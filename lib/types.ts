export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: number
  following: number
}

export interface Post {
  id: string
  userId: string
  imageUrl: string
  caption: string
  timestamp: string
  likesCount: number
  commentsCount: number
  likedBy?: string[] // Track which users liked the post
}

export interface Comment {
  id: string
  postId: string
  userId: string
  text: string
  timestamp: string
}

export interface Story {
  id: string
  userId: string
  imageUrl: string
  viewed: boolean
  timestamp: string
}

export interface Favorite {
  userId: string
  postIds: string[]
}

