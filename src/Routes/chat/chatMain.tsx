import { useEffect, useState } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import TabBar from "../../Component/tabbar/tabbar";
import instanceJson from "../../Component/axios/axiosJson";
import Topbar from "../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfileImage } from "../../Store/store";
import Loading from "../../Component/loading/loading";

// [
//   {
//       "roomId": 8,
//       "userNickname": "test9",
//       "partnerNickname": "ahavvsvw",
//       "updatedAt": "2024-06-04T22:30:34",
//       "latestMessage": null,
//       "reverse_user": "ahavvsvw",
//       "image": "https://i.ytimg.com/vi/oOzBPavkItE/maxresdefault.jpg"
//   }
// ]

type ChatListType = {
  roomId: number;
  userNickname: string;
  partnerNickname: string;
  updatedAt: string;
  latestMessage: string;
  reverse_user: string;
  image: string;
};

function ChatMain() {
  const [loading, setLoading] = useState<boolean>(true); //로딩
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatList, setChatList] = useState<ChatListType[]>([]);

  useEffect(() => {
    instanceJson
      .get("/api/chat/room/list")
      .then((response) => {
        console.log(response.data);
        setChatList(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return format(date, "p");
    } else if (isYesterday(date)) {
      return "어제";
    } else {
      return format(date, "MMM d일");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Topbar title="채팅" />
      <div className="w-full h-screen">
        <div className="mt-18">
          {chatList.map((chat, index) => {
            return (
              <div
                onClick={() => {
                  navigate(`/chat/detail/${chat.roomId}`);
                  dispatch(setProfileImage(chat.image));
                }}
                key={index}
                className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="flex items-center">
                  <img src={chat.image} alt="profile" className="w-12 h-12 rounded-full" />
                  <div className="ml-4 max-w-52">
                    <div className="text-lg font-bold">{chat.reverse_user}</div>
                    <div className="text-sm text-zinc-500">{chat.latestMessage === null ? "아직 채팅을 시작하지 않았습니다" : chat.latestMessage}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 text-nowrap">{formatDate(chat.updatedAt)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <TabBar />
    </>
  );
}

export default ChatMain;
