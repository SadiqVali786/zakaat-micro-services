"use client";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useWhatsAppStore } from "@repo/zustand-store/whats-app-store";
import { UserRole } from "@repo/mongodb";
import { ChatMessageStatus } from "@repo/common/validators";

const WhatsAppPage = () => {
  const {
    isConnected,
    sendChatMessage,
    sendTypingMessage,
    sendSeenMessage,
    disconnect,
    sendCreateRoomMessage,
    sendJoinRoomsMessage,
    sendLeaveRoomsMessage
  } = useWebSocket(
    "ws://192.168.1.7:8003?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZva2M1ZDEwMDAzZDA5YjVlMG9kcDF1IiwiZnVsbG5hbWUiOiJTaGFoZWVuYSIsInJvbGUiOiJBUFBMSUNBTlQiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhci52ZXJjZWwuc2gvU2hhaGVlbmEifQ.qzUOc0TAU2ourHe7QMN54wEwKfnfdYd1cXhgqXxB45M"
  );

  const store = useWhatsAppStore();
  const { user, rooms, users, updateMessageStatus, setUser, setUsers } = store;

  const [message, setMessage] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomParticipants, setNewRoomParticipants] = useState<string>("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Simulate user login
      setUser({
        id: "cm6okc5d10003d09b5e0odp1u",
        role: UserRole.Applicant,
        lastSeen: new Date(),
        name: "Sadiq Vali",
        avatar: "",
        online: true
      });

      // Simulate other users
      setUsers({
        cm6ok7le80000d09bezh2k6om: {
          id: "cm6ok7le80000d09bezh2k6om",
          role: UserRole.Donor,
          lastSeen: new Date(),
          name: "Sadiq Vali",
          avatar: "",
          online: true
        },
        cm6okc5d10003d09b5e0odp1u: {
          id: "cm6okc5d10003d09b5e0odp1u",
          role: UserRole.Applicant,
          lastSeen: new Date(),
          name: "Shaheena",
          avatar: "",
          online: true
        }
      });
      // {
      //   userId: "cm6ok7le80000d09bezh2k6om",
      //   name: "Sadiq Vali",
      //   role: "DONOR",
      //   avatar: "https://avatar.vercel.sh/Sadiq%20Vali",
      //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZvazdsZTgwMDAwZDA5YmV6aDJrNm9tIiwiZnVsbG5hbWUiOiJTYWRpcSBWYWxpIiwicm9sZSI6IkRPTk9SIiwiYXZhdGFyIjoiaHR0cHM6Ly9hdmF0YXIudmVyY2VsLnNoL1NhZGlxJTIwVmFsaSJ9.BWNfCAckWQjIHmaSQ3_cIWEPJ__x5KANq4qWgVo3_qc"
      // }

      // {
      //   userId: "cm6okc5d10003d09b5e0odp1u",
      //   name: "Shaheena",
      //   role: "APPLICANT",
      //   avatar: "https://avatar.vercel.sh/Shaheena",
      //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZva2M1ZDEwMDAzZDA5YjVlMG9kcDF1IiwiZnVsbG5hbWUiOiJTaGFoZWVuYSIsInJvbGUiOiJBUFBMSUNBTlQiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhci52ZXJjZWwuc2gvU2hhaGVlbmEifQ.qzUOc0TAU2ourHe7QMN54wEwKfnfdYd1cXhgqXxB45M"
      // }
      // Simulate initial rooms
      // addRoom({
      //   id: 1,
      //   name: "Room1",
      //   participients: [
      //     { userId: "cm6ok7le80000d09bezh2k6om", typing: false },
      //     { userId: "cm6okc5d10003d09b5e0odp1u", typing: false }
      //   ],
      //   messages: []
      // });
      // addRoom({
      //   id: 2,
      //   name: "Room 2",
      //   participients: [
      //     { userId: "user1", typing: false },
      //     { userId: "user3", typing: false }
      //   ],
      //   messages: []
      // });
    }
  }, [isMounted]);

  useEffect(() => {
    if (isConnected && user) {
      sendJoinRoomsMessage();
    }
    return () => {
      if (isConnected && user) {
        sendLeaveRoomsMessage();
      }
    };
  }, [isConnected, user, sendJoinRoomsMessage, sendLeaveRoomsMessage]);

  const handleSendMessage = () => {
    if (message && selectedRoomId) {
      sendChatMessage(message, selectedRoomId);
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (selectedRoomId) {
      sendTypingMessage(selectedRoomId);
    }
  };

  const handleSeen = (
    roomId: number,
    senderId: string,
    messageId: number,
    status: ChatMessageStatus
  ) => {
    console.log({ messageId });
    sendSeenMessage(roomId, senderId, messageId, status);
    updateMessageStatus(roomId, messageId, ChatMessageStatus.MessageSeen, new Date());
  };

  const handleCreateRoom = () => {
    if (newRoomName && newRoomParticipants) {
      sendCreateRoomMessage(
        newRoomName,
        newRoomParticipants.split(",").map((id) => id.trim())
      );
      setNewRoomName("");
      setNewRoomParticipants("");
    }
  };

  console.log(users);
  console.log(rooms);

  return (
    <div>
      <h1>WhatsApp Clone</h1>
      <p>User: {user?.name}</p>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={disconnect}>Disconnect</button>

      <div>
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Participants (user1, user2)"
          value={newRoomParticipants}
          onChange={(e) => setNewRoomParticipants(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create</button>
      </div>

      <div>
        <h2>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room?.id}
              onClick={() => setSelectedRoomId(room?.id)}
              style={{
                cursor: "pointer",
                fontWeight: selectedRoomId === room?.id ? "bold" : "normal"
              }}
            >
              {room?.name} ({room?.participients.map((p) => users[p.userId]?.name).join(", ")})
            </li>
          ))}
        </ul>
      </div>

      {selectedRoomId && (
        <div>
          <h2>Chat Room {rooms.find((r) => r.id === selectedRoomId)?.name}</h2>
          <div>
            {rooms
              .find((r) => r.id === selectedRoomId)
              ?.messages.map((m) => (
                <div key={m.messageId}>
                  {users[m.senderId]?.name}: {m.message} - {m.status}
                  {m.status === ChatMessageStatus.MessageRecieved && (
                    <button
                      onClick={() =>
                        handleSeen(
                          selectedRoomId,
                          m.senderId,
                          m.messageId,
                          ChatMessageStatus.MessageSeen
                        )
                      }
                    >
                      Seen
                    </button>
                  )}
                </div>
              ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            onKeyUp={handleTyping}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      {/* JOIN_ROOMS */}
      {/* <div>
        <button
          onClick={() =>
            sendMessage(
              JSON.stringify({
                type: "JOIN_ROOMS",
                payload: {
                  roomIds: [1, 2, 3]
                }
              })
            )
          }
        >
          JOIN_ROOMS
        </button>
      </div>

      {/* LEAVE_ROOMS */}
      {/* <div>
        <button
          onClick={() =>
            sendMessage(
              JSON.stringify({
                type: "LEAVE_ROOMS",
                payload: {
                  roomIds: [1, 2, 3]
                }
              })
            )
          }
        >
          JOIN_ROOMS
        </button>
      </div> */}

      {/* Add Room */}
      {/* <div>
        <button
          onClick={() =>
            sendMessage(
              JSON.stringify({
                type: "CREATE_ROOM",
                payload: {
                  roomId: 123,
                  donorId: "cm6ok7le80000d09bezh2k6om",
                  applicantId: "cm6okc5d10003d09b5e0odp1u"
                }
              })
            )
          }
        >
          Add Room
        </button>
      </div> */}

      {/* TYPING */}
      {/* <div>
        <button
          onClick={() =>
            sendMessage(
              JSON.stringify({
                type: "TYPING",
                payload: {
                  roomId: 123,
                  userId: "cm6ok7le80000d09bezh2k6om",
                }
              })
            )
          }
        >
          Add Room
        </button>
      </div> */}
    </div>
  );
};

export default WhatsAppPage;
