export interface TranslationKey {
  key: string;
  englishValue: string;
  category: string;
}

export interface LanguageReport {
  code: string;
  name: string;
  nativeName: string;
  totalKeys: number;
  missingKeys: TranslationKey[];
  completionPercentage: number;
}

export interface TranslationExport {
  targetLanguage: string;
  translations: Record<string, string>;
  metadata: {
    exportDate: string;
    totalKeys: number;
    sourceLanguage: string;
  };
}

export interface TranslationImport {
  targetLanguage: string;
  translations: Record<string, string>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface LanguageContextStructure {
  languages: Array<{ code: string; name: string; nativeName: string }>;
  translations: Record<string, Record<string, string>>;
  commonTranslations?: Record<string, Record<string, string>>;
}
