// **Podcast Types**
export const podcastTypes = [
    { value: "educational", label: "Educational" },
    { value: "entertainment", label: "Entertainment" },
    { value: "news", label: "News & Current Affairs" },
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "storytelling", label: "Storytelling" },
    { value: "interview", label: "Interview" },
    { value: "comedy", label: "Comedy" },
  ] as const;

// **Podcast Languages**
export const languageOptions = [
    { value: "english", label: "English", native: "English" },
    { value: "hindi", label: "Hindi", native: "हिंदी" },
    { value: "chinese", label: "Chinese", native: "中文" },
    { value: "japanese", label: "Japanese", native: "日本語" },
    { value: "korean", label: "Korean", native: "한국어" },
    { value: "arabic", label: "Arabic", native: "العربية" },
    { value: "russian", label: "Russian", native: "Русский" },
    { value: "thai", label: "Thai", native: "ไทย" },
    { value: "vietnamese", label: "Vietnamese", native: "Tiếng Việt" },
    { value: "bengali", label: "Bengali", native: "বাংলা" },
    { value: "tamil", label: "Tamil", native: "தமிழ்" },
    { value: "telugu", label: "Telugu", native: "తెలుగు" },
    { value: "marathi", label: "Marathi", native: "मराठी" },
    { value: "gujarati", label: "Gujarati", native: "ગુજરાતી" },
    { value: "kannada", label: "Kannada", native: "ಕನ್ನಡ" },
    { value: "malayalam", label: "Malayalam", native: "മലയാളം" },
    { value: "punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { value: "urdu", label: "Urdu", native: "اردو" },
    { value: "persian", label: "Persian", native: "فارسی" },
    { value: "greek", label: "Greek", native: "Ελληνικά" },
    { value: "hebrew", label: "Hebrew", native: "עברית" },
    { value: "turkish", label: "Turkish", native: "Türkçe" },
    { value: "portuguese", label: "Portuguese", native: "Português" },
    { value: "spanish", label: "Spanish", native: "Español" },
    { value: "french", label: "French", native: "Français" },
    { value: "german", label: "German", native: "Deutsch" },
    { value: "italian", label: "Italian", native: "Italiano" },
    { value: "dutch", label: "Dutch", native: "Nederlands" },
    { value: "polish", label: "Polish", native: "Polski" },
    { value: "czech", label: "Czech", native: "Čeština" },
    { value: "swedish", label: "Swedish", native: "Svenska" },
    { value: "danish", label: "Danish", native: "Dansk" },
    { value: "norwegian", label: "Norwegian", native: "Norsk" },
    { value: "finnish", label: "Finnish", native: "Suomi" },
    { value: "hungarian", label: "Hungarian", native: "Magyar" },
    { value: "romanian", label: "Romanian", native: "Română" },
    { value: "bulgarian", label: "Bulgarian", native: "Български" },
    { value: "ukrainian", label: "Ukrainian", native: "Українська" },
    { value: "indonesian", label: "Indonesian", native: "Bahasa Indonesia" },
    { value: "malay", label: "Malay", native: "Bahasa Melayu" },
    { value: "tagalog", label: "Filipino", native: "Filipino" },
    { value: "swahili", label: "Swahili", native: "Kiswahili" },
  ];

// **AI Content**
export const toneOptions = [
    { value: "casual", label: "Casual & Friendly" },
    { value: "professional", label: "Professional & Formal" },
    { value: "humorous", label: "Humorous & Light" },
    { value: "educational", label: "Educational & Informative" },
    { value: "storytelling", label: "Storytelling & Narrative" },
    { value: "motivational", label: "Motivational & Inspiring" },
];

export const targetAudienceOptions = [
    { value: "general", label: "General Audience" },
    { value: "beginners", label: "Beginners" },
    { value: "intermediate", label: "Intermediate Level" },
    { value: "advanced", label: "Advanced Level" },
    { value: "professionals", label: "Professionals" },
    { value: "students", label: "Students" },
    { value: "elderly", label: "Elderly" },
    { value: "youth", label: "Youth" },
];

export const styleOptions = [
    { value: "conversational", label: "Conversational" },
    { value: "interview", label: "Interview Style" },
    { value: "monologue", label: "Monologue" },
    { value: "debate", label: "Debate Style" },
    { value: "tutorial", label: "Tutorial/How-to" },
    { value: "storytelling", label: "Storytelling" },
];

export const voiceCategories = [
    { value: 'Drew', label: 'Drew (Male)', description: 'Deep and professional' },
    { value: 'Rachel', label: 'Rachel (Female)', description: 'Clear and engaging' },
    { value: 'Sarah', label: 'Sarah (Female)', description: 'Warm and friendly' },
  ];