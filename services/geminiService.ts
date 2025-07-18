import { GoogleGenAI, type Chat, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

// Configuration constants
const DEFAULT_MODEL = 'gemini-2.5-flash';

// Error classes for better error handling
class GeminiServiceError extends Error {
  constructor(message: string, public readonly service: string) {
    super(`[${service}] ${message}`);
    this.name = 'GeminiServiceError';
  }
}

class APIKeyError extends GeminiServiceError {
  constructor() {
    super('API Key is not provided or is invalid.', 'Gemini API');
  }
}

class ClientNotInitializedError extends GeminiServiceError {
  constructor() {
    super('Gemini AI Client is not initialized. Please set your API key in the settings.', 'Gemini Client');
  }
}

/**
 * Initializes the Gemini AI client with the provided API key
 * @param apiKey - The Google GenAI API key
 * @throws {APIKeyError} When API key is not provided or invalid
 */
export function initializeAiClient(apiKey: string): void {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    ai = null;
    throw new APIKeyError();
  }
  try {
    ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    console.log("Gemini AI Client Initialized successfully.");
  } catch (error) {
    ai = null;
    throw new GeminiServiceError('Failed to initialize Gemini AI client.', 'Gemini Client');
  }
}

/**
 * Gets the initialized AI client
 * @returns {GoogleGenAI} The initialized AI client
 * @throws {ClientNotInitializedError} When client is not initialized
 */
function getAiClient(): GoogleGenAI {
  if (!ai) {
    throw new ClientNotInitializedError();
  }
  return ai;
}

/**
 * Validates that the response contains valid HTML
 * @param htmlCode - The HTML code to validate
 * @returns {boolean} True if valid HTML
 */
function isValidHtml(htmlCode: string): boolean {
  if (!htmlCode || typeof htmlCode !== 'string') return false;
  const trimmed = htmlCode.trim();
  return trimmed.startsWith('<') && trimmed.includes('>');
}

/**
 * Sanitizes the HTML code by removing potentially dangerous elements
 * @param htmlCode - The HTML code to sanitize
 * @returns {string} Sanitized HTML code
 */
function sanitizeHtml(htmlCode: string): string {
  // Remove script tags and their content
  let sanitized = htmlCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:\s*[^"'\s]*/gi, '');
  return sanitized;
}

const systemInstruction = `You are DAssigner, an autonomous, evolving AI web designer specializing in creating world-class, production-ready HTML interfaces. Your core mission is to transform user visions into stunning, functional web experiences that meet the highest modern design and accessibility standards, rivaling top-tier web development agencies in quality and innovation. Your performance is continually evaluated and optimized based on user feedback and evolving web development best practices.

I. Core Operational Principles:

Initial Generation & Refinement Cycle (IGRC):

Initiation: Every user prompt begins an IGRC. Your initial response is a fully-formed HTML structure intended for immediate deployment (within a <body> tag).

Iteration: Subsequent user messages within the same conversation are treated as refinement requests directly related to the immediately preceding HTML output. Focus on additive changes, preserving existing design unless explicitly modified. Interpret vague requests with informed assumptions based on UX best practices, current design trends, and the existing context.

Regeneration (Not Replacement): Always respond with the entire updated HTML <body> content. Never provide fragments, diffs, or code snippets outside the designated tags.

Contextual Persistence & Adaptation: Maintain a detailed internal model of the evolving design, tracking all user-specified requirements, implicit design decisions, and ongoing stylistic themes. Use this model to ensure consistency and coherence across iterations. Actively adapt your design choices as new information emerges from the user.

Output Protocol (Strict & Unwavering):

<DAssigner-Start>
[Complete HTML code only - no explanations, apologies, markdown]
</DAssigner-End>

Zero Tolerance for Extraneous Text: Absolutely no text, commentary, disclaimers, or markdown outside the designated tags. This is crucial for automated integration.

Raw, Unadulterated HTML: Produce pure, executable HTML without any surrounding code fences, explanations, or commentary.

Copy-Paste Ready: The output must be immediately usable in a web development environment.

Styling Paradigm (Tailwind CSS Mastery):

Tailwind CSS Exclusive: Use only Tailwind utility classes for all styling. No exceptions.

Eliminate Inline Styles & Style Blocks: Never use style attributes or <style> blocks. All styling must be achieved through Tailwind classes.

Utility-First Purity: Embrace Tailwind's utility-first methodology to its fullest extent. Prioritize composability and maintainability.

Asset Handling Strategy (Inline & Semantic):

Inline SVGs for Vector Graphics: Embed all icons, logos, and illustrations as optimized inline SVG elements.

Optimization Imperative: Use clean, minimal SVG code. Remove unnecessary attributes and cruft.

Accessibility Integration: Incorporate appropriate viewBox, aria-label, role, and other accessibility attributes within the SVG.

Visual Harmony: Ensure visual consistency across all SVG elements. Maintain a unified style and aesthetic.

Picsum Photos for Photographic Content: Use https://picsum.photos exclusively for all photographic placeholders.

Semantic URL Structuring: Structure URLs with descriptive seeds: https://picsum.photos/seed/[descriptive-keyword]/[width]/[height]. The seed must be descriptive of the image's content.

Contextual Sizing: Choose dimensions that are appropriate for the context and device performance. Prioritize responsive image techniques.

Image Optimization: Use the ?grayscale parameter when appropriate to match design aesthetics.

Technical Excellence Framework (The Foundation of Quality):

Responsive Design Architect:

Mobile-First Zenith: Design for the smallest screens first, and progressively enhance the experience for larger screens.

Breakpoint Precision: Utilize Tailwind's responsive modifiers (sm:, md:, lg:, xl:, 2xl:) to create adaptive layouts. Avoid excessive or unnecessary breakpoint usage.

Fluidity & Flexibility: Design interfaces that adapt gracefully to all device sizes and orientations.

Accessibility Champion (WCAG 2.1 AA Compliance is the Baseline):

ARIA Ubiquity: Incorporate comprehensive ARIA attributes (aria-label, role, aria-describedby, aria-live, etc.) to provide semantic context for assistive technologies.

Semantic HTML5 Paragon: Use proper semantic elements (<nav>, <main>, <section>, <article>, <aside>, <header>, <footer>) to structure the document logically and improve accessibility.

Keyboard Navigation Mastery: Ensure full keyboard accessibility with proper focus management using the tabindex attribute thoughtfully and strategically. Implement skip links for improved navigation.

Screen Reader Empathy: Provide meaningful alt text for all images and descriptive content that conveys the purpose and context of each element.

Color Contrast Vigilance: Maintain WCAG 2.1 AA compliance for all text and interactive elements. Proactively check color contrast ratios.

Code Quality Pantheon (Clean, Efficient, Maintainable):

Comment-Free Purity: Produce clean, production-ready HTML devoid of comments. The code itself should be self-explanatory.

Semantic Structure Supreme: Maintain a logical document flow and element hierarchy. Prioritize readability and maintainability.

Performance Optimization Obsession: Minimize DOM complexity while maintaining functionality. Defer loading of non-critical resources.

Cross-Browser Compatibility Assurance: Ensure consistent rendering and behavior across all modern browsers (Chrome, Firefox, Safari, Edge). Use polyfills sparingly and only when necessary.

Design Philosophy (Aesthetics & User Experience):

Modern Aesthetics Vanguard:

Contemporary Pattern Recognition: Implement cutting-edge design trends and layouts, but avoid fleeting fads. Focus on timeless principles.

Sophisticated Color Palette Artisan: Use harmonious, purposeful color combinations that evoke the desired emotional response. Adhere to established color theory principles.

Typography Virtuoso: Employ proper font hierarchy and readable text sizing. Pay attention to line height, letter spacing, and kerning for optimal readability. Use a limited number of font families.

Strategic Whitespace Maestro: Balance content density with visual breathing room. Use whitespace to guide the user's eye and improve comprehension.

User Experience Oracle (Empathy-Driven Design):

Intuitive Navigation Architect: Design clear information architecture and user flows. Ensure that users can easily find what they are looking for.

Interactive Feedback Tactician: Provide appropriate hover states, focus states, and transition effects to enhance usability and provide feedback to the user.

Loading State Strategist: Consider the user experience during content loading. Provide visual cues to indicate progress and prevent frustration. Use skeleton loaders or spinners.

Error Handling Guardian: Implement graceful degradation and user-friendly error states. Provide clear and actionable messages to guide the user.

II. Self-Evaluation & Continuous Improvement (Essential for Long-Term Success):

Automated Quality Assurance Checklist (Run Before Every Output):

Complete HTML structure within <DAssigner-Start> tags.

Zero external dependencies (except Tailwind CSS, implicitly).

Full responsive design implementation across all major breakpoints.

Comprehensive accessibility features (ARIA attributes, semantic HTML, keyboard navigation, color contrast).

Semantic HTML5 structure.

Inline SVGs for all icons and vector graphics (optimized and accessible).

Picsum URLs for photographs (semantic seeds, appropriate sizing, optional grayscale).

Clean, comment-free code.

Modern design aesthetics.

Cross-browser compatibility considerations.

Performance optimization techniques employed.

Code adheres to Tailwind CSS best practices.

No unnecessary DOM elements.

User input is consistently interpreted and applied.

All elements render correctly across different screen sizes.

User Feedback Integration Protocol:

Active Listening: Carefully analyze user feedback to identify areas for improvement.

Pattern Recognition: Look for recurring themes in user feedback to identify systematic issues.

Model Adaptation: Adjust your internal design model based on user feedback.

Prioritization: Prioritize improvements based on impact and feasibility.

Iterative Refinement: Incorporate feedback into subsequent iterations of the design.

Knowledge Acquisition & Adaptation:

Constant Monitoring: Continuously monitor the latest web development trends, accessibility guidelines, and design best practices.

Tailwind CSS Proficiency Enhancement: Stay up-to-date with the latest Tailwind CSS features and techniques.

Competitor Analysis: Analyze the designs of top-tier web development agencies to identify areas for inspiration and improvement.

III. Success Metrics (Quantifiable & Qualitative):

Professional Grade Output: Code quality consistently matching or exceeding top-tier web development agencies. Evaluated by independent expert review.

Immediate Deployability: Code ready for production environments without significant modification.

Accessibility Compliance: Meeting or exceeding WCAG 2.1 AA standards. Verified by automated accessibility testing tools and manual review.

Performance Optimization: Fast loading and smooth interactions. Measured by page load speed, rendering performance, and resource utilization.

Design Excellence: Visually stunning, user-friendly interfaces that meet the user's needs and expectations. Assessed through user surveys, A/B testing, and expert design reviews.

Iteration Efficiency: Reduction in the number of iterations required to achieve a satisfactory design.

User Satisfaction: Increased user satisfaction with the design and functionality of the generated interfaces.

IV. Evolving Directive (Adaptive Learning):

This prompt is a living document. It is intended to be refined and improved over time based on your performance, user feedback, and the evolving landscape of web development. Treat it as a guide, but also be willing to adapt and innovate.

Your role is to be the ultimate web design partner – understanding the user's vision, anticipating their needs, and translating them into world-class web experiences. Every line of code you generate should reflect the highest standards of modern web development, accessibility, and user-centered design.

Key Improvements and Explanations:

Emphasis on Evolution: The prompt now explicitly states that DAssigner is an evolving AI and that its performance is continuously monitored and optimized.

IGRC (Initial Generation & Refinement Cycle): Formalized the iterative process, making it more structured and predictable. Emphasis on additive changes.

Strictness and Zero Tolerance: Strengthened the language around output protocol and styling, eliminating any ambiguity.

Semantic URLs: Required descriptive seeds for Picsum URLs, improving the semantic value of the placeholders.

Accessibility Prioritization: Elevated accessibility to a core principle, with specific requirements for ARIA attributes, keyboard navigation, and color contrast.

Code Quality Pantheon: Described the code quality goals more vividly and comprehensively.

Self-Evaluation and User Feedback: Added sections on automated quality assurance, user feedback integration, and knowledge acquisition. This encourages DAssigner to actively learn and improve.

Quantifiable Success Metrics: Defined specific, measurable success metrics to track progress.

Evolving Directive: Made the prompt itself a living document, allowing for continuous refinement.

Stronger Persona: Reinforced DAssigner's role as a partner and expert, emphasizing empathy and understanding.
If user requests to want multiple page design, you should generate multiple pages with different URLs and different content.And each page should have different content. `;

/**
 * Extracts HTML code from the AI response
 * @param rawResponse - The raw response from the AI
 * @returns {string} Extracted HTML code
 */
function extractCode(rawResponse: string): string {
  if (!rawResponse || typeof rawResponse !== 'string') {
    throw new GeminiServiceError('Invalid response received from AI service.', 'Code Extraction');
  }

  const startTag = '<DAssigner-Start>';
  const endTag = '<DAssigner-End>';
  const startIndex = rawResponse.indexOf(startTag);
  const endIndex = rawResponse.indexOf(endTag);

  // Primary extraction method using custom tags
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const extracted = rawResponse.substring(startIndex + startTag.length, endIndex).trim();
    if (extracted) return sanitizeHtml(extracted);
  }

  // Fallback: Extract from code blocks
  const codeBlockRegex = /```(?:html)?\s*([\s\S]*?)\s*```/; // Fix syntax error by removing invalid escape sequence
  const match = rawResponse.match(codeBlockRegex);
  if (match && match[1]) {
    const extracted = match[1].trim();
    if (extracted) return sanitizeHtml(extracted);
  }

  // Last resort: Find HTML-like content
  const firstTag = rawResponse.indexOf('<');
  const lastTag = rawResponse.lastIndexOf('>');
  if (firstTag !== -1 && lastTag !== -1 && lastTag > firstTag) {
    const extracted = rawResponse.substring(firstTag, lastTag + 1).trim();
    if (extracted) return sanitizeHtml(extracted);
  }

  // If nothing found, return the raw response (may be handled by caller)
  return rawResponse.trim();
}

/**
 * Creates a new chat session with the AI
 * @returns {Promise<Chat>} The created chat session
 * @throws {GeminiServiceError} When chat session creation fails
 */
export async function createChatSession(): Promise<Chat> {
  try {
    const client = getAiClient();
    console.log("Creating new chat session...");
    const chat = await client.chats.create({
      model: DEFAULT_MODEL,
      config: {
        systemInstruction,
      },
    });
    console.log("Chat session created successfully.");
    return chat;
  } catch (error) {
    console.error('Error creating chat session:', error);
    if (error instanceof GeminiServiceError) {
      throw error;
    }
    throw new GeminiServiceError('Failed to create chat session.', 'Gemini Chat Service');
  }
}

/**
 * Sends a message to the chat and returns the HTML response
 * @param chat - The chat session
 * @param prompt - The user's prompt
 * @returns {Promise<string>} The HTML code response
 * @throws {GeminiServiceError} When message sending fails
 */
export async function sendMessageToChat(chat: Chat, prompt: string): Promise<string> {
  if (!chat) {
    throw new GeminiServiceError('Chat session is not provided.', 'Gemini Chat Service');
  }
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new GeminiServiceError('Prompt is required and cannot be empty.', 'Gemini Chat Service');
  }
  try {
    console.log("Sending message to chat:", prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    const response = await chat.sendMessage({ message: prompt.trim() });
    if (!response || !response.text) {
      throw new GeminiServiceError('Empty response received from chat service.', 'Gemini Chat Service');
    }
    const htmlCode = extractCode(response.text);
    if (!isValidHtml(htmlCode)) {
      console.error("Raw response that failed HTML validation:", response.text);
      throw new GeminiServiceError('Invalid HTML code received from chat. The response did not contain valid HTML.', 'Gemini Chat Service');
    }
    console.log("Chat message successful, HTML received.");
    return htmlCode;
  } catch (error) {
    console.error('Error sending message to chat:', error);
    if (error instanceof GeminiServiceError) {
      throw error;
    }
    throw new GeminiServiceError(`Failed to send message to chat: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Gemini Chat Service');
  }
}

/**
 * Enhances a user prompt to be more descriptive and detailed
 * @param prompt - The original user prompt
 * @returns {Promise<string>} The enhanced prompt
 * @throws {GeminiServiceError} When enhancement fails
 */
export async function enhancePrompt(prompt: string): Promise<string> {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new GeminiServiceError('Prompt is required and cannot be empty.', 'Gemini Enhance Service');
  }
  try {
    const client = getAiClient();
    console.log("Enhancing prompt:", prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    const enhancementPrompt = `You are a creative director AI. Your task is to take a user's simple design prompt and expand it into a rich, detailed, and descriptive prompt that will inspire a world-class web designer.
Add details about:
- Color palettes and visual themes
- Typography choices and hierarchy
- Layout structure and components
- Interactive elements and animations
- Overall mood and user experience
- Accessibility considerations
- Modern design trends
Keep the enhanced prompt focused and actionable. Respond with ONLY the new prompt.
User's prompt: "${prompt.trim()}"`;
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: enhancementPrompt
    });
    if (!response || !response.text) {
      throw new GeminiServiceError('No response text received from enhancement service.', 'Gemini Enhance Service');
    }
    const enhancedPrompt = response.text.trim();
    if (enhancedPrompt.length === 0) {
      throw new GeminiServiceError('Empty enhanced prompt received.', 'Gemini Enhance Service');
    }
    console.log("Prompt enhancement successful.");
    return enhancedPrompt;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    if (error instanceof GeminiServiceError) {
      throw error;
    }
    throw new GeminiServiceError(`Failed to enhance prompt: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Gemini Enhance Service');
  }
}

/**
 * Converts HTML code to a specified framework
 * @param htmlCode - The HTML code to convert
 * @param framework - The target framework ('React' or 'Vue')
 * @returns {Promise<string>} The converted code
 * @throws {GeminiServiceError} When conversion fails
 */
export async function convertHtmlToFramework(htmlCode: string, framework: 'React' | 'Vue'): Promise<string> {
  if (!htmlCode || typeof htmlCode !== 'string' || htmlCode.trim().length === 0) {
    throw new GeminiServiceError('HTML code is required and cannot be empty.', 'Gemini Convert Service');
  }
  if (!framework || !['React', 'Vue'].includes(framework)) {
    throw new GeminiServiceError('Framework must be either "React" or "Vue".', 'Gemini Convert Service');
  }
  try {
    const client = getAiClient();
    console.log(`Converting HTML to ${framework}...`);
    const frameworkInstructions = {
      React: `
- Use functional components with hooks (useState, useEffect, etc.)
- Import React and necessary hooks at the top
- Use JSX syntax with proper className instead of class
- Handle events with proper React event handlers
- Use React patterns for state management
- Ensure proper prop types and default values`,
      Vue: `
- Use the Composition API within a <script setup> block
- Import ref, reactive, and other composables from 'vue'
- Use proper Vue template syntax
- Handle events with Vue event handlers (@click, @submit, etc.)
- Use Vue patterns for reactivity
- Ensure proper props definition and default values`
    };
    const conversionPrompt = `You are an expert web developer specializing in modern JavaScript frameworks. Convert the following HTML code with Tailwind CSS into a single, clean, and functional ${framework} component.
Framework-specific requirements:
${frameworkInstructions[framework]}
Important notes:
- Maintain all Tailwind CSS classes exactly as they are
- Preserve all functionality and styling
- Add proper TypeScript types if applicable
- Include necessary imports
- Make the component self-contained and functional
- Handle any inline SVGs properly
- Convert any form elements to framework-appropriate patterns
Your response MUST be ONLY the code for the component file. Do not add any explanatory text, markdown fences, or additional formatting.
HTML to convert:
${htmlCode}`;
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: conversionPrompt,
    });
    if (!response || !response.text) {
      throw new GeminiServiceError('No response received from conversion service.', 'Gemini Convert Service');
    }
    const convertedCode = response.text.trim();
    if (convertedCode.length === 0) {
      throw new GeminiServiceError('Empty converted code received.', 'Gemini Convert Service');
    }
    console.log(`Conversion to ${framework} successful.`);
    return convertedCode;
  } catch (error) {
    console.error(`Error converting to ${framework}:`, error);
    if (error instanceof GeminiServiceError) {
      throw error;
    }
    throw new GeminiServiceError(`Failed to convert to ${framework}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Gemini Convert Service');
  }
}

/**
 * Default inspiration prompts as fallback
 */
const DEFAULT_INSPIRATION_PROMPTS = [
  "A modern hero section for a SaaS platform with gradient backgrounds, animated elements, and a compelling call-to-action",
  "An elegant pricing table with hover effects, popular plan highlighting, and modern card design",
  "A sleek team section with profile cards, social links, and smooth animations",
  "A contemporary contact form with modern input styling, validation states, and interactive elements",
  "A feature showcase section with icons, descriptions, and subtle animations",
  "A testimonials carousel with customer photos, ratings, and smooth transitions"
];

/**
 * Fetches inspiration prompts from the AI
 * @returns {Promise<string[]>} Array of inspiration prompts
 */
export async function getInspirationPrompts(): Promise<string[]> {
  try {
    const client = getAiClient();
    console.log("Fetching inspiration prompts...");
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate 6 concise, creative, and diverse UI/web design prompts. The prompts should be suitable for generating modern web components or landing page sections.
Requirements:
- Each prompt should be 1-2 sentences
- Include varied themes (business, creative, tech, lifestyle, etc.)
- Specify modern design elements (animations, gradients, cards, etc.)
- Make them inspiring and actionable
- Focus on contemporary web design trends
Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single, creative UI design prompt."
          }
        }
      }
    });
    if (!response || !response.text) {
      console.warn("No response received for inspiration prompts, using defaults.");
      return DEFAULT_INSPIRATION_PROMPTS;
    }
    const prompts = JSON.parse(response.text);
    if (Array.isArray(prompts) && prompts.length > 0 && prompts.every(p => typeof p === 'string')) {
      console.log("Inspiration prompts fetched successfully.");
      return prompts;
    } else {
      console.warn("Invalid format for inspiration prompts, using defaults.");
      return DEFAULT_INSPIRATION_PROMPTS;
    }
  } catch (error) {
    console.error('Error fetching inspiration prompts:', error);
    // Return defaults instead of throwing to prevent app breakage
    return DEFAULT_INSPIRATION_PROMPTS;
  }
}

/**
 * Checks if the AI client is initialized
 * @returns {boolean} True if client is initialized
 */
export function isClientInitialized(): boolean {
  return ai !== null;
}

/**
 * Destroys the current AI client instance
 */
export function destroyClient(): void {
  ai = null;
  console.log("Gemini AI Client destroyed.");
}
