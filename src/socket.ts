// socket.ts
import { io, Socket } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "http://localhost:3000"; // or your deployed URL

// Create a singleton socket instance
export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true, // socket will connect immediately
});
