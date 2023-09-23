import "./App.css";
import React from "react";
import ChatBox from "./components/ChatBox";
import randomString from "random-string";

function App() {
  const [roomId, setRoomId] = React.useState("");

  React.useEffect(() => {
    const existingRoom = new URL(window.location.href).searchParams.get("room");
    if (existingRoom) setRoomId(existingRoom);
    else {
      let id = randomString({
        length: 8,
        numeric: true,
        letters: true,
        special: false,
      });
      setRoomId(id);
    }
  }, []);
  return <>{roomId.length > 0 && <ChatBox key={roomId} roomId={roomId} />}</>;
}

export default App;
