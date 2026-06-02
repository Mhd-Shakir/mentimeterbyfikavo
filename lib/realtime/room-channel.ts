import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import type { Database, RoomEvent } from "@/lib/supabase/types";

export function roomChannelName(roomCode: string) {
  return `room:${roomCode}`;
}

export async function broadcastRoomEvent(
  supabase: SupabaseClient<Database>,
  roomCode: string,
  event: RoomEvent
) {
  const channel = supabase.channel(roomChannelName(roomCode));
  await channel.subscribe();
  return channel.send({
    type: "broadcast",
    event: event.type,
    payload: event
  });
}
