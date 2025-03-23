"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Home, Search, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PostActions } from "@/components/post-actions"
import { CommentForm } from "@/components/comment-form"
import { CommentList } from "@/components/comment-list"
import { SearchDialog } from "@/components/search-dialog"
import {
  initializeStorage,
  getUsers,
  getPosts,
  getUserById,
  getCommentsByPostId,
  formatTimestamp,
  isPostLikedByUser,
  isPostBookmarkedByUser,
} from "@/lib/client-storage"
import type { Comment, User as UserType } from "@/lib/types"

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [post, setPost] = useState(getPosts().find((p) => p.id === id))
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const commentInputRef = useRef<HTMLDivElement>(null)
  // Initialize localStorage

  useEffect(() => {
    initializeStorage()
    setIsInitialized(true)
  }, [])
  // Load data when initialized
  useEffect(() => {
    if (isInitialized) {
      loadData()
    }
  }, [isInitialized])

  // Load data
  const loadData = () => {
    // Get post from localStorage
    const foundPost = getPosts().find((p) => p.id === id)
    setPost(foundPost)
    if (foundPost) {
      // Get user who created the post
      const foundUser = getUserById(foundPost.userId)
      if (foundUser) {
        setUser(foundUser)
      }

      // Load comments
      setComments(getCommentsByPostId(foundPost.id))
      // Set likes count
      setLikesCount(foundPost.likesCount)

    // Set current user (first user for demo)
      const users = getUsers()
    if (users.length > 0) {
        const user = users[0]
        setCurrentUser(user)
        // Set initial like and bookmark state
        setIsLiked(isPostLikedByUser(foundPost.id, user.id))
        setIsBookmarked(isPostBookmarkedByUser(foundPost.id, user.id))
    }
  }
  }
  // Handle like toggle

  const handleLikeToggle = (postId: string, liked: boolean, newLikesCount: number) => {
    setIsLiked(liked)
    setLikesCount(newLikesCount)
    // Update the post object
    if (post) {
      setPost({
        ...post,
        likesCount: newLikesCount,
      })
    }
  }
  // Handle bookmark toggle
  const handleBookmarkToggle = (postId: string, bookmarked: boolean) => {
    setIsBookmarked(bookmarked)
  }

  // Handle new comment
  const handleCommentAdded = (newComment: Comment) => {
    // Add the new comment to the comments state
    setComments((prevComments) => [newComment, ...prevComments])
    // If the post exists, update its comment count in state
    if (post) {
      setPost({
        ...post,
        commentsCount: post.commentsCount + 1,
      })
    }
  }

  // Focus the comment input when comment button is clicked
  const handleCommentClick = () => {
    if (commentInputRef.current) {
      const inputElement = commentInputRef.current.querySelector("input")
      if (inputElement) {
        inputElement.focus()
      }
    }
  }

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="mt-2">The post you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!user || !currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Post</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl pb-20">
        <div className="pb-6">
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
              likesCount={likesCount}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onCommentClick={handleCommentClick}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
            />
            <div className="mt-1">
              <span className="font-medium">{user.username}</span> <span className="text-sm">{post.caption}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Comments</h2>
                <span className="text-sm text-muted-foreground">{comments.length} comments</span>
              </div>

              <CommentList comments={comments} />

              <div className="mt-4" ref={commentInputRef}>
                <CommentForm postId={post.id} userId={currentUser.id} onCommentAdded={handleCommentAdded} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-background">
        <div className="mx-auto flex max-w-2xl justify-around p-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
        </div>
      </footer>

      {/* Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}

