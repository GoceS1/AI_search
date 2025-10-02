import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  hideExamples?: boolean
}

export function SearchBar({ onSearch, placeholder = "Search for your perfect trip...", hideExamples = false }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleExampleSearch = (exampleQuery: string) => {
    setQuery(exampleQuery)
    onSearch(exampleQuery)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-24 text-lg border-2 border-gray-200 focus:border-black transition-colors duration-200 rounded-lg bg-white shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-black hover:bg-gray-800 text-white rounded-md transition-colors duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {!hideExamples && (
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Show me safaris under $3,000",
            "Luxury trips in Asia",
            "Adventures longer than 10 days",
            "Beach destinations for summer",
            "Cultural experiences in Europe"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleSearch(example)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 border border-gray-200"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
