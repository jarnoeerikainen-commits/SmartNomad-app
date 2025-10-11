import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Country } from '@/types/country';

interface Trip {
  country: string;
  countryCode: string;
  flag: string;
  entryDate: string;
  exitDate: string | null;
  days: number;
  purpose: string;
}

interface PDFReportGeneratorProps {
  countries: Country[];
  trips?: Trip[];
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ countries, trips = [] }) => {
  
  const generatePDFContent = () => {
    const currentDate = format(new Date(), 'MMMM dd, yyyy');
    const reportPeriod = trips.length > 0 
      ? `${format(new Date(trips[0].entryDate), 'MMM yyyy')} - ${format(new Date(), 'MMM yyyy')}`
      : 'Current Period';

    let content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Travel Compliance Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 210mm;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 30px;
    }
    .header h1 { 
      font-size: 28px;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .header p {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      padding: 20px;
      background: #f3f4f6;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      display: block;
    }
    .summary-card .label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-safe { background: #dcfce7; color: #166534; }
    .status-warning { background: #fef3c7; color: #92400e; }
    .status-danger { background: #fee2e2; color: #991b1b; }
    .timeline {
      position: relative;
      padding-left: 30px;
      margin-top: 20px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -24px;
      top: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2563eb;
      border: 2px solid white;
    }
    .timeline-date {
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 5px;
    }
    .timeline-country {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .timeline-details {
      font-size: 14px;
      color: #6b7280;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✈️ Travel Compliance Report</h1>
    <p>Report Period: ${reportPeriod} | Generated: ${currentDate}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <span class="value">${countries.length}</span>
        <span class="label">Countries Tracked</span>
      </div>
      <div class="summary-card">
        <span class="value">${trips.length}</span>
        <span class="label">Total Trips</span>
      </div>
      <div class="summary-card">
        <span class="value">${trips.reduce((sum, t) => sum + t.days, 0)}</span>
        <span class="label">Total Days Traveled</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Country Tracking Status</h2>
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Days Spent</th>
          <th>Day Limit</th>
          <th>Status</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${countries.map(country => {
          const progress = (country.daysSpent / country.dayLimit) * 100;
          const statusClass = progress >= 90 ? 'status-danger' : progress >= 70 ? 'status-warning' : 'status-safe';
          const statusText = progress >= 90 ? 'Critical' : progress >= 70 ? 'Warning' : 'Safe';
          
          return `
            <tr>
              <td><strong>${country.flag} ${country.name}</strong></td>
              <td>${country.daysSpent} days</td>
              <td>${country.dayLimit} days</td>
              <td><span class="status-badge ${statusClass}">${statusText}</span></td>
              <td>${country.reason}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2 class="section-title">Trip Timeline</h2>
    <div class="timeline">
      ${trips.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()).map(trip => `
        <div class="timeline-item">
          <div class="timeline-date">${format(new Date(trip.entryDate), 'MMMM dd, yyyy')}</div>
          <div class="timeline-country">${trip.flag} ${trip.country}</div>
          <div class="timeline-details">
            Duration: ${trip.days} days | 
            ${trip.exitDate ? `Departed: ${format(new Date(trip.exitDate), 'MMM dd, yyyy')}` : 'Ongoing'} | 
            Purpose: ${trip.purpose}
          </div>
        </div>
      `).join('')}
      ${trips.length === 0 ? '<p style="color: #9ca3af; text-align: center;">No trips recorded yet</p>' : ''}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Compliance Notes</h2>
    <ul style="padding-left: 20px; line-height: 2;">
      <li>This report is generated automatically based on recorded travel data</li>
      <li>All dates and durations are calculated based on user-provided information</li>
      <li>Please verify all entries for accuracy before submission to authorities</li>
      <li>Day counts include both arrival and departure days unless specified otherwise</li>
      <li>Tax residency rules vary by country and personal circumstances</li>
    </ul>
  </div>

  <div class="footer">
    <p>This report was generated by Travel Day Guardian</p>
    <p>For official tax and visa advice, please consult with qualified professionals</p>
  </div>
</body>
</html>
    `;

    return content;
  };

  const downloadPDF = () => {
    const htmlContent = generatePDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    const htmlContent = generatePDFContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional Reports
        </CardTitle>
        <CardDescription>
          Generate audit-ready PDF reports with trip timelines and compliance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={printPDF} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Print as PDF
          </Button>
          <Button onClick={downloadPDF} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
          <p><strong>Report includes:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Executive summary with key statistics</li>
            <li>Complete country tracking status</li>
            <li>Visual trip timeline with all entries</li>
            <li>Compliance notes and disclaimers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
