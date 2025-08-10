import { useEffect, useState, useRef } from "react";
import MessageInput from "../MessageInput/MessageInput";
import { io } from "socket.io-client";

import "./ChatWindow.scss";
import userImg from "../../assets/user.png";
import logoImg from "../../assets/wa-logo.png";
import { MdOutlineVideocam } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

const userFuncs = [<MdOutlineVideocam />, <CiSearch />, <BsThreeDotsVertical />];
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL;

export default function ChatWindow({ wa_id, name, roomId }) {

  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    setLoading(true);
    async function fetchMessages() {
      try {
        const response = await fetch(`${API_URL}/api/message/${wa_id}/${roomId}`);
        const result = await response.json();
        // console.log(result);

        setMessagesByRoom((prev) => ({
          ...prev,
          [roomId]: [...result.messages],
        }));
        setLoading(false);
      } catch (error) {
        console.log("fetch messages error:", error);
        setLoading(false);
        setError(true);
      }
    }
    fetchMessages();
  }, [wa_id, roomId])



  useEffect(() => {
    socket.current = io(SOCKET_URL, {
      autoConnect: true,
    });
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByRoom, wa_id]);

  useEffect(() => {
    if (!wa_id) return;

    // const roomId = ["01", wa_id].sort().join("_");

    // Join the room
    socket.current.emit("joinRoom", roomId);

    const eventName = `receiveMessage:${roomId}`;
    socket.current.on(eventName, (data) => {

      setMessagesByRoom((prev) => ({
        ...prev,
        [data.roomId]: [...(prev[data.roomId] || []), data],
      }));
    });

    return () => {
      socket.current.emit("leaveRoom", roomId);
      socket.current.off(eventName);
    };
  }, [wa_id, roomId]);

  const handleSend = async (text) => {
    const newMsg = {
      wa_id,
      name,
      text,
      from: "01",
      status: "sent",
      timestamp: new Date().toISOString(),
    };

    // const roomId = ["01", wa_id].sort().join("_");

    socket.current.emit("sendMessage", {
      roomId,
      ...newMsg,
    });
  };

  // const currentRoomId = wa_id ? ["01", wa_id].sort().join("_") : null;
  const currentMessages = roomId ? messagesByRoom[roomId] || [] : [];

  return (
    <>
      {!wa_id ? (
        <div className="about-app">
          <div className="img-wrapper">
            <img src={logoImg} alt="wa-logo" />
          </div>
          <div className="content">
            <h1>Real-Time Chat App – A Modern WhatsApp Clone with React & Node.js.</h1>
            <p>&copy; {new Date().getFullYear()} Made by Rajat Sharma</p>
          </div>
        </div>
      ) : (
        <div className="chat-window-container">
          <div className="user-head">
            <div className="left-wrapper">
              <div className="img-wrapper">
                <img src={userImg} alt={name || wa_id} />
              </div>
              <h3>{name || wa_id}</h3>
            </div>

            <div className="right-wrapper">
              {userFuncs.map((fun, index) => {
                if (index === 0) {
                  return (
                    <span key={index} className="user-icon">
                      {fun} <IoIosArrowDown />
                    </span>
                  );
                }
                return <span key={index}>{fun}</span>;
              })}
            </div>
          </div>

          {isLoading && <p>Loading message......</p>}
          {!isLoading && isError && <p>Error in loading message.</p>}


          {!isLoading && !isError && <div className="message-container">
            {currentMessages.map((msg, index) => {
              let timestamp = `${new Date(msg.timestamp).toLocaleTimeString()}`;

              if (msg.status === "delivered") {
                timestamp += " ✓";
              } else if (msg.status === "seen") {
                timestamp += " ✓✓";
              }

              return (
                <div
                  key={index}
                  className={`message-wrapper ${msg.from !== "01" ? "inbound" : "outbound"
                    }`}
                >
                  <p className="text">{msg.text}</p>
                  <p className="timestamp">{timestamp}</p>
                </div>
              );
            })}

            <span ref={messagesEndRef} />
          </div>}

          <MessageInput onSend={handleSend} />
        </div>
      )}
    </>
  );
}
