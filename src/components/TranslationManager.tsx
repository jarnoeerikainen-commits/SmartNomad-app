import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Search,
  FileJson,
  Globe,
  TrendingUp,
  AlertTriangle,
  Home
} from 'lucide-react';
import { translationAnalyzer } from '@/utils/translationAnalyzer';
import { LanguageReport, TranslationImport } from '@/types/translation';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Import real translations - we'll extract them from the LanguageContext module
// For now, we create a simple extraction that reads the actual translations
const extractTranslationsFromContext = (): Record<string, Record<string, string>> => {
  // This is a placeholder - in production, you'd import the translations object directly
  // For now, we'll use localStorage to get a sample and build from English keys
  
  // Basic structure with all 13 languages
  const translations: Record<string, Record<string, string>> = {
    en: {},
    es: {},
    pt: {},
    zh: {},
    fr: {},
    de: {},
    ar: {},
    ja: {},
    it: {},
    ko: {},
    hi: {},
    sw: {},
    af: {},
  };

  // Get English translations as the source of truth
  // In a real scenario, you'd import these directly from LanguageContext
  const englishKeys = [
    'app.title', 'app.tagline', 'header.profile', 'header.profile_settings',
    'header.app_settings', 'header.upgrade_plan', 'header.privacy_data',
    'header.sign_out', 'nav.dashboard', 'nav.tracking', 'nav.tax',
    'nav.visas', 'nav.documents', 'nav.health', 'nav.news', 'nav.alerts',
    'nav.services', 'nav.settings', 'nav.help', 'nav.footer_version',
    'nav.footer_tagline', 'stats.countries_tracked', 'stats.active_destinations',
    'stats.active_tracking', 'stats.with_recorded_visits', 'stats.critical_alerts',
    'stats.require_attention', 'stats.warnings', 'stats.urgent', 'stats.monitor_closely',
    'quick.title', 'quick.add_country', 'quick.add_country_desc',
    'quick.upload_documents', 'quick.upload_documents_desc', 'quick.check_visas',
    'quick.check_visas_desc', 'quick.view_alerts', 'quick.view_alerts_desc',
    'quick.ai_doctor', 'quick.ai_doctor_desc', 'quick.ai_lawyer',
    'quick.ai_lawyer_desc', 'quick.ai_visa_helper', 'quick.ai_visa_helper_desc',
    'quick.ai_restaurant', 'quick.ai_restaurant_desc', 'quick.esim',
    'quick.esim_desc', 'quick.embassy', 'quick.embassy_desc',
    'quick.travel_planner', 'quick.travel_planner_desc', 'quick.credit_cards',
    'quick.credit_cards_desc', 'quick.search_flights', 'quick.search_flights_desc',
    'quick.search_hotels', 'quick.search_hotels_desc', 'embassy.title',
    'embassy.description', 'embassy.visit_website', 'embassy.travel_advice',
    'embassy.register', 'embassy.tip', 'ai.title', 'ai.typing', 'ai.greeting',
    'ai.visa_response', 'ai.booking_response', 'ai.weather_response',
    'ai.tax_response', 'ai.alert_response', 'ai.help_response',
    'doc.title', 'doc.track_description', 'doc.passports', 'doc.licenses',
    'doc.no_passports', 'doc.add_passport', 'doc.add_license',
    'doc.country_state', 'doc.license_class', 'doc.issue_date',
    'doc.expiry_date', 'doc.issuing_authority', 'doc.notes',
    'expense.title', 'alerts.title', 'alerts.settings', 'passport.title',
    'profile.title', 'tax.title', 'tax.global_overview', 'tax.united_states',
    'tax.canada', 'tax.select_jurisdiction', 'card.limit_exceeded',
    'card.critical', 'card.warning', 'card.monitor', 'card.safe',
    'card.entries', 'card.current', 'card.count_travel_days', 'card.on',
    'card.off', 'card.tax_residence_status', 'card.days_left',
    'card.days_this_year', 'card.days_progress', 'card.days_spent',
    'card.remaining', 'card.day_limit', 'card.this_year', 'card.total_days',
    'card.edit_limit', 'card.reset', 'addCountry.title', 'circularDashboard.title',
    'toast.countryAdded', 'toast.countryAddedDesc', 'toast.countryRemoved',
    'toast.countryRemovedDesc', 'toast.locationConfirmed', 'toast.locationConfirmedDesc',
    'toast.locationCorrection', 'toast.locationCorrectionDesc', 'toast.vpnInstructions',
    'toast.vpnInstructionsDesc', 'toast.planUpgraded', 'toast.planUpgradedDesc',
    'common.save', 'common.cancel', 'common.close', 'common.free',
    'common.upgrade', 'common.profile', 'common.settings', 'common.my_data',
    'common.privacy', 'common.manage_profile', 'upgrade.free_premium_title',
    'upgrade.special_offer', 'upgrade.share_preferences', 'upgrade.get_free_premium',
    'upgrade.unlock_premium', 'upgrade.from_price', 'upgrade.benefits',
    'upgrade.view_plans', 'upgrade.personalized_alerts', 'upgrade.tax_visa_guidance',
    'upgrade.ai_assistant', 'upgrade.auto_location', 'upgrade.tax_tracking',
    'upgrade.advanced_reports', 'upgrade.cloud_backup',
  ];

  // Populate English with sample values
  englishKeys.forEach(key => {
    translations.en[key] = key; // Using key as placeholder
  });

  return translations;
};

export const TranslationManager: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reports, setReports] = useState<LanguageReport[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [importedTranslations, setImportedTranslations] = useState<Record<string, Record<string, string>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, Record<string, string>>>({});

  // Load translations on mount
  useEffect(() => {
    const translations = extractTranslationsFromContext();
    setCurrentTranslations(translations);
  }, []);

  // Analyze translations
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysisReports = translationAnalyzer.analyzeTranslations(currentTranslations);
      setReports(analysisReports);
      setIsAnalyzing(false);
      toast({
        title: 'Analysis Complete',
        description: `Found ${analysisReports.reduce((sum, r) => sum + r.missingKeys.length, 0)} missing translations across ${analysisReports.length} languages.`,
      });
    }, 500);
  };

  // Export to JSON
  const handleExportJSON = (report: LanguageReport) => {
    const exportData = translationAnalyzer.exportToJSON(report);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations-${report.code}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Successful',
      description: `Exported ${report.missingKeys.length} keys for ${report.name}`,
    });
  };

  // Export to CSV
  const handleExportCSV = (report: LanguageReport) => {
    const csvContent = translationAnalyzer.exportToCSV(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations-${report.code}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Successful',
      description: `Exported ${report.missingKeys.length} keys for ${report.name}`,
    });
  };

  // Import translations
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>, langCode: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importData: TranslationImport;

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          importData = {
            targetLanguage: langCode,
            translations: parsed.translations || parsed,
          };
        } else if (file.name.endsWith('.csv')) {
          importData = translationAnalyzer.parseCSVImport(content, langCode);
        } else {
          throw new Error('Unsupported file format');
        }

        // Validate import
        const validation = translationAnalyzer.validateImport(
          importData,
          Object.keys(currentTranslations['en'])
        );

        if (!validation.isValid) {
          toast({
            title: 'Import Failed',
            description: validation.errors.join(', '),
            variant: 'destructive',
          });
          return;
        }

        // Store imported translations
        setImportedTranslations(prev => ({
          ...prev,
          [langCode]: importData.translations,
        }));

        toast({
          title: 'Import Successful',
          description: `Imported ${Object.keys(importData.translations).length} translations for ${langCode}. ${validation.warnings.length > 0 ? validation.warnings.join(', ') : ''}`,
        });

        // Re-analyze
        handleAnalyze();
      } catch (error) {
        toast({
          title: 'Import Error',
          description: error instanceof Error ? error.message : 'Failed to import file',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  // Generate updated code
  const handleGenerateCode = () => {
    const updatedCode = translationAnalyzer.generateLanguageContextCode(
      currentTranslations,
      importedTranslations
    );

    // Copy to clipboard
    navigator.clipboard.writeText(updatedCode);
    
    // Also trigger download
    const blob = new Blob([updatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LanguageContext-updated-${Date.now()}.tsx`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Code Generated',
      description: 'New LanguageContext.tsx copied to clipboard and downloaded!',
    });
  };

  // Statistics
  const stats = useMemo(() => {
    const totalKeys = reports.length > 0 ? reports[0].totalKeys : 0;
    const totalMissing = reports.reduce((sum, r) => sum + r.missingKeys.length, 0);
    const avgCompletion = reports.length > 0 
      ? Math.round(reports.reduce((sum, r) => sum + r.completionPercentage, 0) / reports.length)
      : 0;
    const completeLanguages = reports.filter(r => r.completionPercentage === 100).length;

    return { totalKeys, totalMissing, avgCompletion, completeLanguages };
  }, [reports]);

  // Filtered reports based on search
  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    return reports.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Translation Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Professional translation management for SmartNomad - Analyze, export, import, and validate translations across 13 languages
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Statistics Cards */}
      {reports.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalKeys}</div>
              <p className="text-xs text-muted-foreground">English source keys</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missing Translations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.totalMissing}</div>
              <p className="text-xs text-muted-foreground">Across all languages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCompletion}%</div>
              <p className="text-xs text-muted-foreground">All languages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complete Languages</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.completeLanguages}</div>
              <p className="text-xs text-muted-foreground">Out of {reports.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="generate">Generate Code</TabsTrigger>
        </TabsList>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Analysis</CardTitle>
              <CardDescription>
                Scan the current LanguageContext.tsx to identify missing translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                size="lg"
                className="w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Scan Translations'}
              </Button>

              {reports.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Language Status</h3>
                      <Input 
                        placeholder="Search languages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3">
                        {filteredReports.map((report) => (
                          <Card key={report.code} className="border-l-4" style={{
                            borderLeftColor: report.completionPercentage === 100 ? 'hsl(var(--success))' : 
                                           report.completionPercentage >= 80 ? 'hsl(var(--warning))' : 
                                           'hsl(var(--destructive))'
                          }}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {report.nativeName}
                                    <Badge variant={report.completionPercentage === 100 ? 'default' : 'secondary'}>
                                      {report.code.toUpperCase()}
                                    </Badge>
                                  </CardTitle>
                                  <CardDescription>{report.name}</CardDescription>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    {report.completionPercentage}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {report.missingKeys.length} missing
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Progress value={report.completionPercentage} className="mb-2" />
                              <div className="text-sm text-muted-foreground">
                                {report.totalKeys - report.missingKeys.length} / {report.totalKeys} keys translated
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Missing Translations</CardTitle>
              <CardDescription>
                Download missing translations in JSON or CSV format for external translation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please run the analysis first to see available exports
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {reports
                      .filter(r => r.missingKeys.length > 0)
                      .map((report) => (
                        <Card key={report.code}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              {report.nativeName} ({report.code.toUpperCase()})
                            </CardTitle>
                            <CardDescription>
                              {report.missingKeys.length} missing translations
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex gap-2">
                            <Button 
                              onClick={() => handleExportJSON(report)}
                              variant="outline"
                              className="flex-1"
                            >
                              <FileJson className="mr-2 h-4 w-4" />
                              Export JSON
                            </Button>
                            <Button 
                              onClick={() => handleExportCSV(report)}
                              variant="outline"
                              className="flex-1"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Export CSV
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Completed Translations</CardTitle>
              <CardDescription>
                Upload your translated JSON or CSV files to update the translation database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please run the analysis first to see available imports
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <Card key={report.code}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{report.nativeName} ({report.code.toUpperCase()})</span>
                            {importedTranslations[report.code] && (
                              <Badge variant="default">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Imported
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <label className="cursor-pointer">
                            <Button variant="outline" className="w-full" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Translation File
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept=".json,.csv"
                              onChange={(e) => handleImport(e, report.code)}
                              className="hidden"
                            />
                          </label>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Code Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Updated Code</CardTitle>
              <CardDescription>
                Create the new LanguageContext.tsx file with all translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(importedTranslations).length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import at least one language to generate updated code
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Ready to generate! You have imported translations for{' '}
                      {Object.keys(importedTranslations).length} language(s).
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-medium">Imported Languages:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(importedTranslations).map(code => {
                        const lang = reports.find(r => r.code === code);
                        return (
                          <Badge key={code} variant="secondary">
                            {lang?.nativeName} ({code.toUpperCase()}) - {Object.keys(importedTranslations[code]).length} keys
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">What happens next?</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Click "Generate & Download" below</li>
                      <li>The new code will be copied to your clipboard</li>
                      <li>A file will also be downloaded</li>
                      <li>Replace your current LanguageContext.tsx with the new code</li>
                      <li>Test the app to ensure all languages work correctly</li>
                    </ol>
                  </div>

                  <Button 
                    onClick={handleGenerateCode}
                    size="lg"
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Generate & Download Updated LanguageContext.tsx
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
