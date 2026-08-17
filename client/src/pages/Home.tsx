/**
 * Design reminder — Field Notes After Dark: editorial photojournalism, ink-blue systems,
 * warm paper reading surfaces, Signal Gold navigation, and an asymmetric field-dossier flow.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileText,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const assets = {
  hero: "/manus-storage/collapse-hero_df72bfe0.png",
  network: "/manus-storage/collapse-chapter-network_5dbde09b.png",
  civic: "/manus-storage/collapse-civic-action_4cb99735.png",
  mark: "/manus-storage/collapse-brand-mark_2483af57.png",
};

const chapters = [
  ["01", "Privacy Is Not Secrecy", "From a glance to a searchable history.", "Foundation"],
  ["02", "When the Camera Becomes Clothing", "Smart glasses and ambient capture.", "Ambient Capture"],
  ["03", "The Classroom Without a Camera-Off Switch", "When practice becomes permanent evidence.", "Ambient Capture"],
  ["04", "Florida Recording Law", "Context, consent, and reasonable expectation.", "Law & Boundaries"],
  ["05", "When a License Plate Becomes a Life Story", "ALPR networks and retrospective movement.", "Networks & Movement"],
  ["06", "Abortion, State Borders, and Movement", "When national data ignores legal lines.", "Networks & Movement"],
  ["07", "The Face Becomes the Boarding Pass", "Airport biometrics and normalized identity checks.", "Biometrics"],
  ["08", "Three Different Biometric Futures", "World ID, TSA Digital ID, and One ID.", "Biometrics"],
  ["09", "The Purchase of a Warrant", "ICE, data brokers, and commercial access.", "Power & Enforcement"],
  ["10", "The Home Is the Castle", "Administrative warrants at the threshold.", "Power & Enforcement"],
  ["11", "The First Amendment Under a Sensor Net", "Protest, association, and the chilling effect.", "Civic Liberty"],
  ["12", "The Workplace Panopticon", "AI scoring and the home-office collapse.", "Civic Liberty"],
  ["13", "The Connector Problem", "AI permissions, indexing, retention, and scope.", "AI & Private Life"],
  ["14", "Privilege in the Prompt Box", "Confidentiality, counsel, and AI settings.", "AI & Private Life"],
  ["15", "The Phone as Sensor Platform", "Permissions, MDM, and managed devices.", "AI & Private Life"],
  ["16", "Location Is Not Biometrics", "Routes can reveal a life without being a fingerprint.", "Networks & Movement"],
  ["17", "Why You Cannot Simply Block Spam", "Spoofing, cloned voices, and rotating identities.", "AI & Private Life"],
  ["18", "The “Best Behavior” Theory", "What constant observation makes people stop doing.", "Civic Liberty"],
  ["19", "When Personal Data Changes the Choice", "Pricing, feeds, and behavioral extraction.", "Commercial Power"],
  ["20", "The Biometrics You Cannot Rotate", "Why bodily identifiers are uniquely durable.", "Biometrics"],
  ["21", "Two Different Privacy Architectures", "Europe’s broad rights and America’s patchwork.", "Law & Boundaries"],
  ["22", "The Flashlight Pointed Back", "FOIA, public records, and watchdog research.", "Evidence & Oversight"],
  ["23", "The Failure Matrix", "Accuracy is only one way a system can fail.", "Evidence & Oversight"],
  ["24", "What AI Actually “Weaponizes”", "The removal of friction at administrative scale.", "AI & Private Life"],
  ["25", "The Rights and Design Agenda", "Rules, architecture, and civic choices.", "Evidence & Oversight"],
  ["26", "The Student Investigation Lab", "A method for asking better questions of power.", "Evidence & Oversight"],
] as const;

const fieldQuestions = [
  "What is collected?",
  "Who can search it?",
  "How long does it persist?",
  "What can it be joined to?",
  "Can a person opt out?",
  "What stands between curiosity and coercion?",
];

function ApertureMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-full border-2 border-[#E8A33D] bg-[#091018] ${compact ? "h-11 w-11" : "h-14 w-14"}`} aria-hidden="true">
      <span className="absolute h-[2px] w-[calc(100%+6px)] bg-[#E8A33D]" />
      <span className="h-[38%] w-[38%] rounded-full border border-[#F8F1E5]/80 bg-[#091018]" />
    </span>
  );
}

function EvidenceBand({ index, label, statement }: { index: string; label: string; statement: string }) {
  return (
    <div className="border-y border-[#F8F1E5]/10 bg-[#05090E] text-[#F8F1E5]">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-5 md:px-10 lg:px-16">
        <ApertureMark compact />
        <span className="font-mono text-[10px] tracking-[0.16em] text-[#E8A33D]">{index}</span>
        <span className="hidden h-5 w-px bg-[#F8F1E5]/25 sm:block" />
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[#F8F1E5]/48 sm:block">{label}</span>
        <p className="ml-auto max-w-2xl text-right font-serif text-xl leading-tight tracking-[-0.02em] md:text-2xl">{statement}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState("All chapters");

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const themes = useMemo(
    () => ["All chapters", ...Array.from(new Set(chapters.map((chapter) => chapter[3])))],
    [],
  );

  const filteredChapters = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return chapters.filter(([number, title, dek, theme]) => {
      const matchesTheme = activeTheme === "All chapters" || theme === activeTheme;
      const matchesSearch = [number, title, dek, theme].join(" ").toLowerCase().includes(normalized);
      return matchesTheme && matchesSearch;
    });
  }, [activeTheme, query]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#091018] text-[#F8F1E5]">
      <div className="fixed left-0 top-0 z-[70] h-1 w-full bg-[#E8A33D]/15" aria-hidden="true">
        <div className="h-full bg-[#E8A33D] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <aside className="fixed bottom-8 left-6 z-40 hidden w-12 flex-col items-center gap-5 lg:flex" aria-label="Reading position">
        <span className="rotate-180 font-mono text-[10px] tracking-[0.2em] text-[#F8F1E5]/50 [writing-mode:vertical-rl]">FIELD GUIDE / 2026</span>
        <div className="h-24 w-px bg-[#F8F1E5]/20">
          <div className="w-px bg-[#E8A33D] transition-all duration-150" style={{ height: `${progress}%` }} />
        </div>
        <span className="font-mono text-[10px] text-[#E8A33D]">{String(progress).padStart(2, "0")}</span>
      </aside>

      <header className="sticky top-0 z-50 border-b border-[#F8F1E5]/10 bg-[#091018]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 py-3 md:px-10 lg:px-16">
          <button className="flex items-center gap-3 text-left" onClick={() => jumpTo("top")} aria-label="Return to the beginning">
            <ApertureMark compact />
            <span className="hidden leading-none sm:block">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8A33D]">Field Guide</span>
              <span className="block pt-1 font-serif text-base tracking-tight text-[#F8F1E5]">Public / Private</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F8F1E5]/70 md:flex" aria-label="Main navigation">
            <button className="transition-colors hover:text-[#E8A33D]" onClick={() => jumpTo("thesis")}>The thesis</button>
            <button className="transition-colors hover:text-[#E8A33D]" onClick={() => jumpTo("chapters")}>26 chapters</button>
            <button className="transition-colors hover:text-[#E8A33D]" onClick={() => jumpTo("lab")}>Investigation lab</button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden border-l border-[#F8F1E5]/20 pl-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#E8A33D] xl:block">Reader / {String(progress).padStart(2, "0")}%</span>
            <button className="rounded-full border border-[#E8A33D]/45 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#E8A33D] transition hover:bg-[#E8A33D] hover:text-[#091018] active:scale-[0.97]" onClick={() => jumpTo("chapters")}>
              Explore the report
            </button>
          </div>
          <button className="ml-2 grid h-10 w-10 place-items-center md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#F8F1E5]/10 bg-[#101923] px-5 py-5 md:hidden">
            <div className="grid gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[#F8F1E5]/75">
              <button className="text-left" onClick={() => jumpTo("thesis")}>The thesis</button>
              <button className="text-left" onClick={() => jumpTo("chapters")}>26 chapters</button>
              <button className="text-left" onClick={() => jumpTo("lab")}>Investigation lab</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative isolate min-h-[790px] overflow-hidden border-b border-[#F8F1E5]/10 lg:min-h-[830px]">
          <img src={assets.hero} alt="A person crossing a city street amid accumulating data trails" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,16,24,.96)_0%,rgba(9,16,24,.82)_34%,rgba(9,16,24,.18)_73%,rgba(9,16,24,.35)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#091018] via-[#091018]/55 to-transparent" />
          <div className="relative mx-auto flex min-h-[790px] max-w-[1440px] items-end px-5 pb-16 pt-28 md:px-10 lg:min-h-[830px] lg:px-16 lg:pb-24">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A33D]">
                <span className="h-px w-10 bg-[#E8A33D]" />
                Investigative research edition / 14 August 2026
              </div>
              <h1 className="max-w-4xl font-serif text-6xl leading-[.9] tracking-[-0.06em] text-[#F8F1E5] sm:text-7xl md:text-8xl lg:text-[112px]">
                The collapse of the <em className="text-[#E8A33D]">public–private</em> divide.
              </h1>
              <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-[#F8F1E5]/80 md:text-xl">
                Surveillance capitalism, ambient capture, AI fusion, and the erosion of democratic liberty—mapped as a student field guide to the new surveillance state.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button className="group inline-flex items-center gap-3 rounded-full bg-[#E8A33D] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#091018] transition hover:bg-[#F8F1E5] active:scale-[0.97]" onClick={() => jumpTo("chapters")}>
                  Enter the field guide <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
                </button>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#F8F1E5]/55">26 chapters / 1 central question</span>
              </div>
            </div>
          </div>
        </section>

        <EvidenceBand index="01" label="Evidence threshold / core thesis" statement="A camera sees a moment. A system remembers a life." />

        <section id="thesis" className="relative scroll-mt-20 bg-[#F5EFE4] text-[#13212E]">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[.8fr_1.5fr] lg:px-16 lg:py-28">
            <div className="border-l-2 border-[#E8A33D] pl-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A5526]">The central question</p>
              <p className="mt-4 font-serif text-3xl leading-tight tracking-[-0.03em]">A machine does not merely see. It can remember, identify, connect, infer, predict, and act.</p>
            </div>
            <div>
              <p className="max-w-3xl font-serif text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl">
                “Was I in public?” is no longer the whole privacy question.
              </p>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-[#13212E]/78">
                The paper argues that a thousand innocent public acts can become a persistent dossier when cheap capture, storage, identity matching, data brokerage, and AI inference are fused into one searchable system.
              </p>
              <div className="mt-10 grid gap-px overflow-hidden border border-[#13212E]/15 bg-[#13212E]/15 sm:grid-cols-3">
                {["Capture", "Fuse", "Infer"].map((word, index) => (
                  <div key={word} className="bg-[#F5EFE4] p-5">
                    <span className="font-mono text-xs text-[#8A5526]">0{index + 1}</span>
                    <p className="mt-7 font-serif text-2xl">{word}</p>
                    <p className="mt-2 text-sm leading-6 text-[#13212E]/65">{index === 0 ? "Ordinary life becomes machine-readable." : index === 1 ? "Separate fragments become one queryable record." : "Patterns become consequential claims about people."}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#101923] py-20 text-[#F8F1E5] lg:py-28">
          <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_center,rgba(232,163,61,.18),transparent_68%)]" />
          <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[1.1fr_.9fr] lg:px-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#E8A33D]">The surveillance stack</p>
              <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[.98] tracking-[-0.05em] sm:text-6xl">The danger is not one device. It is the stack.</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#F8F1E5]/70">The report follows the shift from a single sensor to a system that can resolve identity, join databases, search backward, create inference, retain memory, and trigger action.</p>
              <a href="#chapters" className="mt-9 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E8A33D] transition hover:text-[#F8F1E5]">Trace the chapters <ArrowUpRight size={16} /></a>
            </div>
            <div className="border-l border-[#F8F1E5]/15 pl-6 sm:pl-10">
              {fieldQuestions.map((question, index) => (
                <div key={question} className="group flex items-baseline gap-4 border-b border-[#F8F1E5]/12 py-4 last:border-b-0">
                  <span className="font-mono text-[11px] text-[#E8A33D]">0{index + 1}</span>
                  <p className="font-serif text-xl transition-colors group-hover:text-[#E8A33D]">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="chapters" className="scroll-mt-20 bg-[#F5EFE4] py-20 text-[#13212E] lg:py-28">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A5526]">Research map</p>
                <h2 className="mt-4 font-serif text-5xl leading-[.96] tracking-[-0.055em] sm:text-6xl">Twenty-six launch points for deeper investigation.</h2>
              </div>
              <div className="border-y border-r border-[#13212E]/15 border-l-2 border-l-[#E8A33D] bg-[#FBF7F0] p-5 shadow-[0_16px_40px_rgba(19,33,46,.08)]">
                <label className="flex items-center gap-3 border-b border-[#13212E]/12 pb-3 text-[#13212E]/55">
                  <Search size={17} />
                  <input className="w-full bg-transparent font-mono text-xs uppercase tracking-[0.11em] outline-none placeholder:text-[#13212E]/40" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chapter, concept, or system" aria-label="Search chapters" />
                </label>
                <div className="mt-4 grid grid-cols-2 border-l border-t border-[#13212E]/12 sm:grid-cols-3">
                  {themes.map((theme) => (
                    <button key={theme} onClick={() => setActiveTheme(theme)} className={`border-b border-r border-[#13212E]/12 px-3 py-2 text-left font-mono text-[9px] uppercase tracking-[0.12em] transition active:scale-[0.97] ${activeTheme === theme ? "bg-[#13212E] text-[#F8F1E5]" : "bg-[#FBF7F0] text-[#13212E]/70 hover:bg-[#E8A33D]/28"}`}>
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden border-y border-[#13212E]/15 bg-[#13212E]/15 md:grid-cols-2 xl:grid-cols-3">
              {filteredChapters.map(([number, title, dek, theme]) => (
                <article key={number} className="group min-h-56 bg-[#F5EFE4] p-6 transition hover:bg-[#13212E] hover:text-[#F8F1E5] sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] text-[#8A5526] transition-colors group-hover:text-[#E8A33D]">{number}</span>
                    <span className="max-w-28 text-right font-mono text-[9px] uppercase tracking-[0.13em] text-[#13212E]/50 transition-colors group-hover:text-[#F8F1E5]/45">{theme}</span>
                  </div>
                  <h3 className="mt-11 max-w-xs font-serif text-2xl leading-[1.05] tracking-[-0.035em]">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[#13212E]/62 transition-colors group-hover:text-[#F8F1E5]/68">{dek}</p>
                  <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A5526] opacity-0 transition group-hover:opacity-100 group-hover:text-[#E8A33D]">Read the issue <ChevronRight size={14} /></div>
                </article>
              ))}
            </div>
            {filteredChapters.length === 0 && <p className="mt-8 font-serif text-2xl">No chapter matches that search. Try “biometric,” “movement,” or “AI.”</p>}
          </div>
        </section>

        <section className="grid bg-[#091018] text-[#F8F1E5] lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden">
            <img src={assets.network} alt="A vehicle route observed across a network of cameras" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091018] via-[#091018]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#E8A33D]">Field observation / movement</span>
              <p className="mt-3 max-w-md font-serif text-3xl leading-tight">A local camera can become a national time machine.</p>
            </div>
          </div>
          <div className="flex items-center px-5 py-20 md:px-10 lg:px-16">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#E8A33D]">The legal shift</p>
              <h2 className="mt-4 font-serif text-5xl leading-[.98] tracking-[-0.05em] sm:text-6xl">The line is moving from a glimpse to a dossier.</h2>
              <p className="mt-7 text-lg leading-8 text-[#F8F1E5]/70">The report’s recurring test is not whether one fragment exists. It is what changes when fragments can be retained, joined, searched, and converted into inference at continental scale.</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {["What does the system remember?", "Who can turn a signal into a consequence?"].map((question) => (
                  <div key={question} className="border-l border-[#E8A33D] pl-4 font-serif text-xl leading-7">{question}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <EvidenceBand index="02" label="Evidence threshold / legal shift" statement="The privacy line is moving from a glimpse to a dossier." />

        <section id="lab" className="scroll-mt-20 bg-[#EDE2CD] text-[#13212E]">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[.95fr_1.05fr] lg:px-16 lg:py-28">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5C351A]">The student investigation lab</p>
              <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[.98] tracking-[-0.05em] sm:text-6xl">Do not prove fear. Document the system.</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#13212E]/75">The point of this field guide is evidence-based inquiry: determine what a system sees, remembers, guesses, shares, and permits—and then decide what protections are proportionate.</p>
              <button onClick={() => jumpTo("chapters")} className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#13212E] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition hover:bg-[#13212E] hover:text-[#F8F1E5] active:scale-[0.97]">Start with a chapter <BookOpen size={15} /></button>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#13212E]/30">
              <img src={assets.civic} alt="Students and researchers mapping a surveillance system together" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13212E]/82 via-[#13212E]/10 to-transparent" />
              <div className="absolute bottom-0 p-7 text-[#F8F1E5] md:p-9">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#E8A33D]"><FileText size={14} /> Assignment: map one system</div>
                <p className="mt-3 max-w-md font-serif text-3xl leading-tight">Follow a record from raw signal to final consequence.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#13212E] px-5 py-12 text-[#F8F1E5] md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="flex items-center gap-3">
              <ApertureMark />
              <div>
                <p className="font-serif text-xl">Public / Private</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F8F1E5]/55">A student field guide to surveillance power</p>
              </div>
            </div>
            <div className="max-w-lg md:text-right">
              <p className="font-sans text-sm leading-6 text-[#F8F1E5]/62">Based on the investigative research edition by Rick McCawley. The site is designed as a civic reading experience: questions first, claims next, evidence always.</p>
              <button onClick={() => jumpTo("top")} className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#E8A33D] hover:text-[#F8F1E5]">Return to the top <ArrowUpRight size={14} /></button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
