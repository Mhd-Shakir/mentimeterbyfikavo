import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function calculatePoints(timeTakenMs: number, timeLimitSeconds: number, isCorrect: boolean) {
  if (!isCorrect) return 0;
  const totalMs = Math.max(1, timeLimitSeconds * 1000);
  const remainingRatio = Math.max(0, totalMs - timeTakenMs) / totalMs;
  return Math.round(300 + remainingRatio * 700);
}
