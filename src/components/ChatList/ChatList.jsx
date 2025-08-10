import "./ChatList.scss"
import { RiChatNewFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import userImg from "../../assets/user.png"
import { useEffect, useState } from "react";

const filters = ["All", "Unread", "Favourites", "Groups"];
const API_URL = import.meta.env.VITE_API_URL;

export default function ChatList({ chats, onChats, onSelect, selected }) {

    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function fetchChatLists() {
            try {
                const response = await fetch(`${API_URL}/api/chats`)
                const result = await response.json();
                // console.log(result);
                onChats(result.chatsList)
                setLoading(false);
            } catch (error) {
                console.log("chat list error", error);
                setLoading(false);
                setError(true);
            }
        }
        fetchChatLists();

    }, []);

    return (
        <div className="chat-list">
            <div className="header">
                <main className="heading">
                    <h2>WhatsApp</h2>
                    <div className="h-icon">
                        <span><RiChatNewFill /></span>
                        <span><BsThreeDotsVertical /></span>
                    </div>
                </main>

                <div className="search-bar">
                    <span className="search-icon"><CiSearch /></span>
                    <input type="search" name="serach" placeholder="Search or start a new chat" />
                </div>

                <div className="filter-bar">
                    {
                        filters.map((filter, index) => <p key={index} className="fliter">{filter}</p>)
                    }

                </div>
            </div>

            {isLoading && <p>Loading Chats......</p>}
            {!isLoading && isError && <p>Error in loading chats.</p>}

            {!isLoading && !isError && chats.map((chat) => (
                <div
                    key={chat.wa_id}
                    onClick={() => onSelect(chat)}
                    className={selected?.wa_id == chat?.wa_id ? "users-container active" : "users-container"}
                >
                    <div className="left-wrapper">
                        <img className="user-img" src={userImg} alt={chat.name} />
                    </div>
                    <div className="right-wrapper">
                        <h2 className="">{chat.name || chat.wa_id}</h2>
                        <p className="">{chat.wa_id}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
