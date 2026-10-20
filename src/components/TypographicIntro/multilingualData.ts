export interface MultilingualScriptItem {
  id: string;
  lang: string;
  name: string;
  text: string;
  letterSpacing?: string;
  fontFamily?: string;
  dir?: 'ltr' | 'rtl';
}

export const MULTILINGUAL_SCRIPTS: MultilingualScriptItem[] = [
  {
    id: 'en',
    lang: 'en',
    name: 'English',
    text: 'HACK WITH INDIA',
    letterSpacing: '-0.04em',
  },
  {
    id: 'hi',
    lang: 'hi',
    name: 'Hindi',
    text: 'हैक विथ इंडिया',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Devanagari", "Noto Sans Devanagari", "Nirmala UI", sans-serif',
  },
  {
    id: 'bn',
    lang: 'bn',
    name: 'Bengali',
    text: 'হ্যাক উইথ ইন্ডিয়া',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Bangla", "Noto Sans Bengali", "Nirmala UI", sans-serif',
  },
  {
    id: 'gu',
    lang: 'gu',
    name: 'Gujarati',
    text: 'હેક વિથ ઇન્ડિયા',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Gujarati", "Noto Sans Gujarati", "Nirmala UI", "Shruti", sans-serif',
  },
  {
    id: 'pa',
    lang: 'pa',
    name: 'Punjabi',
    text: 'ਹੈਕ ਵਿਥ ਇੰਡੀਆ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Gurmukhi", "Nirmala UI", "Raavi", sans-serif',
  },
  {
    id: 'ta',
    lang: 'ta',
    name: 'Tamil',
    text: 'ஹேக் வித் இந்தியா',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Tamil", "Noto Sans Tamil", "Nirmala UI", "Latha", sans-serif',
  },
  {
    id: 'te',
    lang: 'te',
    name: 'Telugu',
    text: 'హ్యాక్ విత్ ఇండియా',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Telugu", "Noto Sans Telugu", "Nirmala UI", "Gautami", sans-serif',
  },
  {
    id: 'kn',
    lang: 'kn',
    name: 'Kannada',
    text: 'ಹ್ಯಾಕ್ విత్ ఇండియా',
    letterSpacing: '0.01em',
    fontFamily: '"Kohinoor Kannada", "Noto Sans Kannada", "Nirmala UI", "Tunga", sans-serif',
  },
  {
    id: 'ml',
    lang: 'ml',
    name: 'Malayalam',
    text: 'ഹാക്ക് വിത്ത് ഇന്ത്യ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Malayalam", "Nirmala UI", "Kartika", sans-serif',
  },
  {
    id: 'or',
    lang: 'or',
    name: 'Odia',
    text: 'ହ୍ୟାକ୍ ୱିଥ୍ ଇଣ୍ଡିଆ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Oriya", "Noto Sans Odia", "Nirmala UI", "Kalinga", sans-serif',
  },
  {
    id: 'as',
    lang: 'as',
    name: 'Assamese',
    text: 'হেক উইথ ইণ্ডিয়া',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Bengali", "Kohinoor Bangla", "Nirmala UI", sans-serif',
  },
  {
    id: 'ur',
    lang: 'ur',
    name: 'Urdu',
    text: 'ہیک وِد انڈیا',
    letterSpacing: '0.02em',
    fontFamily: '"Noto Nastaliq Urdu", "Noto Sans Arabic", "Segoe UI", "Tahoma", "Urdu Typesetting", sans-serif',
    dir: 'rtl',
  },
];

export const FINAL_BRAND_TITLE = {
  text: 'HACK WITH INDIA',
};
