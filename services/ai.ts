import { Product } from "../data/products";

// Using Groq API directly via fetch
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getRecommendations(query: string, products: Product[]): Promise<string[]> {
    const productList = products.map(p =>
        `ID: ${p.id}, Name: ${p.name}, Price: $${p.price}, Category: ${p.category}, Description: ${p.description}`
    ).join('\n');

    const prompt = `
    You are a shopping assistant.
    User Query: "${query}"
    
    Here is the list of available products:
    ${productList}
    
    Select the products that best match the user's query.
    Return ONLY a valid JSON array of strings containing the IDs of the recommended products. 
    Return at most 3-4 top recommendations.
    Example response: ["1", "3"]
    If no products match, return [].
    Do NOT return any other text, explanation, or markdown. Just the raw JSON array.
  `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile", // Latest powerful model on Groq
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Groq API request failed");
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || "";

        // Check for empty text
        if (!text) {
            throw new Error("Empty response from AI");
        }

        console.log("Raw AI Response:", text); // DEBUG LOG

        // Extract JSON array from text (find first '[' and last ']')
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');

        if (start === -1 || end === -1) {
            // Fallback: If AI just lists IDs like "1, 2, 3", try to parse that
            // But for now let's stick to strict JSON requirement or returning empty
            throw new Error("No JSON array found in response");
        }

        const jsonStr = text.substring(start, end + 1);
        const parsed = JSON.parse(jsonStr);

        // Ensure all IDs are strings
        return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        throw error;
    }
}
