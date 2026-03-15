import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const time = searchParams.get('time') || '7d';

  // Simulating trending topics from US. 
  const allTopics = [
    { title: "AI replacing jobs", source: "Reddit", hotness: 95 },
    { title: "New NASA discovery", source: "Google", hotness: 88 },
    { title: "Apple Vision Pro", source: "YouTube", hotness: 92 },
    { title: "Weird ocean creature", source: "Reddit", hotness: 85 },
    { title: "SpaceX rocket", source: "Google", hotness: 90 },
    { title: "Quantum Computing breakthrough", source: "TechCrunch", hotness: 82 },
    { title: "Ancient Amazon city discovery", source: "National Geographic", hotness: 87 },
    { title: "New health benefits of coffee", source: "HealthLine", hotness: 80 },
    { title: "Evolution of electric cars", source: "Bloomberg", hotness: 89 },
    { title: "Future of Mars colonization", source: "ScienceDaily", hotness: 91 },
    { title: "Deep Sea Exploration", source: "Explorer", hotness: 78 },
    { title: "Mental Health in Tech", source: "Medium", hotness: 84 },
    { title: "Remote Work Trends 2026", source: "Forbes", hotness: 93 },
    { title: "Sustainable Food Solutions", source: "GreenPeace", hotness: 76 }
  ];

  let shuffled = [...allTopics];
  if (time === '24h') {
    shuffled = shuffled.sort(() => 0.5 - Math.random());
    shuffled = shuffled.map(t => ({...t, hotness: Math.min(99, t.hotness + 5)}));
  } else if (time === '30d') {
    shuffled = shuffled.reverse();
    shuffled = shuffled.map(t => ({...t, hotness: Math.max(60, t.hotness - 5)}));
  } else {
    // 7d default
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const start = (dayOfYear % allTopics.length);
    shuffled = [...allTopics.slice(start), ...allTopics.slice(0, start)];
  }

  const topics = shuffled.slice(0, 10);

  return NextResponse.json(topics);
}
