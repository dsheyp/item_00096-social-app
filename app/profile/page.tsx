"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Grid3X3, ArrowLeft, Bookmark } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { initializeStorage, getUsers, getPostsByUserId, getFavoritePostsByUserId } from "@/lib/client-storage"

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [favoritePosts, setFavoritePosts] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
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
  const loadData = () => {
  // Use the first user as the current user for demo purposes
    const users = getUsers()
    if (users.length > 0) {
      const user = users[0]
      setCurrentUser(user)
      // Get user posts and favorites
      setUserPosts(getPostsByUserId(user.id))
      setFavoritePosts(getFavoritePostsByUserId(user.id))
    }
  }
  if (!currentUser) return null

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
          <h1 className="text-lg font-semibold">{currentUser.username}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl pb-20">
        <div className="p-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 justify-around text-center">
              <div>
                <div className="font-semibold">{userPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-semibold">{currentUser.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-semibold">{currentUser.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold">{currentUser.displayName}</div>
            <div className="text-sm">{currentUser.bio}</div>
          </div>
          
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">
              <Grid3X3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Bookmark className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`} className="relative aspect-square">
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {favoritePosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`} className="relative aspect-square">
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-background">
        <div className="mx-auto flex max-w-2xl justify-around p-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Home</span>
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

