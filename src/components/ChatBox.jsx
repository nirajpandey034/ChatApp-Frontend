/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Socket from "../config/socket";
import Chat from "./Chat";
export default function ChatBox({ roomId }) {
  const [msgList, setMsgList] = useState([]);
  const [sharableURL, setSharableURL] = useState("");

  const inputRef = useRef(null);
  const socket = useRef(null);
  const msg = useRef(null);

  const styles = {
    buttonStyle: {
      borderRadius: "1rem",
      border: "1px solid black",
      borderColor: "indianred",
      height: "3.2rem",
    },
  };
  const msgInputHandler = () => {
    msg.current = inputRef.current.value;
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
      socket.current.connect();
      socket.current.emit("setRoom", roomId);
      socket.current.emit("new-message", {
        text: `${window.localStorage.getItem("username")} joined the Chat`,
        sender: window.localStorage.getItem("username"),
        id: `${socket.current.id}${Math.random()}`,
        roomId: roomId,
        socketID: socket.current.id,
        type: "special",
      });
    }
  };
  const buttonClickHandler = () => {
    if (msg.current.trim().length > 0) {
      if (socket !== "") {
        setMsgList((msgs) => [
          ...msgs,
          {
            text: msg.current,
            id: `${socket.current.id}${Math.random()}`,
            sender: window.localStorage.getItem("username"),
            socketID: socket.current.id,
            type: "regular",
          },
        ]);

        socket.current.emit("new-message", {
          text: msg.current,
          id: `${socket.current.id}${Math.random()}`,
          sender: window.localStorage.getItem("username"),
          socketID: socket.current.id,
          roomId: roomId,
          type: "regular",
        });
        msg.current = null;
        inputRef.current.value = "";
        inputRef.current?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
        inputRef.current.focus();
      }
    }
  };
  useEffect(() => {
    if (socket?.current !== null) {
      socket?.current?.on(roomId, (msg) => {
        if (msg.sender !== window.localStorage.getItem("username")) {
          setMsgList((msgs) => [...msgs, msg]);
        }
      });
    }

    return () => {
      socket.current.off(roomId);
    };
  }, [socket.current]);

  useEffect(() => {
    if (!window.localStorage.getItem("username")) {
      let userName = window.prompt("Your good name please!");
      if (userName.length > 0)
        window.localStorage.setItem("username", userName.toLowerCase());
      else location.reload();
    }
    socket.current = Socket;
    socket.current.on("connect", checkURLandConnectSocket);
    inputRef.current.focus();
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
