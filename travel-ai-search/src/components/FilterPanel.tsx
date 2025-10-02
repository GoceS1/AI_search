import React from 'react';
import { X, MapPin, DollarSign, Calendar, Briefcase, Star, Clock } from 'lucide-react';

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

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (newFilters: SearchFilters) => void;
  onSearch: (query: string) => void;
  resultCount?: number;
}

export function FilterPanel({ filters, onFiltersChange, onSearch, resultCount }: FilterPanelProps) {
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  });

  if (!hasActiveFilters) {
    return null;
  }

  const removeFilter = (filterKey: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onSearch(''); // Show all trips
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm inline-block max-w-4xl">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              AI understood your search{resultCount !== undefined ? ` • ${resultCount} trip${resultCount !== 1 ? 's' : ''} found` : ''}:
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-3">
        {/* Destinations */}
        {filters.destinations && filters.destinations.map((destination) => (
          <div
            key={destination}
            className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            <MapPin className="w-3 h-3" />
            <span>{destination}</span>
            <button
              onClick={() => removeFilter('destinations')}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Trip Types */}
        {filters.types && filters.types.map((type) => (
          <div
            key={type}
            className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
          >
            <Briefcase className="w-3 h-3" />
            <span className="capitalize">{type}</span>
            <button
              onClick={() => removeFilter('types')}
              className="hover:bg-purple-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Max Price */}
        {filters.maxPrice && (
          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <DollarSign className="w-3 h-3" />
            <span>Under ${filters.maxPrice.toLocaleString()}</span>
            <button
              onClick={() => removeFilter('maxPrice')}
              className="hover:bg-green-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Min Price */}
        {filters.minPrice && (
          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <DollarSign className="w-3 h-3" />
            <span>Over ${filters.minPrice.toLocaleString()}</span>
            <button
              onClick={() => removeFilter('minPrice')}
              className="hover:bg-green-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Max Duration */}
        {filters.maxDuration && (
          <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
            <Clock className="w-3 h-3" />
            <span>Under {filters.maxDuration} days</span>
            <button
              onClick={() => removeFilter('maxDuration')}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Min Duration */}
        {filters.minDuration && (
          <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
            <Clock className="w-3 h-3" />
            <span>Over {filters.minDuration} days</span>
            <button
              onClick={() => removeFilter('minDuration')}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Seasons */}
        {filters.seasons && filters.seasons.map((season) => (
          <div
            key={season}
            className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
          >
            <Calendar className="w-3 h-3" />
            <span className="capitalize">{season}</span>
            <button
              onClick={() => removeFilter('seasons')}
              className="hover:bg-yellow-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Activities */}
        {filters.activities && (
          <div className="flex items-center space-x-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
            <Star className="w-3 h-3" />
            <span>{filters.activities.join(', ')}</span>
            <button
              onClick={() => removeFilter('activities')}
              className="hover:bg-indigo-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        </div>

        <div className="text-center">
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}
