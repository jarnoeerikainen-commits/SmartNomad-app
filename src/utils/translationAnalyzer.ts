import { TranslationKey, LanguageReport, TranslationExport, TranslationImport, ValidationResult, LanguageContextStructure } from '@/types/translation';

export class TranslationAnalyzer {
  private languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  ];

  /**
   * Analyzes the current translation structure from LanguageContext
   */
  analyzeTranslations(translations: Record<string, Record<string, string>>): LanguageReport[] {
    const englishKeys = Object.keys(translations['en'] || {});
    const reports: LanguageReport[] = [];

    for (const lang of this.languages) {
      const langTranslations = translations[lang.code] || {};
      const langKeys = Object.keys(langTranslations);
      
      const missingKeys: TranslationKey[] = englishKeys
        .filter(key => !langKeys.includes(key))
        .map(key => ({
          key,
          englishValue: translations['en'][key],
          category: this.getCategoryFromKey(key),
        }));

      reports.push({
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        totalKeys: englishKeys.length,
        missingKeys,
        completionPercentage: Math.round(((englishKeys.length - missingKeys.length) / englishKeys.length) * 100),
      });
    }

    return reports;
  }

  /**
   * Gets the category from a translation key (e.g., 'app.title' -> 'app')
   */
  private getCategoryFromKey(key: string): string {
    const parts = key.split('.');
    return parts.length > 1 ? parts[0] : 'common';
  }

  /**
   * Exports missing translations to JSON format
   */
  exportToJSON(report: LanguageReport): TranslationExport {
    const translations: Record<string, string> = {};
    
    report.missingKeys.forEach(({ key, englishValue }) => {
      translations[key] = englishValue; // User will replace with translated value
    });

    return {
      targetLanguage: report.code,
      translations,
      metadata: {
        exportDate: new Date().toISOString(),
        totalKeys: report.missingKeys.length,
        sourceLanguage: 'en',
      },
    };
  }

  /**
   * Exports missing translations to CSV format
   */
  exportToCSV(report: LanguageReport): string {
    const headers = ['Key', 'Category', 'English Value', `${report.name} Translation`];
    const rows = report.missingKeys.map(({ key, englishValue, category }) => {
      // Escape quotes and wrap in quotes if contains comma
      const escapeCSV = (str: string) => {
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        escapeCSV(key),
        escapeCSV(category),
        escapeCSV(englishValue),
        '', // Empty field for translation
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Validates imported translations
   */
  validateImport(importData: TranslationImport, expectedKeys: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if language code is valid
    if (!this.languages.find(l => l.code === importData.targetLanguage)) {
      errors.push(`Invalid language code: ${importData.targetLanguage}`);
    }

    // Check for missing keys
    const importedKeys = Object.keys(importData.translations);
    const missingKeys = expectedKeys.filter(key => !importedKeys.includes(key));
    
    if (missingKeys.length > 0) {
      warnings.push(`Missing ${missingKeys.length} keys in import`);
    }

    // Check for extra keys not in English
    const extraKeys = importedKeys.filter(key => !expectedKeys.includes(key));
    if (extraKeys.length > 0) {
      warnings.push(`Found ${extraKeys.length} extra keys not in English source`);
    }

    // Check for empty translations
    const emptyTranslations = importedKeys.filter(key => !importData.translations[key]?.trim());
    if (emptyTranslations.length > 0) {
      errors.push(`Found ${emptyTranslations.length} empty translations`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generates the updated LanguageContext.tsx code
   */
  generateLanguageContextCode(
    currentTranslations: Record<string, Record<string, string>>,
    updates: Record<string, Record<string, string>>
  ): string {
    // Merge updates into current translations
    const mergedTranslations = { ...currentTranslations };
    
    for (const [langCode, translations] of Object.entries(updates)) {
      mergedTranslations[langCode] = {
        ...mergedTranslations[langCode],
        ...translations,
      };
    }

    // Generate the TypeScript code
    const languagesArray = this.languages.map(l => 
      `  { code: '${l.code}', name: '${l.name}', nativeName: '${l.nativeName}' }`
    ).join(',\n');

    const translationsObject = Object.entries(mergedTranslations)
      .map(([langCode, translations]) => {
        const translationEntries = Object.entries(translations)
          .map(([key, value]) => {
            // Escape quotes and newlines in values
            const escapedValue = value
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/\n/g, '\\n');
            return `    '${key}': '${escapedValue}'`;
          })
          .join(',\n');

        return `  ${langCode}: {\n${translationEntries}\n  }`;
      })
      .join(',\n');

    return `import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  languages: Language[];
}

const LANGUAGES: Language[] = [
${languagesArray}
];

const translations: Record<string, Record<string, string>> = {
${translationsObject}
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('app_language');
    return saved && ['en', 'es', 'pt', 'zh', 'fr', 'de', 'ar', 'ja', 'it', 'ko', 'hi', 'sw', 'af'].includes(saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', currentLanguage);
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
  };

  const setLanguage = (code: string) => {
    if (['en', 'es', 'pt', 'zh', 'fr', 'de', 'ar', 'ja', 'it', 'ko', 'hi', 'sw', 'af'].includes(code)) {
      setCurrentLanguage(code);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
`;
  }

  /**
   * Parses CSV import data
   */
  parseCSVImport(csvContent: string, targetLanguage: string): TranslationImport {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const translations: Record<string, string> = {};

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Simple CSV parsing (handles quoted fields)
      const match = line.match(/^"?([^",]+)"?,\s*"?([^",]*)"?,\s*"?([^"]*)"?,\s*"?([^"]*)"?$/);
      
      if (match) {
        const [, key, , , translation] = match;
        if (key && translation && translation.trim()) {
          translations[key.trim()] = translation.trim();
        }
      }
    }

    return {
      targetLanguage,
      translations,
    };
  }

  /**
   * Gets all language codes
   */
  getLanguageCodes(): string[] {
    return this.languages.map(l => l.code);
  }

  /**
   * Gets language info by code
   */
  getLanguageInfo(code: string) {
    return this.languages.find(l => l.code === code);
  }
}

export const translationAnalyzer = new TranslationAnalyzer();
