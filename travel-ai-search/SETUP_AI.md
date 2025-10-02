# AI-Powered Search Setup Guide

## Overview

Your travel search app now includes AI-powered natural language search using OpenAI's GPT models. This upgrade replaces the basic regex pattern matching with intelligent query parsing.

## Features Added

✅ **Natural Language Understanding**: Users can ask complex questions like "Show me luxury beach trips in Asia under $3000 for more than 7 days"

✅ **Smart Filtering**: AI understands context, synonyms, and complex combinations

✅ **Fallback Mechanism**: If AI fails, falls back to regex-based search

✅ **Real-time Feedback**: Shows search explanations and loading states

✅ **Few-shot Learning**: Includes examples to improve AI accuracy

## Setup Instructions

### 1. Install Dependencies

```bash
cd travel-ai-search
npm install
```

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 3. Set Environment Variable

Create a `.env` file in the `travel-ai-search` directory:

```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

**⚠️ Important Security Note**: 
- This setup exposes your API key in the frontend (not recommended for production)
- For production, create a backend API that proxies OpenAI requests
- Consider using environment-specific keys and rate limiting

### 4. Start the Application

```bash
npm start
```

## How It Works

### Architecture
```
User Query → AI Parser → Smart Filters → Trip Results
     ↓
 Fallback: Regex Parser (if AI fails)
```

### AI Pipeline

1. **Query Analysis**: GPT-3.5 analyzes the natural language query
2. **Filter Extraction**: AI extracts structured filters (price, duration, type, etc.)
3. **Smart Matching**: Applies filters with fuzzy matching and context awareness
4. **Result Ranking**: Sorts results based on query intent

### Example Queries That Work

- "Show me safaris under $3,000"
- "Luxury trips in Asia"
- "Adventures longer than 10 days"
- "Beach destinations for summer"
- "Cultural experiences in Europe under $2500"
- "Wellness retreats with yoga for 7-10 days"
- "Mountain adventures in Switzerland with hiking"

## Files Modified

- **`src/services/aiSearchService.ts`**: Core AI search logic
- **`src/utils/searchLogic.ts`**: Updated to use AI (with fallback)
- **`src/App.tsx`**: Added async search handling and loading states
- **`package.json`**: Added OpenAI dependency

## Advanced Features

### Few-Shot Examples
The AI is trained with specific examples of your travel data to improve accuracy:

```typescript
const examples = [
  {
    query: "Show me safaris under $3,000",
    response: { filters: { types: ["wildlife"], maxPrice: 3000 } }
  },
  // ... more examples
];
```

### Fallback Strategy
1. **Primary**: AI-powered parsing
2. **Secondary**: Regex-based parsing (your original logic)
3. **Tertiary**: Simple keyword search

### Error Handling
- API failures gracefully fall back to regex search
- Invalid responses trigger fallback parsing
- Network errors show user-friendly messages

## Monitoring & Debugging

Check the browser console for:
- AI search explanations
- Fallback triggers
- API response details
- Error messages

## Cost Optimization

- Uses GPT-3.5-turbo (cheaper than GPT-4)
- Temperature set to 0 for consistent results
- Max tokens limited to 500
- Caches common queries (future enhancement)

## Next Steps

### Immediate Improvements
1. **Add Backend API**: Move OpenAI calls to server-side
2. **Response Caching**: Cache frequent search queries
3. **Analytics**: Track search patterns and success rates

### Advanced Features
1. **Vector Search**: Add semantic similarity for descriptions
2. **Multi-language Support**: Support queries in different languages
3. **Personalization**: Learn user preferences over time
4. **Voice Search**: Add speech-to-text capability

## Troubleshooting

### Common Issues

**"AI search failed, falling back"**
- Check API key is set correctly
- Verify OpenAI account has credits
- Check network connectivity

**"No results found"**
- AI might be over-filtering - try simpler queries
- Check if your query matches available trip data
- Fallback search should still work

**Slow responses**
- OpenAI API can take 1-3 seconds
- Immediate results show first, then AI refines them
- Consider adding request timeout

### Performance Tips

- Keep queries specific but not overly complex
- Use example queries as templates
- The more you use it, the better the caching will work (future)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your OpenAI API key and credits
3. Test with the example queries first
4. Try the fallback by temporarily removing the API key
