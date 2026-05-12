"use client";

import { useCallback, useEffect, useState } from "react";

const PHONE_DIGITS_OK = /^(01[016789]\d{7,8}|02\d{7,8}|0[3-9]\d{8,9})$/;

function formatKoreanPhone(raw: string): string {
  const t = raw.replace(/\D/g, "");
  if (t.startsWith("02")) {
    if (t.length <= 2) return t;
    if (t.length <= 5) return `${t.slice(0, 2)}-${t.slice(2)}`;
    if (t.length <= 10)
      return `${t.slice(0, 2)}-${t.slice(2, t.length - 4)}-${t.slice(-4)}`;
  } else if (/^01[016789]/.test(t)) {
    if (t.length <= 3) return t;
    if (t.length <= 7) return `${t.slice(0, 3)}-${t.slice(3)}`;
    return `${t.slice(0, 3)}-${t.slice(3, 7)}-${t.slice(7, 11)}`;
  } else if (/^0[3-9]/.test(t)) {
    if (t.length <= 3) return t;
    if (t.length <= 6) return `${t.slice(0, 3)}-${t.slice(3)}`;
    return `${t.slice(0, 3)}-${t.slice(3, t.length - 4)}-${t.slice(-4)}`;
  }
  return t;
}

function isValidPhoneDisplay(s: string): boolean {
  return PHONE_DIGITS_OK.test(s.replace(/\D/g, ""));
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function validateNameField(value: string): string {
  if (!value) return "";
  if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(value)) return "올바르게 입력해주세요.";
  return "";
}

type FormState = {
  companyName: string;
  managerName: string;
  contactType: "phone" | "email";
  contact: string;
  inquiryType: string;
  inquiryContent: string;
};

type FieldErrors = {
  companyName: string;
  managerName: string;
  contact: string;
};

const inputBase =
  "placeholder:text-[14px] w-full border border-[#D9D9D9] rounded-[8px] px-[6px] py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500";

function FormField({
  title,
  type,
  value,
  onChange,
  options = [],
  placeholder,
  className,
  error,
  radioOptions,
  radioDirection = "horizontal",
  showInputBelowRadio,
  inputValue,
  onInputChange,
  inputPlaceholder,
  inputError,
}: {
  title: string;
  type: "text" | "textarea" | "select" | "radio";
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
  error?: string;
  radioOptions?: { label: string; value: string }[];
  radioDirection?: "horizontal" | "vertical";
  showInputBelowRadio?: boolean;
  inputValue?: string;
  onInputChange?: (v: string) => void;
  inputPlaceholder?: string;
  inputError?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {title ? (
        <label className="text-[14px] font-regular text-[#1E1E1E]">
          {title}
        </label>
      ) : null}

      {type === "radio" && radioOptions ? (
        <div className="flex flex-col gap-2">
          <div
            className={
              radioDirection === "vertical"
                ? "flex flex-col gap-2"
                : "flex flex-row gap-[20px]"
            }
          >
            {radioOptions.map((opt) => (
              <label
                key={opt.value}
                className="label flex cursor-pointer flex-row items-center gap-[6px] py-0"
              >
                <input
                  type="radio"
                  name="contact-type"
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="h-4 w-4 shrink-0 border border-[#D9D9D9] text-blue-600 accent-blue-600"
                />
                <span className="label-text text-[14px] leading-none text-[#1E1E1E]">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {showInputBelowRadio ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={inputValue ?? ""}
                onChange={(e) => onInputChange?.(e.target.value)}
                placeholder={inputPlaceholder}
                className={inputBase}
              />
              {inputError ? (
                <span className="mt-[-4px] text-[12px] text-red-500">
                  {inputError}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {type === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full appearance-none border border-[#D9D9D9] rounded-[8px] px-[6px] py-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !value ? "text-[#757575]" : "text-[#1E1E1E]"
            }`}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className ? `${inputBase} ${className}` : inputBase}
          rows={4}
        />
      ) : type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className ? `${inputBase} ${className}` : inputBase}
        />
      ) : null}

      {error ? (
        <span className="mt-[-4px] text-[12px] text-red-500">{error}</span>
      ) : null}
    </div>
  );
}

const initialForm: FormState = {
  companyName: "",
  managerName: "",
  contactType: "phone",
  contact: "",
  inquiryType: "",
  inquiryContent: "",
};

const initialErrors: FieldErrors = {
  companyName: "",
  managerName: "",
  contact: "",
};

export function LandingInquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);

  const setField = useCallback(
    (key: keyof FormState, v: string) => {
      setForm((prev) => ({ ...prev, [key]: v }));
      if (key === "companyName" || key === "managerName") {
        const msg = validateNameField(v);
        setErrors((prev) => ({ ...prev, [key]: msg }));
      }
    },
    []
  );

  const onContactInput = useCallback(
    (raw: string) => {
      if (form.contactType === "phone") {
        const formatted = formatKoreanPhone(raw);
        setForm((p) => ({ ...p, contact: formatted }));
        setErrors((e) => ({
          ...e,
          contact: isValidPhoneDisplay(formatted)
            ? ""
            : "전화번호 형식이 올바르지 않습니다.",
        }));
      } else {
        setForm((p) => ({ ...p, contact: raw }));
        setErrors((e) => ({
          ...e,
          contact: isValidEmail(raw)
            ? ""
            : "이메일 형식이 올바르지 않습니다.",
        }));
      }
    },
    [form.contactType]
  );

  const onContactTypeChange = useCallback((t: string) => {
    setForm((p) => ({
      ...p,
      contactType: t as "phone" | "email",
      contact: "",
    }));
    setErrors((e) => ({ ...e, contact: "" }));
  }, []);

  const submit = async () => {
    const { companyName, managerName, contact, inquiryType, inquiryContent, contactType } =
      form;
    if (
      !companyName ||
      !managerName ||
      !contact ||
      !inquiryType ||
      !inquiryContent
    ) {
      window.alert("모든 필드를 입력해주세요.");
      return;
    }

    const okCompany = !validateNameField(companyName);
    const okManager = !validateNameField(managerName);
    const okContact =
      contactType === "phone"
        ? isValidPhoneDisplay(contact)
        : isValidEmail(contact);

    setErrors({
      companyName: validateNameField(companyName),
      managerName: validateNameField(managerName),
      contact:
        okContact
          ? ""
          : contactType === "phone"
            ? "전화번호 형식이 올바르지 않습니다."
            : "이메일 형식이 올바르지 않습니다.",
    });

    if (!okCompany || !okManager || !okContact) return;

    const payload = {
      company_name: companyName,
      manager: managerName,
      contact_type: contactType,
      phone_number: contactType === "phone" ? contact : null,
      email: contactType === "email" ? contact : null,
      type: inquiryType,
      content: inquiryContent,
    };

    try {
      const res = await fetch("/api/inquiry/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("upstream failed");
      window.alert("문의가 성공적으로 전송되었습니다.");
      onClose();
      setForm(initialForm);
      setErrors(initialErrors);
    } catch (e) {
      console.error("문의 전송 실패:", e);
      window.alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-[16%] right-[12%] z-50 flex items-center justify-center">
      <div className="relative min-w-[260px] w-full max-w-md rounded-lg bg-white p-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.40)]">
        <div className="flex flex-col items-center justify-center gap-[15px]">
          <div className="text-center">
            <h2 className="text-[22px] font-bold">문의하기</h2>
            <span className="mt-[2px] block text-[14px] text-[#757575]">
              빠른 시일 내 연락 드리겠습니다.
            </span>
          </div>

          <FormField
            title="회사명"
            type="text"
            value={form.companyName}
            onChange={(v) => setField("companyName", v)}
            error={errors.companyName}
          />
          <FormField
            title="담당자 이름"
            type="text"
            value={form.managerName}
            onChange={(v) => setField("managerName", v)}
            error={errors.managerName}
          />
          <FormField
            title=""
            type="radio"
            value={form.contactType}
            onChange={onContactTypeChange}
            radioOptions={[
              { label: "전화번호", value: "phone" },
              { label: "이메일", value: "email" },
            ]}
            radioDirection="horizontal"
            showInputBelowRadio
            inputValue={form.contact}
            onInputChange={onContactInput}
            inputPlaceholder={
              form.contactType === "phone"
                ? "연락 받을 연락처를 입력 해주세요."
                : "이메일을 입력해주세요."
            }
            inputError={errors.contact}
          />
          <FormField
            title="문의 유형"
            type="select"
            value={form.inquiryType}
            onChange={(v) => setField("inquiryType", v)}
            options={["광고 문의", "제휴 문의", "연동 문의"]}
            placeholder="유형을 선택해주세요."
          />
          <FormField
            title="문의 내용"
            type="textarea"
            value={form.inquiryContent}
            onChange={(v) => setField("inquiryContent", v)}
            placeholder="문의 내용을 간략하게 작성해주세요."
            className="h-[70px] resize-none"
          />

          <div className="flex w-full gap-[10px] text-[14px]">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-[6px] bg-[#E0E0E0]"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={submit}
              className="w-full rounded-[6px] bg-[#2C2C2C] py-[7px] text-white"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
