import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trip } from "@/data/trips"
import { Clock, MapPin } from "lucide-react"

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200">
      <div className="relative overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${trip.price.toLocaleString()}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-xl mb-1 text-gray-900">{trip.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{trip.destination}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {trip.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{trip.duration} days</span>
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {trip.type} • {trip.season}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
