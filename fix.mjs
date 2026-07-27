import fs from 'fs';
const file = 'e:/QB/wedding new/Senuri kushan/src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

const splitText = '    setIsLowPowerMode(reduceMotion || isMobile);\n';
const afterText = '  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);';

const index1 = data.indexOf(splitText);
const index2 = data.indexOf(afterText);

if(index1 > -1 && index2 > index1) {
  const replacement = `    if (reduceMotion) {
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
      className={\`pointer-events-none fixed inset-0 overflow-hidden z-40 \${isLowPowerMode ? "opacity-70" : ""}\`}
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
            x: \`\${petal.x}vw\`,
            y: "-10vh",
            rotateX: petal.rotation,
            rotateY: petal.rotation / 2,
            rotateZ: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: \`\${petal.x + petal.drift}vw\`,
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
              <linearGradient id={\`grad-\${petal.id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="25%" stopColor={petal.color} stopOpacity="0.9" />
                <stop offset="75%" stopColor={petal.color} stopOpacity="1" />
                <stop offset="100%" stopColor="#4a0404" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path 
              d="M15,5 C17,2 25,0 28,8 C30,20 20,30 15,35 C10,30 0,20 2,8 C5,0 13,2 15,5 Z" 
              fill={\`url(#grad-\${petal.id})\`}
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

`;
  
  data = data.substring(0, index1 + splitText.length) + replacement + data.substring(index2);
  fs.writeFileSync(file, data, 'utf8');
  console.log('Fixed file successfully');
} else {
  console.log('Indices not found', index1, index2);
}
