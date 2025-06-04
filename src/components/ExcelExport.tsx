
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileExcel, Download, Calendar } from 'lucide-react';
import { Country } from '@/types/country';

interface ExcelExportProps {
  countries: Country[];
}

interface TravelDay {
  date: string;
  country: string;
  countryCode: string;
  flag: string;
  city?: string;
  counted: boolean;
}

const ExcelExport: React.FC<ExcelExportProps> = ({ countries }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate sample travel data (in real app, this would come from stored location data)
  const generateTravelData = (): TravelDay[] => {
    const data: TravelDay[] = [];
    const today = new Date();
    
    countries.forEach(country => {
      // Generate sample days for each country based on daysSpent
      for (let i = 0; i < country.daysSpent; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (country.daysSpent - i));
        
        data.push({
          date: date.toISOString().split('T')[0],
          country: country.name,
          countryCode: country.code,
          flag: country.flag,
          city: `City ${i + 1}`, // Sample city data
          counted: country.countTravelDays
        });
      }
    });
    
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const travelData = generateTravelData();

  const exportToCSV = () => {
    const headers = ['Date', 'Country', 'Country Code', 'City', 'Counted', 'Flag'];
    const csvContent = [
      headers.join(','),
      ...travelData.map(day => [
        day.date,
        `"${day.country}"`,
        day.countryCode,
        `"${day.city}"`,
        day.counted ? 'Yes' : 'No',
        day.flag
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `travel-days-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCountryStats = () => {
    const stats = countries.map(country => ({
      ...country,
      totalDays: travelData.filter(day => day.countryCode === country.code).length,
      countedDays: travelData.filter(day => day.countryCode === country.code && day.counted).length
    }));
    
    return stats;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-green-300 text-green-600 hover:bg-green-50"
          size="lg"
        >
          <FileExcel className="w-5 h-5 mr-2" />
          Export Excel Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Travel Days Export
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Actions */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Export your complete travel day history with country and city details
            </p>
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>

          {/* Country Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Country Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCountryStats().map(country => (
                <div key={country.id} className="bg-white p-3 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Total Days: <span className="font-medium">{country.totalDays}</span></div>
                    <div>Counted Days: <span className="font-medium">{country.countedDays}</span></div>
                    <div>Limit: <span className="font-medium">{country.dayLimit}</span></div>
                    <div>
                      Remaining: 
                      <span className={`font-medium ml-1 ${
                        country.dayLimit - country.countedDays < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {country.dayLimit - country.countedDays}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day by Day Table */}
          <div>
            <h3 className="font-semibold mb-3">Day by Day Travel History</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Counted</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travelData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No travel data available yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    travelData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {new Date(day.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{day.flag}</span>
                            <span>{day.country}</span>
                          </div>
                        </TableCell>
                        <TableCell>{day.city}</TableCell>
                        <TableCell>
                          <Badge variant={day.counted ? "default" : "secondary"}>
                            {day.counted ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-600">
                            {day.countryCode}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExport;
