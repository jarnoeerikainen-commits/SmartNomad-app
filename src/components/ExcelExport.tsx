
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Expense, ExpenseReport } from '@/types/expense';
import { Country } from '@/types/country';

interface ExcelExportProps {
  expenses: Expense[];
  countries: Country[];
  reportData?: any;
}

const ExcelExport: React.FC<ExcelExportProps> = ({ expenses, countries, reportData }) => {
  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExpenses = () => {
    const expenseData = expenses.map(expense => ({
      'Date': expense.date,
      'Country': expense.country_code,
      'Type': expense.type,
      'Description': expense.description,
      'Amount': expense.amount,
      'Currency': expense.currency,
      'Category': expense.category,
      'Business': expense.is_business ? 'Yes' : 'No',
      'Payment Method': expense.payment_method || '',
      'Vendor': expense.vendor || ''
    }));

    generateCSV(expenseData, `expenses_export_${new Date().toISOString().split('T')[0]}`);
  };

  const exportCountries = () => {
    const countryData = countries.map(country => ({
      'Country Code': country.code,
      'Country Name': country.name,
      'Days Spent': country.daysSpent,
      'Day Limit': country.dayLimit,
      'Remaining Days': country.dayLimit - country.daysSpent,
      'Reason': country.reason,
      'Yearly Days Spent': country.yearlyDaysSpent,
      'Total Entries': country.totalEntries,
      'Count Travel Days': country.countTravelDays ? 'Yes' : 'No',
      'Last Entry': country.lastEntry || '',
      'Last Update': country.lastUpdate || ''
    }));

    generateCSV(countryData, `countries_export_${new Date().toISOString().split('T')[0]}`);
  };

  const exportTaxReport = () => {
    if (!reportData) return;

    const taxData = [
      {
        'Report Type': 'Business Expense Summary',
        'Total Expenses': reportData.total_expenses || 0,
        'Expense Count': reportData.expense_count || 0,
        'Period Start': reportData.period?.start_date || '',
        'Period End': reportData.period?.end_date || '',
        'Generated': new Date().toISOString()
      }
    ];

    // Add category breakdown
    if (reportData.by_category) {
      Object.entries(reportData.by_category).forEach(([category, amount]) => {
        taxData.push({
          'Report Type': 'Category Breakdown',
          'Category': category,
          'Amount': amount,
          'Currency': 'USD'
        });
      });
    }

    // Add country breakdown
    if (reportData.by_country) {
      Object.entries(reportData.by_country).forEach(([country, amount]) => {
        taxData.push({
          'Report Type': 'Country Breakdown',
          'Country': country,
          'Amount': amount,
          'Currency': 'USD'
        });
      });
    }

    generateCSV(taxData, `tax_report_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Export Data</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={exportExpenses}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={expenses.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Expenses
        </Button>
        
        <Button
          onClick={exportCountries}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={countries.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Countries
        </Button>
        
        <Button
          onClick={exportTaxReport}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={!reportData}
        >
          <Download className="w-4 h-4" />
          Export Tax Report
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">
        Exports will be downloaded as CSV files compatible with Excel, Google Sheets, and accounting software.
      </p>
    </div>
  );
};

export default ExcelExport;
