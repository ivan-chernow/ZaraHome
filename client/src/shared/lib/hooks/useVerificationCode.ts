import { useRef, useState } from 'react';

export const useVerificationCode = (length: number = 6) => {
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState<string[]>(Array(length).fill(''));

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < length - 1) codeRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    const nextEmptyIndex = newCode.findIndex(char => !char);
    if (nextEmptyIndex !== -1) {
      codeRefs.current[nextEmptyIndex]?.focus();
    } else {
      codeRefs.current[length - 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  return {
    code,
    setCode,
    codeRefs,
    handleInputChange,
    handlePaste,
    handleKeyDown,
  };
};
