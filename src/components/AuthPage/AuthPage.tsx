import { useEffect, useRef } from "react";
import Navbar from "./Navbar";
import AuthBox from "./AuthBox";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  AlertTriangle,
  CreditCard,
  FileText,
  Share2,
  KeyRound,
  Github,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AuthPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".auth-box-container",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        },
      );
      gsap.to(".blob-1", {
        x: "10%",
        y: "15%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".blob-2", {
        x: "-15%",
        y: "10%",
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      gsap.to(".blob-3", {
        x: "12%",
        y: "-10%",
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
      document.querySelectorAll(".feature-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            duration: 0.3,
            scale: 1.05,
            ease: "power1.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            duration: 0.3,
            scale: 1,
            ease: "power1.out",
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Background blobs */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="blob-1 absolute w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-primary/70 to-purple-500/60 dark:from-primary/40 dark:to-purple-600/40 blur-[30px] opacity-70 dark:opacity-30 top-[10%] left-[10%] transform-gpu"></div>
        <div className="blob-2 absolute w-[45vw] h-[45vw] rounded-full bg-gradient-to-r from-blue-500/60 to-primary/70 dark:from-blue-600/40 dark:to-primary/40 blur-[80px] opacity-70 dark:opacity-60 bottom-[15%] right-[5%] transform-gpu"></div>
        <div className="blob-3 absolute w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-yellow-400/40 to-pink-500/60 dark:from-amber-500/30 dark:to-pink-600/40 blur-[60px] opacity-60 dark:opacity-50 top-[40%] right-[25%] transform-gpu"></div>
      </div>

      <div className="min-h-screen backdrop-blur-[6px] bg-white/30 dark:bg-slate-950/30 text-foreground transition-colors duration-300">
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 sm:px-6 backdrop-filter"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="hero-content order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary/70 dark:from-slate-200 dark:to-slate-400">
                  StashKey: Your Passport to Cyber Safety
                </h1>
                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-8">
                  Your modern, open source password manager with end-to-end
                  encryption that keeps your sensitive information safe and
                  accessible.
                </p>
                <div className="flex flex-wrap gap-4">
                  {/* <a
                    href="#features"
                    className="px-6 py-3 bg-primary/90 hover:bg-primary text-white rounded-md shadow-lg shadow-primary/20 transition-all font-medium flex items-center gap-2"
                  >
                    Explore Features
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a> */}
                  {/* <a
                    href="https://github.com/stashkey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-md shadow-lg backdrop-blur-md transition-all font-medium flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a> */}
                </div>
              </div>
              <div className="auth-box-container flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
                <AuthBox />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="py-20 sm:py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[8px]"
        >
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-14 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-slate-100 dark:to-slate-300">
                Powerful Features
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your digital identity securely in
                one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: "End-to-End Encryption",
                  description:
                    "Your data is encrypted on your device before it's sent to our servers. Only you have the keys.",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5" />,
                  title: "Breach Reports",
                  description:
                    "Get notified immediately when your accounts are compromised in data breaches.",
                },
                {
                  icon: <KeyRound className="w-5 h-5" />,
                  title: "Identity Storage",
                  description:
                    "Safely store your identity information with military-grade encryption.",
                },
                {
                  icon: <CreditCard className="w-5 h-5" />,
                  title: "Payment Cards",
                  description:
                    "Store all types of Debit and Credit cards securely and access across all your devices.",
                },
                {
                  icon: <FileText className="w-5 h-5" />,
                  title: "Secure Notes",
                  description:
                    "Keep private notes, documents, and sensitive information protected.",
                },
                {
                  icon: <Share2 className="w-5 h-5" />,
                  title: "Shamir's Secret Sharing",
                  description:
                    "Advanced failsafe solution that can split your master key to stakeholders, who can come together in majority to recover data.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="feature-card group bg-card/80 dark:bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-sm border border-border dark:border-slate-700/60 hover:border-primary/30 dark:hover:border-slate-500/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 dark:hover:shadow-slate-900/20"
                  style={{ willChange: "transform" }}
                >
                  <div className="mb-5 inline-flex items-center justify-center rounded-full bg-primary/10 dark:bg-slate-700/50 p-3 text-primary dark:text-slate-200 ring-1 ring-primary/20 dark:ring-slate-700 transition-all duration-300 group-hover:bg-primary/15 dark:group-hover:bg-slate-700/80">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-6 mt-16">
              {/* Import/Export Section */}
              <div className="p-8 rounded-xl bg-card/80 dark:bg-gradient-to-br dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-sm shadow-sm border border-border dark:border-slate-700/60 import-export-section">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="md:max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 dark:bg-slate-700/50 p-2 rounded-full">
                        <Share2 className="w-5 h-5 text-primary dark:text-slate-200" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        Seamless Import & Export
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      Easily migrate from other password managers with our
                      import tool. Export your data at any time for your own
                      backups.
                    </p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <button className="w-full md:w-auto px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:bg-slate-700/50 dark:hover:bg-slate-700/80 dark:text-slate-200 rounded-md font-medium transition-all">
                      Import now
                    </button>
                  </div>
                </div>
              </div>

              {/* Open Source Section */}
              <div className="p-8 rounded-xl bg-card/80 dark:bg-gradient-to-br dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-sm shadow-sm border border-border dark:border-slate-700/60 open-source-section">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="md:max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 dark:bg-slate-700/50 p-2 rounded-full">
                        <Github className="w-5 h-5 text-primary dark:text-slate-200" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        100% Open Source
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      We believe in transparency. That's why Stashkey is
                      completely open-source, allowing the community to verify
                      our security claims and contribute to making it even
                      better.
                    </p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <a
                      href="https://github.com/stashkey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:bg-slate-700/50 dark:hover:bg-slate-700/80 dark:text-slate-200 rounded-md font-medium transition-all"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Improved design */}
      <footer
        ref={footerRef}
        className="w-full bg-white/50 dark:bg-slate-950/50 backdrop-blur-[6px] py-10 border-t border-border/40 footer-content"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-6 space-x-2">
              <span className="text-base sm:text-lg font-medium text-foreground/80 dark:text-slate-300">
                Made with
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-500 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.04 2.46-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.54 3 22 5.46 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-base sm:text-lg font-medium text-foreground/80 dark:text-slate-300">
                by
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              {[
                {
                  name: "Aditya Aparadh",
                  github: "https://github.com/AdityaAparadh",
                },
                {
                  name: "Parag Patkulkar",
                  github: "https://github.com/Quanta30",
                },
                {
                  name: "Vedant Panari",
                  github: "https://github.com/Vedant-Panari",
                },
              ].map((person, i) => (
                <a
                  key={i}
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-accent/20 dark:bg-slate-800/40 hover:bg-accent/30 dark:hover:bg-slate-800/60 transition-colors duration-200"
                >
                  <Github className="w-4 h-4 text-foreground/70 dark:text-slate-400" />
                  <span className="text-sm font-medium text-foreground/90 dark:text-slate-200">
                    {person.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border/30 w-full max-w-xs flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} StashKey
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AuthPage;
