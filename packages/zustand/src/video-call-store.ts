import { create } from "zustand";
import Peer, { MediaConnection } from "peerjs";
import { WebRTCCallStatus } from "@repo/common/types";

interface VideoCallState {
  peer: Peer | null;
  socket: WebSocket | null;
  callReference: MediaConnection | null;
  remotePeerId: string | null;
  callStatus: WebRTCCallStatus;
  callerInfo: { id: string; name: string; image: string } | null;
  mediaControls: {
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
  };
  mediaStream: MediaStream | null;
  callTimeout: NodeJS.Timeout | null;
  remoteMediaControls: {
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
  };
  dataChannel: RTCDataChannel | null;

  // Actions
  setPeer: (peer: Peer | null) => void;
  setSocket: (socket: WebSocket | null) => void;
  setCallReference: (call: MediaConnection | null) => void;
  setRemotePeerId: (id: string | null) => void;
  setCallStatus: (status: WebRTCCallStatus) => void;
  setCallerInfo: (
    info: { id: string; name: string; image: string } | null
  ) => void;
  setMediaStream: (stream: MediaStream | null) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  resetCall: () => void;
  setCallTimeout: (timeout: NodeJS.Timeout | null) => void;
  handleIncomingCall: (
    callerId: string,
    callerName: string,
    callerImage: string
  ) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  setRemoteMediaControls: (controls: {
    isAudioEnabled?: boolean;
    isVideoEnabled?: boolean;
  }) => void;
  setDataChannel: (channel: RTCDataChannel | null) => void;
}

export const useVideoCallStore = create<VideoCallState>((set, get) => ({
  peer: null,
  socket: null,
  callReference: null,
  remotePeerId: null,
  callStatus: WebRTCCallStatus.Idle,
  callerInfo: null,
  mediaControls: {
    isAudioEnabled: true,
    isVideoEnabled: true,
  },
  mediaStream: null,
  callTimeout: null,
  remoteMediaControls: {
    isAudioEnabled: true,
    isVideoEnabled: true,
  },
  dataChannel: null,

  setPeer: (peer) => set({ peer }),
  setSocket: (socket) => set({ socket }),
  setCallReference: (call) => set({ callReference: call }),
  setRemotePeerId: (id) => set({ remotePeerId: id }),
  setCallStatus: (status) => set({ callStatus: status }),
  setCallerInfo: (info) => set({ callerInfo: info }),
  setMediaStream: (stream) => set({ mediaStream: stream }),
  setRemoteMediaControls: (controls) =>
    set((state) => ({
      remoteMediaControls: {
        isAudioEnabled:
          controls.isAudioEnabled !== undefined
            ? controls.isAudioEnabled
            : state.remoteMediaControls.isAudioEnabled,
        isVideoEnabled:
          controls.isVideoEnabled !== undefined
            ? controls.isVideoEnabled
            : state.remoteMediaControls.isVideoEnabled,
      },
    })),
  setDataChannel: (channel) => set({ dataChannel: channel }),

  toggleAudio: () => {
    const { mediaStream, dataChannel } = get();
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      const newEnabled = !audioTracks[0]?.enabled;

      // Only modify audio tracks
      audioTracks.forEach((track) => {
        track.enabled = newEnabled;
      });

      // Send only audio control update through data channel
      if (dataChannel?.readyState === "open") {
        dataChannel.send(
          JSON.stringify({
            type: "mediaControl",
            audio: newEnabled,
            // Don't include video state to avoid affecting it
          })
        );
      }

      set((state) => ({
        mediaControls: {
          ...state.mediaControls,
          isAudioEnabled: newEnabled,
          // Keep video state unchanged
          isVideoEnabled: state.mediaControls.isVideoEnabled,
        },
      }));
    }
  },

  toggleVideo: () => {
    const { mediaStream, dataChannel } = get();
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      const newEnabled = !videoTracks[0]?.enabled;

      // Only modify video tracks
      videoTracks.forEach((track) => {
        track.enabled = newEnabled;
      });

      // Send only video control update through data channel
      if (dataChannel?.readyState === "open") {
        dataChannel.send(
          JSON.stringify({
            type: "mediaControl",
            video: newEnabled,
            // Don't include audio state to avoid affecting it
          })
        );
      }

      set((state) => ({
        mediaControls: {
          ...state.mediaControls,
          isVideoEnabled: newEnabled,
          // Keep audio state unchanged
          isAudioEnabled: state.mediaControls.isAudioEnabled,
        },
      }));
    }
  },

  setCallTimeout: (timeout) => set({ callTimeout: timeout }),

  handleIncomingCall: (
    callerId: string,
    callerName: string,
    callerImage: string
  ) => {
    // Set new call info
    set({
      callStatus: WebRTCCallStatus.Incoming,
      callerInfo: {
        id: callerId,
        name: callerName,
        image: callerImage,
      },
    });

    // Set new timeout
    const timeout = setTimeout(() => {
      const state = get();
      if (state.callStatus === WebRTCCallStatus.Incoming) {
        // Auto-reject if call wasn't answered
        state.rejectCall();
      }
    }, 30000); // 30 seconds

    set({ callTimeout: timeout });
  },

  acceptCall: () => {
    const { socket, callerInfo, callTimeout, peer } = get();

    // Clear timeout
    if (callTimeout) {
      clearTimeout(callTimeout);
      set({ callTimeout: null });
    }

    if (!socket || !callerInfo) {
      throw new Error("No socket or caller info found");
    }

    // Send acceptance message
    socket.send(
      JSON.stringify({
        type: "PERMISSION",
        payload: {
          donorId: callerInfo.id,
          applicantPeerId: peer?.id,
        },
      })
    );

    set({ callStatus: WebRTCCallStatus.Connected });
  },

  rejectCall: () => {
    const { socket, callerInfo, callTimeout } = get();

    // Clear timeout
    if (callTimeout) {
      clearTimeout(callTimeout);
      set({ callTimeout: null });
    }

    if (!socket || !callerInfo) {
      throw new Error("No socket or caller info found");
    }

    // Send rejection message
    socket.send(
      JSON.stringify({
        type: "BUSY",
        payload: {
          donorId: callerInfo.id,
        },
      })
    );

    // Reset call state
    get().resetCall();
  },

  resetCall: () => {
    const { mediaStream, callReference, callTimeout, dataChannel } = get();

    if (callTimeout) {
      clearTimeout(callTimeout);
    }

    if (dataChannel) {
      dataChannel.close();
    }

    callReference?.close();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    set({
      callReference: null,
      remotePeerId: null,
      callStatus: WebRTCCallStatus.Idle,
      callerInfo: null,
      mediaStream: null,
      callTimeout: null,
      dataChannel: null,
    });
  },
}));
