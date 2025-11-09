import { model } from '../config/gemini';
import type { ItineraryGenerationRequest, GeneratedItinerary, AISuggestion } from '../types/ai';

export async function generateItinerary(
  request: ItineraryGenerationRequest
): Promise<GeneratedItinerary> {
  const duration = Math.ceil(
    (request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const prompt = `You are a professional travel planner. Generate a detailed itinerary for a trip with the following details:

Destination: ${request.destination}
Duration: ${duration} days
Budget: ${request.currency} ${request.budget}
Travel Style: ${request.travelStyle || 'moderate'}
Group Size: ${request.groupSize || 1} ${request.groupSize === 1 ? 'person' : 'people'}
${request.interests ? `Interests: ${request.interests.join(', ')}` : ''}

Please provide:
1. A brief overview of the trip (2-3 sentences)
2. 8-12 specific activity/place suggestions with the following details for each:
   - Title (concise, max 50 characters)
   - Description (detailed, 100-150 characters)
   - Category (accommodation, transport, food, activity, or other)
   - Location (specific address or area)
   - Estimated cost in ${request.currency}
   - Duration (e.g., "2-3 hours", "Full day", "Half day")
   - Best time to visit
   - 2-3 practical tips
3. Budget breakdown by category (accommodation, food, activities, transport, other)
4. 5 general travel tips for this destination

Format your response as JSON with this exact structure:
{
  "overview": "string",
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "category": "activity|accommodation|transport|food|other",
      "location": "string",
      "estimatedCost": number,
      "duration": "string",
      "bestTimeToVisit": "string",
      "tips": ["string", "string", "string"]
    }
  ],
  "budgetBreakdown": {
    "accommodation": number,
    "food": number,
    "activities": number,
    "transport": number,
    "other": number
  },
  "tips": ["string", "string", "string", "string", "string"]
}

Ensure all numbers are within the total budget of ${request.currency} ${request.budget}. Make suggestions realistic and practical for the destination.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object in text
      const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonText = jsonObjectMatch[0];
      }
    }

    const parsed = JSON.parse(jsonText);

    // Add IDs to suggestions
    const suggestionsWithIds: AISuggestion[] = parsed.suggestions.map((s: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      ...s,
    }));

    return {
      overview: parsed.overview,
      suggestions: suggestionsWithIds,
      budgetBreakdown: parsed.budgetBreakdown,
      tips: parsed.tips,
    };
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}

export async function getSuggestionDetails(
  destination: string,
  activityName: string
): Promise<string> {
  const prompt = `Provide detailed information about "${activityName}" in ${destination}. Include:
- What makes it special
- Best time to visit
- Approximate duration
- Tips for visitors
- Estimated cost range

Keep response concise (3-4 sentences).`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting suggestion details:', error);
    return 'Unable to fetch details at this time.';
  }
}

export async function optimizeItinerary(
  activities: Array<{ title: string; location: string; duration: string }>,
  destination: string
): Promise<string> {
  const prompt = `Given these activities for a trip to ${destination}:
${activities.map((a, i) => `${i + 1}. ${a.title} at ${a.location} (${a.duration})`).join('\n')}

Suggest an optimal day-by-day order for these activities considering:
- Geographical proximity
- Typical opening hours
- Logical flow (e.g., outdoor activities during day, dining at evening)
- Energy levels throughout the day

Provide a brief, organized schedule (max 200 words).`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error optimizing itinerary:', error);
    return 'Unable to optimize itinerary at this time.';
  }
}
