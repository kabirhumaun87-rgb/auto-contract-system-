import React, { useState, useEffect } from 'react';
import { formatBOQQuantity } from '../utils/numberToWordsBangla';

interface BOQQuantityInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Quantity Input for Bill of Quantities tables that enforces the MES rule:
 * No single digit in Quantity; single numbers are formatted with a leading "0" (e.g. 01, 02, ..., 09).
 */
export const BOQQuantityInput: React.FC<BOQQuantityInputProps> = ({
  value,
  onChange,
  className = 'w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono',
  placeholder = '01'
}) => {
  const [text, setText] = useState<string>(() => formatBOQQuantity(value));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setText(formatBOQQuantity(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(text);
    if (isNaN(parsed) || text.trim() === '') {
      onChange(0);
      setText('00');
    } else {
      onChange(parsed);
      setText(formatBOQQuantity(parsed));
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={isFocused ? text : formatBOQQuantity(value)}
      onChange={handleChange}
      onFocus={() => {
        setIsFocused(true);
        setText(formatBOQQuantity(value));
      }}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
};
