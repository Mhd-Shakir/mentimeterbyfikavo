"use client";

import { useEffect, useMemo, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database, Presentation, Response, RoomEvent } from "@/lib/supabase/types";
import { roomChannelName } from "@/lib/realtime/room-channel";

type RoomRealtimeState = {
  activeCount: number;
  lastEvent: RoomEvent | null;
  responses: Response[];
};

export function useRoomRealtime(roomCode: string, nickname?: string) {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<RoomRealtimeState>({
    activeCount: 0,
    lastEvent: null,
    responses: []
  });
  const [presentation, setPresentation] = useState<Presentation | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const channel: RealtimeChannel = supabase
      .channel(roomChannelName(roomCode), {
        config: {
          presence: { key: nickname || crypto.randomUUID() }
        }
      })
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        setState((current) => ({
          ...current,
          activeCount: Object.keys(presenceState).length
        }));
      })
      .on("broadcast", { event: "slide-change" }, ({ payload }) => {
        setState((current) => ({ ...current, lastEvent: payload as RoomEvent }));
      })
      .on("broadcast", { event: "quiz-ended" }, ({ payload }) => {
        setState((current) => ({ ...current, lastEvent: payload as RoomEvent }));
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "presentations",
          filter: `room_code=eq.${roomCode}`
        },
        (payload: RealtimePostgresChangesPayload<Database["public"]["Tables"]["presentations"]["Row"]>) => {
          setPresentation(payload.new as Presentation);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
          filter: `room_code=eq.${roomCode}`
        },
        (payload: RealtimePostgresChangesPayload<Database["public"]["Tables"]["responses"]["Row"]>) => {
          const newResponse = payload.new as Response;
          setState((current) => ({
            ...current,
            responses: [...current.responses.filter((r) => r.id !== newResponse.id), newResponse]
          }));
        }
      );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          nickname: nickname || "Presenter",
          joinedAt: new Date().toISOString()
        });
      }
    });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [nickname, roomCode, supabase]);

  return { ...state, presentation };
}
