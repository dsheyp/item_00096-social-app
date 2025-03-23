"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, ImageIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createPostSchema, type CreatePostFormValues } from "@/lib/schemas"
import { initializeStorage, getUsers, addNewPost } from "@/lib/client-storage"

export default function CreatePostPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  // Initialize localStorage
  useEffect(() => {
    initializeStorage()
    setIsInitialized(true)
    // Set current user (first user for demo)
    const users = getUsers()
    if (users.length > 0) {
      setCurrentUser(users[0])
    }
  }, [])

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
      location: "",
      altText: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CreatePostFormValues) => {
    if (!currentUser) return
    try {
      setIsSubmitting(true)

      // In a real app, you would upload the image to a storage service
      // For this demo, we'll use a placeholder URL based on the file name
      const imageUrl = `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(data.image.name)}`
      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the new post to localStorage
      addNewPost({
        userId: currentUser.id,
        imageUrl,
        caption: data.caption,
        location: data.location || "",
        altText: data.altText || "",
      })

      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Create New Post</h1>
          </div>
          <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting ? "Posting..." : "Share"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    {imagePreview ? (
                      <div className="relative aspect-square overflow-hidden rounded-md">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => {
                            setImagePreview(null)
                            form.resetField("image")
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium">Drag photos and videos here</h3>
                        <div className="relative">
                          <Button type="button" className="mt-2">
                            <Upload className="mr-2 h-4 w-4" /> Select from computer
                          </Button>
                          <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write a caption..." className="min-h-[100px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Add location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accessibility</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write alt text..." className="min-h-[80px] resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Alt text describes your photos for people with visual impairments.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </main>
    </div>
  )
}

