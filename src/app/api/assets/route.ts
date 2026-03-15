import { NextResponse } from 'next/server';
import { searchStockVideos, rankAssets } from '@/lib/core';

export async function POST(req: Request) {
  const { keywords } = await req.json();
  const rawAssets = await searchStockVideos(keywords);
  
  const keywordList = Array.isArray(keywords) 
    ? keywords 
    : (typeof keywords === 'string' ? keywords.split(',') : []);
    
  if (keywordList.length === 0) {
    return NextResponse.json([]);
  }
    
  const ranked = rankAssets(rawAssets, keywordList);
  
  return NextResponse.json(ranked.slice(0, 3)); // Return top 3 options
}
