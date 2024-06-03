import React, { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import quizDataJson from "./quizData.json";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import instanceJson from "../../../Component/axios/axiosJson";

type Answers = {
  [K in `q${number}`]: boolean | number | null;
};

type Question = {
  question: string;
  options?: string[];
};

function PartnerShipStep4() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [quizData] = useState(quizDataJson);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
    q9: null,
    q10: null,
    q11: 0,
    q12: 0,
    q13: 0,
    q14: 0,
    q15: 0,
    q16: 0,
    q17: 0,
    q18: 0,
    q19: 0,
    q20: 0,
  });

  const handleAnswerChange = (answer: string, index: number) => {
    const newAnswers: Answers = { ...answers };
    const key = `q${index + 1}` as keyof Answers;
    if (index < 10) {
      newAnswers[key] = answer === "O";
    } else {
      newAnswers[key] = parseInt(answer, 10);
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.oxQuestions.length + quizData.mcQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const sendAnswer = () => {
    const unansweredQuestions = Object.entries(answers)
      .filter(([key, value]) => value === null || value === 0)
      .map(([key]) => key.replace("q", ""));

    if (unansweredQuestions.length > 0) {
      alertBox(`다음 문제를 답변해주세요: ${unansweredQuestions.join(", ")}`);
      return;
    }

    instanceJson
      .post("/mypage/partner/apply/step3", answers)
      .then((res) => {
        alertBox("파트너 등록이 완료되었습니다.");
        navigate("/profile");
        localStorage.setItem("partnership", "1");
        console.log(res.data);
      })
      .catch((err) => {
        alertBox("파트너 등록에 실패했습니다.");
        navigate("/profile");
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const currentQuestion: Question = currentQuestionIndex < quizData.oxQuestions.length ? quizData.oxQuestions[currentQuestionIndex] : quizData.mcQuestions[currentQuestionIndex - quizData.oxQuestions.length];
  const isMCQuestion = currentQuestionIndex >= quizData.oxQuestions.length;

  return (
    <>
      <Topbar backUrl="/profile/partnerShip/step3" title="퀴즈"></Topbar>
      <div className="w-full h-screen">
        <div className="mt-20 px-4">
          <div>
            <p>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </p>
            {isMCQuestion ? (
              <div className="flex flex-col">
                {currentQuestion.options?.map((option, index) => (
                  <label key={index}>
                    <input type="radio" name={`question${currentQuestionIndex}`} value={index + 1} checked={answers[`q${currentQuestionIndex + 1}`] === index + 1} onChange={() => handleAnswerChange((index + 1).toString(), currentQuestionIndex)} />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <label>
                  <input type="radio" name={`question${currentQuestionIndex}`} value="O" checked={answers[`q${currentQuestionIndex + 1}`] === true} onChange={() => handleAnswerChange("O", currentQuestionIndex)} />O
                </label>
                <label>
                  <input type="radio" name={`question${currentQuestionIndex}`} value="X" checked={answers[`q${currentQuestionIndex + 1}`] === false} onChange={() => handleAnswerChange("X", currentQuestionIndex)} />X
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "이전 문제",
          color: "bg-main",
          onClick: handlePrevious,
        }}
        button2Props={{
          text: currentQuestionIndex === quizData.oxQuestions.length + quizData.mcQuestions.length - 1 ? "제출" : "다음 문제",
          color: "bg-main",
          onClick: currentQuestionIndex === quizData.oxQuestions.length + quizData.mcQuestions.length - 1 ? sendAnswer : handleNext,
        }}></ActionBtn>
    </>
  );
}

export default PartnerShipStep4;
