import { useEffect, useRef, useState } from "react";
import Topbar from "../../Component/topbar/topbar";
import { useParams } from "react-router-dom";
import instanceJson from "../../Component/axios/axiosJson";
import { useWebSocket } from "../../Component/webSocket/webSocket";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setChat } from "../../Store/store";
import dayjs from "dayjs";
import Loading from "../../Component/loading/loading";

type ChatDetailType = {
  sender: string;
  content: string;
  sendTime: string;
};

function ChatDetail() {
  const [loading, setLoading] = useState<boolean>(true); //로딩
  const { id } = useParams();
  const dispatch = useDispatch();
  const chatList = useSelector((state: { chat: any }) => state.chat);
  const image = useSelector((state: { profileImage: string }) => state.profileImage);
  const webSocketContext = useWebSocket();
  const ws1 = webSocketContext ? webSocketContext.ws1 : null;
  const email = localStorage.getItem("email");
  const nickname = localStorage.getItem("nickname");
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const message = {
      type: "message",
      roomId: `${id}`,
      sender: `${email}`,
      message: input,
    };

    if (ws1 && ws1.readyState === WebSocket.OPEN) {
      ws1.send(JSON.stringify(message));
      setInput("");
    } else {
      console.error("WebSocket is not open");
    }
  };

  useEffect(() => {
    instanceJson
      .get(`/api/chat/room/history?roomId=${id}`)
      .then((response) => {
        console.log(response.data);
        dispatch(setChat(response.data));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const message = {
      type: "join",
      roomId: `${id}`,
      sender: `${email}`,
    };
    if (ws1 && ws1.readyState === WebSocket.OPEN) {
      ws1.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open");
    }
  }, [ws1]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/chat" title="채팅내역" />
      <div className="w-full h-screen px-2">
        <div className="mt-18 overflow-auto">
          {/*채팅 내역 */}
          {chatList.map((chat: ChatDetailType, index: number) => {
            const isOwnMessage = chat.sender === nickname || chat.sender === email;
            const showProfileImage = index === 0 || chat.sender !== chatList[index - 1].sender;
            const showTime = index === chatList.length - 1 || chat.sender !== chatList[index + 1].sender;

            return (
              <div key={index} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} my-2`}>
                {!isOwnMessage && showProfileImage ? <img src={image} alt="profile" className="w-10 h-10 rounded-full mr-2" /> : <div className="w-10 h-10 bg-white mr-2"></div>}
                <div className="flex flex-col items-end">
                  {isOwnMessage ? (
                    <div className="flex justify-end items-end">
                      {showTime && <div className="text-xs mr-2 mb-1 font-bold">{dayjs(chat.sendTime).format("HH:mm")}</div>}
                      <div className={`py-2 px-3 rounded-xl bg-blue-300 my-1 flex items-center font-semibold max-w-64`}>{chat.content}</div>
                    </div>
                  ) : (
                    <div className="flex justify-start items-end ">
                      <div className={`py-2 px-3 rounded-xl bg-zinc-200 my-1 flex items-center font-semibold max-w-64`}>{chat.content}</div>
                      {showTime && <div className="text-xs ml-2 mb-1 font-bold">{dayjs(chat.sendTime).format("HH:mm")}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* {Object.keys(groupedMessages).map((key, index) => {
            const messageGroup = groupedMessages[key];
            const firstMessage = messageGroup[0];
            const lastMessage = messageGroup[messageGroup.length - 1];
            const isOwnMessage = firstMessage.sender === nickname || firstMessage.sender === email;
            return (
              <div key={index} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} my-2`}>
                {!isOwnMessage && <img src={image} alt="profile" className="w-10 h-10 rounded-full mr-2" />}
                <div>
                  {messageGroup.map((chat, msgIndex) => (
                    <div key={msgIndex}>
                      {isOwnMessage ? (
                        <div className="flex justify-end items-end">
                          {msgIndex === messageGroup.length - 1 && <div className="text-xs mr-2 mb-1 font-bold">{dayjs(chat.sendTime).format("HH:mm")}</div>}
                          <div className={`p-2 rounded-xl ${isOwnMessage ? "bg-blue-300" : "bg-zinc-200"} my-1 flex items-center font-bold max-w-64`}>{chat.content}</div>
                        </div>
                      ) : (
                        <div className="flex justify-start items-end">
                          <div className={`p-2 rounded-xl ${isOwnMessage ? "bg-blue-300" : "bg-zinc-200"} my-1 flex items-center font-bold max-w-64`}>{chat.content}</div>
                          {msgIndex === messageGroup.length - 1 && <div className="text-xs ml-2 mb-1 font-bold">{dayjs(chat.sendTime).format("HH:mm")}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })} */}

          <div ref={messagesEndRef} />
          <div className="pb-20"></div>
          {/*채팅 입력*/}
          <div className="fixed bottom-0 left-0 right-0 flex w-full border-t border-zinc-500">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="bg-zinc-100 w-full p-2 font-semibold" type="text" />
            <div className="bg-main flex justify-center items-center">
              <i onClick={() => sendMessage()} className="xi-send xi-2x pl-4 pr-3 py-3 text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatDetail;
