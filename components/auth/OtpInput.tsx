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
    // Handle paste operation - when user pastes 6 digits at once
    if (value.length > 1) {
      const pastedValue = value.replace(/\D/g, "").slice(0, length); // Remove non-digits and limit to length

      // Fill each input with corresponding digit
      pastedValue.split("").forEach((char, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = char;
        }
      });

      // Update the OTP state
      onOtpChange(pastedValue);

      // Focus the next available input or the last one
      const nextIndex = Math.min(pastedValue.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single character input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Update OTP value
    const otp = inputRefs.current.map((ref) => ref?.value || "").join("");
    onOtpChange(otp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!inputRefs.current[index]?.value && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (inputRefs.current[index]?.value) {
        // Clear current input and stay there
        inputRefs.current[index]!.value = "";
        const otp = inputRefs.current.map((ref) => ref?.value || "").join("");
        onOtpChange(otp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, ""); // Remove non-digits

    if (pastedData.length === length) {
      // Distribute pasted digits across all inputs
      pastedData.split("").forEach((char, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = char;
        }
      });

      onOtpChange(pastedData);

      // Focus the last input after paste
      inputRefs.current[length - 1]?.focus();
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
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6} // Allow paste by setting maxLength to 6
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OtpInput;
