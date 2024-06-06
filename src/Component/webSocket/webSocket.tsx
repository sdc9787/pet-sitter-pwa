// WebSocketContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat, setLocation, setPartnerState, setWalkLocation } from "../../Store/store";
import { useAlert } from "../../hook/useAlert/useAlert";
import { useGeolocationWithAddress } from "../../hook/useGeolocation/useGeolocation";
import instanceJson from "../axios/axiosJson";

type WebSocketContextType = {
  ws1: WebSocket | null;
  ws2: WebSocket | null;
  ws3: WebSocket | null;
};

type WebSocketProviderProps = {
  children: React.ReactNode;
};

const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const alertBox = useAlert();
  const dispatch = useDispatch();
  const chatList = useSelector((state: { chat: any }) => state.chat);
  const chatListRef = useRef(chatList);
  const { latitude, longitude } = useGeolocationWithAddress(); // 위치 정보를 받아오는 훅
  const partnerState = useSelector((state: { partnerState: number }) => state.partnerState);

  useEffect(() => {
    chatListRef.current = chatList;
  }, [chatList]);

  const websocketUrl1 = `${import.meta.env.VITE_APP_API_URL}/chat`;
  const websocketUrl2 = `${import.meta.env.VITE_APP_API_URL}/notifications`;
  const websocketUrl3 = `${import.meta.env.VITE_APP_API_URL}/location`;

  const [ws1, setWs1] = useState<WebSocket | null>(null);
  const [ws2, setWs2] = useState<WebSocket | null>(null);
  const [ws3, setWs3] = useState<WebSocket | null>(null);

  const connectWebSocket = (websocketUrl: string, websocketLabel: string) => {
    let ws = new WebSocket(websocketUrl);

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
      setTimeout(() => connectWebSocket(websocketUrl, websocketLabel), 5000); // 5초 후 재연결
    };

    return ws;
  };

  // 알림
  const connectWebSocket2 = (websocketUrl: string, websocketLabel: string) => {
    let ws = new WebSocket(websocketUrl);

    ws.onopen = function () {
      console.log(`WebSocket connection ${websocketLabel} established`);
      const token = localStorage.getItem("Authorization");
      if (token) {
        ws.send(
          JSON.stringify({
            type: "Authorization",
            token: `${token}`,
          })
        );
      }
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        alertBox(data.message);
        console.log(`Notification from server ${websocketLabel}:`, data.message);
        if (data.message === "매칭이 성사되었습니다" || data.message === "산책이 시작되었습니다") {
          dispatch(setPartnerState(1));
        } else if (data.message === "산책이 종료되었습니다") {
          dispatch(setPartnerState(0));
        }

        // Handle the notification message as needed
      }
    };

    ws.onerror = function (error) {
      console.error(`WebSocket Error ${websocketLabel}:`, error);
    };

    ws.onclose = function (event) {
      console.log(`WebSocket connection ${websocketLabel} closed`, event);
      setTimeout(() => connectWebSocket2(websocketUrl, websocketLabel), 5000); // 5초 후 재연결
    };

    return ws;
  };

  // 위치전송
  const connectWebSocket3 = (websocketUrl: string, websocketLabel: string) => {
    let ws = new WebSocket(websocketUrl);
    let positionInterval: NodeJS.Timeout | null = null;

    ws.onopen = function () {
      console.log(`WebSocket connection ${websocketLabel} established`);
      const token = localStorage.getItem("Authorization");
      if (token) {
        ws.send(
          JSON.stringify({
            type: "Authorization",
            token: `${token}`,
          })
        );
      }

      // 주기적으로 위치 정보 전송
      positionInterval = setInterval(() => {
        if (latitude && longitude && partnerState === 1) {
          const position = {
            type: "location",
            latitude: latitude,
            longitude: longitude,
          };
          ws.send(JSON.stringify(position));
          console.log(`Sent location: ${JSON.stringify(position)}`);
        }
      }, 10000); // 10초마다 위치 전송
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "location") {
        console.log(`Location from server ${websocketLabel}:`, data);
        dispatch(setWalkLocation({ latitude: data.latitude, longitude: data.longitude }));
        // Handle the location message as needed
      }
    };

    ws.onerror = function (error) {
      console.error(`WebSocket Error ${websocketLabel}:`, error);
    };

    ws.onclose = function (event) {
      console.log(`WebSocket connection ${websocketLabel} closed`, event);
      //5초마다 재연결
      setTimeout(() => connectWebSocket3(websocketUrl, websocketLabel), 5000);

      if (positionInterval) {
        clearInterval(positionInterval); // 위치 전송 중지
      }
    };

    return ws;
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token && latitude && longitude) {
      instanceJson
        .get("/mypage/status")
        .then((res) => {
          console.log(res.data);
          if (res.data.partnerWalk === "매칭만완료" || res.data.partnerWalk === "현재산책중") {
            dispatch(setPartnerState(1));
          } else {
            dispatch(setPartnerState(0));
          }
        })
        .catch((error) => {
          console.error(error);
        });

      const ws1 = connectWebSocket(websocketUrl1, "1");
      const ws2 = connectWebSocket2(websocketUrl2, "2");
      const ws3 = connectWebSocket3(websocketUrl3, "3");

      setWs1(ws1);
      setWs2(ws2);
      setWs3(ws3);

      return () => {
        if (ws1) ws1.close();
        if (ws2) ws2.close();
        if (ws3) ws3.close();
      };
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log(partnerState);
  }, [partnerState]);

  return <WebSocketContext.Provider value={{ ws1, ws2, ws3 }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
