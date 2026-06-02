"use client";

import { Suspense, FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import styles from "./join.module.css";

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [roomCode, setRoomCode] = useState(params.get("code") ?? "");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinRoom(event: FormEvent) {
    event.preventDefault();
    const cleanCode = roomCode.replace(/\D/g, "").slice(0, 6);
    const cleanName = nickname.trim().slice(0, 24);

    if (cleanCode.length !== 6) {
      setStatus("Enter a valid 6-digit room code.");
      return;
    }
    if (cleanName.length < 2) {
      setStatus("Nickname must be at least 2 characters.");
      return;
    }

    setLoading(true);
    setStatus("");

    sessionStorage.setItem(`fikavo:nickname:${cleanCode}`, cleanName);
    router.push(`/room/${cleanCode}`);
  }

  return (
    <>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.headerWrap}>
          <div className={styles.iconWrapper}>
            <LogIn size={24} />
          </div>
          <h1 className={styles.title}>Join live quiz</h1>
          <p className={styles.subtitle}>Enter the 6-digit code from the presenter screen.</p>
        </div>

        <form onSubmit={joinRoom} className={styles.form}>
          <div>
            <label className={styles.label}>
              Room code
            </label>
            <input
              inputMode="numeric"
              minLength={6}
              maxLength={6}
              required
              placeholder="000000"
              className={`${styles.input} ${styles.inputCode}`}
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <div>
            <label className={styles.label}>
              Nickname
            </label>
            <input
              required
              maxLength={24}
              placeholder="Your display name"
              className={styles.input}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            />
          </div>
          <Button size="lg" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Joining..." : "Join room"}
          </Button>
          {status && (
            <p className={styles.statusError}>
              {status}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default function JoinPage() {
  return (
    <main className={styles.main}>
      <Suspense fallback={
        <div className={styles.loaderWrap}>
          <div className={styles.spinner} />
        </div>
      }>
        <JoinForm />
      </Suspense>
    </main>
  );
}
