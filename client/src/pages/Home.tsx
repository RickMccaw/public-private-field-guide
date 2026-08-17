/**
 * Design reminder — Field Notes After Dark classroom reader: a one-page civic dossier with
 * full transcripts, photographic chapter thresholds, evidence links, and student writing spaces.
 */
import { jsPDF } from "jspdf";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronDown,
  Download,
  FileText,
  Menu,
  PenLine,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import courseContent from "@/data/courseContent.json";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;

const assets = {
  hero: assetPath("collapse-hero.png"),
  mark: assetPath("collapse-brand-mark.png"),
};

const chapterImages: Record<number, string> = {
  1: assetPath("chapter-images/01_privacy_is_not_secrecy.png"),
  2: assetPath("chapter-images/02_meta_smart_glasses.png"),
  3: assetPath("chapter-images/03_classroom_without_camera_off_switch.png"),
  4: assetPath("chapter-images/04_florida_recording_law.png"),
  5: assetPath("chapter-images/05_flock_alpr.png"),
  6: assetPath("chapter-images/06_abortion_borders_movement.png"),
  7: assetPath("chapter-images/07_tsa_cbp_face_boarding_pass.png"),
  8: assetPath("chapter-images/08_three_biometric_futures.png"),
  9: assetPath("chapter-images/09_ice_data_brokers_warrant.png"),
  10: assetPath("chapter-images/10_home_is_the_castle.png"),
  11: assetPath("chapter-images/11_first_amendment_sensor_net.png"),
  12: assetPath("chapter-images/12_workplace_panopticon.png"),
  13: assetPath("chapter-images/13_connector_problem.png"),
  14: assetPath("chapter-images/14_attorney_client_privilege.png"),
  15: assetPath("chapter-images/15_ios_permissions_managed_devices.png"),
  16: assetPath("chapter-images/16_location_not_biometrics.png"),
  17: assetPath("chapter-images/17_block_spam.png"),
  18: assetPath("chapter-images/18_best_behavior_theory.png"),
  19: assetPath("chapter-images/19_surveillance_capitalism.png"),
  20: assetPath("chapter-images/20_biometrics_cannot_rotate.png"),
  21: assetPath("chapter-images/21_europe_vs_us_privacy_architecture.png"),
  22: assetPath("chapter-images/22_foia_watchdogs.png"),
  23: assetPath("chapter-images/23_failure_matrix.png"),
  24: assetPath("chapter-images/24_what_ai_weaponizes.png"),
  25: assetPath("chapter-images/25_rights_design_agenda.png"),
  26: assetPath("chapter-images/26_student_investigation_lab.png"),
};

const courseArcs = [
  { weeks: "Weeks 01–04", title: "Foundations & ambient capture", chapters: "Ch. 01–06", text: "Privacy, wearables, classrooms, recording context, plate readers, and movement across borders." },
  { weeks: "Weeks 05–08", title: "Movement, identity & enforcement", chapters: "Ch. 07–12", text: "Airport biometrics, identity systems, data brokers, home entry, protest, and workplace monitoring." },
  { weeks: "Weeks 09–12", title: "Private systems & AI", chapters: "Ch. 13–18", text: "Connectors, privilege, device controls, navigation, spam, and the ideology of constant observation." },
  { weeks: "Weeks 13–16", title: "Rights, oversight & investigation", chapters: "Ch. 19–26", text: "Commercial power, biometrics, EU/US models, records requests, failure modes, remedies, and student research." },
];

type StudentProfile = { name: string; course: string; instructor: string };
type AnswerMap = Record<string, string>;

function ApertureMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-full border-2 border-[#E8A33D] bg-[#091018] ${compact ? "h-10 w-10" : "h-14 w-14"}`} aria-hidden="true">
      <span className="absolute h-[2px] w-[calc(100%+6px)] bg-[#E8A33D]" />
      <span className="h-[38%] w-[38%] rounded-full border border-[#F8F1E5]/80 bg-[#091018]" />
    </span>
  );
}

function renderTextWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer" className="break-all text-[#B7642E] underline decoration-[#E8A33D]/70 underline-offset-4 hover:text-[#13212E]">
        {part}
      </a>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [profile, setProfile] = useState<StudentProfile>({ name: "", course: "", instructor: "" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("public-private-answer-map");
    const savedProfile = localStorage.getItem("public-private-student-profile");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("public-private-answer-map", JSON.stringify(answers));
    localStorage.setItem("public-private-student-profile", JSON.stringify(profile));
  }, [answers, profile, ready]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(Number(visible.target.getAttribute("data-chapter-number")));
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    document.querySelectorAll("[data-chapter-number]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const responseCount = useMemo(() => Object.values(answers).filter((answer) => answer.trim().length > 0).length, [answers]);
  const filteredChapters = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return courseContent.chapters;
    return courseContent.chapters.filter((chapter) => [chapter.title, chapter.subtitle, ...chapter.transcript.map((entry) => entry.text)].join(" ").toLowerCase().includes(normalized));
  }, [query]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const updateAnswer = (key: string, value: string) => setAnswers((current) => ({ ...current, [key]: value }));

  const jumpChapter = (chapterNumber: number) => {
    setActiveChapter(chapterNumber);
    scrollTo(`chapter-${String(chapterNumber).padStart(2, "0")}`);
  };

  const exportPaper = () => {
    const entries = courseContent.chapters.flatMap((chapter) => chapter.questions.map((question, index) => ({ chapter, question, answer: answers[`${chapter.number}-${index}`]?.trim() ?? "" }))).filter((entry) => entry.answer);
    if (!entries.length) {
      scrollTo("student-paper");
      return;
    }
    const pdf = new jsPDF({ unit: "pt", format: "letter" });
    const width = 468;
    const margin = 72;
    let y = 78;
    const addText = (text: string, size: number, weight: "normal" | "bold" = "normal") => {
      pdf.setFont("times", weight);
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, width) as string[];
      const lineHeight = size * 1.45;
      lines.forEach((line) => {
        if (y > 710) { pdf.addPage(); y = 72; }
        pdf.text(line, margin, y);
        y += lineHeight;
      });
    };
    addText("The Collapse of the Public–Private Divide", 18, "bold");
    addText(profile.name || "Student response portfolio", 12);
    if (profile.course || profile.instructor) addText([profile.course, profile.instructor].filter(Boolean).join(" • "), 10);
    addText(`Generated ${new Date().toLocaleDateString()}`, 10);
    y += 10;
    entries.forEach(({ chapter, question, answer }) => {
      addText(`Chapter ${String(chapter.number).padStart(2, "0")} — ${chapter.title.replace(/^\d+\.\s*/, "")}`, 13, "bold");
      addText(`Prompt: ${question}`, 10, "bold");
      addText(answer, 11);
      y += 9;
    });
    pdf.addPage();
    y = 72;
    addText("Selected sources from the field guide", 14, "bold");
    courseContent.worksCited.slice(0, 36).forEach((citation) => addText(citation, 9));
    pdf.save("public-private-student-response-paper.pdf");
  };

  const currentIndex = Math.max(0, courseContent.chapters.findIndex((chapter) => chapter.number === activeChapter));

  return (
    <div className="min-h-screen bg-[#091018] pb-16 text-[#F8F1E5]">
      <div className="fixed left-0 top-0 z-[80] h-1 w-full bg-[#E8A33D]/15" aria-hidden="true"><div className="h-full bg-[#E8A33D] transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>

      <header className="sticky top-0 z-50 border-b border-[#F8F1E5]/10 bg-[#091018]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center gap-3 px-4 py-3 md:px-7 lg:px-10">
          <button className="flex items-center gap-2 text-left" onClick={() => scrollTo("top")} aria-label="Return to the beginning"><ApertureMark compact /><span className="hidden leading-none sm:block"><span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[#E8A33D]">Field guide</span><span className="mt-1 block font-serif text-base">Public / Private</span></span></button>
          <div className="ml-auto hidden min-w-0 items-center gap-3 md:flex">
            <label className="flex min-w-[180px] items-center gap-2 border-l border-[#F8F1E5]/15 pl-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[#F8F1E5]/50"><ChevronDown size={13} /><select value={activeChapter} onChange={(event) => jumpChapter(Number(event.target.value))} className="w-full appearance-none bg-transparent py-2 text-[#F8F1E5] outline-none"><option className="bg-[#13212E]" value="0">Jump to chapter</option>{courseContent.chapters.map((chapter) => <option className="bg-[#13212E]" key={chapter.number} value={chapter.number}>Ch. {String(chapter.number).padStart(2, "0")} — {chapter.title.replace(/^\d+\.\s*/, "")}</option>)}</select></label>
            <button className="inline-flex items-center gap-2 border-l border-[#F8F1E5]/15 pl-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("student-paper")}><PenLine size={14} /> My paper <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#E8A33D] px-1 text-[9px] text-[#091018]">{responseCount}</span></button>
          </div>
          <button className="ml-auto grid h-10 w-10 place-items-center md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle reading menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        {menuOpen && <div className="border-t border-[#F8F1E5]/10 bg-[#13212E] p-4 md:hidden"><label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#F8F1E5]/55"><ChevronDown size={14} /><select value={activeChapter} onChange={(event) => jumpChapter(Number(event.target.value))} className="w-full bg-transparent py-2 text-[#F8F1E5] outline-none"><option className="bg-[#13212E]" value="0">Jump to chapter</option>{courseContent.chapters.map((chapter) => <option className="bg-[#13212E]" key={chapter.number} value={chapter.number}>Ch. {String(chapter.number).padStart(2, "0")} — {chapter.title.replace(/^\d+\.\s*/, "")}</option>)}</select></label><button className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#E8A33D]" onClick={() => scrollTo("student-paper")}>Open my paper ({responseCount})</button></div>}
      </header>

      <main id="top">
        <section className="relative isolate min-h-[670px] overflow-hidden border-b border-[#F8F1E5]/10 md:min-h-[720px]"><img src={assets.hero} alt="A person crossing a city street amid accumulating data trails" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,16,24,.96)_0%,rgba(9,16,24,.82)_36%,rgba(9,16,24,.22)_75%,rgba(9,16,24,.42)_100%)]" /><div className="relative mx-auto flex min-h-[670px] max-w-[1600px] items-end px-5 pb-16 pt-28 md:min-h-[720px] md:px-10 lg:px-20"><div className="max-w-4xl"><p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8A33D]"><span className="h-px w-10 bg-[#E8A33D]" /> {courseContent.edition}</p><h1 className="font-serif text-6xl leading-[.88] tracking-[-.065em] sm:text-7xl md:text-8xl lg:text-[110px]">The collapse of the <em className="text-[#E8A33D]">public–private</em> divide.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#F8F1E5]/76">A complete, chapter-by-chapter classroom reader with primary research text, visual thresholds, source links, and a writing portfolio for every question the field guide raises.</p><div className="mt-9 flex flex-wrap gap-4"><button className="inline-flex items-center gap-3 rounded-full bg-[#E8A33D] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#091018] transition hover:bg-[#F8F1E5] active:scale-[.97]" onClick={() => scrollTo("reader")}>Begin reading <ArrowDown size={15} /></button><button className="inline-flex items-center gap-2 border-b border-[#E8A33D] font-mono text-[10px] uppercase tracking-[0.15em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("student-paper")}>Build a response paper <ArrowRight size={14} /></button></div></div></div></section>

        <section className="border-b border-[#13212E]/15 bg-[#F5EFE4] text-[#13212E]"><div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:px-10 lg:grid-cols-[.82fr_1.18fr] lg:px-20"><div className="border-l-2 border-[#E8A33D] pl-5"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8A5526]">How to use this reader</p><p className="mt-4 font-serif text-3xl leading-tight tracking-[-.035em]">Read the record. Trace the source. Write your response.</p></div><div className="grid gap-px border border-[#13212E]/15 bg-[#13212E]/15 sm:grid-cols-3">{[["01", "Read", "Every section preserves the full chapter transcript."], ["02", "Question", "Prompts sit at the end of each chapter and save in your browser."], ["03", "Synthesize", "Gather answered prompts into a downloadable PDF paper."]].map(([number, label, text]) => <div key={number} className="bg-[#F5EFE4] p-5"><span className="font-mono text-[10px] text-[#8A5526]">{number}</span><p className="mt-6 font-serif text-2xl">{label}</p><p className="mt-2 text-sm leading-6 text-[#13212E]/68">{text}</p></div>)}</div></div></section>

        <section className="bg-[#101923] px-5 py-14 md:px-10 lg:px-20"><div className="mx-auto max-w-[1600px]"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8A33D]">16-week course path</p><h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[.98] tracking-[-.05em] sm:text-5xl">A seminar rhythm for studying surveillance as infrastructure, law, and design.</h2></div><button className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("reader")}>Open the complete reader <ArrowRight size={15} /></button></div><div className="mt-10 grid gap-px border border-[#F8F1E5]/12 bg-[#F8F1E5]/12 md:grid-cols-2 xl:grid-cols-4">{courseArcs.map((arc) => <article key={arc.weeks} className="bg-[#101923] p-6"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#E8A33D]">{arc.weeks}</p><h3 className="mt-7 font-serif text-2xl leading-tight">{arc.title}</h3><p className="mt-2 font-mono text-[10px] uppercase tracking-[.13em] text-[#F8F1E5]/45">{arc.chapters}</p><p className="mt-5 text-sm leading-6 text-[#F8F1E5]/68">{arc.text}</p></article>)}</div></div></section>

        <section id="reader" className="scroll-mt-20 bg-[#EDE2CD] px-5 py-16 text-[#13212E] md:px-10 lg:px-20"><div className="mx-auto max-w-[1600px]"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8A5526]">Complete chapter reader</p><h2 className="mt-3 font-serif text-5xl leading-[.94] tracking-[-.055em] sm:text-6xl">The full text, arranged as a navigable field dossier.</h2></div><label className="flex items-center gap-3 border-y border-[#13212E]/20 bg-[#F8F3EA] px-4 py-4 text-[#13212E]/55"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent font-mono text-[10px] uppercase tracking-[.12em] outline-none placeholder:text-[#13212E]/40" placeholder="Find a chapter, case, law, or key term" /></label></div><div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-y border-[#13212E]/15 py-4 font-mono text-[10px] uppercase tracking-[.12em] text-[#13212E]/60"><span className="text-[#8A5526]">Quick anchors:</span>{courseContent.chapters.map((chapter) => <button key={chapter.number} onClick={() => jumpChapter(chapter.number)} className={`hover:text-[#8A5526] ${activeChapter === chapter.number ? "text-[#8A5526] underline decoration-[#E8A33D] underline-offset-4" : ""}`}>{String(chapter.number).padStart(2, "0")}</button>)}</div></div></section>

        <section className="bg-[#F5EFE4] text-[#13212E]">{filteredChapters.map((chapter) => <article id={chapter.slug} data-chapter-number={chapter.number} key={chapter.number} className="scroll-mt-24 border-b border-[#13212E]/15"><div className="relative isolate min-h-[340px] overflow-hidden bg-[#13212E] md:min-h-[420px]"><img src={chapterImages[chapter.number]} loading={chapter.number > 1 ? "lazy" : "eager"} decoding="async" alt={`Visual metaphor for ${chapter.title.replace(/^\d+\.\s*/, "")}`} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,16,24,.94)_0%,rgba(9,16,24,.62)_40%,rgba(9,16,24,.12)_78%)]" /><div className="relative mx-auto flex min-h-[340px] max-w-[1600px] items-end px-5 py-10 md:min-h-[420px] md:px-10 lg:px-20"><div className="max-w-4xl text-[#F8F1E5]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8A33D]">Chapter {String(chapter.number).padStart(2, "0")} / {chapter.citations.length} linked source{chapter.citations.length === 1 ? "" : "s"}</p><h2 className="mt-4 font-serif text-5xl leading-[.93] tracking-[-.055em] sm:text-6xl md:text-7xl">{chapter.title.replace(/^\d+\.\s*/, "")}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[#F8F1E5]/75">{chapter.subtitle}</p></div></div></div><div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-20 lg:py-16"><div className="max-w-3xl"><div className="chapter-transcript">{chapter.transcript.map((entry, index) => entry.type === "heading" ? <h3 key={`${entry.text}-${index}`} className="mt-10 font-mono text-[11px] uppercase tracking-[.15em] text-[#8A5526] first:mt-0">{entry.text}</h3> : entry.type === "question" ? null : <p key={`${entry.text}-${index}`} className={`mt-4 text-[17px] leading-8 text-[#13212E]/82 ${entry.text.startsWith("IN PLAIN ENGLISH") ? "border-l-2 border-[#E8A33D] pl-5 font-serif text-2xl leading-8 text-[#13212E]" : ""}`}>{entry.text}</p>)}</div><section className="mt-12 border-t-2 border-[#13212E] pt-7"><div className="flex items-center gap-3"><PenLine size={16} className="text-[#8A5526]" /><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#8A5526]">Chapter inquiry / saved privately in this browser</p></div><h3 className="mt-3 font-serif text-3xl leading-tight">Write through the questions this chapter forces.</h3><div className="mt-7 space-y-6">{chapter.questions.map((question, index) => { const key = `${chapter.number}-${index}`; return <label key={key} className="block"><span className="block font-serif text-xl leading-7">{question}</span><textarea value={answers[key] ?? ""} onChange={(event) => updateAnswer(key, event.target.value)} rows={4} className="mt-3 w-full resize-y border border-[#13212E]/22 bg-[#FBF7F0] p-4 text-base leading-7 outline-none transition focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20" placeholder="Draft your response, example, evidence, or question for discussion…" /></label>; })}</div></section></div><aside className="lg:sticky lg:top-28 lg:h-fit"><div className="border-t-2 border-[#E8A33D] bg-[#13212E] p-6 text-[#F8F1E5]"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#E8A33D]">Evidence file</p><p className="mt-3 font-serif text-2xl leading-tight">Sources cited in this chapter</p>{chapter.citations.length ? <ol className="mt-6 space-y-4">{chapter.citations.map((citation, index) => <li key={`${citation.url}-${index}`} className="border-t border-[#F8F1E5]/14 pt-4"><p className="font-mono text-[9px] uppercase tracking-[.11em] text-[#F8F1E5]/48">{String(index + 1).padStart(2, "0")}</p><p className="mt-2 text-sm leading-5 text-[#F8F1E5]/77">{citation.label}</p><a href={citation.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-[#E8A33D] hover:text-[#F8F1E5]">Open source <ArrowRight size={13} /></a></li>)}</ol> : <p className="mt-6 text-sm leading-6 text-[#F8F1E5]/65">This chapter frames a synthesis section. Consult the final reference archive for its broader source trail.</p>}</div><button onClick={() => scrollTo("reader")} className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#8A5526] hover:text-[#13212E]"><ArrowUp size={13} /> Back to reader index</button></aside></div></article>)}</section>

        {filteredChapters.length === 0 && <section className="bg-[#F5EFE4] px-5 py-20 text-[#13212E]"><div className="mx-auto max-w-3xl border-l-2 border-[#E8A33D] pl-5"><p className="font-serif text-3xl">No chapter contains that term.</p><button className="mt-4 font-mono text-[10px] uppercase tracking-[.15em] text-[#8A5526]" onClick={() => setQuery("")}>Clear search</button></div></section>}

        <section id="student-paper" className="scroll-mt-24 bg-[#101923] px-5 py-20 md:px-10 lg:px-20"><div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8A33D]">Student paper workspace</p><h2 className="mt-4 font-serif text-5xl leading-[.96] tracking-[-.055em] sm:text-6xl">Your questions become a working paper.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-[#F8F1E5]/70">Your responses remain in this browser while you work. When you are ready, this workspace compiles every completed response and a selected reference section into a clean downloadable PDF.</p><div className="mt-9 border-l border-[#E8A33D] pl-5"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D]">Progress</p><p className="mt-2 font-serif text-4xl">{responseCount} answered prompt{responseCount === 1 ? "" : "s"}</p></div></div><div className="border border-[#F8F1E5]/15 bg-[#13212E] p-6 md:p-8"><div className="grid gap-4 sm:grid-cols-2"><label className="font-mono text-[9px] uppercase tracking-[.13em] text-[#F8F1E5]/52">Student name<input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full border-b border-[#F8F1E5]/25 bg-transparent py-2 text-base text-[#F8F1E5] outline-none focus:border-[#E8A33D]" placeholder="Your name" /></label><label className="font-mono text-[9px] uppercase tracking-[.13em] text-[#F8F1E5]/52">Course / section<input value={profile.course} onChange={(event) => setProfile((current) => ({ ...current, course: event.target.value }))} className="mt-2 w-full border-b border-[#F8F1E5]/25 bg-transparent py-2 text-base text-[#F8F1E5] outline-none focus:border-[#E8A33D]" placeholder="e.g., Design & Democracy" /></label><label className="font-mono text-[9px] uppercase tracking-[.13em] text-[#F8F1E5]/52 sm:col-span-2">Instructor / facilitator<input value={profile.instructor} onChange={(event) => setProfile((current) => ({ ...current, instructor: event.target.value }))} className="mt-2 w-full border-b border-[#F8F1E5]/25 bg-transparent py-2 text-base text-[#F8F1E5] outline-none focus:border-[#E8A33D]" placeholder="Instructor name" /></label></div><div className="mt-8 border-y border-[#F8F1E5]/12 py-5"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D]">Ready for export</p><p className="mt-2 text-sm leading-6 text-[#F8F1E5]/68">The PDF will include your answered prompts in reading order plus a selected source appendix from the field guide.</p></div><button disabled={!responseCount} onClick={exportPaper} className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#E8A33D] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[.15em] text-[#091018] transition hover:bg-[#F8F1E5] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[.97]"><Download size={15} /> Download response paper PDF</button>{!responseCount && <p className="mt-3 font-mono text-[9px] uppercase tracking-[.12em] text-[#F8F1E5]/42">Answer at least one question to enable export.</p>}</div></div></section>

        <section id="resources" className="scroll-mt-24 bg-[#F5EFE4] px-5 py-20 text-[#13212E] md:px-10 lg:px-20"><div className="mx-auto max-w-[1600px]"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8A5526]">Reference appendix</p><h2 className="mt-3 font-serif text-5xl leading-[.95] tracking-[-.055em] sm:text-6xl">Sources, systems, and the watchlist.</h2></div><p className="max-w-2xl text-lg leading-8 text-[#13212E]/72">Every linked case-file source remains attached to its chapter. This appendix gathers the source archive from the original document for deeper classroom research.</p></div><div className="mt-12 grid gap-10 lg:grid-cols-2"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#8A5526]">Cross-system surveillance matrix</p><div className="mt-4 space-y-3 border-l border-[#E8A33D] pl-5">{courseContent.matrix.map((item, index) => <p key={`${item}-${index}`} className={`${index === 0 ? "font-mono text-[10px] uppercase tracking-[.11em] text-[#8A5526]" : "text-sm leading-6 text-[#13212E]/73"}`}>{renderTextWithLinks(item)}</p>)}</div></div><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#8A5526]">2026–2030 watchlist</p><div className="mt-4 space-y-3 border-l border-[#E8A33D] pl-5">{courseContent.watchlist.map((item, index) => <p key={`${item}-${index}`} className={index % 2 === 0 ? "font-serif text-xl leading-7" : "text-sm leading-6 text-[#13212E]/73"}>{renderTextWithLinks(item)}</p>)}</div></div></div><details className="mt-14 border-t-2 border-[#13212E] pt-6"><summary className="cursor-pointer font-serif text-3xl leading-tight">Works cited: {courseContent.worksCited.length} documented sources <span className="ml-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#8A5526]">Open archive</span></summary><ol className="mt-8 grid gap-x-12 gap-y-4 lg:grid-cols-2">{courseContent.worksCited.map((citation, index) => <li key={`${citation}-${index}`} className="border-t border-[#13212E]/12 pt-3 text-sm leading-6 text-[#13212E]/75"><span className="mr-2 font-mono text-[10px] text-[#8A5526]">{String(index + 1).padStart(3, "0")}</span>{renderTextWithLinks(citation)}</li>)}</ol></details></div></section>

        <footer className="bg-[#13212E] px-5 py-12 md:px-10 lg:px-20"><div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-8 md:flex-row md:items-end"><div className="flex items-center gap-3"><ApertureMark /><div><p className="font-serif text-2xl">Public / Private</p><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#F8F1E5]/55">A one-page classroom field guide</p></div></div><div className="max-w-xl md:text-right"><p className="text-sm leading-6 text-[#F8F1E5]/62">Based on the investigative research edition by Rick McCawley. This reader preserves chapter text, links research sources, and supports student writing without requiring an account.</p><div className="mt-4 flex flex-wrap gap-4 md:justify-end"><button className="font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("reader")}>Chapter index</button><button className="font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("resources")}>Reference appendix</button><button className="font-mono text-[10px] uppercase tracking-[.14em] text-[#E8A33D] hover:text-[#F8F1E5]" onClick={() => scrollTo("top")}>Back to top</button></div></div></div></footer>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#F8F1E5]/10 bg-[#091018]/95 px-3 py-2 backdrop-blur-xl md:px-6" aria-label="Bottom reader navigation"><div className="mx-auto flex max-w-[880px] items-center justify-between gap-2"><button onClick={() => jumpChapter(Math.max(1, courseContent.chapters[currentIndex - 1]?.number ?? 1))} className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#F8F1E5]/65 hover:text-[#E8A33D]"><ArrowLeft size={13} /> Previous</button><button onClick={() => scrollTo("reader")} className="font-mono text-[9px] uppercase tracking-[.12em] text-[#E8A33D]">Contents / {String(activeChapter).padStart(2, "0")}</button><button onClick={() => scrollTo("student-paper")} className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#F8F1E5]/65 hover:text-[#E8A33D]">My paper <span className="text-[#E8A33D]">{responseCount}</span></button><button onClick={() => jumpChapter(Math.min(26, courseContent.chapters[currentIndex + 1]?.number ?? 26))} className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#F8F1E5]/65 hover:text-[#E8A33D]">Next <ArrowRight size={13} /></button></div></nav>
    </div>
  );
}
