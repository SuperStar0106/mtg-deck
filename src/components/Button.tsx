import React from "react";

interface ButtonProps {
  type: any;
  text: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { type, text, className, disabled, onClick } = props;

    return (
      <button
        type={type}
        className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
      >
        {text}
      </button>
    );
  }
);

export default Button;
