"use client";

export interface ExamAttempt {
  id: string;
  date: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  timeSpentSeconds: number;
  answers: Record<string, string>;
  markedForReview: string[];
}

export interface UserStats {
  attempts: ExamAttempt[];
  bookmarked: string[];
  practiceHistory: { questionId: string; correct: boolean; date: string }[];
}

const STORAGE_KEY = "pq_platform_v1";

export function loadStats(): UserStats {
  if (typeof window === "undefined") return { attempts: [], bookmarked: [], practiceHistory: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [], bookmarked: [], practiceHistory: [] };
    return JSON.parse(raw) as UserStats;
  } catch {
    return { attempts: [], bookmarked: [], practiceHistory: [] };
  }
}

export function saveStats(stats: UserStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function addAttempt(attempt: ExamAttempt) {
  const stats = loadStats();
  stats.attempts.unshift(attempt);
  stats.attempts = stats.attempts.slice(0, 50);
  saveStats(stats);
}

export function recordPractice(questionId: string, correct: boolean) {
  const stats = loadStats();
  stats.practiceHistory.unshift({ questionId, correct, date: new Date().toISOString() });
  stats.practiceHistory = stats.practiceHistory.slice(0, 200);
  saveStats(stats);
}

export function toggleBookmark(questionId: string) {
  const stats = loadStats();
  if (stats.bookmarked.includes(questionId)) {
    stats.bookmarked = stats.bookmarked.filter((id) => id !== questionId);
  } else {
    stats.bookmarked.push(questionId);
  }
  saveStats(stats);
  return stats.bookmarked;
}
