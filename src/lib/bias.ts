import { eq } from 'drizzle-orm'
import { db } from './db'
import { biasCache } from './schema'
import ratings from './bias-ratings.json'

export type BiasLean = 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right'

export function getBiasForSource(sourceName: string): BiasLean | null {
  return (ratings as Record<string, BiasLean>)[sourceName] ?? null
}

export async function getFramingAnalysis(
  articleUrl: string,
  title: string,
  description: string | null,
  sourceName: string,
): Promise<{ lean: BiasLean | null; framing: string }> {
  // Return from cache if already analyzed
  const cached = db.select().from(biasCache).where(eq(biasCache.articleUrl, articleUrl)).all()
  if (cached.length > 0) {
    return { lean: cached[0].lean as BiasLean | null, framing: cached[0].framing }
  }

  // Lazy-import OpenAI to avoid issues if OPENAI_API_KEY is not set
  let lean: BiasLean | null = null
  let framing = 'No framing analysis available.'

  try {
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const text = `Source: ${sourceName}\nTitle: ${title}\nSummary: ${description ?? 'N/A'}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content:
            'You are a media bias analyst. Given a news article, classify its political lean as one of: Left, Center-Left, Center, Center-Right, Right. Then write a single sentence describing how the article frames the story. Respond as JSON: {"lean": "<label>", "framing": "<sentence>"}',
        },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(response.choices[0].message.content ?? '{}')
    lean = parsed.lean ?? null
    framing = parsed.framing ?? framing
  } catch (err) {
    console.error('[getFramingAnalysis] OpenAI error:', err)
    // Return defaults — don't crash the page
  }

  // Cache the result (even on failure, to avoid hammering the API)
  try {
    db.insert(biasCache).values({ articleUrl, lean, framing }).run()
  } catch {
    // Ignore cache write failures (e.g. duplicate URL race condition)
  }

  return { lean, framing }
}
