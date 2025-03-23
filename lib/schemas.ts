"use client"

import { z } from "zod"

export const createPostSchema = z.object({
  image:
    typeof window === "undefined"
      ? z.any()
      : z.instanceof(File).refine((file) => file.size > 0, {
    message: "Please select an image.",
  }),
  caption: z.string().max(2200, {
    message: "Caption must be 2200 characters or less.",
  }),
  location: z.string().optional(),
  altText: z.string().optional(),
})

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Comment cannot be empty." })
    .max(500, { message: "Comment must be 500 characters or less." }),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>
export type CommentFormValues = z.infer<typeof commentSchema>

