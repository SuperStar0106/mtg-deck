import React from "react";
import Button from "./Button";

import defaultCardImage from "../assets/images/default.jpg";

export interface CardProps {
  card: any;
  isDeckFull: boolean;
  count: number;
  btnText: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = (props) => {
  const { card, isDeckFull, count, btnText, onClick } = props;

  const renderCardContent = () => {
    if (card.imageUrl) {
      return (
        <img
          className="w-full object-cover rounded-t-lg"
          src={card.imageUrl}
          alt={card.name}
        />
      );
    } else {
      const truncatedText =
        card.text.length > 210
          ? card.text.substring(0, 210) + "..."
          : card.text;
      return (
        <div className="h-full p-4 bg-gray-800 text-white rounded-t-lg">
          <div className="flex justify-between items-center border-b border-gray-500 mb-2 pb-2">
            <h2 className="text-xl font-bold">
              {card.name.length > 22
                ? card.text.substring(0, 22) + "..."
                : card.name}
            </h2>
            <div className="rounded-full bg-gray-500 w-6 h-6 items-center flex justify-center">
              {card.cmc}
            </div>
          </div>
          <img
            className="h-44 object-cover rounded-t-lg pb-1 border-b border-gray-500"
            src={defaultCardImage}
            alt={card.name}
          />
          <p className="text-sm border-b border-gray-500">{card.type}</p>
          <p className="border-b border-gray-500 h-36">{truncatedText}</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer fade-in-up relative group">
      {renderCardContent()}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:backdrop-blur-sm transition-opacity duration-300 backdrop-filter"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          type="button"
          text={count !== 0 ? `${btnText} (×${count})` : btnText}
          className="bg-red-600 text-white hover:bg-red-500 w-40"
          onClick={onClick}
          disabled={btnText === "Add" && isDeckFull}
        />
      </div>
    </div>
  );
};

export default Card;
