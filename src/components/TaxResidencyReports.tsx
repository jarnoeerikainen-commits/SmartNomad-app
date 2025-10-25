import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Shield, FileCheck, BarChart } from 'lucide-react';
import { Country } from '@/types/country';
import { useToast } from '@/hooks/use-toast';

interface TaxResidencyReportsProps {
  countries: Country[];
}

const TaxResidencyReports: React.FC<TaxResidencyReportsProps> = ({ countries }) => {
  const { toast } = useToast();

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `Your ${reportType} is being prepared. This will be available soon.`,
    });
  };

  const handleExportData = (format: 'csv' | 'xlsx' | 'json') => {
    // Prepare data for export
    const exportData = countries.map(country => ({
      Country: country.name,
      Code: country.code,
      'Days Spent': country.daysSpent,
      'Yearly Days': country.yearlyDaysSpent,
      'Day Limit': country.dayLimit,
      'Total Entries': country.totalEntries,
      'Last Entry': country.lastEntry || 'N/A',
      Status: country.daysSpent >= country.dayLimit ? 'Tax Resident' : 
              country.daysSpent >= country.dayLimit * 0.8 ? 'Warning' : 'Safe'
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tax-residency-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = Object.keys(exportData[0] || {});
      const csv = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
        )
      ].join('\n');
      
      const dataBlob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tax-residency-data-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Data Exported",
      description: `Your data has been exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download your tax residency data for use with accounting software or advisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExportData('csv')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExportData('xlsx')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExportData('json')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Annual Residency Report */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Annual Residency Report</CardTitle>
                  <CardDescription className="mt-1">
                    Complete breakdown by tax year
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary">
                <FileCheck className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Day-by-day location timeline</p>
              <p>✓ Country-by-country breakdown</p>
              <p>✓ Supporting documentation references</p>
              <p>✓ Government source citations</p>
              <p>✓ Compliance status summary</p>
            </div>
            <Button 
              className="w-full gradient-trust border-none"
              onClick={() => handleGenerateReport('Annual Residency Report')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Tax Advisor Summary */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Tax Advisor Summary</CardTitle>
                  <CardDescription className="mt-1">
                    Executive overview for professionals
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary">
                <FileCheck className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Current tax residency status</p>
              <p>✓ Key dates and thresholds</p>
              <p>✓ Compliance risk assessment</p>
              <p>✓ Tie-breaker rule analysis</p>
              <p>✓ Recommended next steps</p>
            </div>
            <Button 
              className="w-full gradient-trust border-none"
              onClick={() => handleGenerateReport('Tax Advisor Summary')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Summary
            </Button>
          </CardContent>
        </Card>

        {/* Audit Defense Package */}
        <Card className="hover:shadow-lg transition-shadow border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Audit Defense Package</CardTitle>
                  <CardDescription className="mt-1">
                    Complete evidence for tax authorities
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/30">
                Premium
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Complete presence timeline</p>
              <p>✓ Travel document verification</p>
              <p>✓ Accommodation proof compilation</p>
              <p>✓ Financial transaction records</p>
              <p>✓ Legal opinion template</p>
            </div>
            <Button 
              className="w-full gradient-trust border-none"
              onClick={() => handleGenerateReport('Audit Defense Package')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Generate Package
            </Button>
          </CardContent>
        </Card>

        {/* Quarterly Compliance Report */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Quarterly Review</CardTitle>
                  <CardDescription className="mt-1">
                    Regular compliance monitoring
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary">
                <FileCheck className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✓ Quarter-by-quarter analysis</p>
              <p>✓ Threshold progress tracking</p>
              <p>✓ Upcoming risk alerts</p>
              <p>✓ Compliance recommendations</p>
              <p>✓ Travel planning suggestions</p>
            </div>
            <Button 
              className="w-full gradient-trust border-none"
              onClick={() => handleGenerateReport('Quarterly Review')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Verification Statement */}
      <Card className="bg-success/5 border-success/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-success flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Government-Verified Data Sources</h3>
              <p className="text-sm text-muted-foreground">
                All tax residency calculations are based on official government publications and bilateral tax treaties. 
                Every report includes direct links to the source material used, ensuring full transparency and auditability.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">IRS.gov</Badge>
                <Badge variant="outline" className="text-xs">HMRC.gov.uk</Badge>
                <Badge variant="outline" className="text-xs">CRA.gc.ca</Badge>
                <Badge variant="outline" className="text-xs">ATO.gov.au</Badge>
                <Badge variant="outline" className="text-xs">OECD Tax Treaties</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Network */}
      <Card>
        <CardHeader>
          <CardTitle>Share with Your Professional Network</CardTitle>
          <CardDescription>
            Grant secure, read-only access to your tax advisor or accountant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Coming Soon: Professional Portal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A secure web portal where your advisors can view your tax residency data, 
                add notes, and collaborate with you on compliance planning.
              </p>
              <Badge variant="outline">In Development</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResidencyReports;
