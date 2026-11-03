export type Language = 'en' | 'ta';

export type TranslationDictionary = Translations;

export interface Translations {
  nav: {
    home: string;
    about: string;
    services: string;
    horoscope: string;
    panchangam: string;
    birthChart: string;
    blogs: string;
    booking: string;
    login: string;
    quickChat: string;
    logout: string;
    centreName: string;
    centreSubtitle: string;
    navigation: string;
    user: string;
  };
  common: {
    bookNow: string;
    bookConsultation: string;
    exploreServices: string;
    submit: string;
    cancel: string;
    back: string;
    next: string;
    confirm: string;
    save: string;
    loading: string;
    readMore: string;
    viewDetails: string;
    verified: string;
    happyClients: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    male: string;
    female: string;
    other: string;
    self: string;
    familyAndFriends: string;
  };
  floating: {
    chatWithAstrologer: string;
    callWithAstrologer: string;
  };
  home: {
    badge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    ratingBadge: string;
    statsUsers: string;
    statsUsersDesc: string;
    statsMarriage: string;
    statsMarriageDesc: string;
    statsMuhurtham: string;
    statsMuhurthamDesc: string;
    statsFormats: string;
    statsFormatsDesc: string;
    plansHeading: string;
    plansTitle: string;
    plansSubtitle: string;
    quickChatTitle: string;
    quickChatBadge: string;
    quickChatDesc: string;
    quickChatBtn: string;
    reviewsHeading: string;
    reviewsTitle: string;
    reviewsSubtitle: string;
    writeReview: string;
    googleReviews: string;
    comparePricing: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    vehicleTitle: string;
    vehicleDesc: string;
    houseWarmingTitle: string;
    houseWarmingDesc: string;
    cSectionTitle: string;
    cSectionDesc: string;
    marriageTimingTitle: string;
    marriageTimingDesc: string;
    businessTitle: string;
    businessDesc: string;
    propertyTitle: string;
    propertyDesc: string;
    bookAppointment: string;
  };
  about: {
    title: string;
    badge: string;
    subtitle: string;
    exp1: string;
    exp2: string;
    exp3: string;
    exp4: string;
    exp5: string;
    inquiryTitle: string;
    fullName: string;
    phoneNum: string;
    subject: string;
    message: string;
    sendInquiry: string;
    contactDirectly: string;
  };
  horoscope: {
    badge: string;
    title: string;
    subtitle: string;
    yesterday: string;
    today: string;
    tomorrow: string;
    selectSign: string;
    luckyColor: string;
    luckyNumber: string;
    remedy: string;
    love: string;
    career: string;
    finance: string;
    health: string;
    bookConsultationForRasi: string;
  };
  panchangam: {
    badge: string;
    title: string;
    subtitle: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    sunSign: string;
    moonSign: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    rahukaal: string;
    rahuKaal: string;
    yamaganda: string;
    gulika: string;
    abhijit: string;
    brahma: string;
    guidance: string;
    muhurthamCounsel: string;
    auspiciousSection: string;
    inauspiciousSection: string;
    bookMuhurthamBtn: string;
  };
  birthChart: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    fullName: string;
    dob: string;
    tob: string;
    pob: string;
    generateBtn: string;
    generating: string;
    rasiChart: string;
    navamsaChart: string;
    planetaryPositions: string;
  };
  booking: {
    badge: string;
    title: string;
    subtitle: string;
    bookingFor: string;
    bookingForSelf: string;
    bookingForFamily: string;
    relationship: string;
    personName: string;
    mobile: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    selectPlan: string;
    selectDate: string;
    selectSlot: string;
    confirmBooking: string;
    appointmentSummary: string;
  };
  footer: {
    description: string;
    sitemap: string;
    specializedServices: string;
    location: string;
    locationDesc: string;
    copyright: string;
    tagline: string;
    adminCore: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      horoscope: "Horoscope",
      panchangam: "Panchangam",
      birthChart: "Birth Chart",
      blogs: "Blogs",
      booking: "Booking",
      login: "Login Portal",
      quickChat: "Quick Chat",
      logout: "Logout",
      centreName: "Kkarthikeya",
      centreSubtitle: "Astrological Centre",
      navigation: "Navigation",
      user: "User"
    },
    common: {
      bookNow: "Book Now",
      bookConsultation: "Book Consultation",
      exploreServices: "Explore Services",
      submit: "Submit",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      confirm: "Confirm",
      save: "Save",
      loading: "Loading...",
      readMore: "Read More",
      viewDetails: "View Details",
      verified: "Verified",
      happyClients: "5000+ Happy Users",
      phone: "Phone",
      email: "Email",
      address: "Address",
      whatsapp: "WhatsApp",
      male: "Male",
      female: "Female",
      other: "Other",
      self: "Myself (Self)",
      familyAndFriends: "Family & Friends"
    },
    floating: {
      chatWithAstrologer: "Chat with Astrologer",
      callWithAstrologer: "WhatsApp Consultation"
    },
    home: {
      badge: "Trusted Vedic Astrology Guidance",
      heroTitle1: "Gain Absolute Clarity &",
      heroTitle2: "Confidence in Life",
      heroDesc: "Welcome to Kkarthikeya Astrological Centre. I provide personalized Vedic astrology guidance to help people make confident decisions in life through professional horoscope analysis and auspicious Muhurtham consultations.",
      ratingBadge: "4.9⭐ rating on Google Business (5000+ happy clients)",
      statsUsers: "Happy Clients Guided",
      statsUsersDesc: "Personal horoscope readings & life problems solved",
      statsMarriage: "Marriage Compatibility",
      statsMarriageDesc: "Happy couples matched for marriage",
      statsMuhurtham: "Auspicious Timing (Muhurtham)",
      statsMuhurthamDesc: "Lucky start times calculated for important events",
      statsFormats: "Consultation Modes",
      statsFormatsDesc: "Online, phone, and direct consultations worldwide",
      plansHeading: "Consultation Plans & Pricing",
      plansTitle: "Choose the Plan That Suits You Best",
      plansSubtitle: "Clear, accurate calculations backed by authentic Vedic astrology principles.",
      quickChatTitle: "Quick Chat Consultation",
      quickChatBadge: "Fast Response",
      quickChatDesc: "5-10 Minutes Chat • Direct Text Guidance • Simple Remedies & Advice",
      quickChatBtn: "Chat Now",
      reviewsHeading: "Client Reviews",
      reviewsTitle: "What Our Clients Say",
      reviewsSubtitle: "Verified live reviews from our Google Business Profile.",
      writeReview: "Write A Review",
      googleReviews: "Google Reviews",
      comparePricing: "Compare Consultation Pricing"
    },
    services: {
      badge: "Our Services & Consultations",
      title: "Astrology & Lucky Timing (Muhurtham) Services",
      subtitle: "Personalized guidance for every step of your life journey",
      vehicleTitle: "Vehicle Purchase Timing",
      vehicleDesc: "Best lucky dates and auspicious hours to buy your vehicle based on planet positions.",
      houseWarmingTitle: "House Warming (Grihapravesham)",
      houseWarmingDesc: "Best lucky date and auspicious timing for your house warming and new home ceremony (Grihapravesham).",
      cSectionTitle: "Baby Delivery Timing (C-Section)",
      cSectionDesc: "Best auspicious birth timing calculating a lucky birth star (Nakshatra) and rising sign (Lagna) for your newborn baby.",
      marriageTimingTitle: "Wedding Date & Time (Muhurtham)",
      marriageTimingDesc: "Matching bride & groom horoscopes to find the most blessed wedding date and auspicious hour.",
      businessTitle: "Business & Shop Opening Timing",
      businessDesc: "Best lucky dates and hours to launch your new business or shop for long-term success.",
      propertyTitle: "Property & Land Registration Timing",
      propertyDesc: "Best lucky dates and smooth timing for property purchase, land, or flat registration.",
      bookAppointment: "Book Appointment"
    },
    about: {
      title: "About Astrologer Kkarthikeya",
      badge: "Traditional Vedic Astrologer",
      subtitle: "Dedicated to providing clarity, confidence, and peace of mind",
      exp1: "Traditional Vedic Astrology Consultation",
      exp2: "Horoscope Analysis & Birth Time Correction (Chart Verification)",
      exp3: "Auspicious Timing (Muhurtham) for major life milestones",
      exp4: "Instant Clock Astrology for Urgent Questions (Kadikara Prasannam)",
      exp5: "Easy Phone & Online Video Consultations Worldwide",
      inquiryTitle: "Send an Inquiry",
      fullName: "Full Name",
      phoneNum: "Mobile Number",
      subject: "Subject",
      message: "Message",
      sendInquiry: "Send Message",
      contactDirectly: "Direct Contact Information"
    },
    horoscope: {
      badge: "Daily Vedic Horoscope",
      title: "Today's Horoscope (Rasi Palan)",
      subtitle: "Daily planetary influences and personalized astrological predictions",
      yesterday: "Yesterday",
      today: "Today",
      tomorrow: "Tomorrow",
      selectSign: "Select Your Zodiac Sign",
      luckyColor: "Lucky Color",
      luckyNumber: "Lucky Number",
      remedy: "Remedy & Prayers",
      love: "Love & Relationships",
      career: "Career & Work",
      finance: "Finance & Wealth",
      health: "Health & Energy",
      bookConsultationForRasi: "Book One-on-One Consultation for Your Sign"
    },
    panchangam: {
      badge: "Vedic Daily Calendar",
      title: "Daily Panchangam & Auspicious Timings",
      subtitle: "Accurate Lunar Day (Tithi), Star (Nakshatra), Good & Inauspicious Hours",
      tithi: "Lunar Day (Tithi / திதி)",
      nakshatra: "Birth Star (Nakshatra / நட்சத்திரம்)",
      yoga: "Planetary Combination (Yoga / யோகம்)",
      karana: "Half Lunar Day (Karana / கரணம்)",
      sunSign: "Sun Sign (சூரிய ராசி)",
      moonSign: "Moon Sign (சந்திர ராசி)",
      sunrise: "Sunrise (சூரியோதயம்)",
      sunset: "Sunset (சூரிய அஸ்தமனம்)",
      moonrise: "Moonrise (சந்திரோதயம்)",
      moonset: "Moonset (சந்திர அஸ்தமனம்)",
      rahukaal: "Rahu Kaalam - Inauspicious Time (ராகு காலம்)",
      rahuKaal: "Rahu Kaalam - Inauspicious Time (ராகு காலம்)",
      yamaganda: "Yamagandam - Caution Time (எமகண்டம்)",
      gulika: "Gulika Kaalam - Repetition Time (குளிகை காலம்)",
      abhijit: "Abhijit Muhurtham - Most Auspicious Hour (அபிஜித்)",
      brahma: "Brahma Muhurtham - Sacred Dawn Time (பிரம்ம முகூர்த்தம்)",
      guidance: "Astrologer's Daily Guidance",
      muhurthamCounsel: "Astrologer's Daily Guidance",
      auspiciousSection: "Good & Auspicious Hours (Shubha Kaal)",
      inauspiciousSection: "Hours to Avoid (Inauspicious / Ashubha Kaal)",
      bookMuhurthamBtn: "Book Auspicious Timing (Muhurtham) Consultation"
    },
    birthChart: {
      badge: "Birth Chart Calculator",
      title: "Vedic Birth Chart (Kundli)",
      subtitle: "Accurate Vedic Birth Chart & Planet Positions",
      formTitle: "Birth Details (Date, Time & Place)",
      fullName: "Full Name",
      dob: "Date of Birth",
      tob: "Time of Birth",
      pob: "Place of Birth (City, State / Country)",
      generateBtn: "Calculate Birth Chart",
      generating: "Calculating Planet Positions & Houses...",
      rasiChart: "Main Birth Chart (Rasi Chart / ராசி கட்டம்)",
      navamsaChart: "Destiny & Marriage Chart (Navamsa / நவாம்சம்)",
      planetaryPositions: "Planetary Positions & Signs (கிரக நிலைகள்)"
    },
    booking: {
      badge: "Consultation Booking",
      title: "Book Your Astrology Consultation",
      subtitle: "Choose your preferred plan, time slot, and enter birth details",
      bookingFor: "Consultation Booking For",
      bookingForSelf: "For Myself (My Details)",
      bookingForFamily: "Family Member / Friend",
      relationship: "Relationship with Person",
      personName: "Full Name",
      mobile: "Mobile Number",
      gender: "Gender",
      dob: "Date of Birth",
      tob: "Time of Birth",
      pob: "Place of Birth (City, State / Country)",
      selectPlan: "Select Consultation Plan",
      selectDate: "Select Appointment Date",
      selectSlot: "Select Consultation Time Slot",
      confirmBooking: "Confirm Booking (Pay on Consultation)",
      appointmentSummary: "Appointment Summary"
    },
    footer: {
      description: "Personalized Vedic astrology guidance to help you make clear and confident life decisions through deep horoscope analysis and lucky timing (Muhurtham) calculations.",
      sitemap: "Quick Links",
      specializedServices: "Specialized Services",
      location: "Our Location",
      locationDesc: "Kkarthikeya Astrological Centre, Chennai & Tamil Nadu. Online consultations worldwide.",
      copyright: "All Rights Reserved.",
      tagline: "Designed for Divine Clarity & Peace of Mind.",
      adminCore: "Admin Portal"
    }
  },
  ta: {
    nav: {
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      services: "சேவைகள்",
      horoscope: "ராசிபலன்",
      panchangam: "பஞ்சாங்கம்",
      birthChart: "பிறப்பு ஜாதகம்",
      blogs: "பதிவுகள்",
      booking: "முன்பதிவு",
      login: "உள்நுழைவு",
      quickChat: "உடனடி அரட்டை",
      logout: "வெளியேறு",
      centreName: "கார்த்திகேயா",
      centreSubtitle: "ஜோதிட மையம்",
      navigation: "வழிகாட்டல்",
      user: "பயனர்"
    },
    common: {
      bookNow: "முன்பதிவு செய்க",
      bookConsultation: "ஜோதிட ஆலோசனை முன்பதிவு",
      exploreServices: "சேவைகளை பார்க்க",
      submit: "சமர்ப்பிக்க",
      cancel: "ரத்து செய்",
      back: "பின்செல்ல",
      next: "அடுத்து",
      confirm: "உறுதி செய்",
      save: "சேமிக்க",
      loading: "ஏற்றுகிறது...",
      readMore: "மேலும் படிக்க",
      viewDetails: "விவரங்களை காண்க",
      verified: "சரிபார்க்கப்பட்டது",
      happyClients: "5000+ திருப்திகரமான வாடிக்கையாளர்கள்",
      phone: "தொலைபேசி",
      email: "மின்னஞ்சல்",
      address: "முகவரி",
      whatsapp: "வாட்ஸ்அப்",
      male: "ஆண்",
      female: "பெண்",
      other: "மற்றவை",
      self: "எனக்கு (சொந்த விவரங்கள்)",
      familyAndFriends: "குடும்பத்தினர் / நண்பர்கள்"
    },
    floating: {
      chatWithAstrologer: "ஜோதிடருடன் அரட்டை",
      callWithAstrologer: "வாட்ஸ்அப் ஆலோசனை"
    },
    home: {
      badge: "நம்பகமான பாரம்பரிய வேத ஜோதிடம்",
      heroTitle1: "வாழ்வில் முழு தெளிவும் &",
      heroTitle2: "வெற்றி நம்பிக்கையும் பெறுங்கள்",
      heroDesc: "கார்த்திகேயா ஜோதிட மையத்திற்கு உங்களை அன்புடன் வரவேற்கிறோம். துல்லியமான ஜாதக கணிப்பு, திருமணப் பொருத்தம், சுப முகூர்த்த நிர்ணயம் மற்றும் கடிகாரப் பிரசன்னம் மூலம் உங்கள் வாழ்வின் முக்கிய முடிவுகளுக்கு தெளிவான வழிகாட்டலை வழங்குகிறோம்.",
      ratingBadge: "கூகிள் பிசினஸில் 4.9⭐ மதிப்பீடு (5000+ திருப்திகரமான வாடிக்கையாளர்கள்)",
      statsUsers: "வழிகாட்டப்பட்ட வாடிக்கையாளர்கள்",
      statsUsersDesc: "தீர்க்கப்பட்ட தனிநபர் ஜாதக கணிப்புகள்",
      statsMarriage: "திருமணப் பொருத்தங்கள்",
      statsMarriageDesc: "வெற்றிகரமாக இணைக்கப்பட்ட தம்பதிகள்",
      statsMuhurtham: "சுப முகூர்த்த நேரங்கள்",
      statsMuhurthamDesc: "துல்லியமாக கணிக்கப்பட்ட சுப நேரங்கள்",
      statsFormats: "ஆலோசனை முறைகள்",
      statsFormatsDesc: "நேரடி மற்றும் தொலைபேசி / ஆன்லைன் முறைகள்",
      plansHeading: "ஆலோசனை திட்டங்கள் & கட்டணங்கள்",
      plansTitle: "உங்களுக்கு ஏற்ற திட்டத்தை தேர்ந்தெடுக்கவும்",
      plansSubtitle: "பாரம்பரிய வேத ஜோதிட விதிகளின்படி துல்லியமாக கணிக்கப்படுகிறது.",
      quickChatTitle: "உடனடி அரட்டை ஆலோசனை",
      quickChatBadge: "விரைவான பதில்",
      quickChatDesc: "5-10 நிமிட உடனடி அரட்டை • குறுஞ்செய்தி வழிகாட்டல் • எளிய பரிகாரங்கள்",
      quickChatBtn: "உரையாடுங்கள்",
      reviewsHeading: "வாடிக்கையாளர் கருத்துக்கள்",
      reviewsTitle: "வாடிக்கையாளர்கள் கூறுவது",
      reviewsSubtitle: "கூகிள் பிசினஸ் பக்கத்திலிருந்து பெறப்பட்ட நேரடி சான்றுகள்.",
      writeReview: "மதிப்புரை எழுதுக",
      googleReviews: "கூகிள் மதிப்புரைகள்",
      comparePricing: "கட்டண விவரங்களை ஒப்பிடுக"
    },
    services: {
      badge: "எங்கள் சேவைகள் & ஆலோசனைகள்",
      title: "வேத ஜோதிடம் & சுப முகூர்த்த சேவைகள்",
      subtitle: "உங்கள் வாழ்வின் ஒவ்வொரு படியிலும் தெய்வீக வழிகாட்டல்",
      vehicleTitle: "வாகனம் வாங்கும் சுப நேரம்",
      vehicleDesc: "குரு மற்றும் சுக்கிரனின் சுப பார்வை அடிப்படையில் வாகனம் வாங்க சிறந்த தேதி மற்றும் நேரம்.",
      houseWarmingTitle: "கிரகப்பிரவேசம் / புதுமனை புகுவிழா",
      houseWarmingDesc: "புதுமனை புகுவிழா மற்றும் கிரகப்பிரவேசத்திற்கு மிக உன்னதமான சுப முகூர்த்த நேரம்.",
      cSectionTitle: "குழந்தை பிறப்பு சுப முகூர்த்தம்",
      cSectionDesc: "குழந்தையின் எதிர்காலம் சிறக்க உகந்த சுப லக்னம் மற்றும் நட்சத்திற்குரிய நேரம்.",
      marriageTimingTitle: "திருமண சுப முகூர்த்த நேரம்",
      marriageTimingDesc: "மணமக்கள் இருவரின் ஜாதகத்தை கணித்து தோஷமில்லாத உன்னத முகூர்த்த நேரம்.",
      businessTitle: "தொழில் தொடங்கும் சுப நேரம்",
      businessDesc: "வியாபாரம் மற்றும் தொழில் விருத்தியடைய உகந்த லாபகரமான சுப நேரம்.",
      propertyTitle: "சொத்து பத்திரம் பதிவு சுப நேரம்",
      propertyDesc: "தடைகளின்றி சொத்து வாங்கவும், பதிவு செய்யவும் ஏற்ற அனுகூலமான முகூர்த்தம்.",
      bookAppointment: "நேரம் ஒதுக்குக"
    },
    about: {
      title: "ஜோதிடர் கார்த்திகேயா பற்றி",
      badge: "பாரம்பரிய வேத ஜோதிடர்",
      subtitle: "தெளிவும் ஆன்மீக வழிகாட்டலும் வழங்குவதில் அர்ப்பணிப்புடன் செயல்படுகிறார்",
      exp1: "பாரம்பரிய வேத ஜோதிட ஆலோசனை",
      exp2: "துல்லிய ஜாதக கணிப்பு & கால திருத்தம்",
      exp3: "வாழ்வின் முக்கிய நிகழ்வுகளுக்கான சுப முகூர்த்தம்",
      exp4: "கடிகாரப் பிரசன்னம் (உடனடி கேள்விக்கான தீர்வு)",
      exp5: "உலகெங்கிலும் உள்ள தமிழர்களுக்கு தொலைபேசி & ஆன்லைன் ஆலோசனை",
      inquiryTitle: "தகவல் கோரிக்கை அனுப்புக",
      fullName: "முழு பெயர்",
      phoneNum: "தொலைபேசி எண்",
      subject: "விசயம்",
      message: "செய்தி",
      sendInquiry: "செய்தி அனுப்புக",
      contactDirectly: "நேரடி தொடர்பு விவரங்கள்"
    },
    horoscope: {
      badge: "தினசரி வேத ராசிபலன்",
      title: "இன்றைய ராசிபலன்",
      subtitle: "கிரக நிலைகள் மற்றும் துல்லியமான தினசரி பலன்கள்",
      yesterday: "நேற்று",
      today: "இன்று",
      tomorrow: "நாளை",
      selectSign: "உங்கள் ராசியைத் தேர்ந்தெடுக்கவும்",
      luckyColor: "அதிர்ஷ்ட நிறம்",
      luckyNumber: "அதிர்ஷ்ட எண்",
      remedy: "பரிகாரம் & வழிபாடு",
      love: "காதல் & குடும்பம்",
      career: "தொழில் & வேலை",
      finance: "பொருளாதாரம் & நிதி",
      health: "உடல் ஆரோக்கியம்",
      bookConsultationForRasi: "உங்கள் ராசிக்கு விரிவான நேரடி ஆலோசனை பெறுக"
    },
    panchangam: {
      badge: "சுத்த வாக்கிய வேத பஞ்சாங்கம்",
      title: "தினசரி பஞ்சாங்கம் & சுப நேரங்கள்",
      subtitle: "திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் நல்ல நேரங்கள்",
      tithi: "திதி (Tithi)",
      nakshatra: "நட்சத்திரம் (Nakshatra)",
      yoga: "யோகம் (Yoga)",
      karana: "கரணம் (Karana)",
      sunSign: "சூரியன் ராசி",
      moonSign: "சந்திரன் ராசி",
      sunrise: "சூரியோதயம்",
      sunset: "சூரிய அஸ்தமனம்",
      moonrise: "சந்திரோதயம்",
      moonset: "சந்திர அஸ்தமனம்",
      rahukaal: "ராகு காலம் (Rahu Kaal)",
      rahuKaal: "ராகு காலம் (Rahu Kaal)",
      yamaganda: "எமகண்டம் (Yamagandam)",
      gulika: "குளிகை காலம் (Gulika)",
      abhijit: "அபிஜித் முகூர்த்தம்",
      brahma: "பிரம்ம முகூர்த்தம்",
      guidance: "ஜோதிடரின் தினசரி வழிகாட்டல்",
      muhurthamCounsel: "ஜோதிடரின் முகூர்த்த ஆலோசனை",
      auspiciousSection: "சுப முகூர்த்த நேரங்கள் (நல்ல நேரம்)",
      inauspiciousSection: "தவிர்க்க வேண்டிய நேரங்கள் (அசுப நேரம்)",
      bookMuhurthamBtn: "சுப முகூர்த்த ஆலோசனை முன்பதிவு செய்க"
    },
    birthChart: {
      badge: "பிறப்பு ஜாதக கணிப்பான்",
      title: "பிறப்பு ஜாதகம் (குண்டலி)",
      subtitle: "துல்லியமான வேத கிரக நிலைகள் & லக்ன கணிப்பு",
      formTitle: "பிறப்பு விவரங்கள் (தேதி, நேரம் & இடம்)",
      fullName: "முழு பெயர்",
      dob: "பிறந்த தேதி",
      tob: "பிறந்த நேரம்",
      pob: "பிறந்த ஊர்",
      generateBtn: "ஜாதகம் கணிக்க",
      generating: "கிரக நிலைகள் கணிக்கப்படுகிறது...",
      rasiChart: "ராசி கட்டம் (Rasi Chart)",
      navamsaChart: "நவாம்ச கட்டம் (Navamsa Chart)",
      planetaryPositions: "கிரக நிலைகள் (Planetary Positions)"
    },
    booking: {
      badge: "ஆலோசனை முன்பதிவு",
      title: "ஜோதிட ஆலோசனை முன்பதிவு செய்க",
      subtitle: "உங்கள் திட்டம், தேதி மற்றும் நேரத்தை தேர்ந்தெடுங்கள்",
      bookingFor: "யாருக்கு ஆலோசனை?",
      bookingForSelf: "எனக்கு (சொந்த விவரங்கள்)",
      bookingForFamily: "குடும்பத்தினர் / நண்பர்கள்",
      relationship: "உறவு முறை",
      personName: "நபர் முழு பெயர்",
      mobile: "தொலைபேசி எண்",
      gender: "பாலினம்",
      dob: "பிறந்த தேதி",
      tob: "பிறந்த நேரம்",
      pob: "பிறந்த ஊர்",
      selectPlan: "ஆலோசனை திட்டத்தை தேர்ந்தெடுக்கவும்",
      selectDate: "தேதியை தேர்ந்தெடுக்கவும்",
      selectSlot: "ஆலோசனை நேரத்தை தேர்ந்தெடுக்கவும்",
      confirmBooking: "முன்பதிவை உறுதி செய்க (ஆலோசனையின் போது கட்டணம்)",
      appointmentSummary: "முன்பதிவு சுருக்கம்"
    },
    footer: {
      description: "துல்லியமான ஜாதக ஆய்வு, சுப முகூர்த்த நிர்ணயம் மற்றும் கடிகாரப் பிரசன்னம் மூலம் வாழ்வில் தெளிவான முடிவுகளை எடுக்க வழிகாட்டுகிறோம்.",
      sitemap: "தள வழிகாட்டி",
      specializedServices: "சிறப்பு சேவைகள்",
      location: "எங்கள் இருப்பிடம்",
      locationDesc: "கார்த்திகேயா ஜோதிட மையம், சென்னை & தமிழ்நாடு. உலகெங்கிலும் ஆன்லைன் ஆலோசனைகள்.",
      copyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      tagline: "தெய்வீக அமைதி மற்றும் தெளிவிற்காக உருவாக்கப்பட்டது.",
      adminCore: "நிர்வாகி தளம்"
    }
  }
};
