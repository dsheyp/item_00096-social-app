import type { User, Post, Comment, Story, Favorite } from "./types"
import {
  users as initialUsers,
  posts as initialPosts,
  comments as initialComments,
  stories as initialStories,
  favorites as initialFavorites,
} from "./mockData"
import { v4 as uuidv4 } from "uuid"

// Storage keys
const STORAGE_KEYS = {
  USERS: "photogram_users",
  POSTS: "photogram_posts",
  COMMENTS: "photogram_comments",
  STORIES: "photogram_stories",
  FAVORITES: "photogram_favorites",
}

// Initialize localStorage with mock data if not already present
export const initializeStorage = () => {
  if (typeof window === "undefined") return

  // Check if data exists in localStorage
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers))
  }

  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts))
  }

  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments))
  }

  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(initialStories))
  }

  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(initialFavorites))
  }
}

// Get data from localStorage
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return initialUsers
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : initialUsers
}

export const getPosts = (): Post[] => {
  if (typeof window === "undefined") return initialPosts
  const data = localStorage.getItem(STORAGE_KEYS.POSTS)
  return data ? JSON.parse(data) : initialPosts
}

export const getComments = (): Comment[] => {
  if (typeof window === "undefined") return initialComments
  const data = localStorage.getItem(STORAGE_KEYS.COMMENTS)
  return data ? JSON.parse(data) : initialComments
}

export const getStories = (): Story[] => {
  if (typeof window === "undefined") return initialStories
  const data = localStorage.getItem(STORAGE_KEYS.STORIES)
  return data ? JSON.parse(data) : initialStories
}

export const getFavorites = (): Favorite[] => {
  if (typeof window === "undefined") return initialFavorites
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITES)
  return data ? JSON.parse(data) : initialFavorites
}

// Save data to localStorage
export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export const savePosts = (posts: Post[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
}

export const saveComments = (comments: Comment[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
}

export const saveStories = (stories: Story[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories))
}

export const saveFavorites = (favorites: Favorite[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
}

// Helper functions
export const getUserById = (id: string): User | undefined => {
  const users = getUsers()
  return users.find((user) => user.id === id)
}

export const getPostsByUserId = (userId: string): Post[] => {
  const posts = getPosts()
  return posts.filter((post) => post.userId === userId)
}

export const getCommentsByPostId = (postId: string): Comment[] => {
  const comments = getComments()
  return comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const getFavoritesByUserId = (userId: string): Favorite | undefined => {
  const favorites = getFavorites()
  return favorites.find((favorite) => favorite.userId === userId)
}

export const getFavoritePostsByUserId = (userId: string): Post[] => {
  const userFavorites = getFavoritesByUserId(userId)
  if (!userFavorites) return []

  const posts = getPosts()
  return posts.filter((post) => userFavorites.postIds.includes(post.id))
}

export const isPostLikedByUser = (postId: string, userId: string): boolean => {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)
  return post?.likedBy?.includes(userId) || false
}

export const isPostBookmarkedByUser = (postId: string, userId: string): boolean => {
  const userFavorites = getFavoritesByUserId(userId)
  return userFavorites?.postIds.includes(postId) || false
}

// Data modification functions
export const addComment = (postId: string, userId: string, text: string): Comment => {
  const comments = getComments()
  const posts = getPosts()

  // Create new comment
  const newComment: Comment = {
    id: uuidv4(),
    postId,
    userId,
    text,
    timestamp: new Date().toISOString(),
  }

  // Add to comments
  comments.unshift(newComment)
  saveComments(comments)

  // Update post comment count
  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        commentsCount: post.commentsCount + 1,
      }
    }
    return post
  })
  savePosts(updatedPosts)

  return newComment
}

export const toggleLike = (postId: string, userId: string): { isLiked: boolean; likesCount: number } => {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)

  if (!post) {
    return { isLiked: false, likesCount: 0 }
  }

  const isLiked = post.likedBy?.includes(userId) || false
  let updatedLikedBy = post.likedBy || []

  if (isLiked) {
    // Unlike
    updatedLikedBy = updatedLikedBy.filter((id) => id !== userId)
    post.likesCount = Math.max(0, post.likesCount - 1)
  } else {
    // Like
    updatedLikedBy.push(userId)
    post.likesCount += 1
  }

  post.likedBy = updatedLikedBy

  // Update posts
  const updatedPosts = posts.map((p) => (p.id === postId ? post : p))
  savePosts(updatedPosts)

  return { isLiked: !isLiked, likesCount: post.likesCount }
}

export const toggleBookmark = (postId: string, userId: string): boolean => {
  const favorites = getFavorites()
  let userFavorite = favorites.find((f) => f.userId === userId)

  if (!userFavorite) {
    // Create new favorites entry for user
    userFavorite = {
      userId,
      postIds: [],
    }
    favorites.push(userFavorite)
  }

  const isBookmarked = userFavorite.postIds.includes(postId)

  if (isBookmarked) {
    // Remove bookmark
    userFavorite.postIds = userFavorite.postIds.filter((id) => id !== postId)
  } else {
    // Add bookmark
    userFavorite.postIds.push(postId)
  }

  // Update favorites
  const updatedFavorites = favorites.map((f) => (f.userId === userId ? userFavorite! : f))
  saveFavorites(updatedFavorites)

  return !isBookmarked
}

export const addNewPost = (data: {
  userId: string
  imageUrl: string
  caption: string
  location?: string
  altText?: string
}): Post => {
  const posts = getPosts()

  // Create new post
  const newPost: Post = {
    id: uuidv4(),
    userId: data.userId,
    imageUrl: data.imageUrl,
    caption: data.caption,
    timestamp: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    likedBy: [],
  }

  // Add to posts
  posts.unshift(newPost)
  savePosts(posts)

  return newPost
}

export const markStoryAsViewed = (storyId: string): void => {
  const stories = getStories()

  const updatedStories = stories.map((story) => (story.id === storyId ? { ...story, viewed: true } : story))

  saveStories(updatedStories)
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} SECONDS AGO`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} MINUTES AGO`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} HOURS AGO`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} DAYS AGO`
  } else {
    return date.toLocaleDateString()
  }
}

