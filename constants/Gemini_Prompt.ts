export const Gemini_Prompt = `Generate a podcast script and description for a {podcastType} podcast titled "{title}". 

The content should be in {language} language, approximately {duration} minutes long, with a {tone} tone, 
targeted at {targetAudience} audience, in a {style} style.

Additional notes to consider: {note}

Return the response in the following JSON format:

{
    "description": "engaging podcast description here (2-3 sentences)",
    "script": "detailed podcast script here (3-4 paragraphs)",
    "thumbnailPrompts": [
        "detailed visual prompt for thumbnail 1",
        "detailed visual prompt for thumbnail 2",
        "detailed visual prompt for thumbnail 3"
    ]
}

Make the content engaging and natural sounding. The description should be concise but compelling. 
The script should match the selected podcast type and maintain consistent tone throughout.
Each thumbnail prompt should reflect the podcast's theme and type.

Script Guidelines:
- Write as a continuous monologue for a single speaker
- Avoid any special characters, stage directions, or speaker labels
- Do not include timestamps, pauses, or audio cues
- Write in natural, conversational sentences
- Avoid line breaks between sentences
- Remove any non-speaking elements (like [pause], [music], etc.)
- Keep paragraphs flowing naturally without artificial breaks

Important: Generate the content ONLY in the specified {language}. Do not mix languages or use transliteration.

Language Script Guidelines:
- Hindi: Use Devanagari script (हिंदी)
- Chinese: Use simplified Chinese characters (简体中文)
- Japanese: Use proper Japanese writing (漢字とひらがな)
- Korean: Use Hangul (한글)
- Arabic: Use Arabic script (العربية)
- Russian: Use Cyrillic (русский)
- Thai: Use Thai script (ไทย)
- Vietnamese: Use Vietnamese with diacritics (Tiếng Việt)
- Bengali: Use Bengali script (বাংলা)
- Tamil: Use Tamil script (தமிழ்)
- Telugu: Use Telugu script (తెలుగు)
- Marathi: Use Devanagari script (मराठी)
- Gujarati: Use Gujarati script (ગુજરાતી)
- Kannada: Use Kannada script (ಕನ್ನಡ)
- Malayalam: Use Malayalam script (മലയാളം)
- Punjabi: Use Gurmukhi script (ਪੰਜਾਬੀ)
- Urdu: Use Nastaliq script (اردو)
- Persian: Use Persian script (فارسی)
- Greek: Use Greek alphabet (Ελληνικά)
- Hebrew: Use Hebrew script (עברית)
- Turkish: Use Turkish with diacritics (Türkçe)
- Portuguese: Use standard Portuguese (Português)
- Spanish: Use standard Spanish (Español)
- French: Use French with accents (Français)
- German: Use German with umlauts (Deutsch)
- Italian: Use standard Italian (Italiano)
- Dutch: Use standard Dutch (Nederlands)
- Polish: Use Polish with diacritics (Polski)
- Czech: Use Czech with diacritics (Čeština)
- Swedish: Use Swedish with diacritics (Svenska)
- Danish: Use Danish with proper characters (Dansk)
- Norwegian: Use Norwegian with proper characters (Norsk)
- Finnish: Use Finnish with proper characters (Suomi)
- Hungarian: Use Hungarian with diacritics (Magyar)
- Romanian: Use Romanian with diacritics (Română)
- Bulgarian: Use Bulgarian Cyrillic (български)
- Ukrainian: Use Ukrainian Cyrillic (українська)
- Indonesian: Use standard Indonesian (Bahasa Indonesia)
- Malay: Use standard Malay (Bahasa Melayu)
- Tagalog: Use standard Filipino (Filipino)
- Swahili: Use standard Swahili (Kiswahili)

Content Guidelines:
- Use the specified tone ({tone}) consistently throughout
- Adapt content for the target audience ({targetAudience})
- Follow the chosen content style ({style})
- Use formal but conversational tone appropriate for the language
- Follow cultural norms and sensitivities of the target language
- Use proper punctuation and formatting specific to the language
- Use commonly understood terms in the target language
- Follow standard dialect of the chosen language
- Maintain natural flow and expression in the target language
- Write in a way that sounds natural when spoken aloud
- Ensure the script length matches approximately {duration} minutes of speaking time

Note: Always generate thumbnail prompts in English regardless of the content language
Each thumbnail prompt should be unique and focus on different aspects or styles`;
