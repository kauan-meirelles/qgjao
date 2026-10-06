// Hand-written mirrors of the backend Pydantic models — nothing infers across the
// HTTP boundary, so every interface here is kept in sync with backend/models/*.

export interface UserBrief {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  points: number;
}

export interface UserPublic {
  id: string;
  name: string;
  username: string;
  email: string;
  favorite_era: string;
  bio: string;
  quote: string;
  avatar_url: string | null;
  banner_url: string | null;
  points: number;
  created_at: string;
  level: string;
}

export interface Post {
  id: string;
  author: UserBrief;
  text: string;
  image_url: string | null;
  lyric: string | null;
  era: string | null;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author: UserBrief;
  text: string;
  created_at: string;
}

export interface LikeOut {
  liked: boolean;
  like_count: number;
}

export interface Topic {
  id: string;
  author: UserBrief;
  category: string;
  title: string;
  content: string;
  pinned: boolean;
  reply_count: number;
  like_count: number;
  view_count: number;
  liked_by_me: boolean;
  created_at: string;
}

export interface Reply {
  id: string;
  topic_id: string;
  author: UserBrief;
  content: string;
  created_at: string;
}

export interface TopicDetail {
  topic: Topic;
  replies: Reply[];
}

export interface ChatMessage {
  id: string;
  channel: string;
  author: UserBrief;
  text: string;
  created_at: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Album {
  id: string;
  title: string;
  year: string;
  color: string;
  cover: string;
  description: string;
  hits: string[];
  spotify_url: string;
  youtube_url: string;
}

export interface EraInfo {
  id: string;
  title: string;
  year: string;
  description: string;
  photo: string;
  color: string;
}

export interface TourDate {
  name: string;
  city: string;
  venue: string;
  date: string;
  status: string;
}

export interface ArtistData {
  name: string;
  real_name: string;
  born: string;
  voice_type: string;
  label: string;
  origin: string;
  bio: string;
  stats: Stat[];
  albums: Album[];
  eras: EraInfo[];
  tours: TourDate[];
}

export interface MeOut {
  user: UserPublic | null;
}

export interface ProfileOut {
  user: UserPublic;
  posts: Post[];
}

export interface CaptionsOut {
  captions: string[];
  source: "ai" | "curated";
}