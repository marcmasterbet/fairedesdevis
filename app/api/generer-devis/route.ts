import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: 'Tu génères UNIQUEMENT du HTML avec CSS inline. Jamais de markdown. Jamais de #, **, ---, |---|. Uniquement des balises HTML valides avec style inline. Ta réponse commence toujours par <div et finit par </div>.',
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const contenu = data.content[0].text

  return NextResponse.json({ contenu })
}