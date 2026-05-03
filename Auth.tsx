@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 218 45% 12%;

    --card: 0 0% 100%;
    --card-foreground: 218 45% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 218 45% 12%;

    /* NearbyPro brand: deep navy + bold orange */
    --primary: 218 60% 16%;
    --primary-foreground: 0 0% 100%;
    --primary-glow: 218 55% 28%;

    --accent: 24 95% 53%;
    --accent-foreground: 0 0% 100%;
    --accent-glow: 30 100% 62%;

    --secondary: 218 30% 96%;
    --secondary-foreground: 218 45% 18%;

    --muted: 218 20% 95%;
    --muted-foreground: 218 12% 42%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --success: 145 65% 42%;
    --success-foreground: 0 0% 100%;

    --border: 218 20% 90%;
    --input: 218 20% 90%;
    --ring: 24 95% 53%;

    --radius: 0.85rem;

    --gradient-hero: linear-gradient(135deg, hsl(218 60% 14%) 0%, hsl(218 55% 22%) 50%, hsl(24 95% 53%) 130%);
    --gradient-brand: linear-gradient(135deg, hsl(24 95% 53%), hsl(30 100% 62%));
    --gradient-card: linear-gradient(180deg, hsl(0 0% 100%), hsl(218 30% 98%));
    --shadow-elegant: 0 20px 50px -25px hsl(218 60% 16% / 0.35);
    --shadow-glow: 0 10px 40px -10px hsl(24 95% 53% / 0.45);
    --shadow-soft: 0 4px 14px -6px hsl(218 30% 20% / 0.12);

    --sidebar-background: 218 60% 14%;
    --sidebar-foreground: 0 0% 95%;
    --sidebar-primary: 24 95% 53%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 218 50% 22%;
    --sidebar-accent-foreground: 0 0% 100%;
    --sidebar-border: 218 50% 22%;
    --sidebar-ring: 24 95% 53%;
  }

  .dark {
    --background: 218 50% 8%;
    --foreground: 0 0% 96%;
    --card: 218 45% 11%;
    --card-foreground: 0 0% 96%;
    --popover: 218 45% 11%;
    --popover-foreground: 0 0% 96%;
    --primary: 24 95% 53%;
    --primary-foreground: 0 0% 100%;
    --primary-glow: 30 100% 62%;
    --accent: 24 95% 53%;
    --accent-foreground: 0 0% 100%;
    --secondary: 218 40% 16%;
    --secondary-foreground: 0 0% 96%;
    --muted: 218 40% 16%;
    --muted-foreground: 218 15% 65%;
    --border: 218 40% 18%;
    --input: 218 40% 18%;
    --ring: 24 95% 53%;
  }
}

@layer base {
  * { @apply border-border; }
  html, body { @apply bg-background text-foreground; }
  body { font-feature-settings: "rlig" 1, "calt" 1; -webkit-font-smoothing: antialiased; }
}

@layer utilities {
  .bg-gradient-hero { background: var(--gradient-hero); }
  .bg-gradient-brand { background: var(--gradient-brand); }
  .bg-gradient-card { background: var(--gradient-card); }
  .shadow-elegant { box-shadow: var(--shadow-elegant); }
  .shadow-glow { box-shadow: var(--shadow-glow); }
  .shadow-soft { box-shadow: var(--shadow-soft); }
  .text-balance { text-wrap: balance; }

  .ticker { display: flex; width: max-content; animation: ticker 45s linear infinite; }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float-slow {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-float { animation: float-slow 6s ease-in-out infinite; }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.5s ease-out both; }
}

@layer utilities {
  .typing-gradient {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 0.09em solid hsl(var(--accent));
    animation: typing-loop 5.5s steps(28, end) infinite, caret 0.85s step-end infinite;
    max-width: 100%;
  }
  @keyframes typing { from { width: 0; } to { width: 100%; } }
  @keyframes typing-loop { 0% { width: 0; } 55% { width: 100%; } 82% { width: 100%; } 100% { width: 0; } }
  @keyframes caret { 50% { border-color: transparent; } }
}


@layer utilities {
  @media (max-width: 640px) {
    .mobile-typing {
      white-space: nowrap;
      max-width: 100%;
      font-size: clamp(2rem, 10vw, 3rem);
    }
    .ticker { animation-duration: 32s; }
  }
}
