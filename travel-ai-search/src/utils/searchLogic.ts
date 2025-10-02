import { Trip } from "@/data/trips"
import { aiSearch } from "@/services/aiSearchService"

// Legacy interface for backward compatibility
export interface SearchFilters {
  maxPrice?: number
  minPrice?: number
  maxDuration?: number
  minDuration?: number
  destination?: string
  type?: string
  season?: string
  activities?: string[]
}

// Legacy function for backward compatibility (now using AI under the hood)
export function parseSearchQuery(query: string): SearchFilters {
  // This is now a simplified version - the real parsing happens in aiSearchService
  const filters: SearchFilters = {}
  const lowerQuery = query.toLowerCase()

  // Keep basic regex parsing as fallback
  const priceMatch = lowerQuery.match(/(?:under|below|less than|<)\s*\$?(\d+(?:,\d+)?)/)
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1].replace(',', ''))
  }

  const minPriceMatch = lowerQuery.match(/(?:over|above|more than|>)\s*\$?(\d+(?:,\d+)?)/)
  if (minPriceMatch) {
    filters.minPrice = parseInt(minPriceMatch[1].replace(',', ''))
  }

  const maxDurationMatch = lowerQuery.match(/(?:under|below|less than|shorter than)\s*(\d+)\s*days?/)
  if (maxDurationMatch) {
    filters.maxDuration = parseInt(maxDurationMatch[1])
  }

  const minDurationMatch = lowerQuery.match(/(?:over|above|more than|longer than)\s*(\d+)\s*days?/)
  if (minDurationMatch) {
    filters.minDuration = parseInt(minDurationMatch[1])
  }

  return filters
}

// Legacy function for backward compatibility
export function filterTrips(trips: Trip[], filters: SearchFilters): Trip[] {
  return trips.filter(trip => {
    if (filters.maxPrice && trip.price > filters.maxPrice) return false
    if (filters.minPrice && trip.price < filters.minPrice) return false
    if (filters.maxDuration && trip.duration > filters.maxDuration) return false
    if (filters.minDuration && trip.duration < filters.minDuration) return false
    if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false
    if (filters.type && trip.type !== filters.type) return false
    if (filters.season && trip.season !== filters.season && trip.season !== 'year-round') return false

    if (filters.activities && filters.activities.length > 0) {
      const hasMatchingActivity = filters.activities.some(activity =>
        trip.activities.some(tripActivity => 
          tripActivity.toLowerCase().includes(activity.toLowerCase()) ||
          activity.toLowerCase().includes(tripActivity.toLowerCase())
        )
      )
      if (!hasMatchingActivity) return false
    }

    return true
  })
}

// Main search function - now AI-powered!
export async function searchTrips(trips: Trip[], query: string): Promise<Trip[]> {
  if (!query.trim()) return trips

  try {
    // Use AI-powered search
    const result = await aiSearch(query)
    console.log('AI Search Result:', result.explanation)
    return result.trips
  } catch (error) {
    console.error('AI search failed, falling back to regex parsing:', error)
    
    // Fallback to legacy regex-based search
    const filters = parseSearchQuery(query)
    return filterTrips(trips, filters)
  }
}

// Synchronous version for immediate results (fallback)
export function searchTripsSync(trips: Trip[], query: string): Trip[] {
  if (!query.trim()) return trips
  
  const filters = parseSearchQuery(query)
  return filterTrips(trips, filters)
}
