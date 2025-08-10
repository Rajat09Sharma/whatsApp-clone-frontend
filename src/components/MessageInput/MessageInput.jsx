import { useState } from "react";
import "./MessageInput.scss";

export default function MessageInput({ onSend }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
    };

    return (
        <>
            <div className="message-contianer">
                <form onSubmit={handleSubmit} className="msg-form">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message"
                        className="text"
                    />
                    <button
                        type="submit"
                        className="btn"
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}
