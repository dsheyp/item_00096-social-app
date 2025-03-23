"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { commentSchema, type CommentFormValues } from "@/lib/schemas"
import { addComment } from "@/lib/client-storage"

interface CommentFormProps {
  postId: string
  userId: string
  onCommentAdded?: (comment: any) => void
}

export function CommentForm({ postId, userId, onCommentAdded }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(data: CommentFormValues) {
    try {
      setIsSubmitting(true)
      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      // Add comment to localStorage

      const newComment = addComment(postId, userId, data.text)

        // Reset the form
        form.reset()
      // Show success toast
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })

        // Call the callback to update the parent component's state
        if (onCommentAdded) {
        onCommentAdded(newComment)

      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 border-t pt-3 mt-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0">
              <FormControl>
                <Input
                  placeholder="Add a comment..."
                  disabled={isSubmitting}
                  className="bg-slate-100 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={isSubmitting}
          className={form.formState.isValid ? "text-primary font-semibold" : "text-muted-foreground"}
        >
          {isSubmitting ? (
            "Posting..."
          ) : (
            <span className="flex items-center">
              Post <Send className="ml-1 h-3 w-3" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}

