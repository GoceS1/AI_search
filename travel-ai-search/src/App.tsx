import { useState } from 'react'
import { trips } from './data/trips'
import { searchTripsSync } from './utils/searchLogic'
import { applyFilters } from './services/aiSearchService'
import { TripCard } from './components/TripCard'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { Plane, Sparkles, Loader2, Filter, ChevronDown, ChevronUp } from 'lucide-react'

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

function App() {
  const [filteredTrips, setFilteredTrips] = useState(trips)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchExplanation, setSearchExplanation] = useState('')
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  // Count active filters
  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => {
      const value = activeFilters[key as keyof SearchFilters];
      return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  }

  const activeFilterCount = getActiveFilterCount();

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    try {
      if (!query.trim()) {
        setFilteredTrips(trips)
        setSearchExplanation('')
        setActiveFilters({})
        setIsSearching(false)
        return
      }

      // Show immediate results using sync search for better UX
      const immediateResults = searchTripsSync(trips, query)
      setFilteredTrips(immediateResults)
      
      // Then get AI-powered results with filters
      const { aiSearch } = await import('./services/aiSearchService')
      const aiResult = await aiSearch(query)
      
      setFilteredTrips(aiResult.trips)
      setSearchExplanation(aiResult.explanation)
      
      // Set the filters that the AI applied
      setActiveFilters(aiResult.filters || {})
      
      // Keep filters closed by default - users can open if needed
      
    } catch (error) {
      console.error('Search error:', error)
      // Fallback already handled in searchTrips
    } finally {
      setIsSearching(false)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setActiveFilters(newFilters)
    
    // Apply filters directly to trips
    const filteredResults = applyFilters(trips, newFilters)
    setFilteredTrips(filteredResults)
    
    // Update explanation
    const filterCount = Object.keys(newFilters).length
    if (filterCount === 0) {
      setSearchExplanation('')
      setSearchQuery('')
      setShowFilters(false) // Hide filters when all are cleared
    } else {
      setSearchExplanation(`Showing trips with ${filterCount} active filter${filterCount > 1 ? 's' : ''}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Luxe Travel</h1>
                <p className="text-sm text-gray-500">AI-Powered Trip Discovery</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Perfect Journey
            </h2>
          </div>
          
          <div className="relative">
            {/* Search Bar and Filter Button Row */}
            <div className="flex items-start gap-3 justify-center max-w-6xl mx-auto">
              <div className="flex-1 max-w-4xl">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Try: 'Show me luxury trips under $3,000 longer than 7 days'"
                  hideExamples={!!searchQuery}
                />
              </div>
              
              {/* Filter Toggle Button - same height as search bar */}
              {searchQuery && activeFilterCount > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 px-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap flex items-center space-x-2 mt-0"
                  style={{ marginTop: '0px' }}
                >
                  <span>
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                  </span>
                  {showFilters ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Collapsible Filter Panel */}
          {searchQuery && (
            <div className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <FilterPanel 
                filters={activeFilters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                resultCount={filteredTrips.length}
              />
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className={searchQuery ? "py-8" : "-mt-4 pb-16"}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Loading indicator only when searching */}
          {isSearching && (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          )}

          {/* Default header when no search */}
          {!searchQuery && !isSearching && (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-gray-400 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Curated Travel Experiences
                </h3>
              </div>
              <p className="text-gray-600">
                Discover our hand-picked collection of extraordinary journeys
              </p>
            </div>
          )}

          {/* Trip Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Plane className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No trips found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or browse our curated collection
              </p>
              <button
                onClick={() => handleSearch('')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Show All Trips
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Plane className="w-5 h-5 text-gray-600" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">Luxe Travel</span>
          </div>
          <p className="text-gray-500">
            Powered by AI • Curated by Experts • Built for Dreamers
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
