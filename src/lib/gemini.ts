const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const askGemini = async (prompt: string) => {
  // If no API key, throw error immediately
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
    throw new Error('Gemini API key not configured');
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No valid response from API');
    }

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error; // Re-throw so the calling code can handle it
  }
};
