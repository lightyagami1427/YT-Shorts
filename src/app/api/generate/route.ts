import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/core';
import { HOOK_PROMPT, SCRIPT_PROMPT, KEYWORD_PROMPT, METADATA_PROMPT } from '@/prompts';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      // Fallback: Try parsing from text if it's arriving as text/plain
      const text = await req.text();
      body = JSON.parse(text);
    }
    
    const { type, topic, hook, sceneText } = body;
    
    const host = req.headers.get('host');
    console.log(`[Generate API] Request type: ${type}, Topic: ${topic || 'N/A'}, Host: ${host}`);

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_key_here') {
      console.error("[Generate API] CRITICAL: OPENROUTER_API_KEY is missing or invalid in Vercel Environment Variables");
      return NextResponse.json({ 
        error: "Configuration Error", 
        message: "OPENROUTER_API_KEY is not set in Vercel. Please add it to Project Settings > Environment Variables.",
        diagnostics: { host, envPresent: !!process.env.OPENROUTER_API_KEY }
      }, { status: 500 });
    }

    let prompt = "";
    if (type === 'hooks') prompt = HOOK_PROMPT.replace('{topic}', topic);
    else if (type === 'script') prompt = SCRIPT_PROMPT.replace('{topic}', topic).replace('{hook}', hook);
    else if (type === 'keywords') prompt = KEYWORD_PROMPT.replace('{sceneText}', sceneText);
    else if (type === 'metadata') prompt = METADATA_PROMPT.replace('{topic}', topic);

    if (!prompt) {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    const response = await generateAIResponse(prompt);
    
    if (!response) {
      console.error(`[Generate API] AI failed to return content for type: ${type}`);
      return NextResponse.json({ error: "AI provider returned no response" }, { status: 503 });
    }

    // Keyword special case (plain string)
    if (type === 'keywords') {
      return NextResponse.json(response.trim().replace(/^keywords:\s*/i, ''));
    }

    // JSON parsing with robust extraction
    try {
      const jsonStr = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)?.[0] || response;
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("[Generate API] JSON Parse Error. Raw response:", response);
      return NextResponse.json({ 
        error: "Failed to parse AI response into JSON", 
        raw: response.substring(0, 500) 
      }, { status: 422 });
    }
  } catch (globalError: any) {
    console.error("[Generate API] Global Exception:", globalError);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: globalError.message 
    }, { status: 500 });
  }
}
