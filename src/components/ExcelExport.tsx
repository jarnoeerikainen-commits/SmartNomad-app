
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Country } from '@/types/country';

interface ExcelExportProps {
  countries: Country[];
}

const ExcelExport: React.FC<ExcelExportProps> = ({ countries }) => {
  const exportToCSV = () => {
    if (countries.length === 0) {
      alert('No countries to export');
      return;
    }

    // Create CSV header
    const headers = ['Country', 'Country Code', 'Flag', 'Reason', 'Days Spent', 'Day Limit', 'Days Remaining', 'Progress %', 'Count Travel Days'];
    
    // Create CSV rows
    const rows = countries.map(country => {
      const progress = ((country.daysSpent / country.dayLimit) * 100).toFixed(1);
      const daysRemaining = Math.max(0, country.dayLimit - country.daysSpent);
      
      return [
        country.name,
        country.code,
        country.flag,
        country.reason,
        country.daysSpent,
        country.dayLimit,
        daysRemaining,
        `${progress}%`,
        country.countTravelDays ? 'Yes' : 'No'
      ];
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Create and download file
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

  return (
    <Button 
      onClick={exportToCSV}
      variant="outline"
      className="border-blue-300 text-blue-600 hover:bg-blue-50"
      size="lg"
    >
      <Download className="w-5 h-5 mr-2" />
      Export to Excel
    </Button>
  );
};

export default ExcelExport;
