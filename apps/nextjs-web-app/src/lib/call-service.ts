import { useVideoCallStore } from "@repo/zustand/src/video-call-store";
import { DifferentWebRTCSignallingServerMessages, WebRTCCallStatus } from "@repo/common/types";

export const initiateVideoCall = async (
  applicantId: string,
  applicantName: string,
  applicantImage: string,
  donorId: string,
  donorName: string,
  donorImage: string
) => {
  const store = useVideoCallStore.getState();
  const { socket } = store;

  if (!socket) {
    throw new Error("WebSocket connection not established");
  }

  try {
    // Set call status to outgoing before navigation
    store.setCallStatus(WebRTCCallStatus.Outgoing);

    // Send consent request to the server
    socket.send(
      JSON.stringify({
        type: DifferentWebRTCSignallingServerMessages.Consent,
        payload: {
          applicantId,
          donorId,
          donorName,
          donorImage
        }
      })
    );

    store.setCallerInfo({
      id: applicantId,
      name: applicantName,
      image: "https://res.cloudinary.com/dud648ixu/image/upload/v1744800612/charan_q5w2zy.png" // applicantImage
    });
  } catch (error) {
    console.error("Failed to initiate call:", error);
    store.resetCall();
  }
};
