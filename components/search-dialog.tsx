"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { posts, users, getUserById } from "@/lib/mockData"
import type { Post, User } from "@/lib/types"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    users: User[]
    posts: Post[]
  }>({ users: [], posts: [] })

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [] })
      return
    }

    const query = searchQuery.toLowerCase()

    // Search users
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.displayName.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query),
    )

    // Search posts
    const filteredPosts = posts.filter(
      (post) =>
        post.caption.toLowerCase().includes(query) ||
        getUserById(post.userId)?.username.toLowerCase().includes(query) ||
        getUserById(post.userId)?.displayName.toLowerCase().includes(query),
    )

    setSearchResults({
      users: filteredUsers,
      posts: filteredPosts,
    })
  }, [searchQuery])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Search</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="text-transparent h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users and posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() ? (
            <>
              {searchResults.users.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Users</h3>
                  <div className="space-y-2">
                    {searchResults.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.username}`}
                        onClick={onClose}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.displayName}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.posts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Posts</h3>
                  <div className="grid grid-cols-3 gap-1">
                    {searchResults.posts.map((post) => {
                      const user = getUserById(post.userId)
                      if (!user) return null

                      return (
                        <Link
                          key={post.id}
                          href={`/post/${post.id}`}
                          onClick={onClose}
                          className="relative aspect-square"
                        >
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.caption}
                            fill
                            className="object-cover rounded-md"
                          />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {searchResults.users.length === 0 && searchResults.posts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No results found for "{searchQuery}"</div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Enter a search term to find users and posts</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

