"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Story, User } from "@/lib/types"
import { formatTimestamp } from "@/lib/mockData"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface StoryViewerProps {
  isOpen: boolean
  onClose: () => void
  stories: Story[]
  users: Record<string, User>
  onStoryViewed: (storyId: string) => void
}

export function StoryViewer({ isOpen, onClose, stories, users, onStoryViewed }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const currentStory = stories[currentStoryIndex]
  const user = currentStory ? users[currentStory.userId] : null

  const handleNext = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      // Mark current story as viewed
      if (currentStory) {
        //onStoryViewed(currentStory.id)
      }
      // Move to next story
      setCurrentStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      // Mark last story as viewed and close
      if (currentStory) {
        //onStoryViewed(currentStory.id)
      }
      onClose()
    }
  }, [currentStoryIndex, stories.length, currentStory, onStoryViewed, onClose])

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1)
      setProgress(0)
    }
  }

  // Progress bar effect
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / 30 // 100% over 3 seconds (30 steps of 100ms)

        if (newProgress >= 100) {
          clearInterval(interval)
          handleNext()
          return 0
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isOpen, currentStory, isPaused, handleNext])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStoryIndex(0)
      setProgress(0)
    }
  }, [isOpen])

  if (!currentStory || !user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-black text-white">
        <div className="relative h-[80vh] w-full">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>User Stories</DialogTitle>
              <DialogDescription>Show user stories.</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 z-20 p-2">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* User info */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm">{user.username}</div>
              <div className="text-xs opacity-80">{formatTimestamp(currentStory.timestamp)}</div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={onClose}>
              <X className="text-transparent h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Story image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src={currentStory.imageUrl || "/placeholder.svg"} alt="Story" fill className="object-contain" />
          </div>

          {/* Navigation areas */}
          <button
            className="absolute top-0 left-0 h-full w-1/3 z-10 cursor-pointer"
            onClick={handlePrevious}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <span className="sr-only">Previous</span>
          </button>

          <button
            className="absolute top-0 right-0 h-full w-1/3 z-10 cursor-pointer"
            onClick={handleNext}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <span className="sr-only">Next</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

