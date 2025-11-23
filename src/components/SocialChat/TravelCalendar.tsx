import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { SocialProfile } from '@/types/socialChat';
import { format, isSameDay, isAfter } from 'date-fns';

interface TravelCalendarProps {
  profiles: SocialProfile[];
}

export const TravelCalendar = ({ profiles }: TravelCalendarProps) => {
  const upcomingTrips = useMemo(() => {
    const trips: Array<{
      date: Date;
      city: string;
      country: string;
      travelers: SocialProfile[];
      purpose: string;
    }> = [];

    profiles.forEach(profile => {
      profile.mobility.nextDestinations.forEach(dest => {
        const existingTrip = trips.find(
          t => t.city === dest.city && isSameDay(t.date, new Date(dest.arrivalDate))
        );

        if (existingTrip) {
          existingTrip.travelers.push(profile);
        } else {
          trips.push({
            date: new Date(dest.arrivalDate),
            city: dest.city,
            country: dest.country,
            travelers: [profile],
            purpose: dest.purpose
          });
        }
      });
    });

    return trips
      .filter(trip => isAfter(trip.date, new Date()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  }, [profiles]);

  const groupedByCity = useMemo(() => {
    const groups: Record<string, typeof upcomingTrips> = {};
    
    upcomingTrips.forEach(trip => {
      const key = `${trip.city}, ${trip.country}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(trip);
    });

    return groups;
  }, [upcomingTrips]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Travel Calendar</CardTitle>
          </div>
          <CardDescription>
            Upcoming destinations with travelers to connect with
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grouped by City */}
      <div className="space-y-4">
        {Object.entries(groupedByCity).map(([city, trips]) => (
          <Card key={city}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{city}</CardTitle>
                </div>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {trips.reduce((sum, t) => sum + t.travelers.length, 0)} travelers
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {trips.map((trip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold">
                      {format(trip.date, 'd')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(trip.date, 'MMM')}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{trip.purpose}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {trip.travelers.length} {trip.travelers.length === 1 ? 'traveler' : 'travelers'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {trip.travelers.slice(0, 5).map((traveler) => (
                          <img
                            key={traveler.id}
                            src={traveler.basicInfo.avatar}
                            alt={traveler.basicInfo.name}
                            className="w-8 h-8 rounded-full border-2 border-background"
                            title={traveler.basicInfo.name}
                          />
                        ))}
                      </div>
                      {trip.travelers.length > 5 && (
                        <span className="text-sm text-muted-foreground">
                          +{trip.travelers.length - 5} more
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {trip.travelers.slice(0, 3).map((traveler) => (
                        <span
                          key={traveler.id}
                          className="text-xs text-muted-foreground"
                        >
                          {traveler.basicInfo.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {upcomingTrips.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
            <p className="text-muted-foreground">
              Add your travel plans to see connections
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
