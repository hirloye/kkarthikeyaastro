"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Shield, CheckCircle, 
  ChevronRight, Sparkles, User, Users, PhoneCall, 
  Compass, Orbit, AlertCircle, UserPlus, Trash2, Calendar as CalIcon, HeartHandshake
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export interface SavedFamilyMember {
  id: string;
  name: string;
  relationship: string;
  mobile?: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useApp();
  const { t, tText } = useLanguage();
  
  const planParam = searchParams.get('plan') || 'silver';

  // Dynamic Plans State
  const [plansData, setPlansData] = useState<Record<string, { title: string; price: number }>>({
    quick: { title: "Quick Chat Consultation", price: 199 },
    bronze: { title: "Bronze Consultation (15 Mins)", price: 399 },
    silver: { title: "Silver Consultation (30 Mins)", price: 599 },
    gold: { title: "Gold Deep Analysis (60 Mins)", price: 799 },
    marriage: { title: "Marriage Matching", price: 499 },
    muhurtham: { title: "Muhurtham & Auspicious Timing", price: 499 }
  });

  // Allocation State: 'self' or 'family'
  const [bookingFor, setBookingFor] = useState<'self' | 'family'>('self');
  const [relationship, setRelationship] = useState<string>('Mother');
  const [customRelationship, setCustomRelationship] = useState<string>('');
  const [useAccountMobile, setUseAccountMobile] = useState<boolean>(true);
  const [saveToFamilyList, setSaveToFamilyList] = useState<boolean>(true);
  const [savedFamilyMembers, setSavedFamilyMembers] = useState<SavedFamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Form Fields State
  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [userName, setUserName] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');

  // Validation Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  // Helper to parse stored "HH:MM AM" into "HH:MM" (24h) for input type="time"
  const parseTobForInput = (raw?: string) => {
    if (!raw) return '';
    const parts = raw.split(' ');
    let time = parts[0];
    if (parts[1]) {
      const [hours, mins] = time.split(':');
      let h = parseInt(hours, 10);
      if (parts[1].toUpperCase() === 'PM' && h < 12) h += 12;
      if (parts[1].toUpperCase() === 'AM' && h === 12) h = 0;
      time = `${h.toString().padStart(2, '0')}:${mins}`;
    }
    return time;
  };

  // Load saved family members from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('astro_saved_family_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedFamilyMembers(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load saved family members:", e);
    }
  }, []);

  // Prepopulate current user details for "self"
  useEffect(() => {
    if (currentUser && bookingFor === 'self') {
      setTimeout(() => {
        setUserName(currentUser.username || '');
        setMobileNum(currentUser.mobile || '');
        setGender(currentUser.gender || '');
        setDob(currentUser.dob || '');
        setTob(parseTobForInput(currentUser.tob));
        setPob(currentUser.pob || '');
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, bookingFor]);

  // Calendar & Slot States
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Flow control states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    };
  }, []);

  // Fetch dynamic prices
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        const updated: Record<string, { title: string; price: number }> = {};
        Object.keys(data).forEach(key => {
          const numPrice = parseInt(data[key].price.replace(/[^\d]/g, ''), 10) || 0;
          updated[key] = {
            title: data[key].title,
            price: numPrice
          };
        });
        setPlansData(prev => ({ ...prev, ...updated }));
      })
      .catch(err => console.error("Failed to load dynamic pricing for booking:", err));
  }, []);

  const activePlanInfo = plansData[selectedPlan] || plansData.silver;

  // Sync plan if param changes
  useEffect(() => {
    if (planParam && plansData[planParam]) {
      setTimeout(() => setSelectedPlan(planParam), 0);
    }
  }, [planParam, plansData]);

  // Helper for clearing error on change
  const clearFieldError = (fieldKey: string) => {
    if (errors[fieldKey]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
    }
  };

  // Switching between "Myself" and "Family Member / Friend"
  const handleToggleBookingFor = (target: 'self' | 'family') => {
    setBookingFor(target);
    setErrors({});
    if (target === 'self') {
      setSelectedMemberId(null);
      if (currentUser) {
        setUserName(currentUser.username || '');
        setMobileNum(currentUser.mobile || '');
        setGender(currentUser.gender || '');
        setDob(currentUser.dob || '');
        setTob(parseTobForInput(currentUser.tob));
        setPob(currentUser.pob || '');
      }
    } else {
      // Family mode
      if (savedFamilyMembers.length > 0 && !selectedMemberId) {
        setUserName('');
        setMobileNum(currentUser?.mobile || '');
        setGender('');
        setDob('');
        setTob('');
        setPob('');
        setRelationship('Mother');
      } else if (!selectedMemberId) {
        setUserName('');
        setMobileNum(currentUser?.mobile || '');
        setGender('');
        setDob('');
        setTob('');
        setPob('');
        setRelationship('Mother');
      }
    }
  };

  // Selecting a saved family member profile
  const handleSelectSavedMember = (member: SavedFamilyMember) => {
    setSelectedMemberId(member.id);
    setUserName(member.name);
    setRelationship(member.relationship);
    setMobileNum(member.mobile || currentUser?.mobile || '');
    setGender(member.gender);
    setDob(member.dob);
    setTob(parseTobForInput(member.tob));
    setPob(member.pob);
    setErrors({});
  };

  // Start fresh member form
  const handleAddNewMember = () => {
    setSelectedMemberId(null);
    setUserName('');
    setRelationship('Mother');
    setCustomRelationship('');
    setMobileNum(useAccountMobile ? (currentUser?.mobile || '') : '');
    setGender('');
    setDob('');
    setTob('');
    setPob('');
    setErrors({});
  };

  // Delete saved member profile
  const handleDeleteSavedMember = (memberId: string) => {
    const updated = savedFamilyMembers.filter(m => m.id !== memberId);
    setSavedFamilyMembers(updated);
    try {
      localStorage.setItem('astro_saved_family_members', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update saved family members in localStorage:", e);
    }
    if (selectedMemberId === memberId) {
      handleAddNewMember();
    }
  };

  // Focus and scroll smoothly to first invalid field
  const focusField = (fieldId?: string) => {
    if (!fieldId) return;
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 150);
  };

  // Effective relationship string
  const getEffectiveRelationship = () => {
    if (bookingFor === 'self') return 'Self';
    if (relationship === 'Other') return customRelationship.trim() || 'Other Relative';
    return relationship;
  };

  // Comprehensive single-step validation
  const validateFullForm = (): boolean => {
    setSubmissionAttempted(true);
    const newErrors: Record<string, string> = {};
    let firstFieldId: string | undefined;

    // 1. Member Profile Validation
    if (!userName.trim()) {
      newErrors.userName = bookingFor === 'family' 
        ? tText('Please enter family member/friend name', 'குடும்ப உறுப்பினர் அல்லது நண்பரின் பெயரை உள்ளிடவும்') 
        : tText('Please enter your name', 'உங்கள் பெயரை உள்ளிடவும்');
      if (!firstFieldId) firstFieldId = 'input-userName';
    }
    if (!mobileNum.trim()) {
      newErrors.mobileNum = tText('Please enter mobile number for consultation', 'ஆலோசனைக்கான தொலைபேசி எண்ணை உள்ளிடவும்');
      if (!firstFieldId) firstFieldId = 'input-mobileNum';
    } else if (mobileNum.replace(/\D/g, '').length < 10) {
      newErrors.mobileNum = tText('Please enter a valid 10-digit mobile number', 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்');
      if (!firstFieldId) firstFieldId = 'input-mobileNum';
    }
    if (!gender) {
      newErrors.gender = tText('Please select gender', 'பாலினத்தைத் தேர்ந்தெடுக்கவும்');
      if (!firstFieldId) firstFieldId = 'input-gender';
    }
    if (bookingFor === 'family') {
      if (!relationship) {
        newErrors.relationship = tText('Please select relationship', 'உறவுமுறையைத் தேர்ந்தெடுக்கவும்');
        if (!firstFieldId) firstFieldId = 'input-relationship';
      } else if (relationship === 'Other' && !customRelationship.trim()) {
        newErrors.customRelationship = tText('Please specify relationship', 'உறவுமுறையைக் குறிப்பிடவும்');
        if (!firstFieldId) firstFieldId = 'input-customRelationship';
      }
    }

    // 2. Birth Coordinates Validation
    if (!dob) {
      newErrors.dob = tText('Please select date of birth', 'பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்');
      if (!firstFieldId) firstFieldId = 'input-dob';
    }
    if (!tob) {
      newErrors.tob = tText('Please enter time of birth', 'பிறந்த நேரத்தை உள்ளிடவும்');
      if (!firstFieldId) firstFieldId = 'input-tob';
    }
    if (!pob.trim()) {
      newErrors.pob = tText('Please enter place of birth (City, State/Country)', 'பிறந்த ஊரை உள்ளிடவும் (ஊர், மாநிலம்)');
      if (!firstFieldId) firstFieldId = 'input-pob';
    }

    // 3. Schedule Slot Validation
    if (!selectedDate) {
      newErrors.selectedDate = tText('Please select an appointment date from the calendar', 'நாட்காட்டியில் இருந்து ஒரு தேதியைத் தேர்ந்தெடுக்கவும்');
      if (!firstFieldId) firstFieldId = 'calendar-section';
    }
    if (!selectedSlot) {
      newErrors.selectedSlot = tText('Please select a consultation time slot', 'ஆலோசனை நேரத்தைத் தேர்ந்தெடுக்கவும்');
      if (!firstFieldId) firstFieldId = 'slot-section';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      focusField(firstFieldId);
      return false;
    }

    return true;
  };

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const timeSlots = [
    { time: "09:30 AM", label: tText("Morning Slot", "காலை நேரம்") },
    { time: "11:00 AM", label: tText("Morning Slot", "காலை நேரம்") },
    { time: "02:30 PM", label: tText("Afternoon Slot", "மதிய நேரம்") },
    { time: "04:30 PM", label: tText("Evening Slot", "மாலை நேரம்") },
    { time: "06:30 PM", label: tText("Evening Slot", "மாலை நேரம்") }
  ];

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  // Handle Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateFullForm();
    if (!isValid) return;

    setIsProcessing(true);
    const newBookingId = "KK" + Math.floor(100000 + Math.random() * 900000);
    const effectiveRel = getEffectiveRelationship();

    // Auto-save member if requested
    if (bookingFor === 'family' && saveToFamilyList && userName.trim()) {
      try {
        const newMember: SavedFamilyMember = {
          id: selectedMemberId || `fam_${Date.now()}`,
          name: userName.trim(),
          relationship: effectiveRel,
          mobile: mobileNum.trim(),
          gender,
          dob,
          tob,
          pob: pob.trim()
        };
        const existingIdx = savedFamilyMembers.findIndex(m => m.id === newMember.id || m.name.toLowerCase() === newMember.name.toLowerCase());
        let updatedList: SavedFamilyMember[];
        if (existingIdx >= 0) {
          updatedList = [...savedFamilyMembers];
          updatedList[existingIdx] = newMember;
        } else {
          updatedList = [...savedFamilyMembers, newMember];
        }
        setSavedFamilyMembers(updatedList);
        localStorage.setItem('astro_saved_family_members', JSON.stringify(updatedList));
      } catch (err) {
        console.error("Failed to save member to localStorage:", err);
      }
    }
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: newBookingId,
          seekerName: userName.trim(),
          mobileNum: mobileNum.trim(),
          gender,
          dob,
          tob,
          pob: pob.trim(),
          planTitle: activePlanInfo.title,
          planPrice: activePlanInfo.price,
          selectedDate: `${selectedDate} ${monthName} ${currentDate.getFullYear()}`,
          selectedSlot,
          bookingFor,
          relationship: effectiveRel,
          bookedBy: currentUser?.username || userName.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(newBookingId);
        setIsBooked(true);

        const formattedDate = `${selectedDate} ${monthName} ${currentDate.getFullYear()}`;
        const consultationForText = bookingFor === 'family' 
          ? `${userName} (${effectiveRel})`
          : `${userName} (Self)`;

        const bookedByText = (bookingFor === 'family' && currentUser?.username)
          ? `\n*Booked By:* ${currentUser.username} (${currentUser.mobile || 'Account Holder'})`
          : '';

        const textMsg = `Namaste Kkarthikeya Astrological Centre. I have successfully scheduled a consultation appointment.\n\n*Booking ID:* ${newBookingId}\n*Service:* ${activePlanInfo.title}\n*Consultation For:* ${consultationForText}${bookedByText}\n*Contact Mobile:* ${mobileNum}\n*Gender:* ${gender || 'N/A'}\n*Date:* ${formattedDate}\n*Time:* ${selectedSlot}\n*Birth Details:* ${dob} @ ${tob}, ${pob}\n*Status:* Confirmed (Pay on Consultation)\n\nPlease confirm my spiritual consultation details.`;
        const phoneNumber = "917845369302";
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMsg)}`;

        // Start 2-second countdown before automatically redirecting to WhatsApp
        setCountdown(2);
        let secondsLeft = 2;
        redirectTimerRef.current = setInterval(() => {
          secondsLeft -= 1;
          setCountdown(secondsLeft);
          if (secondsLeft <= 0) {
            if (redirectTimerRef.current) {
              clearInterval(redirectTimerRef.current);
              redirectTimerRef.current = null;
            }
            window.location.href = waUrl;
          }
        }, 1000);
      } else {
        alert(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Network error. Failed to schedule appointment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppConfirmation = (overrideBookingId?: string) => {
    if (redirectTimerRef.current) {
      clearInterval(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    const currentId = overrideBookingId || bookingId;
    const formattedDate = `${selectedDate} ${monthName} ${currentDate.getFullYear()}`;
    const effectiveRel = getEffectiveRelationship();
    const consultationForText = bookingFor === 'family' 
      ? `${userName} (${effectiveRel})`
      : `${userName} (Self)`;

    const bookedByText = (bookingFor === 'family' && currentUser?.username)
      ? `\n*Booked By:* ${currentUser.username} (${currentUser.mobile || 'Account Holder'})`
      : '';

    const textMsg = `Namaste Kkarthikeya Astrological Centre. I have successfully scheduled a consultation appointment.\n\n*Booking ID:* ${currentId}\n*Service:* ${activePlanInfo.title}\n*Consultation For:* ${consultationForText}${bookedByText}\n*Contact Mobile:* ${mobileNum}\n*Gender:* ${gender || 'N/A'}\n*Date:* ${formattedDate}\n*Time:* ${selectedSlot}\n*Birth Details:* ${dob} @ ${tob}, ${pob}\n*Status:* Confirmed (Pay on Consultation)\n\nPlease confirm my spiritual consultation details.`;
    
    const phoneNumber = "917845369302";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMsg)}`;
    window.location.href = waUrl;
  };

  const hasAnyError = Object.keys(errors).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
      
      <AnimatePresence mode="wait">
        {!isBooked ? (
          /* 📅 SINGLE-STEP INSTANT BOOKING FORM */
          <motion.form 
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmitBooking}
            noValidate
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
          >
            {/* Top Error Alert Banner when unfilled fields exist */}
            {submissionAttempted && hasAnyError && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 backdrop-blur-md flex items-start gap-3 shadow-glow"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-300 font-serif">
                    {tText("Required Details Incomplete", "முழுமையற்ற விவரங்கள்")}
                  </h4>
                  <p className="text-[11px] text-red-200/90 leading-relaxed">
                    {tText(
                      "Please provide the missing fields highlighted in red below to book your consultation appointment.",
                      "உங்கள் ஆலோசனையை முன்பதிவு செய்ய சிவப்பு நிறத்தில் குறிக்கப்பட்ட விடுபட்ட விவரங்களை பூர்த்தி செய்யவும்."
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* SECTION 1: CONSULTATION PLAN & PERSON DETAILS */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 sm:p-8 shadow-antigravity space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> {tText("1. Select Plan & Person Details", "1. ஜோதிடத் திட்டம் & நபர் விவரங்கள்")}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 uppercase tracking-widest">
                  {tText("Choose your consultation service and specify who this reading is for.", "உங்கள் ஆலோசனைத் திட்டத்தைத் தேர்ந்தெடுத்து யாருக்கு ஜாதகம் கணிக்க வேண்டும் என்பதைக் குறிப்பிடவும்.")}
                </p>
              </div>

              {/* Plan Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-amber-300">
                  {tText("Select Consultation Plan", "தேர்ந்தெடுக்கப்பட்ட ஜோதிடத் திட்டம்")}
                </label>
                <select 
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-serif cursor-pointer"
                >
                  <option value="quick">{tText("Quick Chat Consultation", "உடனடி அரட்டை ஆலோசனை")} — ₹{plansData.quick.price}</option>
                  <option value="bronze">{tText("Bronze Consultation (15 Mins)", "வெண்கல ஆலோசனை (15 நிமிடங்கள்)")} — ₹{plansData.bronze.price}</option>
                  <option value="silver">{tText("Silver Consultation (30 Mins)", "வெள்ளி ஆலோசனை (30 நிமிடங்கள்)")} — ₹{plansData.silver.price}</option>
                  <option value="gold">{tText("Gold Deep Analysis (60 Mins)", "தங்க ஆழ்ந்த ஆய்வு (60 நிமிடங்கள்)")} — ₹{plansData.gold.price}</option>
                  <option value="marriage">{tText("Marriage Matching", "திருமணப் பொருத்தம்")} — ₹{plansData.marriage.price}</option>
                  <option value="muhurtham">{tText("Auspicious Timing (Muhurtham)", "சுப முகூர்த்த நேரம்")} — ₹{plansData.muhurtham.price}</option>
                </select>
              </div>

              {/* WHO IS THIS CONSULTATION FOR? (Myself vs Family & Friends) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-300">
                    {tText("Who is this consultation for?", "யாருக்கு இந்த ஆலோசனை?")}
                  </label>
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold font-serif">
                    {bookingFor === 'self' 
                      ? tText('👤 Personal Reading', '👤 சொந்த ஜாதக கணிப்பு') 
                      : tText('👥 Reading for Loved One', '👥 குடும்பத்தினர்/நண்பருக்கான கணிப்பு')}
                  </span>
                </div>

                {/* Toggle Buttons */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/70 border border-white/10 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleToggleBookingFor('self')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingFor === 'self'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-glow font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{tText("For Myself", "எனக்கு (சொந்த விவரம்)")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBookingFor('family')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingFor === 'family'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{tText("Family & Friends", "குடும்பத்தினர் & நண்பர்கள்")}</span>
                  </button>
                </div>

                {/* Family Mode Guidance & Saved Profiles */}
                {bookingFor === 'family' ? (
                  <div className="space-y-4 pt-1">
                    <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 flex items-start gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white text-[11px]">
                          {tText("Booking Consultation for Family Member or Friend", "குடும்ப உறுப்பினர் அல்லது நண்பருக்கான ஆலோசனை")}
                        </p>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {tText(
                            "Enter their name, relationship, and birth details. The horoscope will be calculated for them, while booking updates will be sent to your account.",
                            "அவர்களது பெயர், உறவுமுறை மற்றும் பிறப்பு விவரங்களை உள்ளிடவும். அவர்களுக்கான ஜாதகம் கணிக்கப்படும், தகவல் உங்கள் கணக்கிற்கு வரும்."
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Saved family member quick selector */}
                    {savedFamilyMembers.length > 0 && (
                      <div className="space-y-2 p-3 bg-white/2 border border-white/5 rounded-2xl">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black text-slate-400">
                          <span>{tText("Saved Family & Friends:", "சேமிக்கப்பட்ட குடும்பத்தினர் & நண்பர்கள்:")}</span>
                          <button
                            type="button"
                            onClick={handleAddNewMember}
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" /> {tText("+ New Person", "+ புதிய நபர்")}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {savedFamilyMembers.map((member) => {
                            const isSelected = selectedMemberId === member.id;
                            return (
                              <div
                                key={member.id}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                                  isSelected
                                    ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-glow'
                                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectSavedMember(member)}
                                  className="flex items-center gap-1.5 font-medium cursor-pointer"
                                >
                                  <span>{member.name}</span>
                                  <span className="text-[10px] text-indigo-300 font-serif">({member.relationship})</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSavedMember(member.id);
                                  }}
                                  title={tText("Remove profile", "நீக்குக")}
                                  className="text-slate-500 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Relationship Selection */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 flex items-center justify-between">
                          <span>{tText("Relationship to You", "உங்களுடனான உறவு")} <span className="text-red-400">*</span></span>
                          {errors.relationship && <span className="text-red-400 lowercase font-normal">required</span>}
                        </label>
                        <select
                          id="input-relationship"
                          value={relationship}
                          onChange={(e) => {
                            setRelationship(e.target.value);
                            clearFieldError('relationship');
                          }}
                          className={`w-full bg-slate-900 border rounded-2xl py-3 px-4 text-xs text-white outline-none transition-all cursor-pointer ${
                            errors.relationship 
                              ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                              : 'border-white/10 focus:border-indigo-500/50'
                          }`}
                        >
                          <option value="Mother">{tText("Mother (Amma)", "தாய் (அம்மா)")}</option>
                          <option value="Father">{tText("Father (Appa)", "தந்தை (அப்பா)")}</option>
                          <option value="Spouse">{tText("Spouse / Partner", "கணவர் / மனைவி")}</option>
                          <option value="Son">{tText("Son", "மகன்")}</option>
                          <option value="Daughter">{tText("Daughter", "மகள்")}</option>
                          <option value="Brother">{tText("Brother", "சகோதரன்")}</option>
                          <option value="Sister">{tText("Sister", "சகோதரி")}</option>
                          <option value="Friend">{tText("Friend", "நண்பர்")}</option>
                          <option value="Relative">{tText("Relative", "உறவினர்")}</option>
                          <option value="Other">{tText("Other", "மற்றவை")}</option>
                        </select>
                        {errors.relationship && (
                          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.relationship}
                          </p>
                        )}
                      </div>

                      {relationship === 'Other' && (
                        <div className="space-y-1.5 animate-fadeIn">
                          <label className="text-[10px] uppercase tracking-widest font-black text-slate-300">
                            {tText("Specify Relationship", "உறவுமுறையைக் குறிப்பிடவும்")} <span className="text-red-400">*</span>
                          </label>
                          <input 
                            id="input-customRelationship"
                            type="text"
                            placeholder={tText("Eg: Cousin, Mentor, Colleague", "உதா: உறவினர், நண்பர், சக ஊழியர்")}
                            value={customRelationship}
                            onChange={(e) => {
                              setCustomRelationship(e.target.value);
                              clearFieldError('customRelationship');
                            }}
                            className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all ${
                              errors.customRelationship 
                                ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                                : 'border-white/10 focus:border-indigo-500/50'
                            }`}
                          />
                          {errors.customRelationship && (
                            <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" /> {errors.customRelationship}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {tText("Consultation booked directly for account holder: ", "கணக்கு உரிமையாளருக்கு நேரடியாக முன்பதிவு செய்யப்படுகிறது: ")}
                      <strong className="text-white">{currentUser?.username || 'You'}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Name, Mobile Number, Gender Grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                
                {/* Member / Person Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>
                      {bookingFor === 'family' 
                        ? tText("Person's Name", "நபரின் பெயர்") 
                        : tText("Your Name", "உங்கள் பெயர்")} <span className="text-red-400">*</span>
                    </span>
                    {errors.userName && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.userName ? 'text-red-400' : 'text-slate-500'}`} />
                    <input 
                      id="input-userName"
                      type="text" 
                      placeholder={bookingFor === 'family' 
                        ? tText("Eg: Radha Devi", "உதா: ராதா தேவி") 
                        : tText("Eg: Ramesh Kumar", "உதா: ரமேஷ் குமார்")} 
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        clearFieldError('userName');
                      }}
                      className={`w-full bg-white/5 border rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all shadow-inner ${
                        errors.userName 
                          ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-indigo-500/50'
                      }`}
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.userName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>{tText("Contact Number", "தொடர்பு எண்")} <span className="text-red-400">*</span></span>
                    {errors.mobileNum && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <div className="relative">
                    <PhoneCall className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.mobileNum ? 'text-red-400' : 'text-slate-500'}`} />
                    <input 
                      id="input-mobileNum"
                      type="tel" 
                      placeholder="Eg: +91 78453 69302" 
                      value={mobileNum}
                      onChange={(e) => {
                        setMobileNum(e.target.value);
                        clearFieldError('mobileNum');
                      }}
                      className={`w-full bg-white/5 border rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all shadow-inner ${
                        errors.mobileNum 
                          ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-indigo-500/50'
                      }`}
                    />
                  </div>
                  {errors.mobileNum && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.mobileNum}
                    </p>
                  )}
                  {bookingFor === 'family' && currentUser?.mobile && (
                    <label className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useAccountMobile}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setUseAccountMobile(checked);
                          if (checked && currentUser?.mobile) {
                            setMobileNum(currentUser.mobile);
                            clearFieldError('mobileNum');
                          }
                        }}
                        className="rounded accent-indigo-500"
                      />
                      <span>{tText(`Use my account mobile (${currentUser.mobile})`, `எனது கணக்கு எண்ணைப் பயன்படுத்தவும் (${currentUser.mobile})`)}</span>
                    </label>
                  )}
                </div>

                {/* Gender Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>{tText("Gender", "பாலினம்")} <span className="text-red-400">*</span></span>
                    {errors.gender && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.gender ? 'text-red-400' : 'text-slate-500'}`} />
                    <select 
                      id="input-gender"
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        clearFieldError('gender');
                      }}
                      className={`w-full bg-slate-900 border rounded-2xl py-3 pl-10 pr-4 text-xs text-white outline-none transition-all shadow-inner cursor-pointer ${
                        errors.gender 
                          ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-indigo-500/50'
                      }`}
                    >
                      <option value="">{tText("Select Gender", "பாலினத்தைத் தேர்ந்தெடுக்கவும்")}</option>
                      <option value="Male">{tText("Male", "ஆண்")}</option>
                      <option value="Female">{tText("Female", "பெண்")}</option>
                      <option value="Other">{tText("Other", "மற்றவை")}</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.gender}
                    </p>
                  )}
                </div>

              </div>

              {/* Save to family list option */}
              {bookingFor === 'family' && (
                <div className="p-3 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="save-member"
                    checked={saveToFamilyList}
                    onChange={(e) => setSaveToFamilyList(e.target.checked)}
                    className="rounded accent-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="save-member" className="text-xs text-slate-300 font-medium cursor-pointer">
                    {tText("Save this person to My Family & Friends for future consultations", "எதிர்கால ஆலோசனைக்காக இந்த நபரை குடும்பத்தினர் பட்டியலில் சேமிக்கவும்")}
                  </label>
                </div>
              )}

            </div>

            {/* SECTION 2: BIRTH DETAILS */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 sm:p-8 shadow-antigravity space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" /> {tText("2. Birth Details (Date, Time & Place)", "2. பிறப்பு விவரங்கள் (தேதி, நேரம் & இடம்)")}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 uppercase tracking-widest">
                  {tText(
                    "Enter accurate birth details for precise horoscope calculations and predictions.",
                    "துல்லியமான ஜாதகக் கணிப்பிற்கு பிறப்பு விவரங்களை உள்ளிடவும்."
                  )}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                
                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>{tText("Date of Birth", "பிறந்த தேதி")} <span className="text-red-400">*</span></span>
                    {errors.dob && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <input 
                    id="input-dob"
                    type="date" 
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      clearFieldError('dob');
                    }}
                    className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none transition-all [color-scheme:dark] ${
                      errors.dob 
                        ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                        : 'border-white/10 focus:border-indigo-500/50'
                    }`}
                  />
                  {errors.dob && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.dob}
                    </p>
                  )}
                </div>

                {/* Time of Birth */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>{tText("Time of Birth", "பிறந்த நேரம்")} <span className="text-red-400">*</span></span>
                    {errors.tob && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <input 
                    id="input-tob"
                    type="time" 
                    value={tob}
                    onChange={(e) => {
                      setTob(e.target.value);
                      clearFieldError('tob');
                    }}
                    className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none transition-all [color-scheme:dark] ${
                      errors.tob 
                        ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                        : 'border-white/10 focus:border-indigo-500/50'
                    }`}
                  />
                  {errors.tob && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.tob}
                    </p>
                  )}
                </div>

                {/* Place of Birth */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center justify-between">
                    <span>{tText("Place of Birth", "பிறந்த இடம்")} <span className="text-red-400">*</span></span>
                    {errors.pob && <span className="text-red-400 font-bold lowercase text-[9px]">required</span>}
                  </label>
                  <input 
                    id="input-pob"
                    type="text" 
                    placeholder={tText("City, State / Country", "ஊர் / நகரம், மாநிலம், நாடு")}
                    value={pob}
                    onChange={(e) => {
                      setPob(e.target.value);
                      clearFieldError('pob');
                    }}
                    className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all ${
                      errors.pob 
                        ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                        : 'border-white/10 focus:border-indigo-500/50'
                    }`}
                  />
                  {errors.pob && (
                    <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      {errors.pob}
                    </p>
                  )}
                </div>

              </div>

              {/* Privacy assurance banner */}
              <div className="flex items-center gap-2 p-3.5 bg-white/2 border border-white/5 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{tText("All birth details and personal information are strictly confidential & encrypted.", "பிறப்பு விவரங்கள் அனைத்தும் முற்றிலும் பாதுகாப்பாகவும் ரகசியமாகவும் வைக்கப்படும்.")}</span>
              </div>

            </div>

            {/* SECTION 3: SCHEDULE APPOINTMENT (CALENDAR & TIME SLOT) */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 sm:p-8 shadow-antigravity space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" /> {tText("3. Choose Appointment Date & Time", "3. ஆலோசனை தேதி & நேரத்தை தேர்ந்தெடுக்கவும்")}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 uppercase tracking-widest">
                  {tText("Select your preferred appointment date and convenient time slot.", "உங்களுக்கு வசதியான தேதி மற்றும் நேரத்தை தேர்ந்தெடுக்கவும்.")}
                </p>
              </div>

              {/* Calendar Card */}
              <div 
                id="calendar-section"
                className={`rounded-[2rem] border bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4 transition-all ${
                  errors.selectedDate 
                    ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase flex items-center gap-2">
                    <CalIcon className="w-4 h-4 text-amber-400" />
                    {tText("Select Date", "தேதியைத் தேர்ந்தெடுக்கவும்")} <span className="text-red-400">*</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:text-white text-slate-500 cursor-pointer">◀</button>
                    <span className="text-amber-300 font-bold font-serif">{monthName} {currentDate.getFullYear()}</span>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:text-white text-slate-500 cursor-pointer">▶</button>
                  </div>
                </div>

                {errors.selectedDate && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {errors.selectedDate}
                  </p>
                )}

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                    <span key={idx} className="text-slate-500 py-1 uppercase">{d}</span>
                  ))}
                  
                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <span key={`empty-${idx}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = selectedDate === dayNum;
                    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = dayDate < today;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        type="button"
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDate(dayNum);
                            clearFieldError('selectedDate');
                          }
                        }}
                        disabled={isPast}
                        className={`py-2 rounded-xl border text-[10px] font-mono transition-all cursor-pointer ${
                          isPast 
                            ? 'opacity-30 cursor-not-allowed border-transparent bg-white/2'
                            : isSelected
                              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-glow'
                              : 'border-transparent bg-white/2 hover:bg-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Picker */}
              <div 
                id="slot-section"
                className={`rounded-[2rem] border bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4 transition-all ${
                  errors.selectedSlot 
                    ? 'border-red-500 bg-red-950/20 ring-1 ring-red-500/50' 
                    : 'border-white/10'
                }`}
              >
                <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5 flex items-center justify-between">
                  <span>{tText("Select Consultation Time Slot", "ஆலோசனை நேரத்தைத் தேர்ந்தெடுக்கவும்")} <span className="text-red-400">*</span></span>
                  {selectedSlot && <span className="text-indigo-400 text-[10px] font-mono font-bold">{selectedSlot}</span>}
                </h3>

                {errors.selectedSlot && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {errors.selectedSlot}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot.time);
                          clearFieldError('selectedSlot');
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-1 ring-indigo-500/50 shadow-glow'
                            : 'border-white/5 bg-white/2 hover:border-white/15 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-bold font-mono">{slot.time}</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest font-black py-0.5 px-2 rounded-full text-indigo-400 bg-indigo-500/10">
                          {slot.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* SECTION 4: BOOKING SUMMARY BOX & SUBMIT BUTTON */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-6 shadow-antigravity text-xs text-slate-400 space-y-4">
              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-slate-500">
                    {tText("Plan Selection", "தேர்ந்தெடுக்கப்பட்ட திட்டம்")}
                  </span>
                  <strong className="text-white font-bold block">{activePlanInfo.title}</strong>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-slate-500">
                    {tText("Consultation For", "யாருக்கான ஆலோசனை")}
                  </span>
                  <strong className="text-amber-300 font-bold block">
                    {userName ? (
                      <>
                        {userName} {bookingFor === 'family' && `(${getEffectiveRelationship()})`}
                      </>
                    ) : (
                      <span className="text-slate-500 italic">{tText("Not Entered Yet", "இன்னும் உள்ளிடவில்லை")}</span>
                    )}
                  </strong>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-slate-500">
                    {tText("Consultation Fee", "கட்டணம்")}
                  </span>
                  <strong className="text-amber-400 font-serif font-black text-sm block">₹{activePlanInfo.price}</strong>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0">
                  <span className="block text-[9px] uppercase tracking-widest font-bold text-slate-500">
                    {tText("Chosen Slot", "தேர்ந்தெடுக்கப்பட்ட நேரம்")}
                  </span>
                  <strong className="text-indigo-300 font-medium block">
                    {selectedDate ? `${selectedDate} ${monthName}` : tText("Date Not Picked", "தேதி தேர்ந்தெடுக்கப்படவில்லை")} <br/> 
                    {selectedSlot || tText("Time Slot Not Selected", "நேரம் தேர்ந்தெடுக்கப்படவில்லை")}
                  </strong>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 sm:py-5 rounded-[2rem] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-black uppercase tracking-widest shadow-glow active:scale-95 transition-all border border-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Orbit className="w-5 h-5 animate-spin" />
                    {tText("Confirming Appointment...", "முன்பதிவு செய்யப்படுகிறது...")}
                  </>
                ) : (
                  <>
                    {t.booking.confirmBooking}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </motion.form>
        ) : (
          /* 🏆 STEP 2: CONFIRMATION & RECEIPT SCREEN */
          <motion.div
            key="booking-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto rounded-[2.5rem] border border-white/15 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-10 shadow-antigravity text-center space-y-6"
            style={{ boxShadow: '0 25px 70px rgba(16,185,129,0.15)' }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-pulse shadow-glow">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black font-serif text-white uppercase tracking-widest">
                {tText("Booking Confirmed!", "முன்பதிவு உறுதியானது!")}
              </h2>
              <span className="text-[10px] text-emerald-400 tracking-widest font-black uppercase bg-emerald-500/10 border border-emerald-500/20 py-1 px-4 rounded-full inline-block">
                {tText("Appointment Confirmed", "ஜோதிட ஆலோசனை நேரம் ஒதுக்கப்பட்டது")}
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
              {tText(
                `Namaste ${currentUser?.username || userName}. Your consultation slot for `,
                `வணக்கம் ${currentUser?.username || userName}. `
              )}
              <strong className="text-white">{userName} {bookingFor === 'family' ? `(${getEffectiveRelationship()})` : ''}</strong>
              {tText(
                " has been successfully confirmed. Astrologer Kkarthikeya has reserved this time for your personalized consultation.",
                "-க்கான சுப ஆலோசனை நேரம் வெற்றிகரமாக ஒதுக்கப்பட்டது. ஜோதிடர் கார்த்திகேயா உங்களுக்காக இந்த நேரத்தை ஒதுக்கியுள்ளார்."
              )}
            </p>

            {/* Receipt details */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3 text-left text-xs text-slate-300 font-medium">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Booking Code", "முன்பதிவு எண்")}
                </span>
                <span className="font-mono text-indigo-300 font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Consultation For", "யாருக்கான ஆலோசனை")}
                </span>
                <span className="text-white font-bold">
                  {userName} {bookingFor === 'family' ? `(${getEffectiveRelationship()})` : '(Self)'}
                </span>
              </div>
              {bookingFor === 'family' && currentUser?.username && (
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                    {tText("Booked By Account", "முன்பதிவு செய்தவர்")}
                  </span>
                  <span className="text-slate-300">{currentUser.username}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Gender", "பாலினம்")}
                </span>
                <span className="text-slate-300">{gender || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Consultation Plan", "ஆலோசனைத் திட்டம்")}
                </span>
                <span className="text-white font-bold">{activePlanInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Auspicious Date", "ஆலோசனை தேதி")}
                </span>
                <span className="text-white font-bold">{selectedDate} {monthName} {currentDate.getFullYear()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Consultation Hour", "ஆலோசனை நேரம்")}
                </span>
                <span className="text-white font-bold">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">
                  {tText("Booking Status", "முன்பதிவு நிலை")}
                </span>
                <span className="text-amber-400 font-bold font-serif">
                  {tText("Confirmed (Pay on Consultation)", "உறுதியானது (ஆலோசனையின் போது கட்டணம்)")}
                </span>
              </div>
            </div>

            {countdown !== null && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {countdown > 0 
                    ? tText(`Redirecting to WhatsApp in ${countdown}s...`, `${countdown} வினாடிகளில் வாட்ஸ்அப்பிற்கு செல்கிறது...`)
                    : tText(`Opening WhatsApp now...`, `வாட்ஸ்அப் இப்போது திறக்கப்படுகிறது...`)}
                </div>
                <p className="text-[10px] text-slate-300">
                  {tText(
                    "Please tap Send in WhatsApp to deliver your booking directly to Astrologer Kkarthikeya.",
                    "ஜோதிடர் கார்த்திகேயாவுக்கு விவரங்களை அனுப்ப வாட்ஸ்அப்பில் Send பொத்தானை அழுத்தவும்."
                  )}
                </p>
              </motion.div>
            )}

            <div className="pt-2 flex flex-col gap-2.5">
              <button 
                onClick={() => handleWhatsAppConfirmation()}
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black tracking-widest uppercase shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {countdown !== null && countdown > 0 
                  ? tText("Open WhatsApp Immediately", "வாட்ஸ்அப்பை உடனே திறக்கவும்") 
                  : tText("Send Details to WhatsApp", "விவரங்களை வாட்ஸ்அப்பில் அனுப்பவும்")}
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                {tText("Return to Centre", "முகப்புக்கு திரும்பவும்")}
              </button>
            </div>

            <div className="text-[8px] text-slate-500 tracking-wider uppercase">
              {tText(
                "An automated confirmation email and SMS notification have been sent with consultation details.",
                "தானியங்கி உறுதிப்படுத்தல் மற்றும் ஆலோசனை விவரங்கள் பதிவு செய்யப்பட்டுள்ளது."
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// Main page component with Suspense fallback for SearchParams
export default function BookingPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <Orbit className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </AuthGuard>
  );
}
