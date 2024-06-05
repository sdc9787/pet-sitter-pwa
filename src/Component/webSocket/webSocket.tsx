// WebSocketContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../../Store/store";

type WebSocketContextType = {
  ws1: WebSocket | null;
  ws2: WebSocket | null;
};

type WebSocketProviderProps = {
  children: React.ReactNode;
};

const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const chatList = useSelector((state: { chat: any }) => state.chat);
  const chatListRef = useRef(chatList);

  useEffect(() => {
    chatListRef.current = chatList;
  }, [chatList]);

  const websocketUrl1 = `${import.meta.env.VITE_APP_API_URL}/chat`;
  const websocketUrl2 = `${import.meta.env.VITE_APP_API_URL}/notifications`;

  const [ws1, setWs1] = useState<WebSocket | null>(null);
  const [ws2, setWs2] = useState<WebSocket | null>(null);

  const connectWebSocket = (websocketUrl: string, websocketLabel: string, attempt = 0) => {
    let ws = new WebSocket(websocketUrl);
    const maxAttempts = 10;

    ws.onopen = function () {
      console.log(`WebSocket connection ${websocketLabel} established`);
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        console.log(chatListRef.current);
        dispatch(
          setChat([
            ...chatListRef.current,
            {
              content: data.message,
              sender: data.sender,
              sendTime: data.sendTime,
            },
          ])
        );
      }
      console.log(`Message from server ${websocketLabel}:`, JSON.parse(event.data));
    };

    ws.onerror = function (error) {
      console.error(`WebSocket Error ${websocketLabel}:`, error);
    };

    ws.onclose = function (event) {
      console.log(`WebSocket connection ${websocketLabel} closed`, event);
      if (!event.wasClean && attempt < maxAttempts) {
        const timeout = Math.min(50000, 1000 * Math.pow(2, attempt));
        setTimeout(() => connectWebSocket(websocketUrl, websocketLabel, attempt + 1), timeout);
      }
    };

    return ws;
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      const ws1 = connectWebSocket(websocketUrl1, "1");
      const ws2 = connectWebSocket(websocketUrl2, "2");

      setWs1(ws1);
      setWs2(ws2);

      return () => {
        ws1.close();
        ws2.close();
      };
    }
  }, []);

  return <WebSocketContext.Provider value={{ ws1, ws2 }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
