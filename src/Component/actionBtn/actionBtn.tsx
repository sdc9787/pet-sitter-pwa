import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  color: string;
}

interface ActionButtonsProps {
  buttonCount: number;
  button1Props: ButtonProps;
  button2Props?: ButtonProps;
}

const ActionBtn: React.FC<ActionButtonsProps> = ({ buttonCount, button1Props, button2Props }) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 px-4 pb-4 pt-2 flex gap-4 bg-white">
      <button onClick={button1Props.onClick} className={`flex-1 font-bold text-white py-3 rounded-lg ${button1Props.color}`}>
        {button1Props.text}
      </button>
      {buttonCount === 2 && button2Props && (
        <button onClick={button2Props.onClick} className={`flex-1 font-bold text-white py-3 rounded-lg ${button2Props.color}`}>
          {button2Props.text}
        </button>
      )}
    </div>
  );
};

export default ActionBtn;
