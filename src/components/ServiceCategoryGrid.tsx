import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Shield, ChevronRight } from 'lucide-react';
import { serviceCategories } from '@/data/localServicesData';
import { majorCities } from '@/data/localServicesData';

interface ServiceCategoryGridProps {
  selectedCity: string;
  searchQuery: string;
}

const ServiceCategoryGrid = ({ selectedCity, searchQuery }: ServiceCategoryGridProps) => {
  const cityData = majorCities.find(city => city.cityName === selectedCity);
  
  // Filter categories based on search query and city availability
  const filteredCategories = serviceCategories.filter(category => {
    const matchesSearch = searchQuery === '' || 
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const availableInCity = !cityData || cityData.availableCategories.includes(category.id);
    
    return matchesSearch && availableInCity;
  });

  // Group categories by priority
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const priority = category.priority;
    if (!acc[priority]) {
      acc[priority] = [];
    }
    acc[priority].push(category);
    return acc;
  }, {} as Record<number, typeof serviceCategories>);

  const priorityLabels: Record<number, { title: string; description: string }> = {
    1: { title: '🚨 Emergency & Essential Services', description: 'Quick response time, available 24/7' },
    2: { title: '⭐ Popular Services', description: 'Most requested by expats' },
    3: { title: '💼 Professional Services', description: 'Specialized expertise' },
    4: { title: '🌟 Lifestyle Services', description: 'Enhance your daily life' },
    5: { title: '📋 Additional Services', description: 'More options available' },
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedCategories)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([priority, categories]) => (
          <div key={priority}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{priorityLabels[Number(priority)].title}</h2>
              <p className="text-muted-foreground">{priorityLabels[Number(priority)].description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{category.categoryIcon}</span>
                        <div>
                          <CardTitle className="text-lg">{category.categoryName}</CardTitle>
                        </div>
                      </div>
                      {category.priority === 1 && (
                        <Badge variant="destructive" className="text-xs">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>~{category.averageResponseTime} min response</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Verified providers only</span>
                    </div>

                    <Button className="w-full" variant="outline">
                      Browse Providers
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No services found matching "{searchQuery}" in {selectedCity}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try a different search term or select another city
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceCategoryGrid;
