export interface MultilingualScriptItem {
  id: string;
  lang: string;
  scriptName: string;
  text: string;
  letterSpacing?: string;
  fontFamily?: string;
}

export const MULTILINGUAL_SCRIPTS: MultilingualScriptItem[] = [
  {
    id: 'en',
    lang: 'en',
    scriptName: 'ENGLISH',
    text: 'HACK WITH INDIA',
    letterSpacing: '-0.04em',
  },
  {
    id: 'hi',
    lang: 'hi',
    scriptName: 'DEVANAGARI',
    text: 'हैक वीथ इंडीआ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Devanagari", "Nirmala UI", "Kohinoor Devanagari", sans-serif',
  },
  {
    id: 'bn',
    lang: 'bn',
    scriptName: 'BENGALI',
    text: 'হ্যাক উইথ ইন্ডিয়া',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Bengali", "Nirmala UI", "Kohinoor Bangla", sans-serif',
  },
  {
    id: 'gu',
    lang: 'gu',
    scriptName: 'GUJARATI',
    text: 'હેક વિથ ઇન્ડિયા',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Gujarati", "Nirmala UI", "Kohinoor Gujarati", sans-serif',
  },
  {
    id: 'pa',
    lang: 'pa',
    scriptName: 'GURMUKHI',
    text: 'ਹੈਕ ਵਿਥ ਇੰਡੀਆ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Gurmukhi", "Nirmala UI", sans-serif',
  },
  {
    id: 'ta',
    lang: 'ta',
    scriptName: 'TAMIL',
    text: 'ஹேக் வித் இந்தியா',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Tamil", "Nirmala UI", "Kohinoor Tamil", sans-serif',
  },
  {
    id: 'te',
    lang: 'te',
    scriptName: 'TELUGU',
    text: 'హ్యాక్ విత్ ఇండియా',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Telugu", "Nirmala UI", "Kohinoor Telugu", sans-serif',
  },
  {
    id: 'kn',
    lang: 'kn',
    scriptName: 'KANNADA',
    text: 'ಹ್ಯಾಕ್ ವಿತ್ ಇಂಡಿಯಾ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Kannada", "Nirmala UI", "Kohinoor Kannada", sans-serif',
  },
  {
    id: 'ml',
    lang: 'ml',
    scriptName: 'MALAYALAM',
    text: 'ഹാക്ക് വിത്ത് ഇന്ത്യ',
    letterSpacing: '0.01em',
    fontFamily: '"Noto Sans Malayalam", "Nirmala UI", sans-serif',
  },
  {
    id: 'ja',
    lang: 'ja',
    scriptName: 'KATAKANA',
    text: 'ハック・ウィズ・インディア',
    letterSpacing: '0.04em',
    fontFamily: '"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
  },
];

export const FINAL_BRAND_TITLE = {
  text: 'HACK WITH INDIA',
  chapterBadge: 'BVUDET-NM CHAPTER',
  tagline: 'INNOVATE · CREATE · ELEVATE',
};
