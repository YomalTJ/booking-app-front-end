import React, { useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onOtpChange: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onOtpChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste operation
      const pastedValue = value.slice(0, length);
      pastedValue.split("").forEach((char, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = char;
        }
      });
      onOtpChange(pastedValue);

      // Focus last input
      const lastIndex = Math.min(pastedValue.length - 1, length - 1);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Single character input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const otp = inputRefs.current.map((ref) => ref?.value || "").join("");
    onOtpChange(otp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
