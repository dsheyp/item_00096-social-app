"use client"

import { useState } from "react"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { toggleLike, toggleBookmark } from "@/lib/client-storage"

interface PostActionsProps {
  postId: string
  userId: string
  likesCount: number
  isLiked: boolean
  isBookmarked: boolean
  onCommentClick?: () => void
  onLikeToggle?: (postId: string, isLiked: boolean, likesCount: number) => void
  onBookmarkToggle?: (postId: string, isBookmarked: boolean) => void
}

export function PostActions({
  postId,
  userId,
  likesCount: initialLikesCount,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
  onCommentClick,
  onLikeToggle,
  onBookmarkToggle,
}: PostActionsProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const handleLike = async () => {
    try {
      setIsLikeLoading(true)
      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 200))
      // Update in localStorage
      const result = toggleLike(postId, userId)

      // Update local state
      setIsLiked(result.isLiked)
      setLikesCount(result.likesCount)

      // Notify parent component if callback provided

      if (onLikeToggle) {
        onLikeToggle(postId, result.isLiked, result.likesCount)
      }
      // Show success toast for better UX
        toast({
        title: result.isLiked ? "Post liked" : "Post unliked",
        description: result.isLiked ? "You liked this post" : "You unliked this post",
        duration: 1500,
        })
    } catch (error) {
      // Revert optimistic update if something goes wrong
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleBookmark = async () => {
    try {
      setIsBookmarkLoading(true)
      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 200))
      // Update in localStorage
      const isNowBookmarked = toggleBookmark(postId, userId)

      // Update local state
      setIsBookmarked(isNowBookmarked)

      // Notify parent component if callback provided

      if (onBookmarkToggle) {
        onBookmarkToggle(postId, isNowBookmarked)
      }
      // Show success toast for better UX
        toast({
        title: isNowBookmarked ? "Post saved" : "Post unsaved",
        description: isNowBookmarked ? "Post added to your saved items" : "Post removed from your saved items",
        duration: 1500,
        })
    } catch (error) {
      // Revert optimistic update if something goes wrong
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsBookmarkLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike} disabled={isLikeLoading}>
            <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">Like</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark} disabled={isBookmarkLoading}>
          <Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-black dark:fill-white" : ""}`} />
          <span className="sr-only">Save</span>
        </Button>
      </div>
      <div className="text-sm font-medium">{likesCount} likes</div>
    </div>
  )
}

