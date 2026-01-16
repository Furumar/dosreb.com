# Multilingual Platform Implementation

## Overview
Your DOSREB platform now supports 14 languages with seamless switching:

### Supported Languages:
1. **English** (en) - Default
2. **Swedish** (sv) - Svenska
3. **Norwegian** (no) - Norsk  
4. **Danish** (da) - Dansk
5. **Spanish** (es) - Español
6. **French** (fr) - Français
7. **German** (de) - Deutsch
8. **Chinese** (zh) - 中文
9. **Russian** (ru) - Русский
10. **Lithuanian** (lt) - Lietuvių
11. **Latvian** (lv) - Latviešu
12. **Latgalian** (ltg) - Latgalīšu
13. **Samogitian** (sgs) - Žemaitėška
14. **Portuguese** (pt) - Português

## How It Works

### URL Structure
The platform uses lang-prefixed URLs:
- English: `http://localhost:3000/en/`
- Swedish: `http://localhost:3000/sv/`
- Chinese: `http://localhost:3000/zh/`
- etc.

All pages automatically work with all languages:
- `/en/about`, `/sv/about`, `/fr/about`
- `/en/projects`, `/no/projects`, `/de/projects`
- `/en/contact`, `/lt/contact`, `/ru/contact`

### Language Switcher
A dropdown menu in the header allows users to switch languages instantly. The switcher:
- Maintains the current page when switching languages
- Updates the URL with the new lang prefix
- Reloads content in the selected language

## Technical Implementation

### Key Files

#### 1. **i18n/request.ts**
Core internationalization configuration defining all supported langs and message loading.

#### 2. **middleware.ts**
Handles automatic lang detection and routing. Redirects users to their preferred language.

#### 3. **app/[lang]/layout.tsx**
Wraps all pages with the NextIntlClientProvider to make translations available throughout the app.

#### 4. **app/[lang]/components/LanguageSwitcher.tsx**
Dropdown component for language selection in the header.

#### 5. **i18n/messages/[lang].json**
Translation files for each language containing all UI text.

### Translation Keys Structure
```json
{
  "nav": { ... },
  "hero": { ... },
  "about": { ... },
  "projects": { ... },
  "lumi": { ... },
  "contact": { ... },
  "footer": { ... }
}
```

## Usage in Components

### Using Translations in Client Components:
```tsx
"use client";
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('nav');
  return <h1>{t('home')}</h1>;
}
```

### Using Translations in Server Components:
```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

## Adding New Languages

To add a new language:

1. Add the lang code to `i18n/request.ts`:
```typescript
export const langs = [
  'en', 'sv', 'no', 'da', 'es', 'fr', 'de', 'zh', 'ru', 'lt', 'lv', 'ltg', 'sgs', 'pt',
  'fi' // Add Finnish
] as const;
```

2. Update the middleware matcher in `middleware.ts`:
```typescript
matcher: ['/', '/(sv|no|da|es|fr|de|zh|ru|lt|lv|ltg|sgs|pt|fi)/:path*']
```

3. Create a new translation file: `i18n/messages/fi.json`

4. Add the language name to `LanguageSwitcher.tsx`:
```typescript
const languageNames: Record<string, string> = {
  // ... existing languages
  fi: 'Suomi',
};
```

## Adding New Translation Keys

To add new translatable content:

1. Add the key to all language files in `i18n/messages/*.json`:
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

2. Use it in your component:
```tsx
const t = useTranslations('newSection');
<h2>{t('title')}</h2>
<p>{t('description')}</p>
```

## Current Translation Coverage

Currently translated sections:
- ✅ Navigation menu
- ✅ Hero section (homepage)
- ✅ About section
- ✅ Projects section titles
- ✅ Contact section
- ✅ Footer

Pages that need translation expansion:
- About page (detailed content)
- Individual project pages
- Contact form
- Lumi page details

## Testing

Start the dev server:
```bash
npm run dev
```

Test different languages by visiting:
- http://localhost:3000/en
- http://localhost:3000/sv
- http://localhost:3000/zh
- etc.

## Build

Build the production version:
```bash
npm run build
```

The build generates static pages for all lang combinations automatically.

## Notes

- All translations are currently stored in JSON files for easy editing
- The default language is English (en)
- If a translation key is missing, it will fall back to the key name
- The language switcher preserves the current page path
- Middleware automatically detects and redirects based on browser language preferences

## Next Steps

1. Expand translations for all page content
2. Add translation management tool (optional)
3. Consider professional translation review
4. Add language-specific SEO metadata
5. Implement RTL support for Arabic/Hebrew if needed
