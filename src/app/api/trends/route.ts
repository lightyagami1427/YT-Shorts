import { NextResponse } from 'next/server';

const allTopics = [
  // Technology
  { title: "AI replacing jobs", source: "Reddit", hotness: 95, category: "technology" },
  { title: "Apple Vision Pro", source: "YouTube", hotness: 92, category: "technology" },
  { title: "Quantum Computing breakthrough", source: "TechCrunch", hotness: 82, category: "technology" },
  { title: "Evolution of electric cars", source: "Bloomberg", hotness: 89, category: "technology" },
  { title: "Neuralink first human trial results", source: "TechCrunch", hotness: 94, category: "technology" },
  { title: "AI video generation tools", source: "Google", hotness: 91, category: "technology" },
  { title: "Remote Work Trends 2026", source: "Forbes", hotness: 93, category: "technology" },

  // Music
  { title: "The science behind viral sounds", source: "Spotify", hotness: 88, category: "music" },
  { title: "AI-generated music hits Billboard", source: "Billboard", hotness: 90, category: "music" },
  { title: "TikTok sounds that broke the internet", source: "YouTube", hotness: 93, category: "music" },
  { title: "How lo-fi beats hack your brain", source: "Reddit", hotness: 85, category: "music" },
  { title: "Underground artists going viral in 2026", source: "SoundCloud", hotness: 82, category: "music" },

  // Entertainment
  { title: "Movies that predicted the future", source: "YouTube", hotness: 87, category: "entertainment" },
  { title: "Hidden messages in popular TV shows", source: "Reddit", hotness: 89, category: "entertainment" },
  { title: "Celebrity lookalikes throughout history", source: "Instagram", hotness: 84, category: "entertainment" },
  { title: "Behind the scenes of viral stunts", source: "YouTube", hotness: 91, category: "entertainment" },
  { title: "Hollywood secrets they don't want you to know", source: "TMZ", hotness: 86, category: "entertainment" },

  // Crazy Viral Facts (blew your mind)
  { title: "Your body replaces itself every 7 years", source: "Reddit", hotness: 96, category: "viral-facts" },
  { title: "Honey never expires — 3000 year old jars found edible", source: "National Geographic", hotness: 94, category: "viral-facts" },
  { title: "Octopuses have 3 hearts and blue blood", source: "ScienceDaily", hotness: 92, category: "viral-facts" },
  { title: "A day on Venus is longer than a year", source: "NASA", hotness: 95, category: "viral-facts" },
  { title: "Bananas are radioactive", source: "Reddit", hotness: 89, category: "viral-facts" },
  { title: "There are more stars than grains of sand on Earth", source: "Space.com", hotness: 97, category: "viral-facts" },
  { title: "Cleopatra lived closer to the iPhone than the pyramids", source: "HistoryExtra", hotness: 93, category: "viral-facts" },
  { title: "Your brain uses 20% of your body's oxygen", source: "HealthLine", hotness: 88, category: "viral-facts" },
  { title: "Lightning strikes Earth 100 times every second", source: "NOAA", hotness: 91, category: "viral-facts" },
  { title: "The Eiffel Tower grows 6 inches every summer", source: "ScienceAlert", hotness: 90, category: "viral-facts" },

  // Gaming
  { title: "Speedrunners breaking impossible records", source: "YouTube", hotness: 88, category: "gaming" },
  { title: "GTA VI map leaked — full breakdown", source: "Reddit", hotness: 96, category: "gaming" },
  { title: "AI NPCs that learn from players", source: "IGN", hotness: 91, category: "gaming" },
  { title: "Gaming addiction science explained", source: "Medium", hotness: 84, category: "gaming" },

  // Science
  { title: "New NASA discovery", source: "Google", hotness: 88, category: "science" },
  { title: "SpaceX rocket", source: "Google", hotness: 90, category: "science" },
  { title: "Ancient Amazon city discovery", source: "National Geographic", hotness: 87, category: "science" },
  { title: "Future of Mars colonization", source: "ScienceDaily", hotness: 91, category: "science" },
  { title: "Deep Sea Exploration", source: "Explorer", hotness: 78, category: "science" },
  { title: "James Webb telescope new images", source: "NASA", hotness: 93, category: "science" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const time = searchParams.get('time') || '7d';
  const category = searchParams.get('category') || 'all';

  let filtered = category === 'all' 
    ? [...allTopics] 
    : allTopics.filter(t => t.category === category);

  // Apply time-based sorting/variation
  if (time === '24h') {
    filtered = filtered.sort(() => 0.5 - Math.random());
    filtered = filtered.map(t => ({...t, hotness: Math.min(99, t.hotness + 5)}));
  } else if (time === '30d') {
    filtered = filtered.reverse();
    filtered = filtered.map(t => ({...t, hotness: Math.max(60, t.hotness - 5)}));
  } else {
    // 7d default - rotate based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const start = dayOfYear % filtered.length;
    filtered = [...filtered.slice(start), ...filtered.slice(0, start)];
  }

  const topics = filtered.slice(0, 10);
  return NextResponse.json(topics);
}
