import React, { ReactNode, useState } from "react";

export const Input = ({
  placeholder,
  className,
  validate,
  inputRegex,
  onSubmit,
  icon,
}: {
  placeholder?: string;
  className?: string;
  validate?: (value: string) => boolean;
  inputRegex?: RegExp;
  onSubmit: (value: string) => void;
  icon: ReactNode;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  return (
    <form
      className={[
        "flex justify-between gap-2 bg-gray-700 rounded-md p-2 transition-shadow ring-red-400",
        error && "ring-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onSubmit={(e) => {
        e.preventDefault();

        if (!validate || validate(inputValue)) onSubmit(inputValue);
        else setError(true);
      }}
    >
      <input
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none"
        value={inputValue}
        onChange={(e) => {
          const { value } = e.target;

          if (!inputRegex || inputRegex.test(value)) {
            setInputValue(value);
            if (error) setError(false);
          }
        }}
      />
      <button
        type="submit"
        className="text-white hover:text-gray-200 focus:text-gray-400 focus:outline-none transition-colors"
      >
        {icon}
      </button>
    </form>
  );
};
