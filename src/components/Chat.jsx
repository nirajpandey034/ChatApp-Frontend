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
    padding: "0.5rem",
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
                  backgroundColor: "#66FF99",
                  marginRight: "auto",
                  marginTop: "0.5rem",
                  ...chatStyle,
                }
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "-1%",
            }}
          >
            <p
              style={{
                fontSize: "1.2rem",
                marginRight: "auto",
                fontStyle: "italic",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  fontSize: "1rem",
                  textDecoration: "underline",
                }}
              >
                {msg.sender}
                {"   "}
              </span>
            </p>
            <p
              style={{
                marginRight: "auto",
              }}
            >
              {msg.text}
            </p>
          </div>
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
