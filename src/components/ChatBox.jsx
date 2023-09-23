/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io(
  `${import.meta.env.VITE_SOCKET_URL}?user=${window.localStorage.getItem(
    "username"
  )}`,
  { autoConnect: false }
);
import Chat from "./Chat";
export default function ChatBox({ roomId }) {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [sharableURL, setSharableURL] = useState("");

  const inputRef = useRef(null);

  const styles = {
    buttonStyle: {
      borderRadius: "1rem",
      border: "1px solid black",
      borderColor: "indianred",
      height: "3.2rem",
    },
  };
  const msgInputHandler = (e) => {
    setMsg(e.target.value);
  };

  const checkURLandConnectSocket = () => {
    const existingRoom = new URL(window.location.href).searchParams.get("room");
    if (!existingRoom) {
      const url = `${window.location.href}?room=${roomId}`;
      setSharableURL(url);
    } else {
      setSharableURL(window.location.href);
    }

    // establish connection and creating room
    if (roomId.length > 0) {
      socket.connect();
      socket.emit("room", roomId);
      socket.emit(roomId, {
        text: `${window.localStorage.getItem("username")} joined the Chat`,
        sender: window.localStorage.getItem("username"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        type: "special",
      });
    }
  };
  const buttonClickHandler = () => {
    if (msg.trim().length > 0) {
      if (socket !== "") {
        setMsgList((msgs) => [
          ...msgs,
          {
            text: msg,
            id: `${socket.id}${Math.random()}`,
            sender: window.localStorage.getItem("username"),
            socketID: socket.id,
            type: "regular",
          },
        ]);
        socket.emit(roomId, {
          text: msg,
          id: `${socket.id}${Math.random()}`,
          sender: window.localStorage.getItem("username"),
          socketID: socket.id,
          type: "regular",
        });
        setMsg("");
        inputRef.current?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
        inputRef.current.focus();
      }
    }
  };
  useEffect(() => {
    if (socket !== "") {
      socket.on(roomId, (msg) => {
        if (msg.sender !== window.localStorage.getItem("username")) {
          setMsgList((msgs) => [...msgs, msg]);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (!window.localStorage.getItem("username")) {
      let userName = window.prompt("Your good name please!");
      if (userName.length > 0)
        window.localStorage.setItem("username", userName.toLowerCase());
      else location.reload();
    }
    checkURLandConnectSocket();
    inputRef.current.focus();
    return () => {
      socket.emit(roomId, {
        text: `${window.localStorage.getItem("username")} left the Chat`,
        sender: window.localStorage.getItem("username"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        type: "special",
      });
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <ul
        style={{
          listStyleType: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "10%",
          padding: 0,
        }}
      >
        {msgList.length > 0 &&
          msgList.map((item, index) => {
            return <Chat msg={item} key={index} />;
          })}
      </ul>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: "5%",
          }}
        >
          <input
            type="text"
            ref={inputRef}
            placeholder="Give your message"
            value={msg}
            style={{
              width: "90%",
              height: "3rem",
              borderRadius: "1rem",
              borderColor: "indianred",
            }}
            onChange={(e) => {
              msgInputHandler(e);
            }}
          />
          <button
            type="button"
            style={{ ...styles.buttonStyle }}
            onClick={() => {
              buttonClickHandler();
            }}
          >
            Send
          </button>
        </div>
        <span style={{ marginTop: "1rem" }}>
          Share this with whomever you want to join this room.
          <span>{"   "}</span>
          <a
            onClick={async (e) => {
              let url = e.target.innerText;
              await navigator.clipboard.writeText(url);

              // Alert the copied text
              alert("Link Copied: " + url);
            }}
            style={{ cursor: "pointer" }}
          >
            {sharableURL}
          </a>
        </span>
      </div>
    </div>
  );
}
