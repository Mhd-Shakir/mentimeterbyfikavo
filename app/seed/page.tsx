"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const rawData = `
2. ഐക്യരാഷ്ട്രസഭയുടെ (UN) ആസ്ഥാനം എവിടെയാണ്?
A) ജനീവ
B) പാരീസ്
C) ലണ്ടൻ
D) ന്യൂയോർക്ക്  ✅

3. ഒഴുകുന്ന പുഴയിൽ. നിന്നാണെങ്കിൽ പോലും വുളൂഅ് എടുക്കുമ്പോൾ വെള്ളം പാഴാക്കരുത് (ഇസ്റാഫ് പാടില്ല) എന്ന് നബി (സ) ഉപദേശിച്ചത് ഏത് സ്വഹാബിയോടാണ്?
A) സഅ്ദ് ഇബ്നു അബീ വഖ്ഖാസ് (റ) ✅
B) അബൂബക്കർ സിദ്ദീഖ് (റ)
C) ഉമർ ഇബ്നുൽ ഖത്താബ് (റ)
D) അലി ഇബ്നു അബീത്വാലിബ് (റ)

4. ഇന്ത്യയിലെ ആദ്യ സമ്പൂർണ സൗരോർജ വിമാനത്താവളം ഏതാണ്?
A) ഇന്ദിരാഗാന്ധി അന്താരാഷ്ട്ര വിമാനത്താവളം (ഡൽഹി)
B) കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളം (CIAL) ✅
C) കെംപഗൗഡ അന്താരാഷ്ട്ര വിമാനത്താവളം (ബംഗളൂരു)
D) ഛത്രപതി ശിവാജി മഹാരാജ് വിമാനത്താവളം (മുംബൈ)

5. പരിസ്ഥിതി സംരക്ഷണത്തിനായി ഇന്ത്യയിൽ 'ചിപ്കോ പ്രസ്ഥാനം' (Chipko Movement) ആരംഭിക്കുന്നതിന് നേതൃത്വം നൽകിയ പ്രമുഖ പരിസ്ഥിതി പ്രവർത്തകൻ ആരാണ്?
A) മേധാ പട്കർ
B) സുന്ദർലാൽ ബഹുഗുണ ✅
C) സലിം അലി
D) ബാബ ആംതെ

6. ഇന്റർനാഷണൽ ക്രിക്കറ്റ് കൗൺസിലിന്റെ (ICC) ആസ്ഥാനം നിലവിൽ എവിടെയാണ് സ്ഥിതി ചെയ്യുന്നത്?
A) ലണ്ടൻ (ഇംഗ്ലണ്ട്)
B) മെൽബൺ (ഓസ്ട്രേലിയ)
C) ദുബായ് (UAE) ✅
D) മുംബൈ (ഇന്ത്യ)

7. സ്വതന്ത്ര ഇന്ത്യയിലെ ആദ്യത്തെ വിദ്യാഭ്യാസ മന്ത്രി ആരായിരുന്നു?
A) മൗലാനാ അബുൽ കലാം ആസാദ് ✅
B) ഡോ. ബി.ആർ. അംബേദ്കർ
C) സർദാർ വല്ലഭഭായ് പട്ടേൽ
D) ജവഹർലാൽ നെഹ്റു

8. ആദ്യമായി ഫിഫ ലോകകപ്പ് (FIFA World Cup) ഫുട്ബോൾ ടൂർണമെന്റ് ആരംഭിച്ച വർഷം ഏതാണ്?
A) 1924
B) 1930 ✅
C) 1950
D) 1942

9. കേരള നിയമസഭയിലെ ആകെ ജനപ്രതിനിധികളുടെ (MLA) സീറ്റുകളുടെ എണ്ണം എത്രയാണ്?
A) 120
B) 130
C) 140 ✅
D) 141

10. വിശുദ്ധ ഖുർആനിൽ ഒരു സൂറത്തിന്റെ പേര് 'തേനീച്ച' എന്നാണ്. പ്രകൃതിയിലെ ഈ ചെറിയ ജീവിയുടെ പ്രാധാന്യത്തെ വിളിച്ചോതുന്ന ഈ സൂറത്ത് ഏതാണ്?
A) സൂറത്തുൽ ബഖറ
B) സൂറത്തുന്നംല്
C) സൂറത്തുന്നഹ്ല് ✅
D) സൂറത്തുൽ ഫീൽ

11. ഇന്ന് പ്രഖ്യാപിച്ച eco campaign-ന്റെ പേര് എന്താണ്?
A) ecovive ✅
B) ecosave
C) greenearth
D) naturefirst

12. ഖുർആനിൽ ഏറ്റവും കൂടുതൽ തവണ (136 തവണ) പേര് പരാമർശിക്കപ്പെടുകയും, ഒരു സൂറത്തിൽ മാത്രം 25 തവണ പ്രതിപാദിക്കപ്പെടുകയും ചെയ്ത പ്രവാചകൻ ആരാണ്?
A) ഈസാ നബി (അ)
B) മൂസാ നബി (അ) ✅
C) ഇബ്രാഹീം നബി (അ)
D) യൂസുഫ് നബി (അ)

13. ജനസംഖ്യ പ്രകാരം ലോകത്തിലെ ഏറ്റവും ചെറിയ രാജ്യം ഏതാണ്?
A) മൊണാക്കോ
B) സാൻ മരീനോ
C) മാലദ്വീപ്
D) വത്തിക്കാൻ സിറ്റി  ✅

14 നിലവിലെ പുതിയ മന്ത്രിസഭയിൽ ആഭ്യന്തരം (Home), വിജിലൻസ് എന്നീ പ്രധാന വകുപ്പുകൾ കൈകാര്യം ചെയ്യുന്ന മന്ത്രി ആരാണ്?
A) രമേശ് ചെന്നിത്തല ✅
B) വി.ഡി. സതീശൻ
C) കെ. മുരളീധരൻ
D) എ.പി. അനിൽ കുമാർ

15. മനുഷ്യ ശരീരത്തിലെ ഏറ്റവും വലിയ അസ്ഥി (Bone) ഏതാണ്?
A) തുടയെല്ല് (Femur)  ✅
B) നട്ടെല്ല്
C) താടിയെല്ല്
D) കൈയെല്ല്

16. ക്ഷമ ഉള്ളവർക്ക് മാതൃകയായി വിശുദ്ധ ഖുർആനിലും ചരിത്രത്തിലും പറയപ്പെടുന്ന പ്രവാചകൻ ആര്?
A) നൂഹ് നബി (അ)
B) യൂനുസ് നബി (അ)
C) അയ്യൂബ് നബി (അ) ✅
D) യഅ്ഖൂബ് നബി (അ)

17. ലഹരിക്കെതിരെ നിലവിലെ സർക്കാർ മുന്നോട്ടുവെച്ച ക്യാമ്പയിന്റെ പേരെന്താണ്?
A) വിമുക്തി
B) ഓപ്പറേഷൻ തൂഫാൻ  ✅
C) യോദ്ധാവ്
D) ക്ലീൻ കാമ്പസ്

18. സമസ്ത കേരള ജംഇയ്യത്തുൽ ഉലമയുടെ പ്രഥമ പ്രസിഡന്റ് ആരായിരുന്നു?
A) ഇ.കെ. അബൂബക്കർ മുസ്ലിയാർ ✅
B) വരക്കൽ മുല്ലക്കോയ തങ്ങൾ
C) കെ.ടി. മാനു മുസ്ലിയാർ
D) പാണക്കാട് സയ്യിദ് അലി തങ്ങൾ

19. ഇന്ത്യയിൽ ഏറ്റവും കൂടുതൽ കടൽത്തീരമുള്ള (Coastline) സംസ്ഥാനം ഏതാണ്?
A) കേരളം
B) തമിഴ്നാട്
C) മഹാരാഷ്ട്ര
D) ഗുജറാത്ത്  ✅

20. കേരളത്തിലൂടെ ഒഴുകുന്ന ഏറ്റവും നീളം കൂടിയ നദി ഏതാണ്?
A) പെരിയാർ ✅
B) ഭാരതപ്പുഴ
C) പമ്പ
D) ചാലിയാർ
`;

export default function SeedPage() {
  const supabase = useMemo(() => createClient(), []);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  async function startSeeding() {
    setLoading(true);
    addLog("Starting seeding process...");

    try {
      const items = rawData.trim().split(/\n\s*\n/);
      const questions = items.map((item) => {
        const lines = item.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        const questionTextMatch = lines[0].match(/^\d+\.?\s*(.+)/);
        const questionText = questionTextMatch ? questionTextMatch[1] : lines[0];

        const options = lines.slice(1).map(optLine => {
          const isCorrect = optLine.includes("✅");
          let text = optLine.replace(/^[A-D]\)\s*/, "").replace(/✅/g, "").trim();
          return { text, isCorrect };
        });

        return { questionText, options };
      });

      addLog(`Parsed ${questions.length} questions from text.`);

      const { data: decks, error: fetchError } = await supabase
        .from("presentations")
        .select("id, title")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError || !decks || decks.length === 0) {
        addLog(`Error: Could not find any decks! Create a deck in the dashboard first. ${fetchError?.message}`);
        setLoading(false);
        return;
      }

      const deckId = decks[0].id;
      addLog(`Found latest deck: "${decks[0].title}" (${deckId}). Adding questions to this deck...`);

      const { data: existingQ } = await supabase
        .from("questions")
        .select("order_index")
        .eq("presentation_id", deckId)
        .order("order_index", { ascending: false })
        .limit(1);
      
      let nextIndex = existingQ && existingQ.length > 0 ? existingQ[0].order_index + 1 : 0;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const { data: createdQuestion, error: qError } = await supabase
          .from("questions")
          .insert({
            presentation_id: deckId,
            question_text: q.questionText,
            time_limit: 20,
            order_index: nextIndex++
          })
          .select()
          .single();

        if (qError || !createdQuestion) {
          addLog(`Failed to insert question ${i + 2}: ${qError?.message}`);
          continue;
        }

        const optionsToInsert = q.options.map(opt => ({
          question_id: createdQuestion.id,
          option_text: opt.text,
          is_correct: opt.isCorrect
        }));

        const { error: optError } = await supabase
          .from("options")
          .insert(optionsToInsert);
        
        if (optError) {
          addLog(`Failed to insert options for question ${i + 2}: ${optError.message}`);
        } else {
          addLog(`Inserted Question: "${q.questionText.substring(0, 30)}..."`);
        }
      }
      
      addLog("All 19 questions added successfully! You can now close this page.");
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "3rem", background: "white", color: "black", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Seed Malayalam Quiz Questions</h1>
      <p style={{ marginBottom: "2rem" }}>Clicking the button below will instantly add the 19 Malayalam questions to your most recently created deck, each with a 20-second timer.</p>
      
      <button 
        onClick={startSeeding} 
        disabled={loading}
        style={{ padding: "1rem 2rem", background: "#6366f1", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
      >
        {loading ? "Seeding..." : "Inject Questions into Latest Deck"}
      </button>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f3f4f6", borderRadius: "8px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {logs.map((l, i) => <div key={i}>{l}</div>)}
        {logs.length === 0 && "Logs will appear here..."}
      </div>
    </div>
  );
}
