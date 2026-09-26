"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { QUESTIONS, Question, TOPICS } from "@/data/questions";
import { loadStats, addAttempt, recordPractice, ExamAttempt, UserStats } from "@/lib/storage";

type View = "dashboard" | "upload" | "exam-setup" | "exam" | "exam-review" | "results" | "practice" | "bank" | "tutor" | "stats";

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [stats, setStats] = useState<UserStats>({ attempts: [], bookmarked: [], practiceHistory: [] });
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [examStartTime, setExamStartTime] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);
  const [practiceQ, setPracticeQ] = useState<Question | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [filterTopic, setFilterTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hello! I am your AI Tutor for CSC 106. Ask about any question or concept from the study guide." },
  ]);
  const [tutorInput, setTutorInput] = useState("");

  useEffect(() => { setStats(loadStats()); }, []);

  useEffect(() => {
    if (view !== "exam" || !timerEnabled || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); handleSubmitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [view, timerEnabled, timeLeft]);

  const overallStats = useMemo(() => {
    const a = stats.attempts;
    if (!a.length) return { accuracy: 0, totalQuestions: 0, examsCompleted: 0, best: 0 };
    const correct = a.reduce((s, x) => s + x.correct, 0);
    const total = a.reduce((s, x) => s + x.totalQuestions, 0);
    const scores = a.map((x) => x.score);
    return {
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      totalQuestions: total,
      examsCompleted: a.length,
      best: Math.max(...scores),
    };
  }, [stats]);

  const handleSubmitExam = useCallback(() => {
    const timeSpent = Math.round((Date.now() - examStartTime) / 1000);
    let correct = 0, incorrect = 0, unanswered = 0;
    examQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) unanswered++;
      else if (ans === q.correctAnswer) correct++;
      else incorrect++;
    });
    const total = examQuestions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const attempt: ExamAttempt = {
      id: `att-${Date.now()}`, date: new Date().toISOString(),
      subject: "CSC 106", topic: examQuestions[0]?.topic || "Mixed",
      totalQuestions: total, correct, incorrect, unanswered, score,
      timeSpentSeconds: timeSpent, answers: { ...answers }, markedForReview: Array.from(marked),
    };
    addAttempt(attempt);
    setStats(loadStats());
    setLastAttempt(attempt);
    setView("results");
  }, [examQuestions, answers, marked, examStartTime]);

  const startExam = (count: number, topic: string, mins: number) => {
    let pool = topic === "all" ? [...QUESTIONS] : QUESTIONS.filter((q) => q.topic === topic);
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
    setExamQuestions(pool);
    setCurrentIdx(0); setAnswers({}); setMarked(new Set());
    setTimerEnabled(mins > 0); setTimeLeft(mins * 60); setExamStartTime(Date.now());
    setView("exam");
  };

  const startPractice = (topic?: string) => {
    let pool = topic ? QUESTIONS.filter((q) => q.topic === topic) : [...QUESTIONS];
    if (!pool.length) pool = [...QUESTIONS];
    setPracticeQ(pool[Math.floor(Math.random() * pool.length)]);
    setPracticeAnswer(null); setShowSolution(false); setView("practice");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const filteredBank = useMemo(() => QUESTIONS.filter((q) => {
    if (filterTopic !== "all" && q.topic !== filterTopic) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterTopic, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">PQ</div>
            <div>
              <h1 className="text-sm font-semibold">Past Questions Lab</h1>
              <p className="text-[11px] text-slate-500">CSC 106 · Microprocessor Systems</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1">
            {(["dashboard","exam-setup","practice","bank","stats","tutor","upload"] as View[]).map((id) => (
              <button key={id} onClick={() => id === "practice" ? startPractice() : id === "upload" ? (setUploadStep(0), setUploadDone(false), setView("upload"), (() => { let i=0; const t=setInterval(()=>{i++;setUploadStep(i);if(i>=6){clearInterval(t);setUploadDone(true);}},700); })()) : setView(id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${view===id||(id==="exam-setup"&&["exam","results","exam-review"].includes(view))?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-100"}`}>
                {id==="exam-setup"?"Exam":id==="dashboard"?"Dashboard":id.charAt(0).toUpperCase()+id.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="md:hidden border-b bg-white px-2 py-2 flex gap-1 overflow-x-auto">
        {(["dashboard","exam-setup","practice","bank","stats","tutor"] as View[]).map((id) => (
          <button key={id} onClick={() => id==="practice"?startPractice():setView(id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${view===id?"bg-blue-600 text-white":"bg-slate-100 text-slate-700"}`}>
            {id==="exam-setup"?"Exam":id==="dashboard"?"Home":id}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome back, Student</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Accuracy", value: `${overallStats.accuracy}%` },
                { label: "Questions", value: overallStats.totalQuestions },
                { label: "Exams", value: overallStats.examsCompleted },
                { label: "Best", value: `${overallStats.best}%` },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-xl border p-4 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase">{c.label}</p>
                  <p className="text-2xl font-bold mt-1">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <button onClick={() => setView("exam-setup")} className="p-5 bg-blue-600 text-white rounded-xl text-left">
                <p className="font-semibold">Start Exam</p>
                <p className="text-sm text-blue-100 mt-1">Choose topic, count & timer</p>
              </button>
              <button onClick={() => startPractice()} className="p-5 bg-white border rounded-xl text-left">
                <p className="font-semibold">Practice Mode</p>
                <p className="text-sm text-slate-500 mt-1">Immediate feedback</p>
              </button>
              <button onClick={() => setView("bank")} className="p-5 bg-white border rounded-xl text-left">
                <p className="font-semibold">Question Bank</p>
                <p className="text-sm text-slate-500 mt-1">{QUESTIONS.length} questions</p>
              </button>
            </div>
            {stats.attempts.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold mb-3">Recent Attempts</h3>
                {stats.attempts.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{a.topic}</span>
                    <span className={`font-bold ${a.score >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{a.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "exam-setup" && (
          <div className="max-w-xl mx-auto bg-white rounded-xl border p-6 space-y-4">
            <h2 className="text-xl font-bold">Configure Exam</h2>
            <div>
              <label className="text-sm font-medium">Number of questions</label>
              <input type="number" id="qcount" defaultValue={10} min={1} max={QUESTIONS.length} className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Topic</label>
              <select id="qtopic" className="w-full mt-1 px-3 py-2 border rounded-lg">
                <option value="all">All topics</option>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Timer (minutes, 0 = off)</label>
              <input type="number" id="qtimer" defaultValue={30} min={0} className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <button onClick={() => {
              const count = Number((document.getElementById("qcount") as HTMLInputElement).value) || 10;
              const topic = (document.getElementById("qtopic") as HTMLSelectElement).value;
              const mins = Number((document.getElementById("qtimer") as HTMLInputElement).value) || 0;
              startExam(count, topic, mins);
            }} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">Start Exam</button>
          </div>
        )}

        {view === "exam" && examQuestions.length > 0 && (() => {
          const q = examQuestions[currentIdx];
          return (
            <div className="grid lg:grid-cols-[1fr_200px] gap-6">
              <div className="bg-white rounded-xl border p-6">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-slate-500">Q {currentIdx + 1} / {examQuestions.length}</span>
                  {timerEnabled && <span className="font-mono text-sm">{formatTime(timeLeft)}</span>}
                </div>
                <p className="text-xs text-slate-400 mb-1">{q.number}</p>
                <p className="text-lg font-medium mb-6">{q.text}</p>
                <div className="space-y-3">
                  {q.options.map((opt) => (
                    <button key={opt.key} onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.key }))}
                      className={`w-full text-left border-2 rounded-lg p-4 ${answers[q.id] === opt.key ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}>
                      <strong>{opt.key}.</strong> {opt.text}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40">Previous</button>
                  <button onClick={() => setMarked((m) => { const n = new Set(m); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}
                    className={`px-4 py-2 rounded-lg text-sm ${marked.has(q.id) ? "bg-amber-100" : "border"}`}>
                    {marked.has(q.id) ? "Unmark" : "Mark"}
                  </button>
                  {currentIdx < examQuestions.length - 1
                    ? <button onClick={() => setCurrentIdx(currentIdx + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm ml-auto">Next</button>
                    : <button onClick={() => window.confirm("Submit?") && handleSubmitExam()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm ml-auto">Submit</button>}
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4 h-fit sticky top-20">
                <p className="text-xs font-semibold text-slate-500 mb-2">NAV</p>
                <div className="grid grid-cols-5 gap-1">
                  {examQuestions.map((qq, i) => (
                    <button key={qq.id} onClick={() => setCurrentIdx(i)}
                      className={`w-8 h-8 rounded text-xs ${i === currentIdx ? "ring-2 ring-blue-600" : ""} ${marked.has(qq.id) ? "bg-amber-500 text-white" : answers[qq.id] ? "bg-blue-600 text-white" : "bg-slate-100"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => window.confirm("Submit?") && handleSubmitExam()} className="mt-4 w-full py-2 bg-emerald-600 text-white text-sm rounded-lg">Submit</button>
              </div>
            </div>
          );
        })()}

        {view === "results" && lastAttempt && (
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold">Results</h2>
            <div className="bg-white rounded-xl border p-8">
              <p className="text-5xl font-bold text-blue-600">{lastAttempt.score}%</p>
              <p className="text-slate-500 mt-2">{lastAttempt.correct} / {lastAttempt.totalQuestions} correct</p>
              <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                <div><p className="text-2xl font-semibold text-emerald-600">{lastAttempt.correct}</p><p>Correct</p></div>
                <div><p className="text-2xl font-semibold text-red-600">{lastAttempt.incorrect}</p><p>Incorrect</p></div>
                <div><p className="text-2xl font-semibold text-slate-400">{lastAttempt.unanswered}</p><p>Skipped</p></div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setView("exam-review")} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg">Review</button>
              <button onClick={() => startPractice()} className="px-5 py-2.5 border rounded-lg">Practice</button>
              <button onClick={() => setView("dashboard")} className="px-5 py-2.5 text-slate-600">Dashboard</button>
            </div>
          </div>
        )}

        {view === "exam-review" && lastAttempt && (
          <div className="max-w-3xl mx-auto space-y-4">
            <button onClick={() => setView("results")} className="text-sm text-blue-600">← Back</button>
            {examQuestions.map((q, i) => {
              const ua = lastAttempt.answers[q.id];
              const ok = ua === q.correctAnswer;
              return (
                <div key={q.id} className="bg-white rounded-xl border p-5">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Q{i + 1}. {q.text}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${!ua ? "bg-slate-100" : ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {!ua ? "Skipped" : ok ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  </div>
                  <p className="text-sm mt-2">Your answer: <strong>{ua || "—"}</strong> · Correct: <strong className="text-emerald-700">{q.correctAnswer}</strong></p>
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        )}

        {view === "practice" && practiceQ && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Practice</h2>
            <div className="bg-white rounded-xl border p-6">
              <p className="text-xs text-slate-500 mb-1">{practiceQ.number} · {practiceQ.difficulty}</p>
              <p className="text-lg font-medium mb-6">{practiceQ.text}</p>
              <div className="space-y-3">
                {practiceQ.options.map((opt) => {
                  let cls = "border-2 rounded-lg p-4 w-full text-left ";
                  if (showSolution) {
                    if (opt.key === practiceQ.correctAnswer) cls += "border-emerald-500 bg-emerald-50";
                    else if (opt.key === practiceAnswer) cls += "border-red-500 bg-red-50";
                    else cls += "border-slate-200";
                  } else cls += practiceAnswer === opt.key ? "border-blue-600 bg-blue-50" : "border-slate-200";
                  return (
                    <button key={opt.key} disabled={showSolution} onClick={() => {
                      setPracticeAnswer(opt.key); setShowSolution(true);
                      recordPractice(practiceQ.id, opt.key === practiceQ.correctAnswer); setStats(loadStats());
                    }} className={cls}>
                      <strong>{opt.key}.</strong> {opt.text}
                    </button>
                  );
                })}
              </div>
              {showSolution && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <p className={`font-semibold ${practiceAnswer === practiceQ.correctAnswer ? "text-emerald-700" : "text-red-700"}`}>
                    {practiceAnswer === practiceQ.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  <p className="text-sm mt-2">{practiceQ.explanation}</p>
                  {practiceQ.keyLesson && <p className="text-sm mt-2 text-blue-800"><strong>Key lesson:</strong> {practiceQ.keyLesson}</p>}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => startPractice(practiceQ.topic)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">Next</button>
                    <button onClick={() => setView("dashboard")} className="px-4 py-2 text-sm text-slate-500">Dashboard</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "bank" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Question Bank ({QUESTIONS.length})</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <input type="search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border rounded-lg text-sm w-64" />
              <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                <option value="all">All topics</option>
                {TOPICS.map((t) => <option key={t} value={t}>{t.slice(0, 40)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {filteredBank.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border p-4">
                  <span className="text-xs font-mono text-blue-600">{q.number}</span>
                  <span className="text-xs text-slate-400 ml-2">{q.difficulty}</span>
                  <p className="text-sm font-medium mt-1">{q.text}</p>
                  <button onClick={() => { setPracticeQ(q); setPracticeAnswer(null); setShowSolution(false); setView("practice"); }}
                    className="mt-2 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md">Practice</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "stats" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border p-4"><p className="text-xs text-slate-500">Accuracy</p><p className="text-xl font-bold">{overallStats.accuracy}%</p></div>
              <div className="bg-white rounded-xl border p-4"><p className="text-xs text-slate-500">Exams</p><p className="text-xl font-bold">{overallStats.examsCompleted}</p></div>
              <div className="bg-white rounded-xl border p-4"><p className="text-xs text-slate-500">Questions</p><p className="text-xl font-bold">{overallStats.totalQuestions}</p></div>
              <div className="bg-white rounded-xl border p-4"><p className="text-xs text-slate-500">Best</p><p className="text-xl font-bold">{overallStats.best}%</p></div>
            </div>
          </div>
        )}

        {view === "tutor" && (
          <div className="max-w-3xl mx-auto flex flex-col h-[70vh]">
            <h2 className="text-xl font-bold mb-2">AI Tutor</h2>
            <div className="flex-1 bg-white rounded-xl border p-4 overflow-y-auto space-y-3">
              {tutorMessages.map((m, i) => (
                <div key={i} className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100"}`}>{m.text}</div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={tutorInput} onChange={(e) => setTutorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (() => {
                if (!tutorInput.trim()) return;
                const msg = tutorInput.trim();
                setTutorMessages((m) => [...m, { role: "user", text: msg }]);
                setTutorInput("");
                let reply = "Ask about buses, 2's complement, interrupts, memory decoding, or any question from the bank.";
                const l = msg.toLowerCase();
                if (l.includes("2's") || l.includes("complement")) reply = "2's complement lets subtraction become addition. Range for 8-bit is -128 to +127.";
                else if (l.includes("polling") || l.includes("interrupt")) reply = "Polling wastes CPU time. Interrupts only notify when data is ready.";
                else if (l.includes("data bus")) reply = "Data Bus is bidirectional because data travels both ways. Address Bus is unidirectional.";
                setTimeout(() => setTutorMessages((m) => [...m, { role: "ai", text: reply }]), 500);
              })()} placeholder="Ask a question…" className="flex-1 px-4 py-2.5 border rounded-lg text-sm" />
              <button onClick={() => {
                if (!tutorInput.trim()) return;
                const msg = tutorInput.trim();
                setTutorMessages((m) => [...m, { role: "user", text: msg }]);
                setTutorInput("");
                setTimeout(() => setTutorMessages((m) => [...m, { role: "ai", text: "I can explain any CSC 106 concept. Try: Why is the data bus bidirectional? or What is 2's complement?" }]), 500);
              }} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm">Send</button>
            </div>
          </div>
        )}

        {view === "upload" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-4">PDF Import</h2>
            {!uploadDone ? (
              <div className="space-y-2">
                {["Uploading","Reading","Extracting","Identifying answers","Explanations","Organizing","Ready"].map((l, i) => (
                  <div key={l} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < uploadStep ? "bg-emerald-500 text-white" : i === uploadStep ? "bg-blue-600 text-white" : "bg-slate-200"}`}>{i < uploadStep ? "✓" : i+1}</div>
                    <span className="text-sm">{l}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-lg font-semibold text-emerald-700">✓ {QUESTIONS.length} questions ready</p>
                <button onClick={() => setView("bank")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">View Bank</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
