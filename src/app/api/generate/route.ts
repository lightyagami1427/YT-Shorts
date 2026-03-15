import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/core';
import { HOOK_PROMPT, SCRIPT_PROMPT, KEYWORD_PROMPT, METADATA_PROMPT } from '@/prompts';

export async function POST(req: Request) {
  const { type, topic, hook, sceneText } = await req.json();

  let prompt = "";
  if (type === 'hooks') prompt = HOOK_PROMPT.replace('{topic}', topic);
  else if (type === 'script') prompt = SCRIPT_PROMPT.replace('{topic}', topic).replace('{hook}', hook);
  else if (type === 'keywords') prompt = KEYWORD_PROMPT.replace('{sceneText}', sceneText);
  else if (type === 'metadata') prompt = METADATA_PROMPT.replace('{topic}', topic);

  const response = await generateAIResponse(prompt);
  
  if (!response) {
    return NextResponse.json({ error: "AI provider returned no response" }, { status: 500 });
  }

  if (type === 'keywords') {
    return NextResponse.json(response.trim());
  }

  try {
    const jsonStr = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)?.[0] || response;
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (e) {
    return NextResponse.json({ error: "Failed to parse AI response", raw: response }, { status: 500 });
  }
}
