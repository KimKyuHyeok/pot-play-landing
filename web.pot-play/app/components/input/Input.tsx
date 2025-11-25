"use client";

interface InputProps {
  title: string;
  type: "text" | "select" | "textarea" | "radio";
  value?: string;
  onChange?: (value: string) => void;
  options?: string[]; // select일 때 사용
  placeholder?: string;
  className?: string;
  error?: string; // 에러 메시지
  radioOptions?: { label: string; value: string }[]; // radio 전용 옵션
  radioDirection?: "horizontal" | "vertical"; // 라디오 배치 방향
}

export default function Input({
  title,
  type,
  value,
  onChange,
  options = [],
  placeholder,
  className,
  error,
  radioOptions = [],
  radioDirection = "horizontal",
}: InputProps) {
  const baseInputStyle =
    "placeholder:text-[14px] w-full border border-[#D9D9D9] rounded-[8px] px-[6px] py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-regular text-[#1E1E1E]">{title}</label>
      {type === "radio" ? (
        <div
          className={`flex ${
            radioDirection === "vertical"
              ? "flex-col gap-2"
              : "flex-row gap-[20px]"
          }`}
        >
          {radioOptions?.map((option) => (
            <div key={option.value} className="form-control">
              <label className="label cursor-pointer flex flex-row items-center gap-[6px] py-0">
                <input
                  type="radio"
                  name={title}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="radio"
                />
                <span className="label-text text-[14px] text-[#1E1E1E] leading-none">
                  {option.label}
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : type === "select" ? (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full border border-[#D9D9D9] rounded-[8px] px-[6px] py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] appearance-none ${
              !value ? "text-[#757575]" : "text-[#1E1E1E]"
            }`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="#757575"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={
            className ? `${baseInputStyle} ${className}` : baseInputStyle
          }
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={
            className ? `${baseInputStyle} ${className}` : baseInputStyle
          }
        />
      )}
      {error && (
        <span className="text-[12px] text-red-500 mt-[-4px]">{error}</span>
      )}
    </div>
  );
}
