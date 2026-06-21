const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;

const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Attempt to extract and parse JSON from a possibly malformed AI response
 */
const extractJSON = (text) => {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch (_) {}

  // Try to find JSON block
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (_) {}
  }

  // Try to find raw JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch (_) {}
  }

  throw new Error('Could not extract valid JSON from AI response');
};

/**
 * Generate a complete trip itinerary using Gemini
 */
const generateTripItinerary = async ({ destination, durationDays, budgetTier, interests }) => {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

  const interestsList = interests.join(', ');
  const budgetMap = {
    low: 'budget-conscious (economy class, hostels/budget hotels, street food)',
    medium: 'mid-range (business class, 3-4 star hotels, local restaurants)',
    high: 'luxury (first class, 5-star hotels, fine dining)',
  };

  const prompt = `You are an expert travel planner. Generate a detailed ${durationDays}-day travel itinerary for ${destination}.

Trip Details:
- Destination: ${destination}
- Duration: ${durationDays} days
- Budget Tier: ${budgetTier} (${budgetMap[budgetTier]})
- Interests: ${interestsList}

Return ONLY a valid JSON object (no markdown, no explanation) with this EXACT structure:
{
  "destination": "${destination}",
  "country": "Country Name (e.g. India)",
  "countryCode": "ISO Country Code (2-letter uppercase, e.g. IN, US, JP)",
  "durationDays": ${durationDays},
  "itinerary": [
    {
      "day": 1,
      "theme": "Theme for the day",
      "imageUrl": "https://loremflickr.com/800/600/travel,india,beach",
      "activities": [
        {
          "title": "Activity Name",
          "description": "Detailed description of the activity",
          "estimatedCost": 25,
          "time": "09:00 AM",
          "category": "sightseeing"
        }
      ]
    }
  ],
  "estimatedBudget": {
    "flights": 500,
    "accommodation": 800,
    "food": 300,
    "activities": 200,
    "transport": 150,
    "total": 1950,
    "currency": "USD"
  },
  "hotels": [
    {
      "name": "Hotel Name",
      "category": "budget",
      "rating": 3.5,
      "reason": "Why this hotel is recommended",
      "budgetType": "Budget Option",
      "pricePerNight": 50,
      "location": "City Center"
    },
    {
      "name": "Hotel Name",
      "category": "mid-range",
      "rating": 4.0,
      "reason": "Why this hotel is recommended",
      "budgetType": "Mid-Range Option",
      "pricePerNight": 120,
      "location": "Beach Area"
    },
    {
      "name": "Hotel Name",
      "category": "premium",
      "rating": 4.8,
      "reason": "Why this hotel is recommended",
      "budgetType": "Premium Option",
      "pricePerNight": 350,
      "location": "Downtown"
    }
  ],
  "packingList": [
    { "item": "Passport", "category": "documents", "completed": false },
    { "item": "Travel Insurance", "category": "documents", "completed": false },
    { "item": "T-shirts (${Math.min(durationDays, 7)})", "category": "clothing", "completed": false },
    { "item": "Comfortable Walking Shoes", "category": "clothing", "completed": false },
    { "item": "Smartphone + Charger", "category": "electronics", "completed": false },
    { "item": "Power Bank", "category": "electronics", "completed": false },
    { "item": "Basic Medicines", "category": "medicine", "completed": false },
    { "item": "Sunscreen SPF 50", "category": "weather-essentials", "completed": false }
  ],
  "riskAssessment": {
    "weatherRisk": 25,
    "travelDifficulty": 30,
    "crowdLevel": 60,
    "budgetRisk": 20,
    "overallScore": 35,
    "explanation": "Brief explanation of the overall risk level for this trip",
    "travelTips": [
      "Tip 1 for traveling to ${destination}",
      "Tip 2 for this trip",
      "Tip 3 about safety and precautions"
    ]
  }
}

Generate ${durationDays} day objects in the itinerary array. Each day must have 3-5 activities relevant to the interests: ${interestsList}. Make all cost estimates realistic for the ${budgetTier} budget tier.
For each day's 'imageUrl', construct a valid loremflickr search URL matching: 'https://loremflickr.com/800/600/travel,countryName,themeKeywords' using lowercase tags separated by commas. Make it extremely specific to the destination and day theme (e.g. 'https://loremflickr.com/800/600/travel,india,temple' or 'https://loremflickr.com/800/600/travel,japan,sushi').`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = extractJSON(text);

  // Validate required fields
  if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
    throw new Error('AI response missing itinerary array');
  }
  if (!parsed.estimatedBudget) {
    throw new Error('AI response missing budget breakdown');
  }
  if (!parsed.hotels || !Array.isArray(parsed.hotels)) {
    throw new Error('AI response missing hotel recommendations');
  }

  return parsed;
};

/**
 * Regenerate a specific day's activities
 */
const regenerateDay = async ({ destination, dayNumber, durationDays, budgetTier, interests, itinerary, customInstructions }) => {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Format existing itinerary for context to avoid duplication
  const existingItineraryContext = itinerary && Array.isArray(itinerary)
    ? itinerary.map(d => {
        return `Day ${d.day} Theme: ${d.theme || ''}\nActivities:\n` + 
          (d.activities || []).map(a => `- ${a.time || ''}: ${a.title} (${a.description || ''})`).join('\n');
      }).join('\n\n')
    : 'No existing itinerary context available.';

  const prompt = `You are an expert travel planner. Regenerate Day ${dayNumber} of a ${durationDays}-day trip to ${destination}.

Trip Context:
- Destination: ${destination}
- Day: ${dayNumber} of ${durationDays}
- Budget Tier: ${budgetTier}
- Interests: ${interests.join(', ')}
- Special Instructions for Day ${dayNumber}: ${customInstructions || 'Make it fresh and interesting'}

Existing Itinerary for Context (use this to ensure the new activities flow well and do NOT duplicate activities from other days):
${existingItineraryContext}

Return ONLY a valid JSON object with this EXACT structure (no markdown wrapper, no conversational text):
{
  "day": ${dayNumber},
  "theme": "Theme for Day ${dayNumber}",
  "imageUrl": "https://loremflickr.com/800/600/travel,india,beach",
  "activities": [
    {
      "title": "Activity Name",
      "description": "Detailed description of the activity",
      "estimatedCost": 30,
      "time": "09:00 AM",
      "category": "sightseeing"
    }
  ]
}

Provide 3-5 activities. Make it exciting, contextually appropriate, and relevant to the given interests and custom instructions.
For the 'imageUrl', construct a valid loremflickr search URL matching: 'https://loremflickr.com/800/600/travel,countryName,themeKeywords' using lowercase tags separated by commas. Make it specific to this day's theme.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return extractJSON(text);
};

/**
 * Generate a packing list for a trip
 */
const generatePackingList = async ({ destination, durationDays, budgetTier, interests }) => {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Generate a comprehensive packing list for a ${durationDays}-day trip to ${destination}.

Trip Details:
- Duration: ${durationDays} days
- Budget: ${budgetTier}
- Interests: ${interests.join(', ')}

Return ONLY a valid JSON array of packing items:
[
  { "item": "Item Name", "category": "documents|clothing|electronics|medicine|activity-equipment|weather-essentials|other", "completed": false }
]

Include 15-25 items covering all categories. Make items specific to ${destination} and the interests.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = extractJSON(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Packing list response is not an array');
  }
  return parsed;
};

module.exports = {
  generateTripItinerary,
  regenerateDay,
  generatePackingList,
};
