import { MessageCircle, Zap, Brain, Network } from "lucide-react";

// Option 1: MessageCircle with improved styling
export const LogoOption1 = () => (
  <div className="flex items-center gap-3">
    <MessageCircle className="size-10 text-primary drop-shadow-lg" />
    <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-tight font-sans">
      Neura
    </span>
  </div>
);

// Option 2: Brain icon (perfect for "Neura")
export const LogoOption2 = () => (
  <div className="flex items-center gap-3">
    <Brain className="size-10 text-primary drop-shadow-lg animate-pulse" />
    <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide font-serif">
      Neura
    </span>
<br></br>
  </div>
);

// Option 3: Zap icon with modern styling
 export const LogoOption3 = () => (
  <div className="flex items-center gap-3">
    <Zap className="size-10 text-primary drop-shadow-lg" />
    <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary tracking-tighter font-sans">
      Neura
    </span>
  </div>
);

// Option 4: Network icon (represents connectivity)
 export const LogoOption4 = () => (
  <div className="flex items-center gap-3">
    <Network className="size-10 text-primary drop-shadow-lg" />
    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide font-mono">
      Neura
    </span>
  </div>
);

// Option 5: Animated version with MessageCircle
export const LogoOption5 = () => (
  <div className="flex items-center gap-3 group">
    <MessageCircle className="size-10 text-primary drop-shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12" />
    <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-tight font-sans transition-all group-hover:tracking-wide">
      Neura
    </span>
  </div>
);

// Change this to use different options