import translate from 'google-translate-api-x';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文 (简体)' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
];

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    if (targetLang === 'en') {
      return text; // No translation needed for English
    }

    console.log(`Translating "${text}" to ${targetLang}`);
    const result = await translate(text, { to: targetLang });
    console.log(`Translation result: "${result.text}"`);
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const translateMultiple = async (
  texts: string[],
  targetLang: string
): Promise<string[]> => {
  try {
    const translatedTexts = await Promise.all(
      texts.map(text => translateText(text, targetLang))
    );
    return translatedTexts;
  } catch (error) {
    console.error('Multiple translation error:', error);
    return texts; // Return original texts if translation fails
  }
};
