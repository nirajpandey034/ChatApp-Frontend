import { io } from "socket.io-client";

const socket = io(
  `${import.meta.env.VITE_SOCKET_URL}?user=${window.localStorage.getItem(
    "username"
  )}`,
  { transports: ["websocket"], upgrade: false }
);
export default socket;
