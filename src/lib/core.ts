import { Scene, VideoAsset } from '@/types';

export async function generateAIResponse(prompt: string): Promise<string | null> {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      return null;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://viral-facts-lab.vercel.app",
        "X-Title": "ViralFacts Lab"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenRouter API Error (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("AI Generation failed:", error);
    return null;
  }
}

export async function searchStockVideos(keywords: any): Promise<VideoAsset[]> {
  console.log("🔍 searchStockVideos called with keywords:", keywords);
  // Safety check: keywords might be an error object or null from a failed AI response
  let keywordArray: string[] = [];
  
  if (Array.isArray(keywords)) {
    keywordArray = keywords.map(String);
  } else if (typeof keywords === 'string') {
    keywordArray = keywords.split(',').map(k => k.trim());
  } else if (keywords && typeof keywords === 'object' && keywords.keywords) {
    // Handle nested format if AI returns { "keywords": "..." }
    return searchStockVideos(keywords.keywords);
  } else if (keywords && typeof keywords === 'object' && keywords.raw) {
    // Fallback: If AI parsing failed but we have the raw string
    return searchStockVideos(keywords.raw);
  }

  if (keywordArray.length === 0) {
    console.warn("⚠️ No keywords found for search.");
    return [];
  }

  const strictQuery = keywordArray.join(' ');
  const broadQuery = keywordArray.slice(0, 2).join(' '); // Try first two keywords if strict fails

  console.log(`📡 Searching for: "${strictQuery}" (Broad: "${broadQuery}")`);

  async function fetchFromAPIs(query: string, limit: number): Promise<VideoAsset[]> {
    const assets: VideoAsset[] = [];
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

    // Pexels (Randomized Page)
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const pexelsRes = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}&page=${page}`, {
        headers: { "Authorization": PEXELS_API_KEY || '' }
      });
      const pexelsData = await pexelsRes.json();
      if (pexelsData.videos) {
        pexelsData.videos.forEach((v: any) => {
          assets.push({
            id: `pexels-${v.id}`,
            url: v.video_files.find((f: any) => f.width >= 1080)?.link || v.video_files[0].link,
            thumbnail: v.image,
            duration: v.duration,
            source: 'pexels',
            width: v.width,
            height: v.height,
            downloadUrl: v.video_files[0].link
          });
        });
      }
    } catch (e) { console.error("❌ Pexels error:", e); }

    console.log(`✅ Pexels found ${assets.length} assets.`);

    // Pixabay (Randomized Page)
    if (assets.length < limit) {
      try {
        const page = Math.floor(Math.random() * 2) + 1;
        const pixabayRes = await fetch(`https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=${limit}&page=${page}`);
        const pixabayData = await pixabayRes.json();
        if (pixabayData.hits) {
          const startCount = assets.length;
          pixabayData.hits.forEach((v: any) => {
            assets.push({
              id: `pixabay-${v.id}`,
              url: v.videos.medium.url,
              thumbnail: `https://i.vimeocdn.com/video/${v.picture_id}_640x360.jpg`,
              duration: v.duration,
              source: 'pixabay',
              width: v.width,
              height: v.height,
              downloadUrl: v.videos.medium.url
            });
          });
          console.log(`✅ Pixabay added ${assets.length - startCount} assets.`);
        }
      } catch (e) { console.error("❌ Pixabay error:", e); }
    }
    return assets;
  }

  let finalAssets = await fetchFromAPIs(strictQuery, 10); // Increase limit
  
  // Fallback 1: Broad Query (First two words)
  if (finalAssets.length < 3 && broadQuery !== strictQuery) {
    console.log("🔄 Trying broad fallback query...");
    const additional = await fetchFromAPIs(broadQuery, 10);
    finalAssets = [...finalAssets, ...additional].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }

  // Fallback 2: Atomic Search (Single most relevant keyword)
  if (finalAssets.length < 2 && keywordArray.length > 0) {
    const atomicQuery = keywordArray[0];
    console.log(`⚛️ Trying atomic fallback query: "${atomicQuery}"`);
    const additional = await fetchFromAPIs(atomicQuery, 5);
    finalAssets = [...finalAssets, ...additional].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }

  const filtered = finalAssets.filter(a => a.duration >= 3 && a.duration <= 25);
  console.log(`🎯 Final filtered assets: ${filtered.length}`);
  return filtered;
}

export function rankAssets(assets: VideoAsset[], keywords: string[]): VideoAsset[] {
  return assets
    .map(asset => {
      let score = 0;
      if (asset.duration >= 4 && asset.duration <= 7) score += 0.2;
      if (asset.width >= 1920) score += 0.2;
      asset.score = score;
      return asset;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}
