export interface Scene {
  start: number;
  end: number;
  text: string;
  keywords?: string | string[];
  assets?: VideoAsset[];
}

export interface VideoAsset {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  source: 'pexels' | 'pixabay';
  width: number;
  height: number;
  score?: number;
  downloadUrl?: string;
}

export interface VideoPackage {
  id?: string;
  topic: string;
  hook: string;
  script: Scene[];
  titles: string[];
  description: string;
  hashtags: string[];
  viralStrategy?: string;
  createdAt?: string;
}

export type TrendCategory = 'technology' | 'music' | 'entertainment' | 'viral-facts' | 'gaming' | 'science';

export interface TrendingTopic {
  title: string;
  source: string;
  hotness?: number;
  category?: TrendCategory;
}
