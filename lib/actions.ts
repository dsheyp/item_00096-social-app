"use server"

import { revalidatePath } from "next/cache"
import { posts, comments, favorites, setComments } from "./mockData"
import { v4 as uuidv4 } from "uuid"

interface NewPostData {
  userId: string
  imageUrl: string
  caption: string
  location?: string
  altText?: string
}

export async function addNewPost(data: NewPostData) {
  // In a real app, this would be a database operation
  // For this demo, we'll just add to our in-memory array

  const newPost = {
    id: `post${posts.length + 1}`,
    userId: data.userId,
    imageUrl: data.imageUrl,
    caption: data.caption,
    timestamp: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    likedBy: [],
  }

  // Add to the beginning of the array so it shows up first in the feed
  posts.unshift(newPost)

  // Revalidate the home page to show the new post
  revalidatePath("/")

  return newPost
}

// Like a post
export async function likePost(postId: string, userId: string) {
  try {
    // Find the post
    const post = posts.find((p) => p.id === postId)
    if (!post) {
      return { success: false, message: "Post not found" }
    }

    // Check if the user has already liked this post
    // In a real app, we would have a likes table to track this
    // For this demo, we'll simulate it with a simple check
    const hasLiked = post.likedBy?.includes(userId)

    if (hasLiked) {
      // Unlike the post
      post.likesCount = Math.max(0, post.likesCount - 1)
      post.likedBy = post.likedBy?.filter((id) => id !== userId) || []
    } else {
      // Like the post
      post.likesCount += 1
      post.likedBy = [...(post.likedBy || []), userId]
    }

    revalidatePath("/")
    revalidatePath(`/post/${postId}`)

    return {
      success: true,
      liked: !hasLiked,
      likesCount: post.likesCount,
    }
  } catch (error) {
    console.error("Error liking post:", error)
    return { success: false, message: "Failed to like post" }
  }
}

// Bookmark a post
export async function bookmarkPost(postId: string, userId: string) {
  try {
    // Find the user's favorites
    let userFavorites = favorites.find((f) => f.userId === userId)

    if (!userFavorites) {
      // Create new favorites entry for user
      userFavorites = {
        userId,
        postIds: [],
      }
      favorites.push(userFavorites)
    }

    // Check if post is already bookmarked
    const isBookmarked = userFavorites.postIds.includes(postId)

    if (isBookmarked) {
      // Remove bookmark
      userFavorites.postIds = userFavorites.postIds.filter((id) => id !== postId)
    } else {
      // Add bookmark
      userFavorites.postIds.push(postId)
    }

    revalidatePath("/")
    revalidatePath(`/post/${postId}`)
    revalidatePath(`/profile`)

    return {
      success: true,
      bookmarked: !isBookmarked,
    }
  } catch (error) {
    console.error("Error bookmarking post:", error)
    return { success: false, message: "Failed to bookmark post" }
  }
}

// Add a comment to a post
export async function addComment(postId: string, userId: string, text: string) {
  try {
    if (!text.trim()) {
      return { success: false, message: "Comment cannot be empty" }
    }

    // Find the post
    const post = posts.find((p) => p.id === postId)
    if (!post) {
      return { success: false, message: "Post not found" }
    }

    // Create new comment
    const newComment = {
      id: uuidv4(),
      postId,
      userId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add comment to comments array
    comments.unshift(newComment) // Add to beginning so newest comments appear first

    // Update comment count on post
    post.commentsCount += 1

    setComments(comments)

    revalidatePath("/")
    revalidatePath(`/post/${postId}`)

    return {
      success: true,
      comment: newComment,
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { success: false, message: "Failed to add comment" }
  }
}

