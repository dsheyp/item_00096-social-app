import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimestamp, getUserById } from "@/lib/mockData"
import type { Comment } from "@/lib/types"

interface CommentListProps {
  comments: Comment[]
  limit?: number
}

export function CommentList({ comments, limit }: CommentListProps) {
  // If limit is provided, only show that many comments
  const displayComments = limit ? comments.slice(0, limit) : comments
  const hasMoreComments = limit && comments.length > limit

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground py-2">No comments yet.</p>
  }

  return (
    <div className="space-y-3 mt-3">
      {displayComments.map((comment) => {
        const commentUser = getUserById(comment.userId)
        if (!commentUser) return null

        return (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={commentUser.avatar} alt={commentUser.username} />
              <AvatarFallback>{commentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm">
                <Link href={`/profile/${commentUser.username}`} className="font-medium">
                  {commentUser.username}
                </Link>{" "}
                <span>{comment.text}</span>
              </div>
              <div className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</div>
            </div>
          </div>
        )
      })}

      {hasMoreComments && (
        <Link href={`/post/${comments[0]?.postId}`} className="text-sm text-muted-foreground block">
          View all {comments.length} comments
        </Link>
      )}
    </div>
  )
}

