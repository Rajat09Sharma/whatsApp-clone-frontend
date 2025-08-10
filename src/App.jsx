import { useState } from "react";
import ChatList from "./components/ChatList/ChatList";
import ChatWindow from "./components/ChatWindow/ChatWindow";

// const chatsArr = [
//   {
//     wa_id: "911",
//     name: "Ravi Kumar",
//   },
//   {
//     wa_id: "344",
//     name: "Neha Jor"
//   }
// ]

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  return (
    <div className="flex h-screen">

      <ChatList chats={chats} onChats={setChats} onSelect={setSelectedUser} selected={selectedUser} />

      <ChatWindow wa_id={selectedUser?.wa_id} name={selectedUser?.name} roomId={selectedUser?.roomId} />

    </div>
  );
}
