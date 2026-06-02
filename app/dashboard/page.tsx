"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, Plus, Trash2, Wand2, Edit3 } from "lucide-react";
import { BrandShell } from "@/components/brand-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { generateRoomCode } from "@/lib/utils";
import type { Presentation } from "@/lib/supabase/types";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("Fikavo Friday Quiz");
  const [decks, setDecks] = useState<Presentation[]>([]);
  const [status, setStatus] = useState("Loading workspace...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setStatus(data.user ? "Ready" : "Sign in to create presenter decks.");
      setLoading(false);
    });
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("presentations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setStatus(error.message);
        setDecks(data ?? []);
      });
  }, [supabase, userId]);

  async function handleAuth(type: "login" | "signup", event: FormEvent) {
    event.preventDefault();
    setStatus("Authenticating...");
    
    let authUser = null;
    
    if (type === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setStatus(error.message);
        return;
      }
      authUser = data.user;
      setStatus("Account created! You may need to disable 'Confirm email' in Supabase to login without email verification.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus(error.message);
        return;
      }
      authUser = data.user;
      setStatus("Ready");
    }

    if (authUser) {
      // Ensure the profile exists to prevent foreign key errors when creating decks
      await supabase.from("profiles").upsert({ 
        id: authUser.id, 
        email: authUser.email 
      });
      
      setUserId(authUser.id);
    }
  }

  async function createDeck(event: FormEvent) {
    event.preventDefault();
    if (!userId) return;

    setStatus("Ensuring profile exists...");
    
    // We get the email from the current session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Ignore errors here if the profile already exists, just attempt to insert it
      await supabase.from("profiles").insert({ 
        id: user.id, 
        email: user.email 
      });
    }

    const roomCode = generateRoomCode();
    setStatus("Creating deck...");

    const { data: deck, error: deckError } = await supabase
      .from("presentations")
      .insert({ title, room_code: roomCode, user_id: userId })
      .select()
      .single();

    if (deckError || !deck) {
      setStatus(deckError?.message ?? "Could not create deck.");
      return;
    }

    setDecks((current) => [deck, ...current]);
    setStatus("Deck created. Redirecting to edit page...");
    router.push(`/dashboard/${deck.id}`);
  }

  async function deleteDeck(deckId: string) {
    const { error } = await supabase.from("presentations").delete().eq("id", deckId);
    if (!error) {
      setDecks((current) => current.filter((d) => d.id !== deckId));
      setStatus("Deck deleted.");
    } else {
      setStatus(error.message);
    }
  }

  if (loading) {
    return (
      <BrandShell>
        <div className={styles.loader}>
          <div className={styles.spinner} />
        </div>
      </BrandShell>
    );
  }

  return (
    <BrandShell>
      <section className={styles.container}>
        <div className={styles.panel}>
          <LayoutDashboard className={styles.panelIcon} size={28} />
          <h1 className={styles.panelTitle}>Presenter Dashboard</h1>
          <p className={styles.panelCopy}>
            Create live decks, seed questions, and launch presenter mode. Participants never need accounts.
          </p>

          {!userId ? (
            <form className={styles.form}>
              <input
                className={styles.input}
                type="email"
                required
                placeholder="presenter@fikavo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={(e) => handleAuth('login', e)} style={{ flex: 1 }}>Sign in</Button>
                <Button variant="secondary" onClick={(e) => handleAuth('signup', e)} style={{ flex: 1 }}>Sign up</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={createDeck} className={styles.form}>
              <input 
                className={styles.input}
                value={title} 
                onChange={(event) => setTitle(event.target.value)} 
              />
              <Button>
                <Plus size={16} />
                Create starter deck
              </Button>
            </form>
          )}
          {status && (
            <p className={styles.statusMessage}>
              {status}
            </p>
          )}
        </div>

        <div>
          <div className={styles.listHeader}>
            <Wand2 size={24} className={styles.panelIcon} style={{marginBottom: 0}} />
            <h2 className={styles.listTitle}>Your decks</h2>
          </div>
          
          <div className={styles.deckList}>
            {decks.length === 0 ? (
              <div className={styles.emptyState}>
                No decks yet. Create one to start presenting.
              </div>
            ) : (
              decks.map((deck) => (
                <article key={deck.id} className={styles.deckCard}>
                  <div className={styles.deckInfo}>
                    <h3 className={styles.deckTitle}>{deck.title}</h3>
                    <p className={styles.deckCode}>Room {deck.room_code}</p>
                  </div>
                  <div className={styles.deckActions}>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/${deck.id}`}>
                        <Edit3 size={16} color="var(--text-secondary)" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteDeck(deck.id)}>
                      <Trash2 size={16} color="var(--text-secondary)" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/present/${deck.id}`}>
                        Present <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
