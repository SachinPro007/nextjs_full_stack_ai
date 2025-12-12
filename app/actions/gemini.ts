"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper to strip Markdown code blocks if Gemini adds them (e.g. ```html ... ```)
function cleanAIResponse(text: string): string {
  return text.replace(/^```html\s*/i, "").replace(/```$/, "");
}

// ------------------------------------------------------------------
// GENERATE CONTENT
// ------------------------------------------------------------------
export async function generatBlogContent(
  title: string,
  category: string = "",
  tags: string[] = [],
) {
  try {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required to generate content");
    }

    // Use Gemini 1.5 Pro if available for better reasoning, otherwise Flash is fine
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // THE "ELITE WRITER" PROMPT
    const prompt = `
    You are an elite content strategist and senior technical writer. 
    Your task is to write a viral-worthy, high-ranking blog post.
    
    METADATA:
    - Title: "${title}"
    - Category: ${category || "General"}
    - Tags: ${tags.join(", ") || "None"}

    STRICT OUTPUT RULES:
    1. Return ONLY raw HTML. Do not wrap it in markdown code blocks (no \`\`\`html).
    2. Do NOT include the <h1> title (it is rendered separately).
    3. Start directly with a compelling Hook/Introduction.

    WRITING GUIDELINES:
    - Tone: Professional yet conversational, authoritative, and engaging. Avoid robotic transitions like "In conclusion" or "Furthermore".
    - Structure: Use short paragraphs (2-3 sentences) for readability.
    - Formatting: Use <h2> for main sections, <h3> for subsections. Use <ul>/<li> for lists.
    - Engagement: Use <strong> for key insights. Use <blockquote> for standout quotes or takeaways.

    CONTENT STRUCTURE:
    1. **The Hook**: Start with a problem, a startling statistic, or a relatable scenario.
    2. **The "Why It Matters"**: Briefly explain why the reader should care right now.
    3. **Core Content (Deep Dive)**: 3-4 distinct sections. Use analogies and real-world examples.
    4. **Actionable Takeaways**: Don't just explain concepts; tell the reader what to do next.
    5. **Conclusion**: A brief wrap-up that encourages discussion or action.

    Now, write the article. Make it approximately 1000 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();

    // Clean up potential markdown formatting
    content = cleanAIResponse(content);

    if (!content || content.trim().length < 100) {
      throw new Error("Generated content is too short or empty");
    }

    return {
      success: true,
      content: content.trim(),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("AI Generation Error:", error.message);

      // Handle Rate Limits gracefully
      if (
        error.message.includes("429") ||
        error.message.includes("Too Many Requests")
      ) {
        return {
          success: false,
          error:
            "Our AI servers are currently overloaded. Please try again in a moment.",
        };
      }

      return {
        success: false,
        error: "Failed to generate content. Please try again.",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ------------------------------------------------------------------
// IMPROVE CONTENT
// ------------------------------------------------------------------
export async function improveContent(
  currentContent: string,
  improvementType: string = "enhance",
) {
  try {
    if (!currentContent || currentContent.trim().length === 0) {
      throw new Error("Content is required for improvement");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    const baseInstructions = `
      Return ONLY raw HTML. Do not wrap in markdown blocks. 
      Keep the HTML structure valid (h2, h3, p, ul, li).
      Do not add a title <h1> at the top.
    `;

    switch (improvementType) {
      case "expand":
        prompt = `
        Act as a Subject Matter Expert. The user wants to go deeper into this content.
        
        TASK:
        Expand the following content by adding specific examples, data points, analogies, or step-by-step instructions.
        Avoid fluff. Every added sentence must provide value.
        
        ${baseInstructions}
        
        CONTENT TO EXPAND:
        ${currentContent}
        `;
        break;

      case "simplify":
        prompt = `
        Act as a Professional Editor. The user wants this content to be more accessible.
        
        TASK:
        Rewrite the content to aim for a Grade 8 readability level.
        - Break long sentences.
        - Replace jargon with simple words.
        - Use analogies to explain complex topics.
        - Keep the original meaning but make it punchy.
        
        ${baseInstructions}
        
        CONTENT TO SIMPLIFY:
        ${currentContent}
        `;
        break;

      case "shorten": // Added a new useful case
        prompt = `
        Act as a Concise Editor. 
        
        TASK:
        Summarize and condense this content. Remove redundancy. 
        Keep only the most high-impact sentences.
        
        ${baseInstructions}
        
        CONTENT TO SHORTEN:
        ${currentContent}
        `;
        break;

      default: // "enhance" (Polish/Fix Grammar)
        prompt = `
        Act as a Senior Copyeditor.
        
        TASK:
        Polish the following content. 
        - Fix any grammar or spelling errors.
        - Improve sentence flow and rhythm (avoid repetitive sentence structures).
        - Change passive voice to active voice.
        - Make the tone more confident and engaging.
        
        ${baseInstructions}
        
        CONTENT TO POLISH:
        ${currentContent}
        `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let improvedContent = response.text();

    // Clean up potential markdown formatting
    improvedContent = cleanAIResponse(improvedContent);

    return {
      success: true,
      content: improvedContent.trim(),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("AI Improvement Error:", error.message);
      return {
        success: false,
        error: error.message || "Failed to improve content.",
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ------------------------------------------------------------------
// IMPROVE CONTENT
// ------------------------------------------------------------------
export async function generateSmartSuggestion(topic: string) {
  try {
    if (!topic) throw new Error("Topic is required");

    // Use Flash for speed (it's perfect for short text)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // THE "ELITE MICRO-WRITER" PROMPT
    const prompt = `
    You are an expert tech copywriter known for clear, concise explanations.
    
    TASK: 
    Write a **single, high-quality introductory paragraph** about: "${topic}".
    
    STRICT RULES:
    1. **Direct Output Only**: Do not say "Here is a suggestion" or "Sure!". Just write the text.
    2. **Length**: Maximum 100 words.
    3. **Format**: Plain text only (No Markdown, No HTML, No symbols like # or *).
    4. **Content Style**: meaningful, distinct, and professional.
    5. **Goal**: This text will be displayed in a UI card as a quick summary.
    
    EXAMPLE INPUT: "React Hooks"
    EXAMPLE OUTPUT: React Hooks allow function components to access state and lifecycle features without writing classes. They simplify logic reuse and make code cleaner and easier to test.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      success: true,
      content: content.trim(), // Returns the clean text
    };
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return {
      success: false,
      content:
        "Explore how this topic can transform your development workflow with practical examples.", // Fallback text
    };
  }
}
