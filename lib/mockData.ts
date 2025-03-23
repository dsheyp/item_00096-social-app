import type { User, Post, Comment, Story, Favorite } from "./types"

// Users
export const users: User[] = [
  {
    id: "user1",
    username: "johndoe",
    displayName: "John Doe",
    avatar: "/placeholder.svg?height=80&width=80&text=John",
    bio: "Photographer, traveler, and coffee enthusiast ☕️ | Based in NYC 🗽",
    followers: 843,
    following: 162,
  },
  {
    id: "user2",
    username: "janedoe",
    displayName: "Jane Doe",
    avatar: "/placeholder.svg?height=80&width=80&text=Jane",
    bio: "Digital artist and designer | Creating beautiful things daily ✨",
    followers: 1243,
    following: 325,
  },
  {
    id: "user3",
    username: "alexsmith",
    displayName: "Alex Smith",
    avatar: "/placeholder.svg?height=80&width=80&text=Alex",
    bio: "Adventure seeker | Mountain climber | Dog lover 🐕",
    followers: 562,
    following: 231,
  },
  {
    id: "user4",
    username: "sarahparker",
    displayName: "Sarah Parker",
    avatar: "/placeholder.svg?height=80&width=80&text=Sarah",
    bio: "Food blogger | Cooking up delicious recipes | Follow for food inspiration 🍕",
    followers: 1892,
    following: 412,
  },
  {
    id: "user5",
    username: "mikebrown",
    displayName: "Mike Brown",
    avatar: "/placeholder.svg?height=80&width=80&text=Mike",
    bio: "Tech enthusiast | Software engineer | Building the future 💻",
    followers: 723,
    following: 289,
  },
  {
    id: "user6",
    username: "emilyjones",
    displayName: "Emily Jones",
    avatar: "/placeholder.svg?height=80&width=80&text=Emily",
    bio: "Fitness coach | Helping you achieve your goals 💪 | Healthy lifestyle advocate",
    followers: 2145,
    following: 178,
  },
  {
    id: "user7",
    username: "davidwilson",
    displayName: "David Wilson",
    avatar: "/placeholder.svg?height=80&width=80&text=David",
    bio: "Music producer | Guitar player | Living the rhythm 🎵",
    followers: 932,
    following: 345,
  },
  {
    id: "user8",
    username: "oliviagreen",
    displayName: "Olivia Green",
    avatar: "/placeholder.svg?height=80&width=80&text=Olivia",
    bio: "Plant mom 🌱 | Sustainable living | Vegan recipes",
    followers: 1432,
    following: 267,
  },
]

// Posts
export const posts: Post[] = [
  {
    id: "post1",
    userId: "user1",
    imageUrl: "/placeholder.svg?height=600&width=600&text=NYC+Skyline",
    caption: "Beautiful day in New York City! #nyc #skyline #photography",
    timestamp: "2023-03-15T14:30:00Z",
    likesCount: 243,
    commentsCount: 32,
    likedBy: ["user2", "user3", "user4"],
  },
  {
    id: "post2",
    userId: "user2",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Digital+Art",
    caption: "My latest digital artwork. What do you think? #digitalart #creativity",
    timestamp: "2023-03-14T18:45:00Z",
    likesCount: 567,
    commentsCount: 78,
    likedBy: ["user1", "user3"],
  },
  {
    id: "post3",
    userId: "user3",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Mountain+View",
    caption: "Summit reached! The view was worth every step. #hiking #mountains #adventure",
    timestamp: "2023-03-13T12:15:00Z",
    likesCount: 342,
    commentsCount: 41,
    likedBy: [],
  },
  {
    id: "post4",
    userId: "user4",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Homemade+Pizza",
    caption: "Homemade pizza night! Recipe on my blog. #foodie #homecooking #pizza",
    timestamp: "2023-03-12T19:20:00Z",
    likesCount: 421,
    commentsCount: 53,
    likedBy: [],
  },
  {
    id: "post5",
    userId: "user5",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Coding+Setup",
    caption: "My coding setup for 2023. Productivity level: 100% #tech #coding #workspace",
    timestamp: "2023-03-11T09:10:00Z",
    likesCount: 289,
    commentsCount: 34,
    likedBy: [],
  },
  {
    id: "post6",
    userId: "user6",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Workout+Session",
    caption: "Morning workout session. Start your day with energy! #fitness #workout #motivation",
    timestamp: "2023-03-10T07:30:00Z",
    likesCount: 512,
    commentsCount: 67,
    likedBy: [],
  },
  {
    id: "post7",
    userId: "user7",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Studio+Session",
    caption: "Late night studio session. New track coming soon! #music #producer #studio",
    timestamp: "2023-03-09T23:45:00Z",
    likesCount: 378,
    commentsCount: 45,
    likedBy: [],
  },
  {
    id: "post8",
    userId: "user8",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Plant+Collection",
    caption: "My growing plant family. Green living at its best. #plants #homedecor #greenthumb",
    timestamp: "2023-03-08T15:20:00Z",
    likesCount: 456,
    commentsCount: 59,
    likedBy: [],
  },
  {
    id: "post9",
    userId: "user1",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Coffee+Art",
    caption: "Starting my day with some coffee art. #coffee #art #morning",
    timestamp: "2023-03-07T08:15:00Z",
    likesCount: 321,
    commentsCount: 38,
    likedBy: [],
  },
  {
    id: "post10",
    userId: "user2",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Design+Sketch",
    caption: "Working on a new design project. Sketching ideas. #design #creative #sketch",
    timestamp: "2023-03-06T13:40:00Z",
    likesCount: 289,
    commentsCount: 31,
    likedBy: [],
  },
  {
    id: "post11",
    userId: "user3",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Dog+Park",
    caption: "Sunday funday at the dog park with Max. #dogs #pets #weekend",
    timestamp: "2023-03-05T16:30:00Z",
    likesCount: 412,
    commentsCount: 47,
    likedBy: [],
  },
  {
    id: "post12",
    userId: "user4",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Pasta+Dish",
    caption: "Homemade pasta with fresh ingredients. Recipe link in bio! #pasta #cooking #foodporn",
    timestamp: "2023-03-04T19:50:00Z",
    likesCount: 534,
    commentsCount: 72,
    likedBy: [],
  },
]

// Comments
export let comments: Comment[] = [
  {
    id: "comment1",
    postId: "post1",
    userId: "user2",
    text: "Amazing view! I love NYC skyline.",
    timestamp: "2023-03-15T14:45:00Z",
  },
  {
    id: "comment2",
    postId: "post1",
    userId: "user3",
    text: "Great shot! What camera did you use?",
    timestamp: "2023-03-15T15:10:00Z",
  },
  {
    id: "comment3",
    postId: "post2",
    userId: "user1",
    text: "Your art is incredible! Love the colors.",
    timestamp: "2023-03-14T19:00:00Z",
  },
  {
    id: "comment4",
    postId: "post2",
    userId: "user4",
    text: "This is so creative! You have amazing talent.",
    timestamp: "2023-03-14T19:30:00Z",
  },
  {
    id: "comment5",
    postId: "post3",
    userId: "user5",
    text: "What a view! Which mountain is this?",
    timestamp: "2023-03-13T12:45:00Z",
  },
  {
    id: "comment6",
    postId: "post4",
    userId: "user6",
    text: "That pizza looks delicious! Will try your recipe.",
    timestamp: "2023-03-12T20:00:00Z",
  },
  {
    id: "comment7",
    postId: "post5",
    userId: "user7",
    text: "Clean setup! What monitor is that?",
    timestamp: "2023-03-11T10:00:00Z",
  },
  {
    id: "comment8",
    postId: "post6",
    userId: "user8",
    text: "Great form! What's your workout routine?",
    timestamp: "2023-03-10T08:15:00Z",
  },
]

// Stories
export const stories: Story[] = [
  {
    id: "story1",
    userId: "user1",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story1",
    viewed: false,
    timestamp: "2023-03-15T12:00:00Z",
  },
  {
    id: "story2",
    userId: "user2",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story2",
    viewed: false,
    timestamp: "2023-03-15T11:30:00Z",
  },
  {
    id: "story3",
    userId: "user3",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story3",
    viewed: false,
    timestamp: "2023-03-15T10:45:00Z",
  },
  {
    id: "story4",
    userId: "user4",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story4",
    viewed: false,
    timestamp: "2023-03-15T09:20:00Z",
  },
  {
    id: "story5",
    userId: "user5",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story5",
    viewed: false,
    timestamp: "2023-03-15T08:10:00Z",
  },
  {
    id: "story6",
    userId: "user6",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story6",
    viewed: false,
    timestamp: "2023-03-15T07:30:00Z",
  },
  {
    id: "story7",
    userId: "user7",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Story7",
    viewed: false,
    timestamp: "2023-03-15T06:45:00Z",
  },
]

// Favorites
export const favorites: Favorite[] = [
  {
    userId: "user1",
    postIds: ["post2", "post4", "post6"],
  },
  {
    userId: "user2",
    postIds: ["post1", "post3", "post5"],
  },
  {
    userId: "user3",
    postIds: ["post2", "post7", "post9"],
  },
  {
    userId: "user4",
    postIds: ["post1", "post8", "post10"],
  },
]



// setter

export function setComments(_comments: Comment[]): void {
  comments = [..._comments]
}

// Helper functions
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getPostsByUserId(userId: string): Post[] {
  return posts.filter((post) => post.userId === userId)
}

export function getCommentsByPostId(postId: string): Comment[] {
  // Return comments for the post in reverse chronological order (newest first)
  return comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getStoriesByUserId(userId: string): Story[] {
  return stories.filter((story) => story.userId === userId)
}

export function getFavoritesByUserId(userId: string): Favorite | undefined {
  return favorites.find((favorite) => favorite.userId === userId)
}

export function getFavoritePostsByUserId(userId: string): Post[] {
  const userFavorites = getFavoritesByUserId(userId)
  if (!userFavorites) return []
  return posts.filter((post) => userFavorites.postIds.includes(post.id))
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} SECONDS AGO`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} MINUTES AGO`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} HOURS AGO`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} DAYS AGO`
  } else {
    return date.toLocaleDateString()
  }
}

export function isPostLikedByUser(postId: string, userId: string): boolean {
  const post = posts.find((p) => p.id === postId)
  return post?.likedBy?.includes(userId) || false
}

export function isPostBookmarkedByUser(postId: string, userId: string): boolean {
  const userFavorites = getFavoritesByUserId(userId)
  return userFavorites?.postIds.includes(postId) || false
}
export type { User, Comment }

