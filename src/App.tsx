import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

const INVITATION = {
  couple: {
    bride: "නිශාදි",
    groom: "දහම්",
    brideFull: "නිශාදි",
    groomFull: "දහම්",
  },
  date: {
    displayNumeric: "25 . 08 . 2026",
    displayLong: "අඟහරුවාදා, 25 අගෝස්තු 2026",
    countdownTarget: "2026-08-25T08:30:00+05:30",
  },
  time: {
    start: "පෙ.ව. 8.30",
    poruwa: "පෙ.ව. 9.00",
    lunch: "ප.ව. 12.30",
    goingAway: "ප.ව. 4.30",
  },
  venue: {
    name: "The Golden Ridge Hotel",
    city: "නුවරඑළිය",
    mapQuery: "The Golden Ridge Hotel Nuwara Eliya",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=The+Golden+Ridge+Hotel+Nuwara+Eliya",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/508893674.jpg?k=784f7ed3085b40df6b700934c4ff199e219b88df8c5c789b6e9be1319eba6d1b&o=",
  },
  rsvpContacts: ["නිශාදි", "දහම්"],
} as const;

const backgroundMusic = "/Sandarenu Athi Reeka (සඳ රණ ඇත රක)  Cover Song by Nisal Sathsara ft Sachini Ranawaka.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycby0MIr0BBQnwPVhIqLk-nOvRaJ71vY8MABRm3wLiE5vnlcD6QpbGasYHEWDpSsLZqRM/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("pexels-jonathanborba-13779997.jpg"),
  preImagePath("pexels-jonathanborba-13780000.jpg"),
  preImagePath("pexels-jonathanborba-13780002.jpg"),
  preImagePath("pexels-jonathanborba-13780006.jpg"),
  preImagePath("pexels-nayla-bernardes-1673442920-31838685.jpg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#e87a9e", "#f2a7be", "#8c244c", "#c44576", "#fce1eb"];
    const petalCount = isMobile ? 12 : 24; // slightly increased for elegance

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 12, // larger for 3D effect
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div 
      className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}
      style={{ perspective: "1000px" }} // Perspective for 3D effect
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_5px_8px_rgba(0,0,0,0.15)]"
          style={{ 
            color: petal.color,
            transformStyle: "preserve-3d" // Ensure child retains 3D rotation
          }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotateX: petal.rotation,
            rotateY: petal.rotation / 2,
            rotateZ: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotateX: petal.rotation + (isLowPowerMode ? 360 : 720),
            rotateY: (petal.rotation / 2) + (isLowPowerMode ? 360 : 720),
            rotateZ: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size * 1.2} viewBox="0 0 30 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`grad-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="40%" stopColor={petal.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={petal.color} stopOpacity="1" />
              </linearGradient>
            </defs>
            <path 
              d="M15,5 C17,2 25,0 28,8 C30,20 20,30 15,35 C10,30 0,20 2,8 C5,0 13,2 15,5 Z" 
              fill={`url(#grad-${petal.id})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false }: { isDark?: boolean }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "දින", value: days },
    { label: "පැය", value: hours },
    { label: "මිනිත්තු", value: minutes },
    { label: "තත්පර", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] border flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#8c244c] border-white/20" : "bg-white border-pink-100/60"
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 border-[0.5px] rounded-t-full pointer-events-none ${isDark ? "border-white/30" : "border-theme-300/50"
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#8c244c]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-wider md:tracking-widest font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-stone-50 text-stone-500 border-pink-100/50"
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#e87a9e]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ProgressiveImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  // Support both /pre-optimized/ and /pre/ paths just in case
  const tinySrc = src.replace('/pre-optimized/', '/pre-tiny/').replace('/pre/', '/pre-tiny/');

  return (
    <div className={`relative ${className}`}>
      {/* Low-quality placeholder */}
      <img
        src={tinySrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? "opacity-0" : "opacity-100"} blur-md scale-110`}
      />
      {/* Full-quality image */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#1b4332] font-bold tracking-widest text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#52b788]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#c44576] via-[#8c244c] to-[#c44576] bg-clip-text text-transparent italic leading-none">
            සුන්දර මතක
          </h2>
          <p className="text-slate-700 text-sm md:text-base tracking-widest font-medium max-w-2xl mx-auto pt-2 leading-loose">
            අපගේ ආදර කතාවේ සුන්දරතම මොහොතක් ඔබ සමඟ බෙදා ගැනීමට අප සතුටින් බලා සිටිමු.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 5,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(140, 36, 76, 0.15)] border border-pink-100/30 group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <ProgressiveImage
                  src={img}
                  alt=""
                  className="w-full h-full transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute inset-4 border border-white/20 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const searchParams = new URLSearchParams(window.location.search);
  const guestPrefix = searchParams.get('prefix');
  const guestName = searchParams.get('name');

  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        dietaryNotes: "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if ((hasStarted || isOpened) && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [hasStarted, isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#ffffff] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              src="/Wedding_invitation_intro_video_202606081545.mp4"
              muted={!hasStarted}
              playsInline
              preload="auto"
              autoPlay
              loop={!hasStarted}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${!hasStarted ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                }`}
              onEnded={() => setIsOpened(true)}
              onError={() => setIsOpened(true)}
            />

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-black/40 backdrop-blur-[2px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-12"
                  >
                    <h2 className="text-4xl md:text-6xl text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-bold">
                      ශ්‍රී සුභ මංගලම්
                    </h2>
                    <p className="text-xl md:text-2xl text-[#fce1eb] tracking-widest font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                    </p>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasStarted(true);

                      if (introVideoRef.current) {
                        introVideoRef.current.muted = true;
                        introVideoRef.current.loop = false;
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }
                    }}
                    className="group relative px-12 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95 border border-white/50 bg-black/20 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-90 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fce1eb]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-bold text-white text-sm tracking-widest drop-shadow-md">
                      ආරාධනය විවෘත කරන්න
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-[#fce1eb] text-xs tracking-widest font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  >
                    ආරම්භ කිරීමට Click කරන්න
                  </motion.div>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[30vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="text-3xl md:text-7xl text-[#8c244c] mb-8 drop-shadow-md font-bold"
                  >
                    විවාහ ආරාධනයයි!
                  </motion.h2>

                  <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="text-3xl md:text-6xl text-[#8c244c] tracking-widest font-bold drop-shadow-md self-start"
                    >
                      {INVITATION.couple.bride}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="text-2xl md:text-4xl text-[#8c244c] italic drop-shadow-md my-1 font-bold"
                    >
                      &
                    </motion.span>

                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="text-3xl md:text-6xl text-[#8c244c] tracking-widest font-bold drop-shadow-md self-end"
                    >
                      {INVITATION.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-10 z-[110] px-8 py-3 bg-white/40 backdrop-blur-md text-[#8c244c] text-xs tracking-widest rounded-full border border-[#8c244c]/30 hover:bg-white/60 transition-all font-bold shadow-lg"
                >
                  ආරාධනයට පිවිසෙන්න
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-pink-100 text-[#8c244c] hover:bg-pink-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">වසා දමන්න</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-transparent min-h-[85vh] pt-20 md:pt-32">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url('/ChatGPT%20Image%20Jun%208,%202026,%2003_51_28%20PM.png')` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" aria-hidden="true" />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center">
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base md:text-lg tracking-normal font-bold text-[#c44576] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                >
                  විවාහ ආරාධනයයි!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  {guestName && (
                    <div className="mb-8 flex flex-col items-center">
                      <p className="text-3xl md:text-4xl text-[#c44576] font-bold mb-2" style={{ fontFamily: "'Great Vibes', 'Noto Sans Sinhala', cursive" }}>{guestPrefix} {guestName}</p>
                      <p className="text-base md:text-lg text-slate-700 tracking-widest font-semibold">ගෞරවයෙන් ආරාධනා කර සිටිමු</p>
                    </div>
                  )}
                  <h1 className="text-6xl sm:text-7xl md:text-8xl text-slate-800 italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.bride}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-slate-800/40" />
                    <span className="text-4xl md:text-5xl text-[#c44576] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold">සහ</span>
                    <div className="h-px w-14 bg-slate-800/40" />
                  </div>

                  <h1 className="mt-6 text-6xl sm:text-7xl md:text-8xl text-slate-800 italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.groom}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-12 space-y-5"
                >
                  <p className="text-base md:text-lg tracking-normal text-slate-800 font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    {INVITATION.date.displayLong}
                  </p>

                  <p className="text-slate-700 text-base md:text-lg tracking-normal font-medium leading-loose max-w-2xl mx-auto">
                    අපගේ ජීවිතයේ අමතක නොවන සුබ මොහොත ඔබ සමඟ බෙදා ගැනීමට කැමැත්තෙමු!
                  </p>

                  <a
                    href="#details"
                    className="inline-flex items-center justify-center gap-2 mt-6 px-8 py-4 bg-slate-800 text-white text-base md:text-lg font-bold tracking-wider shadow-xl hover:bg-black transition-colors"
                  >
                    විස්තර බලන්න
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <div className="w-px h-14 bg-gradient-to-b from-[#8c244c]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#c44576]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center bg-transparent overflow-hidden"
            >
              <div className="absolute inset-4 md:inset-8 border-[1.5px] border-[#8c244c]/20 pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 border-[0.5px] border-[#e87a9e]/10 pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#8c244c]" />
                    <Sparkles className="w-4 h-4 text-[#c44576]" />
                    <div className="h-px w-8 bg-[#8c244c]" />
                  </div>

                  <div className="text-slate-800 space-y-6 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    <p className="text-slate-700">
                      ආර්. එම්. සුනිල් කුමාර මහතාගේ සහ ඩබ්. එච්. කමලා ප්‍රියදර්ශනී මහත්මියගේ ආදරණීය දියණිය වන
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#c44576] my-2">
                      නිශාදි,
                    </h3>

                    <p className="text-slate-700">
                      එච්. ඒ. ප්‍රසන්න කුමාර මහතාගේ සහ ඩී. එම්. චන්ද්‍රිකා කුමාරි මහත්මියගේ ආදරණීය පුත් වන
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#c44576] my-2">
                      දහම්
                    </h3>

                    <p className="text-slate-700 max-w-2xl mx-auto pt-2">
                      සමඟ අතිනත ගන්නා සොඳුරු මොහොත, ඔබගේ ආශීර්වාදයෙන් වර්ණවත් කර ගැනීම සඳහා,
                    </p>

                    <div className="py-6 my-4 border-t border-b border-[#f2a7be]/50 space-y-3 font-semibold text-slate-900">
                      <p>2026 අගෝස්තු මස 25 වන අඟහරුවාදා දින,</p>
                      <p>The Golden Ridge Hotel (නුවරඑළිය) උත්සව ශාලා පරිශ්‍රයට,</p>
                      <p>ඔබට</p>
                      <p className="text-lg md:text-xl font-bold">පැමිණෙන මෙන් ගෞරවයෙන් ආරාධනා කර සිටිමු.</p>
                    </div>

                    <p className="text-[#c44576] font-bold text-sm md:text-base">
                      (පෝරුවේ චාරිත්‍ර {INVITATION.time.poruwa} ට)
                    </p>

                    <p className="text-slate-900 font-bold text-lg md:text-xl mt-6">
                      ඔබගේ සහභාගිත්වය අප දෙදෙනාට මහත් ආශීර්වාදයකි!
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-slate-900 tracking-widest font-bold">
                    ශ්‍රී සුභ මංගලම්
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-white p-8 md:p-14 shadow-[0_30px_70px_-15px_rgba(140, 36, 76, 0.1)] border border-[#f2a7be]/30 flex flex-col items-center justify-center text-center"
                  >
                    <div className="absolute inset-2 border-[0.5px] border-[#c44576]/30 pointer-events-none" />

                    <div className="space-y-5 mb-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#c44576] leading-none">
                          {INVITATION.couple.bride}
                        </h3>
                      </div>
                    </div>

                    <div className="py-2 flex items-center justify-center w-full relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[#f2a7be]/50" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-6 text-4xl text-slate-800">සමඟ</span>
                      </div>
                    </div>

                    <div className="space-y-5 mt-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#c44576] leading-none">
                          {INVITATION.couple.groom}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#c44576]/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-[#c44576]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#c44576]">
                            දිනය
                          </div>
                          <div className="text-base md:text-lg text-slate-900 font-bold mt-1">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#8c244c]/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-[#8c244c]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#c44576] mb-2">
                            කාලසටහන
                          </div>
                          <div className="text-base md:text-lg text-slate-900 font-bold space-y-1">
                            <p>ආරම්භ කරන වේලාව : {INVITATION.time.start}</p>
                            <p>පෝරුව කටයුතු : {INVITATION.time.poruwa}</p>
                            <p>දිවා ආහාරය : {INVITATION.time.lunch}</p>
                            <p>මනාල යුවල පිටත්වීම : {INVITATION.time.goingAway}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#8c244c]/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#8c244c]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#c44576]">
                            ස්ථානය
                          </div>
                          <div className="text-base md:text-lg text-slate-900 font-bold mt-1">
                            {INVITATION.venue.name}, {INVITATION.venue.city}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-14 md:py-48 bg-transparent flex flex-col items-center overflow-hidden">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url('/ChatGPT%20Image%20Jun%208,%202026,%2003_57_11%20PM.png')` }}
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-12 md:mb-20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2
                      className="text-6xl md:text-[100px] text-white font-normal leading-tight"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Save the <span className="mx-2 md:mx-4 text-[#fce1eb]">Date</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fce1eb]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#fce1eb] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#fce1eb]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 md:mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-widest text-white font-bold text-center">
                    ආදරයෙන් පිරුණු මොහොතකට රැඳී සිටින්න
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#fce1eb] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            <Gallery />


            <section className="relative py-14 md:py-48 bg-transparent overflow-hidden">
              <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">

                {/* Hotel Image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="mb-12 md:mb-20"
                >
                  <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(140,36,76,0.2)] border border-[#f2a7be]/20 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                    <img
                      src={INVITATION.venue.image}
                      alt={`${INVITATION.venue.name} - ${INVITATION.venue.city}`}
                      className="w-full h-[300px] md:h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-left">
                      <p className="text-white/70 text-xs md:text-sm tracking-widest font-bold uppercase mb-2">උත්සව ශාලාව</p>
                      <h3 className="text-2xl md:text-4xl text-white font-bold drop-shadow-lg">{INVITATION.venue.name}</h3>
                      <p className="text-white/80 text-sm md:text-base tracking-wider mt-1 font-medium">{INVITATION.venue.city}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-center w-full">
                  <div className="w-full max-w-[560px] text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="bg-white p-10 md:p-16 shadow-[0_60px_100px_-40px_rgba(140, 36, 76, 0.1)] border border-[#f2a7be]/30 relative group"
                    >
                      <div className="absolute inset-2 border-[0.5px] border-[#c44576]/20 pointer-events-none group-hover:border-[#c44576]/40 transition-colors duration-700" />

                      <div className="space-y-12 relative z-10">
                        <div className="space-y-6">
                          <p className="text-slate-800 text-xl md:text-2xl font-light italic leading-relaxed text-center">
                            “අපගේ ආදර ගමනේ අමතක නොවන මේ සොඳුරු දිනය, ඔබගේ සෙනෙහසින් තවත් අලංකාර කරගැනීමට අප සතුටින් බලා සිටිමු.”
                          </p>
                          <div className="h-0.5 w-12 bg-[#f2a7be]/60 mx-auto" />
                        </div>

                        <div className="space-y-10">
                          <div className="flex items-start gap-8">
                            <div className="w-12 h-12 rounded-full border border-[#c44576]/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-[#c44576]" />
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-[#c44576] font-bold text-sm tracking-wider md:text-base">
                                Location
                              </h4>
                              <p className="text-xl md:text-2xl text-slate-900 leading-relaxed tracking-wide font-bold">
                                {INVITATION.venue.name}, {INVITATION.venue.city}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-8">
                            <div className="w-12 h-12 rounded-full border border-[#c44576]/20 flex items-center justify-center shrink-0">
                              <Clock className="w-5 h-5 text-[#c44576]" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[#c44576] font-bold text-sm tracking-wider md:text-base">
                                පෝරුව චාරිත්‍ර
                              </h4>
                              <p className="text-xl md:text-2xl text-slate-900 leading-relaxed tracking-wide font-bold">
                                {INVITATION.time.poruwa}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => window.open(INVITATION.venue.googleMapsLink, "_blank")}
                          className="w-full group relative inline-flex items-center justify-center gap-4 py-6 bg-[#8c244c] text-white text-sm md:text-base font-bold tracking-widest overflow-hidden transition-all hover:bg-black shadow-xl mt-4"
                        >
                          <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                          <span className="relative z-10 flex items-center gap-3">
                            <MapPin className="w-4 h-4" />
                            Open Map
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>




            <section className="w-full relative overflow-hidden bg-transparent py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#8c244c]/20" />
                    <Sparkles className="w-4 h-4 text-[#c44576]" />
                    <div className="h-px w-10 bg-[#8c244c]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#c44576] via-[#8c244c] to-[#c44576] bg-clip-text text-transparent italic">
                    ස්තූතියි
                  </h2>

                  <p className="text-slate-700 text-sm md:text-base tracking-widest font-medium leading-loose max-w-3xl mx-auto">
                    සෙනෙහසින් ලියැවෙන අපගේ ජීවිත කතාවේ සුන්දරතම දිනය, ඔබගේ පැමිණීමෙන් තවත් අර්ථවත් වනු ඇතැයි අප විශ්වාස කරමු
                  </p>



                  <p className="text-sm md:text-base tracking-widest text-slate-500 font-bold pt-12">
                    © 2026 {INVITATION.couple.bride} සහ {INVITATION.couple.groom}
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#d18a9e] p-3 rounded-full shadow-lg border border-[#fce1eb]/40 hover:bg-[#d18a9e]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #fce1eb33;
            }

            ::-webkit-scrollbar-thumb {
              background: #d18a9e66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}
