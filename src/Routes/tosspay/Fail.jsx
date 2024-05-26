import { useNavigate, useSearchParams } from "react-router-dom";
import ActionBtn from "../../Component/actionBtn/actionBtn";

export function FailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-screen p-6 flex flex-col justify-center items-center gap-4">
        <i className="xi-close-min xi-5x bg-red-600 text-white rounded-full p-1"></i>
        <h1 className="text-xl font-bold">{searchParams.get("message")}</h1>
      </div>
      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "돌아가기",
          color: "bg-zinc-500",
          onClick: () => {
            navigate("/profile");
          },
        }}
        button2Props={{
          text: "다시 충전하기",
          color: "bg-main",
          onClick: () => {
            navigate("/tossPay");
          },
        }}></ActionBtn>
    </>
  );
}
