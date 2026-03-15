import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/core';
import { HOOK_PROMPT, SCRIPT_PROMPT, KEYWORD_PROMPT, METADATA_PROMPT } from '@/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, topic, hook, sceneText } = body;
    
    console.log(`[Generate API] Request type: ${type}, Topic: ${topic || 'N/A'}`);

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("[Generate API] CRITICAL: OPENROUTER_API_KEY is missing in Environment Variables");
      return NextResponse.json({ error: "Server Configuration Error: API Key missing" }, { status: 500 });
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
