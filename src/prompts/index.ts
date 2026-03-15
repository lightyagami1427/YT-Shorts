export const HOOK_PROMPT = `
You are a World-Class Viral Content Strategist for YouTube Shorts. 
Your mission is to generate 10 "Aggressive" high-retention hooks for the topic: {topic}.

HOOK PSYCHOLOGY TO USE:
1. The Negative Consequence: "Stop doing X or you will lose Y..."
2. The Industry Secret: "The [Industry] doesn't want you to know this exact number..."
3. The Pattern Interrupt: "This sounds like a lie, but [Topic] just changed forever."
4. The Immediate Warning: "You have exactly 3 seconds to understand why [Topic] is failing."
5. The Satisfaction Gap: "Everyone thinks [Popular Opinion] is true. They are dead wrong."

STRICT RULES:
- ABSOLUTELY NO generic "Did you know?" questions.
- Every hook must trigger an "Amygdala Response"—it must feel urgent, controversial, or shocking.
- Maximize the first 1.2 seconds. No slow intros.
- Use words like: Dangerous, Fatal, Lie, Hidden, Banned, Secret, Emergency.

Return the hooks as a JSON array of strings.
`;

export const SCRIPT_PROMPT = `
You are a viral script writer for YouTube Shorts.
Generate a high-density, 20-25 second script for the topic: {topic} using the hook: {hook}.

NARRATIVE FLOW (STRICT):
- 0–3s: The Aggressive Hook (Stop the scroll).
- 3-10s: The Setup (Explain the problem or the mystery).
- 10-20s: The Value Bomb (Provide a dense, factual answer or shocking explanation).
- 20-25s: The Satisfying Resolution (Provide a definitive conclusion. NO CLIFFHANGERS. NO "FOLLOW FOR PART 2").

STRICT RULE: The viewer MUST feel like they learned a complete story/fact by the content's end. The script must be self-contained and satisfying.

Return a JSON object with the following structure:
{
  "totalDuration": 25,
  "scenes": [
    { "start": 0, "end": 3, "text": "Aggressive Hook text" },
    { "start": 3, "end": 10, "text": "Context/Setup text" },
    { "start": 10, "end": 15, "text": "Satisfying Fact/Value Part 1" },
    { "start": 15, "end": 20, "text": "Satisfying Fact/Value Part 2" },
    { "start": 20, "end": 25, "text": "Final Satisfying Conclusion/Summary" }
  ]
}
`;

export const KEYWORD_PROMPT = `
You are a Visual Director. Convert the scene description into 3 - 4 ATOMIC search keywords.

SCENE ACTION: {sceneText}

VITAL RULES:
1. ATOMIC: Each keyword must be exactly 1 or 2 words (e.g., "forest ruins", "fast car", "microscope").
2. STOCK COMPATIBLE: Use terms that stock sites (Pexels/Pixabay) definitely have.
3. CONCRETE ONLY: No "mystery", no "conspiracy". Instead use "dark lab", "hidden files", "glitch effect".
4. VARIETY: Provide different aspects (e.g., 1 object, 1 environment, 1 camera style).

Example: "The scientist discovered a new galaxy" -> "telescope, outer space, scientist, nebula"

Return only keywords separated by commas. No other text.
`;

export const METADATA_PROMPT = `
Generate viral metadata for a YouTube Short about: {topic}.

Include:
- 5 clickbait titles.
- A concise description (3-4 sentences).
- 5 highly relevant hashtags.

Return as a JSON object:
{
  "titles": ["title1", "title2", ...],
  "description": "...",
  "hashtags": ["#tag1", "#tag2", ...]
}
`;
