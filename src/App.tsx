import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

const INVITATION = {
  couple: {
    bride: "Senuri",
    groom: "Kushan",
    brideFull: "Senuri Jayasekara",
    groomFull: "Kushan Palliyaguru",
  },
  date: {
    displayNumeric: "07 . 12 . 2026",
    displayLong: "Monday, 7th December 2026",
    countdownTarget: "2026-12-07T18:30:00+05:30",
  },
  time: {
    poruwa: "5.00 PM",
    reception: "6.30 PM",
  },
  venue: {
    name: "Crystal Altrium",
    city: "Paradise Inn Bolgoda",
    mapQuery: "Paradise Inn Bolgoda",
    googleMapsLink: "https://maps.app.goo.gl/hgnCv6atgVkbM2pF7",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9PQvcELCBX_DOEIJdOG1fwy9GHTMN1649wV0X86_s4byyifc33g0ExPx&s=10",
  },
  rsvpContacts: ["Senuri", "Kushan"],
} as const;

const backgroundMusic = "/Die%20with%20a%20smile%20%5BBridgerton%20Version%5D%20%20NEW%20RELEASE.mp3";
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
    }>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#e63946", "#d90429", "#ef233c", "#ba1826", "#a4161a", "#ff4d6d", "#c9184a"];
    const petalCount = isMobile ? 16 : 32;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 12,
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
      style={{ perspective: "1000px" }}
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_8px_15px_rgba(0,0,0,0.35)]"
          style={{ 
            color: petal.color,
            transformStyle: "preserve-3d"
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
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="25%" stopColor={petal.color} stopOpacity="0.9" />
                <stop offset="75%" stopColor={petal.color} stopOpacity="1" />
                <stop offset="100%" stopColor="#4a0404" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path 
              d="M15,0 C28,8 32,24 15,35 C4,28 -2,12 15,0 Z" 
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
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
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
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] border flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#aa8372] border-white/20" : "bg-white border-pink-100/60"
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 border-[0.5px] rounded-t-full pointer-events-none ${isDark ? "border-white/30" : "border-theme-300/50"
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#aa8372]"
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
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#c3a3a6]"
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
            <span className="text-[#aa8372] font-bold tracking-widest text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#c3a3a6]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#aa8372] via-[#aa8372] to-[#aa8372] bg-clip-text text-transparent italic leading-none">
            Beautiful Memories
          </h2>
          <p className="text-slate-700 text-sm md:text-base tracking-widest font-medium max-w-2xl mx-auto pt-2 leading-loose">
            We look forward to sharing a beautiful moment of our love story with you.
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
    attending: "yes",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const [wishesForm, setWishesForm] = useState({
    name: "",
    wish: "",
  });

  const [wishesStatus, setWishesStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
        guests: rsvpForm.attending === "yes" ? rsvpForm.guests : "0",
        attending: rsvpForm.attending,
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1", attending: "yes" });
      setTimeout(() => setRsvpStatus("idle"), 5000);
    } catch {
      setRsvpStatus("error");
      setTimeout(() => setRsvpStatus("idle"), 5000);
    }
  };

  const handleWishesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wishesForm.name.trim() || !wishesForm.wish.trim()) {
      setWishesStatus("error");
      return;
    }

    setWishesStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "wish",
        name: wishesForm.name.trim(),
        wish: wishesForm.wish.trim(),
      });

      setWishesStatus("success");
      setWishesForm({ name: "", wish: "" });
      setTimeout(() => setWishesStatus("idle"), 5000);
    } catch {
      setWishesStatus("error");
      setTimeout(() => setWishesStatus("idle"), 5000);
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
      className={`h-[100dvh] w-full bg-[#ffffff] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth font-content`}
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
              muted={true}
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
                    <h2 className="text-4xl md:text-6xl text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-bold font-topic">
                      Our Wedding
                    </h2>
                    <p className="text-xl md:text-2xl text-[#ccbbb3] tracking-widest font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-cinzel-decorative">
                      {INVITATION.couple.bride} & {INVITATION.couple.groom}
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
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ccbbb3]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-bold text-white text-sm tracking-widest drop-shadow-md">
                      Open Invitation
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-[#ccbbb3] text-xs tracking-widest font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  >
                    Click to start
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
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="text-lg md:text-2xl text-[#aa8372] mb-8 drop-shadow-md font-normal font-cinzel uppercase tracking-[0.2em]"
                  >
                    Wedding Invitation
                  </motion.h2>

                  <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="text-2xl md:text-5xl text-[#aa8372] tracking-widest font-normal drop-shadow-md self-start font-cinzel-decorative"
                    >
                      {INVITATION.couple.bride}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="text-xl md:text-3xl text-[#aa8372] italic drop-shadow-md my-1 font-normal font-cinzel-decorative"
                    >
                      &
                    </motion.span>

                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="text-2xl md:text-5xl text-[#aa8372] tracking-widest font-normal drop-shadow-md self-end font-cinzel-decorative"
                    >
                      {INVITATION.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-10 z-[110] px-8 py-3 bg-white/40 backdrop-blur-md text-[#aa8372] text-xs tracking-widest rounded-full border border-[#aa8372]/30 hover:bg-white/60 transition-all font-bold shadow-lg"
                >
                  Enter Invitation
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
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-pink-100 text-[#aa8372] hover:bg-pink-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">Close</div>
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
                  className="text-base md:text-lg tracking-[0.2em] uppercase font-bold text-[#aa8372] drop-shadow-[0_0_10px_rgba(255,255,255,1)] drop-shadow-[0_0_20px_rgba(255,255,255,1)] drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/40 font-cinzel whitespace-nowrap"
                >
                  Wedding Invitation
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  {guestName && (
                    <div className="mb-8 flex flex-col items-center">
                      <p className="text-3xl md:text-4xl text-[#aa8372] font-bold mb-2" style={{ fontFamily: "'Great Vibes', 'Noto Sans Sinhala', cursive" }}>{guestPrefix} {guestName}</p>
                      <p className="text-base md:text-lg text-slate-700 tracking-widest font-semibold">We cordially invite you</p>
                    </div>
                  )}
                  <h1 className="text-6xl sm:text-7xl md:text-8xl text-slate-800 italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] font-cinzel-decorative">
                    {INVITATION.couple.bride}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-slate-800/40" />
                    <span className="text-4xl md:text-5xl text-[#aa8372] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold font-cinzel-decorative">&</span>
                    <div className="h-px w-14 bg-slate-800/40" />
                  </div>

                  <h1 className="mt-6 text-6xl sm:text-7xl md:text-8xl text-slate-800 italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] font-cinzel-decorative">
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
                    We would love to share this unforgettable moment of our lives with you!
                  </p>

                  <a
                    href="#details"
                    className="inline-flex items-center justify-center gap-2 mt-6 px-8 py-4 bg-[#aa8372] text-white text-base md:text-lg font-bold tracking-wider shadow-xl hover:bg-[#aa8372]/80 transition-colors"
                  >
                    View Details
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
                <div className="w-px h-14 bg-gradient-to-b from-[#aa8372]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#aa8372]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center bg-transparent overflow-hidden"
            >
              <div className="absolute inset-4 md:inset-8 border-[1.5px] border-[#aa8372]/20 pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 border-[0.5px] border-[#c3a3a6]/10 pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#aa8372]" />
                    <Sparkles className="w-4 h-4 text-[#aa8372]" />
                    <div className="h-px w-8 bg-[#aa8372]" />
                  </div>

                  <div className="text-slate-800 space-y-6 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    <p className="text-slate-700 font-content">
                      Daughter of Mr. & Mrs. Jayasekara
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#aa8372] my-2">
                      Senuri,
                    </h3>

                    <p className="text-slate-700 font-content">
                      Son of Mr. & Mrs. Palliyaguru
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#aa8372] my-2">Kushan</h3>

                    <p className="text-slate-700 max-w-2xl mx-auto pt-2 font-content text-lg">
                      Together with their families, joyfully invite you to share in their happiness as they unite in marriage.
                    </p>

                    <div className="py-6 my-4 border-t border-b border-[#ccbbb3]/50 space-y-3 font-semibold text-slate-900 font-content text-lg">
                      <p>On Monday, 7th December 2026,</p>
                      <p>At Crystal Altrium, Paradise Inn Bolgoda</p>
                      <p></p>
                      <p className="text-xl md:text-2xl font-bold">We respectfully invite you to join us.</p>
                    </div>


                    <p className="text-slate-900 font-bold text-xl md:text-2xl mt-6 font-content">
                      Your presence is a great blessing to us!
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-3xl md:text-4xl text-slate-900 tracking-widest font-bold font-topic">
                    Our Wedding
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-white p-8 md:p-14 shadow-[0_30px_70px_-15px_rgba(140, 36, 76, 0.1)] border border-[#ccbbb3]/30 flex flex-col items-center justify-center text-center"
                  >
                    <div className="absolute inset-2 border-[0.5px] border-[#aa8372]/30 pointer-events-none" />

                    <div className="space-y-5 mb-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#aa8372] leading-none font-cinzel-decorative">
                          {INVITATION.couple.bride}
                        </h3>
                      </div>
                    </div>

                    <div className="py-2 flex items-center justify-center w-full relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[#ccbbb3]/50" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-6 text-4xl text-slate-800">with</span>
                      </div>
                    </div>

                    <div className="space-y-5 mt-10">
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-5xl md:text-7xl text-[#aa8372] leading-none font-cinzel-decorative">
                          {INVITATION.couple.groom}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#aa8372]/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-[#aa8372]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#aa8372]">
                            Date
                          </div>
                          <div className="text-base md:text-lg text-slate-900 font-bold mt-1">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#aa8372]/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-[#aa8372]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#aa8372] mb-2">Timeline</div>
                          <div className="text-base md:text-lg text-slate-900 font-bold space-y-1">
                            <p>Poruwa Ceremony : {INVITATION.time.poruwa}</p>
                            <p>Reception : {INVITATION.time.reception}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#aa8372]/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#aa8372]" />
                        </div>
                        <div>
                          <div className="text-[13px] tracking-wider font-bold text-[#aa8372]">Venue</div>
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
                      Save the <span className="mx-2 md:mx-4 text-[#ccbbb3]">Date</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#ccbbb3]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#ccbbb3] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#ccbbb3]/50" />
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
                    Stay tuned for a moment full of love
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#ccbbb3] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>




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
                  <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(140,36,76,0.2)] border border-[#ccbbb3]/20 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                    <img
                      src={INVITATION.venue.image}
                      alt={`${INVITATION.venue.name} - ${INVITATION.venue.city}`}
                      className="w-full h-[300px] md:h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-left">
                      <p className="text-white/70 text-xs md:text-sm tracking-widest font-bold uppercase mb-2">Banquet Hall</p>
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
                      className="bg-white p-10 md:p-16 shadow-[0_60px_100px_-40px_rgba(140, 36, 76, 0.1)] border border-[#ccbbb3]/30 relative group"
                    >
                      <div className="absolute inset-2 border-[0.5px] border-[#aa8372]/20 pointer-events-none group-hover:border-[#aa8372]/40 transition-colors duration-700" />

                      <div className="space-y-12 relative z-10">
                        <div className="space-y-6">
                          <p className="text-slate-800 text-xl md:text-2xl font-light italic leading-relaxed text-center">
                            "We happily look forward to adorning this unforgettable, beautiful day of our love journey with your affection."
                          </p>
                          <div className="h-0.5 w-12 bg-[#ccbbb3]/60 mx-auto" />
                        </div>

                        <div className="space-y-10">
                          <div className="flex items-start gap-8">
                            <div className="w-12 h-12 rounded-full border border-[#aa8372]/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-[#aa8372]" />
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-[#aa8372] font-bold text-sm tracking-wider md:text-base">
                                Location
                              </h4>
                              <p className="text-xl md:text-2xl text-slate-900 leading-relaxed tracking-wide font-bold">
                                {INVITATION.venue.name}, {INVITATION.venue.city}
                              </p>
                            </div>
                          </div>


                        </div>

                        <button
                          onClick={() => window.open(INVITATION.venue.googleMapsLink, "_blank")}
                          className="w-full group relative inline-flex items-center justify-center gap-4 py-6 bg-[#aa8372] text-white text-sm md:text-base font-bold tracking-widest overflow-hidden transition-all hover:bg-black shadow-xl mt-4"
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




            <section className="w-full relative overflow-hidden bg-[#fbf9f8] py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 md:p-12 shadow-[0_30px_70px_-15px_rgba(140,36,76,0.1)] border border-[#ccbbb3]/30 text-center relative"
                >
                  <div className="absolute inset-2 border-[0.5px] border-[#aa8372]/30 pointer-events-none" />
                  <h2 className="text-4xl md:text-5xl text-[#aa8372] italic mb-2 relative z-10">RSVP</h2>
                  <p className="text-slate-600 mb-8 tracking-widest text-sm uppercase font-bold relative z-10">Please respond to let us know if you can make it</p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-6 text-left relative z-10">
                    <div className="space-y-2">
                      <label className="text-[#aa8372] font-bold tracking-widest text-sm uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-4 border border-[#ccbbb3]/40 bg-[#fbf9f8] focus:border-[#aa8372] outline-none transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#aa8372] font-bold tracking-widest text-sm uppercase">Attending?</label>
                        <select
                          value={rsvpForm.attending}
                          onChange={(e) => setRsvpForm(prev => ({ ...prev, attending: e.target.value }))}
                          className="w-full p-4 border border-[#ccbbb3]/40 bg-[#fbf9f8] focus:border-[#aa8372] outline-none transition-colors appearance-none"
                        >
                          <option value="yes">Joyfully Accept</option>
                          <option value="no">Regretfully Decline</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#aa8372] font-bold tracking-widest text-sm uppercase">Guest Count</label>
                        <select
                          value={rsvpForm.guests}
                          onChange={(e) => setRsvpForm(prev => ({ ...prev, guests: e.target.value }))}
                          className="w-full p-4 border border-[#ccbbb3]/40 bg-[#fbf9f8] focus:border-[#aa8372] outline-none transition-colors appearance-none"
                          disabled={rsvpForm.attending === "no"}
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={rsvpStatus === "sending"}
                      className="w-full py-4 bg-[#aa8372] text-white font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {rsvpStatus === "sending" ? "Sending..." : "Submit RSVP"}
                    </button>

                    {rsvpStatus === "success" && (
                      <p className="text-green-600 text-center font-bold">Thank you! Your RSVP has been received.</p>
                    )}
                    {rsvpStatus === "error" && (
                      <p className="text-red-500 text-center font-bold">Failed to send. Please try again or contact us directly.</p>
                    )}
                  </form>
                </motion.div>
              </div>
            </section>

            <section className="w-full relative overflow-hidden bg-white py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#fbf9f8] p-8 md:p-12 shadow-[0_30px_70px_-15px_rgba(140,36,76,0.1)] border border-[#ccbbb3]/30 text-center relative"
                >
                  <div className="absolute inset-2 border-[0.5px] border-[#aa8372]/30 pointer-events-none" />
                  <h2 className="text-4xl md:text-5xl text-[#aa8372] italic mb-2 relative z-10">Leave a Wish</h2>
                  <p className="text-slate-600 mb-8 tracking-widest text-sm uppercase font-bold relative z-10">Share your blessings with the couple</p>

                  <form onSubmit={handleWishesSubmit} className="space-y-6 text-left relative z-10">
                    <div className="space-y-2">
                      <label className="text-[#aa8372] font-bold tracking-widest text-sm uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={wishesForm.name}
                        onChange={(e) => setWishesForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-4 border border-[#ccbbb3]/40 bg-white focus:border-[#aa8372] outline-none transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[#aa8372] font-bold tracking-widest text-sm uppercase">Your Wish</label>
                      <textarea
                        required
                        rows={4}
                        value={wishesForm.wish}
                        onChange={(e) => setWishesForm(prev => ({ ...prev, wish: e.target.value }))}
                        className="w-full p-4 border border-[#ccbbb3]/40 bg-white focus:border-[#aa8372] outline-none transition-colors resize-none"
                        placeholder="Write your wishes here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={wishesStatus === "sending"}
                      className="w-full py-4 bg-[#aa8372] text-white font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {wishesStatus === "sending" ? "Sending..." : "Send Wish"}
                    </button>

                    {wishesStatus === "success" && (
                      <p className="text-green-600 text-center font-bold">Thank you for your beautiful wishes!</p>
                    )}
                    {wishesStatus === "error" && (
                      <p className="text-red-500 text-center font-bold">Failed to send. Please try again.</p>
                    )}
                  </form>
                </motion.div>
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
                    <div className="h-px w-10 bg-[#aa8372]/20" />
                    <Sparkles className="w-4 h-4 text-[#aa8372]" />
                    <div className="h-px w-10 bg-[#aa8372]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#aa8372] via-[#aa8372] to-[#aa8372] bg-clip-text text-transparent italic">
                    Thank You
                  </h2>

                  <p className="text-slate-700 text-sm md:text-base tracking-widest font-medium leading-loose max-w-3xl mx-auto">
                    We believe that the most beautiful day of our life story, written with love, will be more meaningful with your presence.
                  </p>



                  <p className="text-sm md:text-base tracking-widest text-slate-500 font-bold pt-12">
                    © 2026 {INVITATION.couple.bride} & {INVITATION.couple.groom}
                  </p>
                  <p className="text-xs mt-3 font-sans tracking-wider text-slate-500">
                    Want a beautiful wedding website like this? Create yours with <a target="_blank" rel="noreferrer" className="text-[#aa8372] hover:text-slate-700 underline font-bold transition-colors" href="https://wa.me/94707819074">invitemint</a>
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
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#c3a3a6] p-3 rounded-full shadow-lg border border-[#ccbbb3]/40 hover:bg-[#c3a3a6]/10 transition-colors"
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

            input,
            textarea,
            button {
              font-family: 'Cormorant Garamond', 'Montserrat', Arial, sans-serif !important;
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
              background: #ccbbb333;
            }

            ::-webkit-scrollbar-thumb {
              background: #c3a3a666;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}
