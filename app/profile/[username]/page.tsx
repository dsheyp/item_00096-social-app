import Link from "next/link"
import Image from "next/image"
import { Grid3X3, ArrowLeft, Home, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { users, getPostsByUserId } from "@/lib/mockData"

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const user = users.find((u) => u.username === params.username)

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-2">The user you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userPosts = getPostsByUserId(user.id)

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
          <h1 className="text-lg font-semibold">{user.username}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl pb-20">
        <div className="p-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 justify-around text-center">
              <div>
                <div className="font-semibold">{userPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-semibold">{user.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-semibold">{user.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold">{user.displayName}</div>
            <div className="text-sm">{user.bio}</div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="posts">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Posts
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
        </Tabs>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-background">
        <div className="mx-auto flex max-w-2xl justify-around p-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

