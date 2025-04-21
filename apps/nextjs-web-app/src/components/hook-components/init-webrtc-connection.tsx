"use client";

import { useWebRTCSignaling } from "@/hooks/use-webrtc-signalling";

export function InitWebRTCConnection() {
  useWebRTCSignaling();

  return null;
}
