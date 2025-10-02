import OpenAI from 'openai';
import { Trip, trips } from '../data/trips';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend API
});

// Database schema description for the LLM
const DATABASE_SCHEMA = `
You are a travel search assistant. You have access to a trips database with the following structure:

TRIPS TABLE:
- id: string (unique identifier)
- name: string (trip title)
- destination: string (country/location)
- price: number (USD price)
- duration: number (days)
- type: 'adventure' | 'luxury' | 'cultural' | 'wildlife' | 'beach' | 'mountain' | 'wellness'
- season: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round'
- activities: string[] (array of activities)
- description: string (detailed description)

Available trips data:
${trips.map(trip => `
ID: ${trip.id}
Name: ${trip.name}
Destination: ${trip.destination}
Price: $${trip.price}
Duration: ${trip.duration} days
Type: ${trip.type}
Season: ${trip.season}
Activities: ${trip.activities.join(', ')}
Description: ${trip.description}
`).join('\n')}

Key data for filtering:
- Asian destinations: Japan ($3,200), Maldives ($4,500), Indonesia ($1,200)
- Price range: $1,200 - $4,500
- Duration range: 6 - 14 days
- Trip types: adventure, luxury, cultural, wildlife, beach, mountain, wellness

Your task is to analyze the user's natural language query and return a JSON object with filtering criteria.
Return ONLY valid JSON in this exact format:
{
  "filters": {
    "maxPrice": number | undefined,
    "minPrice": number | undefined,
    "maxDuration": number | undefined,
    "minDuration": number | undefined,
    "destinations": string[] | undefined,
    "types": string[] | undefined,
    "seasons": string[] | undefined,
    "activities": string[] | undefined,
    "keywords": string[] | undefined
  },
  "explanation": "Brief explanation of how you interpreted the query"
}

Examples:
- "Show me trips under $2000" → {"filters": {"maxPrice": 2000}, "explanation": "Filtering trips with price less than $2000"}
- "Luxury trips in Asia" → {"filters": {"types": ["luxury"], "destinations": ["Japan", "Maldives", "Indonesia"]}, "explanation": "Filtering luxury trips in Asian destinations"}
- "Adventures longer than 10 days" → {"filters": {"types": ["adventure"], "minDuration": 10}, "explanation": "Filtering adventure trips with duration more than 10 days"}
`;

// Few-shot examples for better parsing
const FEW_SHOT_EXAMPLES = [
  {
    query: "Show me safaris under $3,000",
    response: {
      filters: {
        types: ["wildlife"],
        maxPrice: 3000
      },
      explanation: "Filtering wildlife/safari trips under $3,000"
    }
  },
  {
    query: "Luxury trips in Asia",
    response: {
      filters: {
        types: ["luxury"],
        destinations: ["Japan", "Maldives", "Indonesia"]
      },
      explanation: "Filtering luxury trips in Asian destinations"
    }
  },
  {
    query: "Adventures longer than 10 days",
    response: {
      filters: {
        types: ["adventure"],
        minDuration: 10
      },
      explanation: "Filtering adventure trips longer than 10 days"
    }
  },
  {
    query: "Beach destinations for summer",
    response: {
      filters: {
        types: ["beach"],
        seasons: ["summer", "year-round"]
      },
      explanation: "Filtering beach trips suitable for summer travel"
    }
  },
  {
    query: "Cultural experiences in Europe",
    response: {
      filters: {
        types: ["cultural"],
        destinations: ["Switzerland", "Greece", "Iceland"]
      },
      explanation: "Filtering cultural trips in European destinations"
    }
  }
];

interface SearchFilters {
  maxPrice?: number;
  minPrice?: number;
  maxDuration?: number;
  minDuration?: number;
  destinations?: string[];
  types?: string[];
  seasons?: string[];
  activities?: string[];
  keywords?: string[];
}

interface AISearchResponse {
  filters: SearchFilters;
  explanation: string;
}

// Parse natural language query using OpenAI
export async function parseQueryWithAI(query: string): Promise<AISearchResponse> {
  console.log('🔍 AI Search - Input Query:', query);
  
  try {
    const prompt = `${DATABASE_SCHEMA}

Few-shot examples:
${FEW_SHOT_EXAMPLES.map(ex => 
  `Query: "${ex.query}"\nResponse: ${JSON.stringify(ex.response)}`
).join('\n\n')}

Now parse this query:
Query: "${query}"

Remember to return ONLY valid JSON in the specified format.`;

    console.log('📝 AI Search - Sending prompt to OpenAI...');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a travel search query parser. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    console.log('🤖 AI Search - Raw AI Response:', content);
    
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content) as AISearchResponse;
    console.log('✅ AI Search - Parsed Filters:', JSON.stringify(parsed.filters, null, 2));
    console.log('💡 AI Search - AI Explanation:', parsed.explanation);
    
    // Validate the response structure
    if (!parsed.filters || !parsed.explanation) {
      throw new Error('Invalid response format from AI');
    }

    return parsed;

  } catch (error: any) {
    console.error('❌ AI parsing error:', error);
    console.log('🔄 AI Search - Falling back to regex parsing...');
    
    // Fallback to keyword-based parsing
    return fallbackParse(query);
  }
}

// Fallback parsing when AI fails
function fallbackParse(query: string): AISearchResponse {
  console.log('🔄 Fallback Parse - Input Query:', query);
  const lowerQuery = query.toLowerCase();
  const filters: SearchFilters = {};

  // Price parsing
  const priceMatch = lowerQuery.match(/(?:under|below|less than|<)\s*\$?(\d+(?:,\d+)?)/);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1].replace(',', ''));
    console.log('💰 Fallback Parse - Found max price:', filters.maxPrice);
  }

  const minPriceMatch = lowerQuery.match(/(?:over|above|more than|>)\s*\$?(\d+(?:,\d+)?)/);
  if (minPriceMatch) {
    filters.minPrice = parseInt(minPriceMatch[1].replace(',', ''));
    console.log('💰 Fallback Parse - Found min price:', filters.minPrice);
  }

  // Duration parsing
  const maxDurationMatch = lowerQuery.match(/(?:under|below|less than|shorter than)\s*(\d+)\s*days?/);
  if (maxDurationMatch) {
    filters.maxDuration = parseInt(maxDurationMatch[1]);
    console.log('📅 Fallback Parse - Found max duration:', filters.maxDuration);
  }

  const minDurationMatch = lowerQuery.match(/(?:over|above|more than|longer than)\s*(\d+)\s*days?/);
  if (minDurationMatch) {
    filters.minDuration = parseInt(minDurationMatch[1]);
    console.log('📅 Fallback Parse - Found min duration:', filters.minDuration);
  }

  // Type parsing
  const typeKeywords = {
    safari: ['wildlife'],
    adventure: ['adventure'],
    luxury: ['luxury'],
    cultural: ['cultural'],
    culture: ['cultural'],
    beach: ['beach'],
    mountain: ['mountain'],
    wellness: ['wellness'],
  };

  for (const [keyword, types] of Object.entries(typeKeywords)) {
    if (lowerQuery.includes(keyword)) {
      filters.types = types;
      console.log('🏷️ Fallback Parse - Found types:', types);
      break;
    }
  }

  // Destination parsing
  const destinationKeywords = {
    asia: ['Japan', 'Maldives', 'Indonesia'],
    europe: ['Switzerland', 'Greece', 'Iceland'],
    africa: ['Kenya', 'Morocco'],
    japan: ['Japan'],
    maldives: ['Maldives'],
    indonesia: ['Indonesia'],
    switzerland: ['Switzerland'],
    greece: ['Greece'],
    iceland: ['Iceland'],
    kenya: ['Kenya'],
    morocco: ['Morocco'],
    argentina: ['Argentina'],
  };

  for (const [keyword, destinations] of Object.entries(destinationKeywords)) {
    if (lowerQuery.includes(keyword)) {
      filters.destinations = destinations;
      console.log('🌍 Fallback Parse - Found destinations:', destinations);
      break;
    }
  }

  // Season parsing
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  for (const season of seasons) {
    if (lowerQuery.includes(season)) {
      filters.seasons = [season, 'year-round'];
      console.log('🌸 Fallback Parse - Found seasons:', filters.seasons);
      break;
    }
  }

  // Activity parsing
  const activityKeywords = ['safari', 'diving', 'snorkeling', 'hiking', 'yoga', 'spa', 'temple', 'skiing'];
  const foundActivities = activityKeywords.filter(activity => lowerQuery.includes(activity));
  if (foundActivities.length > 0) {
    filters.activities = foundActivities;
    console.log('🏃 Fallback Parse - Found activities:', foundActivities);
  }

  console.log('📋 Fallback Parse - Final Filters:', JSON.stringify(filters, null, 2));

  return {
    filters,
    explanation: `Fallback parsing applied basic keyword matching for: ${query}`
  };
}

// Apply filters to trips
export function applyFilters(trips: Trip[], filters: SearchFilters): Trip[] {
  console.log('🔍 Filter Application - Starting with', trips.length, 'trips');
  console.log('🎯 Filter Application - Applying filters:', JSON.stringify(filters, null, 2));
  
  const filteredTrips = trips.filter(trip => {
    const reasons: string[] = [];
    
    // Price filters
    if (filters.maxPrice && trip.price > filters.maxPrice) {
      reasons.push(`price ${trip.price} > maxPrice ${filters.maxPrice}`);
      return false;
    }
    if (filters.minPrice && trip.price < filters.minPrice) {
      reasons.push(`price ${trip.price} < minPrice ${filters.minPrice}`);
      return false;
    }

    // Duration filters
    if (filters.maxDuration && trip.duration > filters.maxDuration) {
      reasons.push(`duration ${trip.duration} > maxDuration ${filters.maxDuration}`);
      return false;
    }
    if (filters.minDuration && trip.duration < filters.minDuration) {
      reasons.push(`duration ${trip.duration} < minDuration ${filters.minDuration}`);
      return false;
    }

    // Type filters
    if (filters.types && !filters.types.includes(trip.type)) {
      reasons.push(`type ${trip.type} not in ${filters.types.join(', ')}`);
      return false;
    }

    // Destination filters
    if (filters.destinations && !filters.destinations.some(dest => 
      trip.destination.toLowerCase().includes(dest.toLowerCase())
    )) {
      reasons.push(`destination ${trip.destination} not matching ${filters.destinations.join(', ')}`);
      return false;
    }

    // Season filters
    if (filters.seasons && !filters.seasons.includes(trip.season)) {
      reasons.push(`season ${trip.season} not in ${filters.seasons.join(', ')}`);
      return false;
    }

    // Activity filters
    if (filters.activities && !filters.activities.some(activity =>
      trip.activities.some(tripActivity => 
        tripActivity.toLowerCase().includes(activity.toLowerCase()) ||
        activity.toLowerCase().includes(tripActivity.toLowerCase())
      )
    )) {
      reasons.push(`activities ${trip.activities.join(', ')} not matching ${filters.activities.join(', ')}`);
      return false;
    }

    // Keyword filters (search in name, description, destination)
    if (filters.keywords && !filters.keywords.some(keyword =>
      trip.name.toLowerCase().includes(keyword.toLowerCase()) ||
      trip.description.toLowerCase().includes(keyword.toLowerCase()) ||
      trip.destination.toLowerCase().includes(keyword.toLowerCase())
    )) {
      reasons.push(`keywords ${filters.keywords.join(', ')} not found in trip`);
      return false;
    }

    // Trip passed all filters
    console.log('✅ Filter Application - Trip PASSED:', trip.name, '(' + trip.destination + ')');
    return true;
  });
  
  console.log('📊 Filter Application - Final result:', filteredTrips.length, 'trips passed filters');
  console.log('📝 Filter Application - Passed trips:', filteredTrips.map(t => `${t.name} (${t.destination}, $${t.price})`));
  
  return filteredTrips;
}

// Main AI-powered search function
export async function aiSearch(query: string): Promise<{
  trips: Trip[];
  explanation: string;
  success: boolean;
  filters?: SearchFilters;
  error?: string;
}> {
  console.log('🚀 AI Search - Starting search for:', query);
  
  try {
    if (!query.trim()) {
      console.log('📋 AI Search - Empty query, returning all trips');
      return {
        trips,
        explanation: 'Showing all available trips',
        success: true,
        filters: {}
      };
    }

    // Parse query with AI
    console.log('🧠 AI Search - Parsing query with AI...');
    const { filters, explanation } = await parseQueryWithAI(query);
    
    // Apply filters
    console.log('🎯 AI Search - Applying filters to trips...');
    const filteredTrips = applyFilters(trips, filters);
    
    // Sort results (price ascending by default, but could be smarter)
    console.log('📈 AI Search - Sorting results...');
    const sortedTrips = filteredTrips.sort((a, b) => {
      // If price filter is involved, sort by price
      if (filters.maxPrice || filters.minPrice) {
        return a.price - b.price;
      }
      // If duration filter is involved, sort by duration
      if (filters.maxDuration || filters.minDuration) {
        return b.duration - a.duration;
      }
      // Default: sort by price
      return a.price - b.price;
    });

    console.log('🎉 AI Search - Search completed successfully!');
    console.log('📊 AI Search - Final results:', sortedTrips.length, 'trips found');

    return {
      trips: sortedTrips,
      explanation,
      success: true,
      filters
    };

  } catch (error: any) {
    console.error('❌ AI search error:', error);
    console.log('🔄 AI Search - Falling back to simple keyword search...');
    
    // Fallback to simple search
    const fallbackTrips = trips.filter(trip =>
      trip.name.toLowerCase().includes(query.toLowerCase()) ||
      trip.destination.toLowerCase().includes(query.toLowerCase()) ||
      trip.description.toLowerCase().includes(query.toLowerCase()) ||
      trip.activities.some(activity => 
        activity.toLowerCase().includes(query.toLowerCase())
      )
    );

    console.log('📊 AI Search - Fallback search found:', fallbackTrips.length, 'trips');

    return {
      trips: fallbackTrips,
      explanation: `Fallback search results for: ${query}`,
      success: false,
      filters: {},
      error: error.message
    };
  }
}
