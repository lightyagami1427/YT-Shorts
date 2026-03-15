import { NextResponse } from 'next/server';

export async function GET() {
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

  // Rotate based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const start = (dayOfYear % allTopics.length);
  const topics = [...allTopics.slice(start), ...allTopics.slice(0, start)].slice(0, 10);

  return NextResponse.json(topics);
}
