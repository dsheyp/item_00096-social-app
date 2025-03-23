"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PlusSquare, Home, SearchIcon, LucideUser } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StoryViewer } from "@/components/story-viewer"
import { PostActions } from "@/components/post-actions"
import { CommentForm } from "@/components/comment-form"
import { CommentList } from "@/components/comment-list"
import { SearchDialog } from "@/components/search-dialog"
import {
  initializeStorage,
  getUsers,
  getPosts,
  getStories,
  getUserById,
  getCommentsByPostId,
  formatTimestamp,
  isPostLikedByUser,
  isPostBookmarkedByUser,
  markStoryAsViewed,
} from "@/lib/client-storage"
import type { User, Post, Comment, Story } from "@/lib/types"

interface PostWithComments extends Post {
  comments: Comment[]
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function HomePage() {
  const router = useRouter()
  const [feedPosts, setFeedPosts] = useState<PostWithComments[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)
  const [usersMap, setUsersMap] = useState<Record<string, User>>({})
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const commentInputRefs = useRef<Record<string, HTMLElement | null>>({})

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize localStorage and data
  useEffect(() => {
    // Initialize localStorage with mock data
    initializeStorage()
    setIsInitialized(true)
    // Set current user (first user for demo)
    const users = getUsers()
    if (users.length > 0) {
      setCurrentUser(users[0])
    }
  }, [])
  // Load data when initialized
  useEffect(() => {
    if (isInitialized && currentUser) {
    loadData()
    }
  }, [isInitialized, currentUser])

  // Function to load/reload data
  const loadData = () => {
    if (!currentUser) return
    // Get data from localStorage
    const allPosts = getPosts()
    const allStories = getStories()
    const allUsers = getUsers()
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...allPosts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map((post) => ({
        ...post,
        comments: getCommentsByPostId(post.id),
        isLiked: isPostLikedByUser(post.id, currentUser.id),
        isBookmarked: isPostBookmarkedByUser(post.id, currentUser.id),
      }))

    setFeedPosts(sortedPosts)

    // Filter out viewed stories
    const activeStories = allStories.filter((story) => !story.viewed)
    setStories(activeStories)

    // Create a map of users for quick lookup
    const userMap: Record<string, User> = {}
    allUsers.forEach((user) => {
      userMap[user.id] = user
    })
    setUsersMap(userMap)
  }

  // Handle opening a story
  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index)
    setStoryViewerOpen(true)
  }

  // Handle marking a story as viewed
  const handleStoryViewed = useCallback((storyId: string) => {
    // Mark story as viewed in localStorage
    markStoryAsViewed(storyId)
    setStories((prev) => {
      // Mark the story as viewed in state
      const updatedStories = prev.map((story) => (story.id === storyId ? { ...story, viewed: true } : story))

      // Remove viewed stories after a short delay (to allow for animation)
      setTimeout(() => {
        setStories((current) => current.filter((story) => !story.viewed))
      }, 300)

      return updatedStories
    })
  }, [])

  // Handle like toggle
  const handleLikeToggle = (postId: string, isLiked: boolean, likesCount: number) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likesCount: likesCount,
            isLiked: isLiked,
          }
        }
        return post
      }),
    )
  }
  // Handle bookmark toggle
  const handleBookmarkToggle = (postId: string, isBookmarked: boolean) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: isBookmarked,
          }
        }
        return post
      }),
    )
  }
  // Handle new comment
  const handleCommentAdded = (newComment: Comment) => {

    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === newComment.postId) {
          return {
            ...post,
            comments: [newComment, ...post.comments],
            commentsCount: post.commentsCount + 1,
          }
        }
        return post
      }),
    )
  }

  // Focus the comment input when comment button is clicked
  const handleCommentClick = (postId: string) => {
    const inputRef = commentInputRefs.current[postId]
    if (inputRef) {
      // Find the input element within the ref and focus it
      const inputElement = inputRef.querySelector("input")
      if (inputElement) {
        inputElement.focus()
      }
    }
  }

  // Get stories for the viewer
  const storiesForViewer = stories.slice(selectedStoryIndex)
  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="text-xl font-semibold">Photogram</h1>
          <Link href="/create">
            <Button variant="ghost" size="icon">
              <PlusSquare className="h-6 w-6" />
              <span className="sr-only">Create post</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl pb-20">
        {stories.length > 0 && (
          <div className="p-4">
            <div className="flex gap-4 overflow-x-auto pl-2 pt-2 pb-2">
              {stories.map((story, index) => {
                const user = getUserById(story.userId)
                if (!user) return null

                return (
                  <div key={story.id} className="flex flex-col items-center" onClick={() => handleStoryClick(index)}>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] cursor-pointer transition-transform hover:scale-105">
                      <div className="h-full w-full rounded-full border-2 border-background">
                        <Avatar className="h-full w-full">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="mt-1 text-xs">{user.username}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="divide-y">
          {feedPosts.map((post) => {
            const user = getUserById(post.userId)

            if (!user) return null

            return (
              <div key={post.id} className="pb-6">
                <div className="flex items-center gap-2 p-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Link href={`/profile/${user.username}`} className="font-medium">
                    {user.username}
                  </Link>
                </div>
                <div className="relative aspect-square">
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <PostActions
                    postId={post.id}
                    userId={currentUser.id}
                    likesCount={post.likesCount}
                    isLiked={post.isLiked || false}
                    isBookmarked={post.isBookmarked || false}
                    onCommentClick={() => handleCommentClick(post.id)}
                    onLikeToggle={handleLikeToggle}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                  <div className="mt-1">
                    <span className="font-medium">{user.username}</span> <span className="text-sm">{post.caption}</span>
                  </div>

                  {/* Comments section */}
                  <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Comments</h3>
                      {post.comments.length > 0 && (
                        <span className="text-xs text-muted-foreground">{post.comments.length} comments</span>
                      )}
                    </div>
                    <CommentList comments={post.comments} limit={post.comments.length > 3 ? 3 : undefined} />
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</div>

                  {/* Comment form with ref for focusing */}
                  <div ref={(el) => (commentInputRefs.current[post.id] = el)}>
                    <CommentForm postId={post.id} userId={currentUser.id} onCommentAdded={handleCommentAdded} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-background">
        <div className="mx-auto flex max-w-2xl justify-around p-3">
          <Button variant="ghost" size="icon">
            <Home className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <SearchIcon className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <LucideUser className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
        </div>
      </footer>

      {/* Story Viewer */}
      <StoryViewer
        isOpen={storyViewerOpen}
        onClose={() => {
          setTimeout(() => {
            setStoryViewerOpen(false)
          }, 200)
        }}
        stories={storiesForViewer}
        users={usersMap}
        onStoryViewed={handleStoryViewed}
      />

      {/* Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}

