import React from "react";

interface CardProps {
  title: string;
  description: string;
  highlight?: string;
}

const ReservationMainCard: React.FC<CardProps> = ({ title, description, highlight }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{title}</div>
        {highlight && <div className="text-sm text-red-500">{highlight}</div>}
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ReservationMainCard;
