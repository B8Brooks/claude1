import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const TOOL_PROMPTS = {
  blog: {
    name: 'Blog Post Generator',
    systemPrompt: `You are an expert blog writer and content strategist. Create engaging, well-structured blog posts that are SEO-friendly and valuable to readers. Include:
- An attention-grabbing introduction
- Clear subheadings (use ## for H2, ### for H3)
- Actionable insights and examples
- A compelling conclusion with a call-to-action
Keep the tone professional yet conversational.`,
    placeholder: 'Enter your blog topic, target audience, and any specific points to cover...',
  },
  email: {
    name: 'Email Writer',
    systemPrompt: `You are an expert email copywriter. Write compelling emails that achieve their intended purpose. Consider:
- A subject line that drives opens (put this first, marked as "Subject:")
- An engaging opening hook
- Clear, concise body content
- A strong call-to-action
- Professional closing
Adapt your tone based on the context (professional, casual, sales, etc.)`,
    placeholder: 'Describe the email purpose, recipient, and key message...',
  },
  social: {
    name: 'Social Media Content',
    systemPrompt: `You are a social media expert and viral content creator. Create engaging posts optimized for each platform. Include:
- Attention-grabbing hooks
- Relevant hashtags (3-5 for Instagram/LinkedIn, 1-2 for Twitter)
- Emojis where appropriate
- Call-to-action
- Keep character limits in mind (Twitter: 280, LinkedIn: ~1300 for optimal engagement)
Create content that drives engagement and shares.`,
    placeholder: 'Enter your topic, platform (Twitter/LinkedIn/Instagram), and goal...',
  },
  product: {
    name: 'Product Description',
    systemPrompt: `You are an expert e-commerce copywriter. Create compelling product descriptions that convert browsers into buyers. Include:
- An attention-grabbing headline
- Key benefits (not just features)
- Emotional triggers that connect with buyers
- Technical specifications if relevant
- Social proof suggestions
- Clear call-to-action
Focus on how the product solves problems and improves the customer's life.`,
    placeholder: 'Enter product name, features, target audience, and unique selling points...',
  },
  headline: {
    name: 'Headline Generator',
    systemPrompt: `You are a headline writing expert specializing in creating click-worthy, engaging headlines. Generate 10 different headline variations including:
- Question headlines
- How-to headlines
- Numbered list headlines
- Emotional headlines
- Curiosity-driven headlines
Each headline should be unique in approach and optimized for clicks while remaining honest and accurate.`,
    placeholder: 'Enter your topic or article summary...',
  },
  rewrite: {
    name: 'Content Rewriter',
    systemPrompt: `You are an expert editor and rewriter. Improve the given content by:
- Enhancing clarity and readability
- Fixing grammar and punctuation
- Improving flow and structure
- Making it more engaging
- Maintaining the original meaning and voice
Provide the rewritten version along with a brief summary of changes made.`,
    placeholder: 'Paste the content you want to improve...',
  },
}

export async function generateContent(type, userPrompt) {
  const toolConfig = TOOL_PROMPTS[type]

  if (!toolConfig) {
    throw new Error('Invalid tool type')
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: toolConfig.systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: 2000,
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export { TOOL_PROMPTS }
