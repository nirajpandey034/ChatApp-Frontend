/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function Chat({ msg }) {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [special, setSpecial] = useState(false);
  useEffect(() => {
    if (msg.type === "special") setSpecial(true);
    else setSpecial(false);
    if (msg.sender === window.localStorage.getItem("username")) {
      setIsCurrentUser(true);
    } else setIsCurrentUser(false);
  }, []);

  const chatStyle = {
    padding: "1rem",
    borderRadius: "1rem",
  };
  return (
    <>
      {!special ? (
        <li
          style={
            isCurrentUser
              ? {
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "auto",
                  marginTop: "0.5rem",
                  ...chatStyle,
                }
              : {
                  backgroundColor: "yellow",
                  marginRight: "auto",
                  marginTop: "0.5rem",
                  ...chatStyle,
                }
          }
        >
          {msg.text}
        </li>
      ) : (
        <li
          style={{
            backgroundColor: "gray",
            color: "white",
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: "0.5rem",
            ...chatStyle,
          }}
        >
          {msg.text}
        </li>
      )}
    </>
  );
}
