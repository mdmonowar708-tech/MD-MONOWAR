export interface QuizQuestion {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number; // 1, 2, 3, or 4
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

// Curated static questions across multiple subjects
const STATIC_QUESTIONS: QuizQuestion[] = [
  // --- EASY QUESTIONS ---
  {
    id: "sq_e1",
    category: "Bangla",
    difficulty: "easy",
    question: "বাংলা সাহিত্যের প্রাচীনতম নিদর্শন কোনটি?",
    option1: "চর্যাপদ",
    option2: "শ্রীকৃষ্ণকীর্তন",
    option3: "পদ্মাবতী",
    option4: "মনসামঙ্গল",
    correctAnswer: 1,
    explanation: "চর্যাপদ বাংলা সাহিত্যের প্রাচীন যুগের একমাত্র নির্ভরযোগ্য নিদর্শন।"
  },
  {
    id: "sq_e2",
    category: "GK",
    difficulty: "easy",
    question: "বাংলাদেশের জাতীয় কবির নাম কী?",
    option1: "রবীন্দ্রনাথ ঠাকুর",
    option2: "কাজী নজরুল ইসলাম",
    option3: "জসীমউদ্দীন",
    option4: "জীবনানন্দ দাশ",
    correctAnswer: 2,
    explanation: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি।"
  },
  {
    id: "sq_e3",
    category: "GK",
    difficulty: "easy",
    question: "বাংলাদেশের স্বাধীনতা দিবস কবে পালন করা হয়?",
    option1: "১৬ই ডিসেম্বর",
    option2: "২১শে ফেব্রুয়ারি",
    option3: "২৬শে মার্চ",
    option4: "১৪ই এপ্রিল",
    correctAnswer: 3,
    explanation: "২৬শে মার্চ বাংলাদেশের মহান স্বাধীনতা ও জাতীয় দিবস।"
  },
  {
    id: "sq_e4",
    category: "Science",
    difficulty: "easy",
    question: "পানির রাসায়নিক সংকেত কী?",
    option1: "CO2",
    option2: "H2O",
    option3: "NaCl",
    option4: "O2",
    correctAnswer: 2,
    explanation: "পানির রাসায়নিক সংকেত হলো H2O (দুইটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু)।"
  },
  {
    id: "sq_e5",
    category: "ICT",
    difficulty: "easy",
    question: "কম্পিউটারের মস্তিস্ক বলা হয় কোন অংশকে?",
    option1: "Monitor",
    option2: "RAM",
    option3: "CPU",
    option4: "Hard Disk",
    correctAnswer: 3,
    explanation: "CPU (Central Processing Unit) কে কম্পিউটারের মস্তিস্ক বলা হয়।"
  },
  {
    id: "sq_e6",
    category: "English",
    difficulty: "easy",
    question: "Identify the noun in: 'The beauty of the flower amazed us.'",
    option1: "beauty",
    option2: "amazed",
    option3: "of",
    option4: "us",
    correctAnswer: 1,
    explanation: "এখানে 'beauty' হচ্ছে Abstract Noun।"
  },
  {
    id: "sq_e7",
    category: "Math",
    difficulty: "easy",
    question: "একটি ত্রিভুজের তিন কোণের সমষ্টি কত ডিগ্রী?",
    option1: "৯০°",
    option2: "১২০°",
    option3: "১৮০°",
    option4: "৩৬০°",
    correctAnswer: 3,
    explanation: "যেকোনো ত্রিভুজের তিন কোণের সমষ্টি ১৮০ ডিগ্রী।"
  },
  {
    id: "sq_e8",
    category: "GK",
    difficulty: "easy",
    question: "পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?",
    option1: "৫.১৫ কিমি",
    option2: "৬.১৫ কিমি",
    option3: "৭.১৫ কিমি",
    option4: "৮.১৫ কিমি",
    correctAnswer: 2,
    explanation: "পদ্মা বহুমুখী সেতুর মোট দৈর্ঘ্য ৬.১৫ কিলোমিটার।"
  },
  {
    id: "sq_e9",
    category: "Bangla",
    difficulty: "easy",
    question: "'কবর' কবিতাটি কার রচনা?",
    option1: "কাজী নজরুল ইসলাম",
    option2: "জসীমউদ্দীন",
    option3: "ফররুখ আহমদ",
    option4: "সুফিয়া কামাল",
    correctAnswer: 2,
    explanation: "পল্লীকবি জসীমউদ্দীনের বিখ্যাত ও জনপ্রিয় কবিতা হলো 'কবর'।"
  },
  {
    id: "sq_e10",
    category: "Science",
    difficulty: "easy",
    question: "উদ্ভিদ বাতাসে কোন গ্যাস ত্যাগ করে যা মানুষ গ্রহণ করে?",
    option1: "নাইট্রোজেন",
    option2: "কার্বন ডাই অক্সাইড",
    option3: "অক্সিজেন",
    option4: "হাইড্রোজেন",
    correctAnswer: 3,
    explanation: "উদ্ভিদ সালোকসংশ্লেষণ প্রক্রিয়ায় অক্সিজেন গ্যাস বাতাসে ছাড়ে এবং মানুষ তা শ্বাসকার্যে গ্রহণ করে।"
  },

  // --- MEDIUM QUESTIONS ---
  {
    id: "sq_m1",
    category: "Bangla",
    difficulty: "medium",
    question: "রবীন্দ্রনাথ ঠাকুর কত সালে সাহিত্যে নোবেল পুরস্কার পান?",
    option1: "১৯১১ সালে",
    option2: "১৯১৩ সালে",
    option3: "১৯১৫ সালে",
    option4: "১৯২১ সালে",
    correctAnswer: 2,
    explanation: "রবীন্দ্রনাথ ঠাকুর তাঁর 'গীতাঞ্জলি' কাব্যগ্রন্থের ইংরেজি অনুবাদের জন্য ১৯১৩ সালে এশীয়দের মধ্যে প্রথম সাহিত্যে নোবেল পুরস্কার পান।"
  },
  {
    id: "sq_m2",
    category: "GK",
    difficulty: "medium",
    question: "মুজিবনগর সরকার কবে গঠিত হয়েছিল?",
    option1: "২৬শে মার্চ ১৯৭১",
    option2: "১০ই এপ্রিল ১৯৭১",
    option3: "১৭ই এপ্রিল ১৯৭১",
    option4: "১৬ই ডিসেম্বর ১৯৭১",
    correctAnswer: 2,
    explanation: "১৯৭১ সালের ১০ই এপ্রিল মুজিবনগর সরকার গঠিত হয় এবং ১৭ই এপ্রিল এটি আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।"
  },
  {
    id: "sq_m3",
    category: "GK",
    difficulty: "medium",
    question: "বাংলাদেশের সংবিধান কত তারিখে বলবৎ হয়?",
    option1: "১৬ই ডিসেম্বর ১৯৭২",
    option2: "৪ঠা নভেম্বর ১৯৭২",
    option3: "১২ই অক্টোবর ১৯৭২",
    option4: "২৬শে মার্চ ১৯৭৩",
    correctAnswer: 1,
    explanation: "৪ঠা নভেম্বর ১৯৭২ সংবিধানে গৃহীত হয় এবং ১৬ই ডিসেম্বর ১৯৭২ (বিজয় দিবস) থেকে এটি বলবৎ হয়।"
  },
  {
    id: "sq_m4",
    category: "English",
    difficulty: "medium",
    question: "What is the synonym of 'Prudent'?",
    option1: "Foolish",
    option2: "Careless",
    option3: "Wise",
    option4: "Dishonest",
    correctAnswer: 3,
    explanation: "Prudent মানে বিচক্ষণ বা জ্ঞানী, যার সমার্থক শব্দ হলো Wise।"
  },
  {
    id: "sq_m5",
    category: "Science",
    difficulty: "medium",
    question: "সূর্যের আলো থেকে আমরা কোন ভিটামিন পাই?",
    option1: "ভিটামিন A",
    option2: "ভিটামিন B",
    option3: "ভিটামিন C",
    option4: "ভিটামিন D",
    correctAnswer: 4,
    explanation: "সূর্যের আলোর অতিবেগুনী রশ্মির প্রভাবে আমাদের ত্বকে ভিটামিন D তৈরি হয়।"
  },
  {
    id: "sq_m6",
    category: "ICT",
    difficulty: "medium",
    question: "নিচের কোনটি একটি স্প্রেডশিট সফটওয়্যার?",
    option1: "MS Word",
    option2: "MS PowerPoint",
    option3: "MS Excel",
    option4: "MS Access",
    correctAnswer: 3,
    explanation: "MS Excel হলো হিসাবনিকাশের জন্য ব্যবহৃত একটি স্প্রেডশিট সফটওয়্যার।"
  },
  {
    id: "sq_m7",
    category: "Math",
    difficulty: "medium",
    question: "বৃত্তের ব্যাস ৩ গুণ বৃদ্ধি করলে ক্ষেত্রফল কত গুণ বৃদ্ধি পাবে?",
    option1: "৩ গুণ",
    option2: "৬ গুণ",
    option3: "৯ গুণ",
    option4: "১২ গুণ",
    correctAnswer: 3,
    explanation: "বৃত্তের ক্ষেত্রফল তার ব্যাসের বর্গের সমানুপাতিক। ব্যাস ৩ গুণ বাড়ালে ক্ষেত্রফল ৩^২ = ৯ গুণ বৃদ্ধি পাবে।"
  },
  {
    id: "sq_m8",
    category: "Bangla",
    difficulty: "medium",
    question: "কোনটি খাঁটি বাংলা উপসর্গ?",
    option1: "প্র",
    option2: "অঘ",
    option3: "গর",
    option4: "অপি",
    correctAnswer: 2,
    explanation: "খাঁটি বাংলা উপসর্গ ২১টি, যার মধ্যে 'অঘ' অন্যতম। প্র, অপি হলো সংস্কৃত উপসর্গ এবং গর হলো ফারসি উপসর্গ।"
  },
  {
    id: "sq_m9",
    category: "GK",
    difficulty: "medium",
    question: "গ্রীনিচ মান সময় অপেক্ষা বাংলাদেশের সময় কত ঘণ্টা এগিয়ে?",
    option1: "+৪ ঘণ্টা",
    option2: "+৫ ঘণ্টা",
    option3: "+৬ ঘণ্টা",
    option4: "+৭ ঘণ্টা",
    correctAnswer: 3,
    explanation: "বাংলাদেশের সময় গ্রীনিচ মান সময় (GMT) অপেক্ষা ৬ ঘণ্টা এগিয়ে (+৬.০০)।"
  },
  {
    id: "sq_m10",
    category: "Science",
    difficulty: "medium",
    question: "রক্তের লোহিত কণিকা কোথায় তৈরি হয়?",
    option1: "যকৃতে",
    option2: "প্লীহায়",
    option3: "অস্থিমজ্জায়",
    option4: "হৃদপিণ্ডে",
    correctAnswer: 3,
    explanation: "রক্তের লোহিত রক্তকণিকা (RBC) প্রধানত লাল অস্থিমজ্জায় (Red Bone Marrow) উৎপন্ন হয়।"
  },

  // --- HARD QUESTIONS ---
  {
    id: "sq_h1",
    category: "Bangla",
    difficulty: "hard",
    question: "বাংলা সাহিত্যে অবক্ষয় যুগের স্থায়ীত্বকাল কত ধরা হয়?",
    option1: "১২০১ - ১৩৫০ খ্রিস্টাব্দ",
    option2: "১৭৬০ - ১৮৬০ খ্রিস্টাব্দ",
    option3: "১৮০১ - ১৮৫০ খ্রিস্টাব্দ",
    option4: "১৫০১ - ১৬০০ খ্রিস্টাব্দ",
    correctAnswer: 2,
    explanation: "ভারতচন্দ্র রায়গুণাকরের মৃত্যুর পর (১৭৬০) থেকে আধুনিক যুগের শুরুর দিকে অর্থাৎ ১৮৬০ সাল পর্যন্ত সময়কে বাংলা সাহিত্যের যুগসন্ধিক্ষণ বা অবক্ষয় কাল বলা হয়।"
  },
  {
    id: "sq_h2",
    category: "GK",
    difficulty: "hard",
    question: "বাংলাদেশের সংবিধানের কোন অনুচ্ছেদের অধীনে সুপ্রিম কোর্ট রিট জারি করতে পারে?",
    option1: "অনুচ্ছেদ ৯৪",
    option2: "অনুচ্ছেদ ১০২",
    option3: "অনুচ্ছেদ ১০৮",
    option4: "অনুচ্ছেদ ১১৪",
    correctAnswer: 2,
    explanation: "সংविधानের ১০২ অনুচ্ছেদ অনুযায়ী মৌলিক অধিকার রক্ষার্থে হাইকোর্ট বিভাগ রিট পিটিশন জারির এখতিয়ার রাখে।"
  },
  {
    id: "sq_h3",
    category: "English",
    difficulty: "hard",
    question: "Who is the author of the play 'The Tempest'?",
    option1: "John Milton",
    option2: "William Shakespeare",
    option3: "Christopher Marlowe",
    option4: "William Wordsworth",
    correctAnswer: 2,
    explanation: "'The Tempest' is a famous romance play written by William Shakespeare, widely believed to be his last solo play."
  },
  {
    id: "sq_h4",
    category: "Math",
    difficulty: "hard",
    question: "যদি log_x (1/9) = -2 হয়, তবে x এর মান কত?",
    option1: "৩",
    option2: "৯",
    option3: "১/৩",
    option4: "-৩",
    correctAnswer: 1,
    explanation: "log_x (1/9) = -2 => x^(-2) = 1/9 => 1/(x^2) = 1/9 => x^2 = 9 => x = 3 (যেহেতু লগারিদমের ভিত্তি ঋণাত্মক হয় না)।"
  },
  {
    id: "sq_h5",
    category: "Science",
    difficulty: "hard",
    question: "পারমাণবিক চুল্লিতে মডারেটর হিসেবে নিচের কোনটি ব্যবহার করা হয়?",
    option1: "ভারী পানি (D2O)",
    option2: "তরল সোডিয়াম",
    option3: "ইউরেনিয়াম-২৩৫",
    option4: "ক্যাডমিয়াম রড",
    correctAnswer: 1,
    explanation: "পারমাণবিক চুল্লিতে নিউট্রনের গতি হ্রাস করতে মডারেটর হিসেবে ভারী পানি (Deuterium Oxide - D2O) বা গ্রাফাইট ব্যবহার করা হয়।"
  },
  {
    id: "sq_h6",
    category: "GK",
    difficulty: "hard",
    question: "ব্রেটন উডস ইনস্টিটিউশন (Bretton Woods Institutions) নিচের কোন সংস্থাগুলোকে নির্দেশ করে?",
    option1: "UN ও WHO",
    option2: "IMF ও বিশ্বব্যাংক",
    option3: "WTO ও ADB",
    option4: "EU ও NATO",
    correctAnswer: 2,
    explanation: "১৯৪৪ সালে অনুষ্ঠিত ব্রেটন উডস কনফারেন্সের মাধ্যমে আন্তর্জাতিক মুদ্রা তহবিল (IMF) এবং বিশ্বব্যাংক (World Bank) প্রতিষ্ঠিত হওয়ার কারণে এদেরকে ব্রেটন উডস ইনস্টিটিউশন বলা হয়।"
  },
  {
    id: "sq_h7",
    category: "ICT",
    difficulty: "hard",
    question: "নিচের কোন নেটওয়ার্ক প্রোটোকলটি মূলত সংযোগহীন (Connectionless) ডাটা স্থানান্তরে ব্যবহৃত হয়?",
    option1: "TCP",
    option2: "UDP",
    option3: "HTTP",
    option4: "FTP",
    correctAnswer: 2,
    explanation: "UDP (User Datagram Protocol) হলো একটি সংযোগহীন প্রোটোকল যা দ্রুত ডাটা পাঠাতে ব্যবহৃত হয়, যেখানে ডাটা পৌঁছানোর শতভাগ গ্যারান্টি থাকে না।"
  },
  {
    id: "sq_h8",
    category: "Bangla",
    difficulty: "hard",
    question: "'অপিনিহিতি' এর উদাহরণ কোনটি?",
    option1: "আজ > আইজ",
    option2: "রিকশা > রিসকা",
    option3: "স্কুল > ইশকুল",
    option4: "পক্ব > পক্ক",
    correctAnswer: 1,
    explanation: "শব্দের মধ্যে ই-কার বা উ-কার আগে উচ্চারিত হলে বা ব্যঞ্জনবর্ণের পূর্বে উচ্চারিত হলে তাকে অপিনিহিতি বলে। যেমন: আজ > আইজ, সত্য > সইত্য।"
  },
  {
    id: "sq_h9",
    category: "Math",
    difficulty: "hard",
    question: "একটি বাক্সে ৫টি লাল ও ৪টি নীল বল আছে। নিরপেক্ষভাবে ৩টি বল তুললে ১টি লাল ও ২টি নীল বল হওয়ার সম্ভাবনা কত?",
    option1: "৫/১৪",
    option2: "৫/২১",
    option3: "১৫/২৮",
    option4: "১০/২১",
    correctAnswer: 1,
    explanation: "অনুকূল ঘটনা = (5C1 × 4C2) = 5 × 6 = 30। মোট ঘটনা = 9C3 = (9×8×7)/(3×2×1) = 84। সম্ভাবনা = ৩০/৮৪ = ৫/১৪।"
  },
  {
    id: "sq_h10",
    category: "English",
    difficulty: "hard",
    question: "Select the correct sentence:",
    option1: "He was hunged for murder.",
    option2: "He was hanged for murder.",
    option3: "He was hang for murder.",
    option4: "He had been hung for murder.",
    correctAnswer: 2,
    explanation: "কাউকে ফাঁসি দেওয়া অর্থে 'hang' এর past participle হলো 'hanged'। কাপড় বা অন্য কিছু ঝুলানো অর্থে 'hung' ব্যবহৃত হয়।"
  }
];

// DYNAMIC GENERATORS
interface PoolQuestion {
  id: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number;
  explanation: string;
}

const EXTRA_GK_POOL: PoolQuestion[] = [
  // EASY
  {
    id: "ep_e1",
    category: "Bangla",
    difficulty: "easy",
    question: "'সবুজপত্র' সাহিত্য পত্রিকার সম্পাদক কে ছিলেন?",
    option1: "প্রমথ চৌধুরী", option2: "রবীন্দ্রনাথ ঠাকুর", option3: "কাজী নজরুল ইসলাম", option4: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    correctAnswer: 1,
    explanation: "সবুজপত্র ছবিটি ১৯১৪ সালে প্রমথ চৌধুরীর সম্পাদনায় প্রকাশিত হয় এবং এটি চলিত রীতির প্রবর্তনে বড় ভূমিকা রাখে।"
  },
  {
    id: "ep_e2",
    category: "Science",
    difficulty: "easy",
    question: "কোন মশার কামড়ে ডেঙ্গু জ্বর হয়?",
    option1: "এডিস মশা", option2: "অ্যানোফিলিস মশা", option3: "কিউলেক্স মশা", option4: "স্যান্ড ফ্লাই",
    correctAnswer: 1,
    explanation: "ডেঙ্গু ভাইরাস বহনকারী এডিস মশার কামড়ে ডেঙ্গু জ্বর হয়।"
  },
  {
    id: "ep_e3",
    category: "ICT",
    difficulty: "easy",
    question: "ইন্টারনেটে কোনো তথ্য খোঁজার জন্য ব্যবহৃত ইঞ্জিনকে কী বলা হয়?",
    option1: "সার্চ ইঞ্জিন", option2: "ব্রাউজার", option3: "সফটওয়্যার", option4: "ডাটাবেজ",
    correctAnswer: 1,
    explanation: "তথ্য অনুসন্ধানের জন্য ব্যবহৃত টুল বা সার্ভিসকে সার্চ ইঞ্জিন (যেমন: গুগল, বিং) বলা হয়।"
  },
  {
    id: "ep_e4",
    category: "GK",
    difficulty: "easy",
    question: "স্বাধীন বাংলাদেশের প্রথম অস্থায়ী রাজধানী কোথায় ছিল?",
    option1: "মুজিবনগর", option2: "ঢাকা", option3: "চট্টগ্রাম", option4: "সিলেট",
    correctAnswer: 1,
    explanation: "১৯৭১ সালে মুক্তিযুদ্ধ চলাকালীন মেহেরপুর জেলার বৈদ্যনাথতলার আম্রকাননে (বর্তমান মুজিবনগর) বাংলাদেশের প্রথম অস্থায়ী সরকার গঠিত ও শপথ গ্রহণ করে।"
  },
  {
    id: "ep_e5",
    category: "English",
    difficulty: "easy",
    question: "What is the plural form of the word 'Child'?",
    option1: "Children", option2: "Childs", option3: "Childrens", option4: "Childes",
    correctAnswer: 1,
    explanation: "'Child' শব্দের বহুবচন বা Plural রূপ হলো 'Children'।"
  },
  {
    id: "ep_e6",
    category: "Science",
    difficulty: "easy",
    question: "আমাদের বায়ুমণ্ডলে সবচেয়ে বেশি পরিমাণে পাওয়া যায় কোন গ্যাসটি?",
    option1: "নাইট্রোজেন", option2: "অক্সিজেন", option3: "কার্বন ডাই অক্সাইড", option4: "হাইড্রোজেন",
    correctAnswer: 1,
    explanation: "বায়ুমণ্ডলে নাইট্রোজেন গ্যাসের পরিমাণ সবচেয়ে বেশি, যা প্রায় ৭৮.০৮%।"
  },
  {
    id: "ep_e7",
    category: "GK",
    difficulty: "easy",
    question: "ময়নামতি ঐতিহাসিক স্থানটি কোন জেলায় অবস্থিত?",
    option1: "কুমিল্লা", option2: "বগুড়া", option3: "রাজশাহী", option4: "দিনাজপুর",
    correctAnswer: 1,
    explanation: "ময়নামতি বাংলাদেশের কুমিল্লা জেলায় অবস্থিত একটি বিখ্যাত প্রত্নতাত্ত্বিক স্থান।"
  },
  {
    id: "ep_e8",
    category: "English",
    difficulty: "easy",
    question: "Choose the correct spelling:",
    option1: "Committee", option2: "Comitee", option3: "Committe", option4: "Commitee",
    correctAnswer: 1,
    explanation: "সঠিক বানানটি হলো 'Committee' (C-o-m-m-i-t-t-e-e)।"
  },
  {
    id: "ep_e9",
    category: "Bangla",
    difficulty: "easy",
    question: "বাংলা স্বরবর্ণের সংখ্যা কয়টি?",
    option1: "১১টি", option2: "৩৯টি", option3: "৫০টি", option4: "১২টি",
    correctAnswer: 1,
    explanation: "বাংলা বর্ণমালায় মোট ৫০টি বর্ণের মধ্যে স্বরবর্ণ ১১টি এবং ব্যঞ্জনবর্ণ ৩৯টি।"
  },
  {
    id: "ep_e10",
    category: "ICT",
    difficulty: "easy",
    question: "WWW এর পূর্ণরূপ কী?",
    option1: "World Wide Web", option2: "World Web Wide", option3: "Wide World Web", option4: "Web World Wide",
    correctAnswer: 1,
    explanation: "WWW এর পূর্ণ রূপ হলো 'World Wide Web'।"
  },

  // MEDIUM
  {
    id: "ep_m1",
    category: "Bangla",
    difficulty: "medium",
    question: "কাজী নজরুল ইসলামের অগ্নি-বীণা কাব্যগ্রন্থের প্রথম কবিতা কোনটি?",
    option1: "প্রলয়োল্লাস", option2: "বিদ্রোহী", option3: "রক্তাম্বরধারিণী মা", option4: "ধূমকেতু",
    correctAnswer: 1,
    explanation: "১৯২২ সালে প্রকাশিত অগ্নি-বীণা কাব্যের প্রথম কবিতা হলো 'প্রলয়োল্লাস' এবং দ্বিতীয় কবিতা হলো বিখ্যাত 'বিদ্রোহী'।"
  },
  {
    id: "ep_m2",
    category: "GK",
    difficulty: "medium",
    question: "সুন্দরবনকে ইউনেস্কো (UNESCO) কত সালে বিশ্ব ঐতিহ্যবাহী স্থান হিসেবে ঘোষণা করে?",
    option1: "১৯৯৭ সালে", option2: "১৯৯৯ সালে", option3: "১৯৯৫ সালে", option4: "২০০১ সালে",
    correctAnswer: 1,
    explanation: "ইউনেস্কো ১৯৯৭ সালের ৬ই ডিসেম্বর সুন্দরবনকে বিশ্ব ঐতিহ্য (World Heritage Site) হিসেবে ঘোষণা করে।"
  },
  {
    id: "ep_m3",
    category: "Science",
    difficulty: "medium",
    question: "মানবদেহের স্বাভাবিক তাপমাত্রা কত ডিগ্রী ফারেনহাইট?",
    option1: "৯৮.৪° F", option2: "৯৭.৬° F", option3: "৯৯.২° F", option4: "৯৮.৬° F",
    correctAnswer: 1,
    explanation: "সুস্থ মানবদেহের স্বাভাবিক তাপমাত্রা হলো ৯৮.৪° ফারেনহাইট (বা ৩৬.৯° সেলসিয়াস)।"
  },
  {
    id: "ep_m4",
    category: "English",
    difficulty: "medium",
    question: "Complete the sentence: 'He is senior ___ me.'",
    option1: "to", option2: "than", option3: "of", option4: "with",
    correctAnswer: 1,
    explanation: "Senior, Junior, Superior, Inferior ইত্যাদি শব্দের পর Comparison প্রকাশ করতে 'than' এর পরিবর্তে 'to' বসে।"
  },
  {
    id: "ep_m5",
    category: "ICT",
    difficulty: "medium",
    question: "এক মেগাবایت (1 MB) কত কিলোবাইটের (KB) সমান?",
    option1: "১০২৪ KB", option2: "১০০০ KB", option3: "১০১২ KB", option4: "২০৪৮ KB",
    correctAnswer: 1,
    explanation: "ডিজিটাল পরিমাপে ১ মেগাবایت (MB) = ১০২৪ কিলোবাইট (KB)।"
  },
  {
    id: "ep_m6",
    category: "GK",
    difficulty: "medium",
    question: "লালবাগ কেল্লার আদি নাম কী ছিল?",
    option1: "কেল্লা আওরঙ্গবাদ", option2: "লালবাগ দুর্গ", option3: "আজম দুর্গ", option4: "शाहजदा कल्ला",
    correctAnswer: 1,
    explanation: "১৬৭৮ সালে মুঘল সুবাদার শাহজাদা মোহাম্মদ আজম লালবাগ কেল্লার নির্মাণ শুরু করেন, তখন এর নাম ছিল 'কেল্লা আওরঙ্গবাদ'।"
  },
  {
    id: "ep_m7",
    category: "Science",
    difficulty: "medium",
    question: "রক্তশূন্যতা বা অ্যানিমিয়া দেখা দেয় কোন ভিটামিনের অভাবে?",
    option1: "ভিটামিন B12", option2: "ভিটামিন C", option3: "ভিটামিন A", option4: "ভিটামিন D",
    correctAnswer: 1,
    explanation: "ভিটামিন B12 বা ফলিক অ্যাসিড এবং আয়রনের অভাবে লোহিত রক্তকণিকা তৈরিতে ব্যাঘাত ঘটে, যা অ্যানিমিয়া সৃষ্টি করে।"
  },
  {
    id: "ep_m8",
    category: "Bangla",
    difficulty: "medium",
    question: "কোন বানানটি শুদ্ধ?",
    option1: "মুহূর্ত", option2: "মুহুত্ব", option3: "মুহুর্ত", option4: "মুহুর্থ",
    correctAnswer: 1,
    explanation: "শুদ্ধ বানানটি হলো 'মুহূর্ত' (ম-এ হ্রস্ব উ, হ-এ দীর্ঘ উ এবং ত-এ রেফ)।"
  },
  {
    id: "ep_m9",
    category: "English",
    difficulty: "medium",
    question: "What is the antonym of 'Benevolent'?",
    option1: "Malevolent", option2: "Kind", option3: "Friendly", option4: "Generous",
    correctAnswer: 1,
    explanation: "Benevolent শব্দের অর্থ হলো পরোপকারী বা দয়ালু। এর বিপরীতার্থক শব্দ হলো Malevolent (পরশ্রীকাতর বা অমঙ্গলকামী)।"
  },
  {
    id: "ep_m10",
    category: "Science",
    difficulty: "medium",
    question: "কোনটি লাফিং গ্যাস (Laughing Gas) হিসেবে পরিচিত?",
    option1: "নাইট্রাস অক্সাইড", option2: "নাইট্রিক অক্সাইড", option3: "নাইট্রোজেন ডাইঅক্সাইড", option4: "অ্যামোনিয়া",
    correctAnswer: 1,
    explanation: "নাইট্রাস অক্সাইড (N2O) মৃদু মিষ্টি গন্ধযুক্ত একটি বর্ণহীন গ্যাস যা প্রশ্বাসের সাথে শরীরে প্রবেশ করলে হাসির উদ্রেক করে।"
  },

  // HARD
  {
    id: "ep_h1",
    category: "GK",
    difficulty: "hard",
    question: "স্বাধীন বাংলাদেশের জাতীয় পতাকার ডিজাইনার কে?",
    option1: "কামরুল হাসান", option2: "কামরুল ইসলাম", option3: "জয়নুল আবেদিন", option4: "হামিদুর রহমান",
    correctAnswer: 1,
    explanation: "১৯৭১ সালের স্বাধীনতা যুদ্ধের সময় প্রথম পতাকার নকশা শিব নারায়ণ দাস তৈরি করলেও, স্বাধীনতার পর ১৯৭২ সালে কামরুল হাসান বর্তমান পতাকার চূড়ান্ত নকশা ও পরিমার্জন করেন।"
  },
  {
    id: "ep_h2",
    category: "Bangla",
    difficulty: "hard",
    question: "মঙ্গলকাব্যের শাখাগুলোর মধ্যে সবচেয়ে প্রাচীন শাখা কোনটি?",
    option1: "মনসামঙ্গল", option2: "চণ্ডীমঙ্গল", option3: "অন্নদামঙ্গল", option4: "ধর্মমঙ্গল",
    correctAnswer: 1,
    explanation: "মনসা দেবীর মাহাত্ম্য কীর্তন সম্বলিত মনসামঙ্গল কাব্যধারাটি মঙ্গলকাব্য ধারার প্রাচীনতম শাখা হিসেবে সুপরিচিত।"
  },
  {
    id: "ep_h3",
    category: "Science",
    difficulty: "hard",
    question: "আলোর প্রতিসরণের দ্বিতীয় সূত্রের প্রবক্তা কে?",
    option1: "স্নেল", option2: "আইজ্যাক নিউটন", option3: "আইনস্টাইন", option4: "গ্যালিলিও",
    correctAnswer: 1,
    explanation: "১৬২১ সালে ডাচ গণিতবিদ ও জ্যোতির্বিজ্ঞানী উইলেব্রোর্ড স্নেল আলোর প্রতিসরণের দ্বিতীয় সূত্রটি (Snell's Law) আবিষ্কার করেন।"
  },
  {
    id: "ep_h4",
    category: "English",
    difficulty: "hard",
    question: "Which of the following is the noun form of the verb 'Succeed'?",
    option1: "Success", option2: "Successful", option3: "Successfully", option4: "Successive",
    correctAnswer: 1,
    explanation: "'Succeed' হলো একটি Verb (ক্রিয়া)। এর Noun (বিশেষ্য) রূপ হলো 'Success'।"
  },
  {
    id: "ep_h5",
    category: "ICT",
    difficulty: "hard",
    question: "কম্পিউটারের প্রধান মেমোরির ভেতরে বা বাইরে এড্রেস বহনের জন্য ব্যবহৃত বাসকে কী বলা হয়?",
    option1: "অ্যাড্রেস বাস", option2: "কন্ট্রোল বাস", option3: "ডাটা বাস", option4: "সিস্টেম বাস",
    correctAnswer: 1,
    explanation: "অ্যাড্রেস বাস (Address Bus) মেমোরি লোকেশন বা আই/ও ডিভাইসগুলোর ফিজিক্যাল অ্যাড্রেস বহন করে।"
  },
  {
    id: "ep_h6",
    category: "Bangla",
    difficulty: "hard",
    question: "বৌদ্ধ ধর্মের গোপন তত্ত্ব ও সাধন প্রণালী ব্যক্ত করার জন্য রচিত চর্যাপদের ভাষাকে পণ্ডিত হরপ্রসাদ শাস্ত্রী কী নাম দিয়েছেন?",
    option1: "সান্ধ্য ভাষা", option2: "অপভ্রংশ ভাষা", option3: "প্রাকৃত ভাষা", option4: "নব্য ভারতীয় আর্য ভাষা",
    correctAnswer: 1,
    explanation: "চর্যাপদের ভাষার কিছু অংশ বোঝা যায় এবং কিছু অংশ রহস্যময় বা অস্পষ্ট থাকার কারণে হরপ্রসাদ শাস্ত্রী একে আলো-আঁধারি বা 'সান্ধ্য ভাষা' নামে অভিহিত করেন।"
  },
  {
    id: "ep_h7",
    category: "GK",
    difficulty: "hard",
    question: "ঢাকা বিশ্ববিদ্যালয় কত সালে প্রতিষ্ঠিত হয়?",
    option1: "১৯২১ সালে", option2: "১৯১১ সালে", option3: "১৯০৫ সালে", option4: "১৯৪৭ সালে",
    correctAnswer: 1,
    explanation: "নাথান কমিশনের সুপারিশের ভিত্তিতে ১৯২১ সালের ১লা জুলাই ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠিত ও আনুষ্ঠানিকভাবে কার্যক্রম শুরু করে।"
  },
  {
    id: "ep_h8",
    category: "Science",
    difficulty: "hard",
    question: "উদ্ভিদের বৃদ্ধির হার পরিমাপক যন্ত্রের নাম কী?",
    option1: "অক্সানোমিটার", option2: "ক্রনোগ্রাফ", option3: "ব্যারোমিটার", option4: "হাইড্রোমিটার",
    correctAnswer: 1,
    explanation: "উদ্ভিদ অঙ্গের অত্যন্ত সূক্ষ্ম ও নিখুঁত বৃদ্ধি পরিমাপ করার যন্ত্রের নাম হলো অক্সানোমিটার (Auxanometer)।"
  },
  {
    id: "ep_h9",
    category: "English",
    difficulty: "hard",
    question: "What is the meaning of the idiom 'Achilles' heel'?",
    option1: "A weak spot", option2: "A strong point", option3: "A fast runner", option4: "A fatal injury",
    correctAnswer: 1,
    explanation: "গ্রীক উপকথা থেকে আসা 'Achilles' heel' ইডিয়মটির অর্থ হলো কারো একমাত্র বা প্রধান দুর্বল দিক (A weak spot / vulnerable point)।"
  },
  {
    id: "ep_h10",
    category: "ICT",
    difficulty: "hard",
    question: "নিচের কোন প্রোটোকলটি মূলত সংযোগ-ভিত্তিক ও নির্ভরযোগ্য উপায়ে ডাটা স্থানান্তরে ব্যবহৃত হয়?",
    option1: "TCP", option2: "UDP", option3: "DNS", option4: "ICMP",
    correctAnswer: 1,
    explanation: "TCP (Transmission Control Protocol) হলো একটি সংযোগ-ভিত্তিক (Connection-oriented) প্রোটোকল যা ডাটার নির্ভরযোগ্য ও ত্রুটিমুক্ত স্থানান্তর নিশ্চিত করে।"
  }
];

function shuffleOptionsAndGetAnswer(correctText: string, wrongTexts: string[]): {
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number;
} {
  const all = [correctText, ...wrongTexts];
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctAnswer = shuffled.indexOf(correctText) + 1;
  return {
    option1: shuffled[0],
    option2: shuffled[1],
    option3: shuffled[2],
    option4: shuffled[3],
    correctAnswer
  };
}

function generateMathQuestion(level: number): QuizQuestion {
  const subjects = ["সুদকষা", "লাভ-ক্ষতি", "অনুপাত", "ধারা", "মৌলিক সংখ্যা"];
  const sub = subjects[Math.floor(Math.random() * subjects.length)];
  const difficulty: "easy" | "medium" | "hard" = level <= 3 ? "easy" : level <= 7 ? "medium" : "hard";

  if (sub === "সুদকষা") {
    const rate = Math.floor(Math.random() * 11) + 5; // 5% to 15%
    const principal = (Math.floor(Math.random() * 19) + 4) * 200; // 800 to 4400
    const year = Math.floor(Math.random() * 5) + 2; // 2 to 6 years
    
    const interest = (principal * rate * year) / 100;
    const total = principal + interest;

    const questionType = Math.random() > 0.5 ? "সুদ" : "সুদ-আসল";
    const questionText = `বার্ষিক শতকরা ${rate} টাকা হারে ${principal} টাকার ${year} বছরের ${questionType} কত হবে?`;
    const ansVal = questionType === "সুদ" ? interest : total;

    const correctText = `${ansVal} টাকা`;
    const wrong1 = `${ansVal - 100 > 0 ? ansVal - 100 : ansVal + 150} টাকা`;
    const wrong2 = `${ansVal + 100} টাকা`;
    const wrong3 = `${ansVal + 50} টাকা`;

    const { option1, option2, option3, option4, correctAnswer } = shuffleOptionsAndGetAnswer(correctText, [wrong1, wrong2, wrong3]);
    const id = `dq_m_interest_r${rate}_p${principal}_y${year}_t${questionType === "সুদ" ? 1 : 2}`;

    return {
      id,
      category: "Math",
      difficulty,
      question: questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      explanation: `আমরা জানি, সুদ (I) = (আসল (P) × সুদের হার (r) × সময় (n)) / ১০০। এখানে আসল = ${principal} টাকা, হার = ${rate}%, সময় = ${year} বছর। অতএব সুদ = (${principal}×${rate}×${year})/১০০ = ${interest} টাকা। ${questionType === "সুদ-আসল" ? `সুদ-আসল = আসল + সুদ = ${principal} + ${interest} = ${total} টাকা।` : ""}`,
    };
  } else if (sub === "লাভ-ক্ষতি") {
    const costPrice = (Math.floor(Math.random() * 15) + 3) * 100; // 300 to 1700
    const profitPercent = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
    const isProfit = Math.random() > 0.5;
    
    const diffVal = (costPrice * profitPercent) / 100;
    const sellPrice = isProfit ? costPrice + diffVal : costPrice - diffVal;

    const questionText = `একটি জিনিস ${costPrice} টাকায় ক্রয় করে ${profitPercent}% ${isProfit ? "লাভে" : "ক্ষতিতে"} বিক্রয় করলে বিক্রয়মূল্য কত হবে?`;
    
    const correctText = `${sellPrice} টাকা`;
    const wrong1 = `${sellPrice + (isProfit ? -50 : 50) > 0 ? sellPrice + (isProfit ? -50 : 50) : sellPrice + 80} টাকা`;
    const wrong2 = `${sellPrice + 100} টাকা`;
    const wrong3 = `${sellPrice - 100 > 0 ? sellPrice - 100 : sellPrice + 150} টাকা`;

    const { option1, option2, option3, option4, correctAnswer } = shuffleOptionsAndGetAnswer(correctText, [wrong1, wrong2, wrong3]);
    const id = `dq_m_profit_c${costPrice}_p${profitPercent}_${isProfit ? "p" : "l"}`;

    return {
      id,
      category: "Math",
      difficulty,
      question: questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      explanation: `ক্রয়মূল্য ${costPrice} টাকা হলে, ${profitPercent}% ${isProfit ? "লাভে" : "ক্ষতিতে"} বিক্রয় করতে হবে। ${isProfit ? "লাভ" : "ক্ষতি"} = (${costPrice} × ${profitPercent}) / ১০০ = ${diffVal} টাকা। অতএব বিক্রয়মূল্য = ${costPrice} ${isProfit ? "+" : "-"} ${diffVal} = ${sellPrice} টাকা।`,
    };
  } else if (sub === "অনুপাত") {
    const ratios = [[2, 3], [1, 3], [3, 4], [3, 5], [4, 5], [2, 5], [5, 7], [3, 7], [5, 9]];
    const [ratioA, ratioB] = ratios[Math.floor(Math.random() * ratios.length)];
    const multiple = Math.floor(Math.random() * 15) + 5; // 5 to 19
    
    const totalVal = (ratioA + ratioB) * multiple;
    const shareA = ratioA * multiple;
    const shareB = ratioB * multiple;

    const questionText = `দুইটি সংখ্যার অনুপাত ${ratioA}:${ratioB}। সংখ্যা দুটির সমষ্টি ${totalVal} হলে ছোট সংখ্যাটি কত?`;

    const correctText = `${shareA}`;
    const wrong1 = `${shareB}`;
    const wrong2 = `${totalVal}`;
    const wrong3 = `${shareA + 10}`;

    const { option1, option2, option3, option4, correctAnswer } = shuffleOptionsAndGetAnswer(correctText, [wrong1, wrong2, wrong3]);
    const id = `dq_m_ratio_a${ratioA}_b${ratioB}_m${multiple}`;

    return {
      id,
      category: "Math",
      difficulty,
      question: questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      explanation: `অনুপাতের যোগফল = ${ratioA} + ${ratioB} = ${ratioA + ratioB}। ছোট অংশটি হবে মোট সমষ্টির (${ratioA}/${ratioA + ratioB}) অংশ। অতএব ছোট সংখ্যাটি = ${totalVal} × (${ratioA}/${ratioA + ratioB}) = ${shareA}।`,
    };
  } else if (sub === "ধারা") {
    const start = Math.floor(Math.random() * 12) + 2; // 2 to 13
    const diff = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const n = 5;
    const ansVal = start + (n - 1) * diff;

    const seriesText = `${start}, ${start + diff}, ${start + diff * 2}, ${start + diff * 3}, ...`;
    const questionText = `ধারাটির পরবর্তী (৫ম) পদটি কত? ধারাটি: ${seriesText}`;

    const correctText = `${ansVal}`;
    const wrong1 = `${ansVal - diff}`;
    const wrong2 = `${ansVal + diff}`;
    const wrong3 = `${ansVal + diff * 2}`;

    const { option1, option2, option3, option4, correctAnswer } = shuffleOptionsAndGetAnswer(correctText, [wrong1, wrong2, wrong3]);
    const id = `dq_m_series_s${start}_d${diff}`;

    return {
      id,
      category: "Math",
      difficulty,
      question: questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      explanation: `এটি একটি সমান্তর ধারা যার প্রথম পদ a = ${start} এবং সাধারণ অন্তর d = ${diff}। ৪র্থ পদটি হলো ${start + diff*3}। অতএব ৫ম পদটি হবে ${start + diff*3} + ${diff} = ${ansVal}।`,
    };
  } else {
    const easyPrimes = [11, 13, 17, 19, 23, 29, 31, 37];
    const mediumPrimes = [41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    const hardPrimes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149];
    const primes = difficulty === "easy" ? easyPrimes : difficulty === "medium" ? mediumPrimes : hardPrimes;
    const num = primes[Math.floor(Math.random() * primes.length)];

    const questionText = `নিচের কোন সংখ্যাটি মৌলিক সংখ্যা?`;
    
    const correctText = `${num}`;
    const wrong1 = `${num + 1}`;
    const wrong2 = `${num + 3}`;
    const wrong3 = `${num * 2}`;

    const { option1, option2, option3, option4, correctAnswer } = shuffleOptionsAndGetAnswer(correctText, [wrong1, wrong2, wrong3]);
    const id = `dq_m_prime_${num}`;

    return {
      id,
      category: "Math",
      difficulty,
      question: questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
      explanation: `${num} একটি মৌলিক সংখ্যা কারণ একে ১ এবং ${num} ব্যতীত অন্য কোনো ধনাত্মক পূর্ণসংখ্যা দ্বারা নিঃশেষে ভাগ করা যায় না।`,
    };
  }
}

function generateGKQuestion(level: number): QuizQuestion {
  const difficulty: "easy" | "medium" | "hard" = level <= 3 ? "easy" : level <= 7 ? "medium" : "hard";

  // Try to pick from EXTRA_GK_POOL (75% of the time to maximize rich questions)
  if (Math.random() < 0.75) {
    const matching = EXTRA_GK_POOL.filter(q => q.difficulty === difficulty);
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
  }

  const years = [1971, 1952, 1969, 1966, 1972, 1948];
  const year = years[Math.floor(Math.random() * years.length)];

  if (year === 1971) {
    const questions = [
      {
        id: "dq_g_71_sec",
        q: "মুক্তিযুদ্ধের সময় বাংলাদেশকে কয়টি সেক্টরে ভাগ করা হয়েছিল?",
        o1: "৭টি", o2: "১১টি", o3: "৬৪টি", o4: "৮টি", ans: 2,
        exp: "১৯৭১ সালের মহান মুক্তিযুদ্ধের সময় যুদ্ধ পরিচালনার সুবিধার্থে সমগ্র বাংলাদেশকে ১১টি সামরিক সেক্টরে এবং ৬৪টি সাব-সেক্টরে বিভক্ত করা হয়েছিল।"
      },
      {
        id: "dq_g_71_bir",
        q: "মুক্তিযুদ্ধে বীরত্বপূর্ণ অবদানের জন্য কতজনকে 'বীরশ্রেষ্ঠ' উপাধিতে ভূষিত করা হয়?",
        o1: "৭ জন", o2: "৬৮ জন", o3: "১৭৫ জন", o4: "৪২৬ জন", ans: 1,
        exp: "মহান মুক্তিযুদ্ধে সর্বোচ্চ আত্মত্যাগের বীরত্বপূর্ণ স্বীকৃতির জন্য ৭ জন মুক্তিযোদ্ধাকে সর্বোচ্চ সামরিক সম্মান 'বীরশ্রেষ্ঠ' উপাধিতে ভূষিত করা হয়।"
      },
      {
        id: "dq_g_71_sur",
        q: "১৯৭১ সালের ১৬ই ডিসেম্বর পাক-বাহিনীর আত্মসমর্পণের দলিলে স্বাক্ষর কে করেন?",
        o1: "জেনারেল নিয়াজী", o2: "জেনারেল জ্যাকব", o3: "জেনারেল মানেকশ", o4: "জেনারেল ওসমানী", ans: 1,
        exp: "১৯৭১ সালের ১৬ই ডিসেম্বর রেসকোর্স ময়দানে আত্মসমর্পণ দলিলে পাকিস্তানের পক্ষে জেনারেল এ. এ. কে. নিয়াজী স্বাক্ষর করেন।"
      },
      {
        id: "dq_g_71_rad",
        q: "স্বাধীন বাংলা বেতার কেন্দ্র থেকে প্রচারিত অত্যন্ত জনপ্রিয় ব্যঙ্গাত্মক অনুষ্ঠান কোনটি ছিল?",
        o1: "চরমপত্র", o2: "জল্লাদের দরবার", o3: "খবরের খাস খবর", o4: "দৃষ্টিপাত", ans: 1,
        exp: "এম আর আখতার মুকুলের লিখিত ও কণ্ঠে পঠিত 'চরমপত্র' অনুষ্ঠানটি মুক্তিযোদ্ধাদের ও বাঙালি জাতিকে অনুপ্রাণিত করতে বিশাল ভূমিকা রাখে।"
      }
    ];
    const item = questions[Math.floor(Math.random() * questions.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  } else if (year === 1952) {
    const questions1952 = [
      {
        id: "dq_g_52_pm",
        q: "১৯৫২ সালের মহান ভাষা আন্দোলনের সময় পাকিস্তানের প্রধানমন্ত্রী কে ছিলেন?",
        o1: "লিয়াকত আলী خان", o2: "খাজা নাজিমুদ্দিন", o3: "মোহাম্মদ আলী জিন্নাহ", o4: "আইয়ুব খান", ans: 2,
        exp: "১৯৫২ সালে ভাষা আন্দোলনের চূড়ান্ত বিস্ফোরণের সময় পাকিস্তানের প্রধানমন্ত্রী ছিলেন খাজা নাজিমুদ্দিন (যিনি ঘোষণা করেছিলেন যে উর্দুই হবে পাকিস্তানের একমাত্র রাষ্ট্রভাষা)।"
      },
      {
        id: "dq_g_52_minar",
        q: "ভাষা আন্দোলনের শহীদদের স্মরণে প্রথম শহীদ মিনার কবে নির্মিত হয়?",
        o1: "২১শে ফেব্রুয়ারি ১৯৫২", o2: "২৩শে ফেব্রুয়ারি ১৯৫২", o3: "২৬শে ফেব্রুয়ারি ১৯৫২", o4: "২১শে ফেব্রুয়ারি ১৯৫৩", ans: 2,
        exp: "২৩শে ফেব্রুয়ারি ১৯৫২ তারিখে ঢাকা মেডিকেল কলেজের শিক্ষার্থীরা প্রথম শহীদ মিনার নির্মাণ করেন এবং পরদিন ২৪শে ফেব্রুয়ারি এটি উদ্বোধন করা হয়।"
      }
    ];
    const item = questions1952[Math.floor(Math.random() * questions1952.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  } else if (year === 1966) {
    const questions1966 = [
      {
        id: "dq_g_66_dem",
        q: "ঐতিহাসিক ছয় দফা দাবি কে উত্থাপন করেছিলেন?",
        o1: "মওলানা ভাসানী", o2: "শেরে বাংলা এ কে ফজলুল হক", o3: "বঙ্গবন্ধু শেখ মুজিবুর রহমান", o4: "তাজউদ্দীন আহমদ", ans: 3,
        exp: "১৯৬৬ সালের ৫-৬ ফেব্রুয়ারি লাহোরে অনুষ্ঠিত বিরোধী দলসমূহের সম্মেলনে বঙ্গবন্ধু শেখ মুজিবুর রহমান বাঙালি জাতির মুক্তির সনদ ছয় দফা দাবি পেশ করেন।"
      },
      {
        id: "dq_g_66_ann",
        q: "ছয় দফা দাবি আনুষ্ঠানিকভাবে কবে ঘোষণা করা হয়?",
        o1: "৫ই ফেব্রুয়ারি ১৯৬৬", o2: "২৩শে মার্চ ১৯৬৬", o3: "৭ই জুন ১৯৬৬", o4: "১৭ই এপ্রিল ১৯৬৬", ans: 2,
        exp: "২৩শে মার্চ ১৯৬৬ তারিখে বঙ্গবন্ধু শেখ মুজিবুর রহমান আনুষ্ঠানিকভাবে ছয় দফা ঘোষণা করেন।"
      }
    ];
    const item = questions1966[Math.floor(Math.random() * questions1966.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  } else if (year === 1969) {
    const questions1969 = [
      {
        id: "dq_g_69_asad",
        q: "ঊনসত্তরের গণঅভ্যুত্থানে শহীদ আসাদ কবে শহীদ হন?",
        o1: "২০শে জানুয়ারি ১৯৬৯", o2: "১৫ই ফেব্রুয়ারি ১৯৬৯", o3: "১৮ই ফেব্রুয়ারি ১৯৬৯", o4: "২৫শে মার্চ ১৯৬৯", ans: 1,
        exp: "২০শে জানুয়ারি ১৯৬৯ তারিখে আইয়ুব বিরোধী গণআন্দোলনে আসাদুজ্জামান (শহীদ আসাদ) পুলিশের গুলিতে শহীদ হন।"
      },
      {
        id: "dq_g_69_bong",
        q: "বঙ্গবন্ধুকে 'বঙ্গবন্ধু' উপাধি কবে দেওয়া হয়?",
        o1: "২৩শে ফেব্রুয়ারি ১৯৬৯", o2: "৫ই ডিসেম্বর ১৯৬৯", o3: "৭ই মার্চ ১৯৭১", o4: "২৬শে মার্চ ১৯৭১", ans: 1,
        exp: "২৩শে ফেব্রুয়ারি ১৯৬৯ তারিখে রেসকোর্স ময়দানে এক বিশাল গণসংবর্ধনায় তোফায়েল আহমেদ শেখ মুজিবুর রহমানকে 'বঙ্গবন্ধু' উপাধিতে ভূষিত করেন।"
      }
    ];
    const item = questions1969[Math.floor(Math.random() * questions1969.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  } else if (year === 1972) {
    const questions1972 = [
      {
        id: "dq_g_72_con",
        q: "বাংলাদেশের সংবিধান কবে থেকে কার্যকর হয়?",
        o1: "১৬ই ডিসেম্বর ১৯৭২", o2: "৪ঠা নভেম্বর ১৯৭২", o3: "২৬শে মার্চ ১৯৭২", o4: "১০ই জানুয়ারি ১৯৭২", ans: 1,
        exp: "বাংলাদেশের সংবিধান ৪ঠা নভেম্বর ১৯৭২ তারিখে গণপরিষদে গৃহীত হয় এবং ১৬ই ডিসেম্বর ১৯৭২ (প্রথম বিজয় দিবস) থেকে এটি কার্যকর হয়।"
      },
      {
        id: "dq_g_72_ret",
        q: "বঙ্গবন্ধু শেখ মুজিবুর রহমান কবে স্বাধীন বাংলাদেশে প্রত্যাবর্তন করেন?",
        o1: "১০ই জানুয়ারি ১৯৭২", o2: "১৬ই ডিসেম্বর ১৯৭১", o3: "৮ই জানুয়ারি ১৯৭২", o4: "১৭ই এপ্রিল ১৯৭২", ans: 1,
        exp: "বঙ্গবন্ধু শেখ মুজিবুর রহমান পাকিস্তানের কারাগার থেকে মুক্ত হয়ে ১০ই জানুয়ারি ১৯৭২ তারিখে লন্ডন ও দিল্লী হয়ে স্বাধীন বাংলাদেশে প্রত্যাবর্তন করেন।"
      }
    ];
    const item = questions1972[Math.floor(Math.random() * questions1972.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  } else {
    const regions = [
      { id: "dq_g_gen_coral", q: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ কোনটি?", o1: "সেন্ট মার্টিনস", o2: "কুতুবদিয়া", o3: "সন্দ্বীপ", o4: "হাতিয়া", ans: 1, exp: "সেন্ট মার্টিনস দ্বীপ বঙ্গোপসাগরে অবস্থিত বাংলাদেশের একমাত্র প্রবাল দ্বীপ।" },
      { id: "dq_g_gen_cold", q: "বাংলাদেশের শীতলতম স্থান কোনটি?", o1: "শ্রীমঙ্গল", o2: "লালখান", o3: "হরিপুর", o4: "রাজশাহী", ans: 1, exp: "মৌলভীবাজারের শ্রীমঙ্গলে শীতকালে তাপমাত্রা সবচেয়ে বেশি হ্রাস পায়, একে বাংলাদেশের শীতলতম স্থান বলা হয়।" },
      { id: "dq_g_gen_saarc", q: "সার্ক (SAARC) এর সদর দফতর কোথায় অবস্থিত?", o1: "ঢাকা, বাংলাদেশ", o2: "কাঠমান্ডু, নেপাল", o3: "নয়াদিল্লি, ভারত", o4: "কলম্বো, শ্রীলঙ্কা", ans: 2, exp: "সার্ক (SAARC)-এর সদর দফতর নেপালের রাজধানী কাঠমান্ডুতে অবস্থিত।" },
      { id: "dq_g_gen_river", q: "বাংলাদেশের দীর্ঘতম নদী কোনটি?", o1: "মেঘনা", o2: "পদ্মা", o3: "যমুনা", o4: "ব্রহ্মপুত্র", ans: 1, exp: "বাংলাদেশ অভ্যন্তরে দীর্ঘতম ও গভীরতম নদী হলো মেঘনা।" },
      { id: "dq_g_gen_peak", q: "বাংলাদেশের সর্বোচ্চ শৃঙ্গের নাম কী?", o1: "তাজিংডং", o2: "কেওক্রাডং", o3: "সাকা হাফং", o4: "চিম্বুক", ans: 1, exp: "বিজয় নামে পরিচিত তাজিংডং বান্দরবানে অবস্থিত।" },
      { id: "dq_g_gen_temple", q: "কান্তজিউ মন্দিরটি কোন জেলায় অবস্থিত?", o1: "দিনাজপুর", o2: "রংপুর", o3: "বগুড়া", o4: "নওগাঁ", ans: 1, exp: "ঐতিহাসিক ও দৃষ্টিনন্দন কান্তজিউ বা কান্তনগর মন্দিরটি দিনাজপুর জেলার কাহারোল উপজেলায় অবস্থিত।" },
      { id: "dq_g_gen_bridge", q: "পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?", o1: "৬.১৫ কিমি", o2: "৫.১৫ কিমি", o3: "৭.১৫ কিমি", o4: "৬.২৫ কিমি", ans: 1, exp: "পদ্মা বহুমুখী সেতুর মূল দৈর্ঘ্য হলো ৬.১৫ কিলোমিটার (৬১৫০ মিটার)।" },
      { id: "dq_g_gen_park", q: "বাংলাদেশের জাতীয় উদ্যান কোনটি?", o1: "ভাওয়াল জাতীয় উদ্যান", o2: "লাউয়াছড়া জাতীয় উদ্যান", o3: "হিমছড়ি জাতীয় উদ্যান", o4: "রামসাগর জাতীয় উদ্যান", ans: 1, exp: "গাজীপুরে অবস্থিত ভাওয়াল জাতীয় উদ্যান বাংলাদেশের অন্যতম প্রধান ও বৃহৎ জাতীয় উদ্যান।" }
    ];
    const item = regions[Math.floor(Math.random() * regions.length)];
    return {
      id: item.id,
      category: "GK",
      difficulty,
      question: item.q,
      option1: item.o1,
      option2: item.o2,
      option3: item.o3,
      option4: item.o4,
      correctAnswer: item.ans,
      explanation: item.exp
    };
  }
}

// Get 20 random progressive questions for a specific folder level (1 to 10+)
export function getFolderQuizQuestions(folderId: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedIds = new Set<string>();

  // Load seen questions from localStorage to prevent repetition
  let seenIds = new Set<string>();
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("quiz_seen_question_ids");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          seenIds = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn("Error reading seen IDs:", e);
    }
  }

  // Determine the proportion of Easy, Medium, Hard questions based on folderId (1 to 10+)
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  if (folderId === 1) {
    easyCount = 18; mediumCount = 2; hardCount = 0;
  } else if (folderId === 2) {
    easyCount = 14; mediumCount = 6; hardCount = 0;
  } else if (folderId === 3) {
    easyCount = 10; mediumCount = 8; hardCount = 2;
  } else if (folderId === 4) {
    easyCount = 8; mediumCount = 10; hardCount = 2;
  } else if (folderId === 5) {
    easyCount = 5; mediumCount = 10; hardCount = 5;
  } else if (folderId === 6) {
    easyCount = 4; mediumCount = 10; hardCount = 6;
  } else if (folderId === 7) {
    easyCount = 2; mediumCount = 10; hardCount = 8;
  } else if (folderId === 8) {
    easyCount = 1; mediumCount = 8; hardCount = 11;
  } else if (folderId === 9) {
    easyCount = 0; mediumCount = 6; hardCount = 14;
  } else {
    // Folder 10 and beyond
    easyCount = 0; mediumCount = 3; hardCount = 17;
  }

  // Helper to fetch from static list of matching difficulty, fallback to generator
  const getStaticAndGen = (diff: "easy" | "medium" | "hard", count: number) => {
    // 1. Prioritize unseen static questions
    let matchingStatic = STATIC_QUESTIONS.filter(q => q.difficulty === diff && !seenIds.has(q.id));
    
    // If no unseen static questions, fallback to any static questions of this difficulty
    if (matchingStatic.length === 0) {
      matchingStatic = STATIC_QUESTIONS.filter(q => q.difficulty === diff);
    }
    
    // Shuffle the matching static list
    const shuffled = [...matchingStatic].sort(() => Math.random() - 0.5);
    
    // Cap the number of static questions we use in a single round to ensure freshness
    const maxStaticToUse = Math.min(4, Math.floor(count * 0.4));
    
    let added = 0;
    // Add from static list up to maxStaticToUse
    for (const q of shuffled) {
      if (added >= maxStaticToUse || added >= count) break;
      if (!usedIds.has(q.id)) {
        questions.push(q);
        usedIds.add(q.id);
        added++;
      }
    }

    // 2. Fill the remaining slots with generated questions
    let attempts = 0;
    while (added < count && attempts < 150) {
      attempts++;
      // Alternate between math and general knowledge generator
      const genQ = Math.random() > 0.5 ? generateMathQuestion(folderId) : generateGKQuestion(folderId);
      genQ.difficulty = diff;

      // Ensure we haven't already used this ID in this round AND haven't seen it globally
      if (!usedIds.has(genQ.id) && !seenIds.has(genQ.id)) {
        questions.push(genQ);
        usedIds.add(genQ.id);
        added++;
      }
    }

    // Fallback in case we hit limits and couldn't find enough unseen generated questions
    let fallbackAttempts = 0;
    while (added < count && fallbackAttempts < 50) {
      fallbackAttempts++;
      const genQ = Math.random() > 0.5 ? generateMathQuestion(folderId) : generateGKQuestion(folderId);
      genQ.difficulty = diff;
      if (!usedIds.has(genQ.id)) {
        questions.push(genQ);
        usedIds.add(genQ.id);
        added++;
      }
    }
  };

  getStaticAndGen("easy", easyCount);
  getStaticAndGen("medium", mediumCount);
  getStaticAndGen("hard", hardCount);

  // Mark all selected questions as seen in localStorage
  if (typeof window !== "undefined") {
    try {
      questions.forEach(q => seenIds.add(q.id));
      let seenArray = Array.from(seenIds);
      // Keep seen pool under 600 items to avoid localStorage limit issues
      if (seenArray.length > 600) {
        seenArray = seenArray.slice(seenArray.length - 400);
      }
      localStorage.setItem("quiz_seen_question_ids", JSON.stringify(seenArray));
    } catch (e) {
      console.warn("Error saving seen IDs:", e);
    }
  }

  // Sort them progressively by difficulty (easy -> medium -> hard)
  const diffOrder = { easy: 1, medium: 2, hard: 3 };
  questions.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);

  return questions;
}
