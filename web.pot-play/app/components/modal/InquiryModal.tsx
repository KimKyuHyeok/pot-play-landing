"use client";

import axios from "axios";
import { useState, useCallback } from "react"; // useCallback 추가
import Input from "../input/Input";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// 한국 전화번호 전체를 검증하는 정규식
const koreanPhoneRegex = /^(01[016789]\d{7,8}|02\d{7,8}|0[3-9]\d{8,9})$/;

export default function InquiryModal({
  isOpen,
  onClose,
  className,
}: InquiryModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    contactType: "phone",
    contact: "",
    inquiryType: "",
    inquiryContent: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    managerName: "",
    contact: "",
  });

  // 한글 자음/모음만 있는지 체크하는 함수
  const isOnlyConsonantOrVowel = (text: string): boolean => {
    if (!text) return false;
    // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
    // 자음만: ㄱ-ㅎ (0x3131-0x314E)
    // 모음만: ㅏ-ㅣ (0x314F-0x3163)
    const onlyConsonantVowel = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
    return onlyConsonantVowel.test(text);
  };

  // 회사명, 담당자 이름 검증
  const validateName = useCallback(
    (field: "companyName" | "managerName", value: string): boolean => {
      if (!value) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        return true;
      }
      if (isOnlyConsonantOrVowel(value)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "올바르게 입력해주세요.",
        }));
        return false;
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        return true;
      }
    },
    []
  );

  // 한국 전화번호 하이픈 자동 포맷팅
  const formatKoreanPhone = useCallback((num: string): string => {
    const digits = num.replace(/\D/g, "");

    if (digits.startsWith("02")) {
      // 서울 번호
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return digits.slice(0, 2) + "-" + digits.slice(2);
      if (digits.length <= 10)
        return (
          digits.slice(0, 2) +
          "-" +
          digits.slice(2, digits.length - 4) +
          "-" +
          digits.slice(-4)
        );
    } else if (/^01[016789]/.test(digits)) {
      // 휴대폰: 항상 4자리-4자리 형식 (010-XXXX-XXXX)
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return digits.slice(0, 3) + "-" + digits.slice(3);
      // 8자 이상: 항상 010-XXXX-XXXX 형식 (가운데 4자리, 마지막 4자리)
      return (
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, 7) +
        "-" +
        digits.slice(7, 11)
      );
    } else if (/^0[3-9]/.test(digits)) {
      // 일반 지역번호(031, 032 등)
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return digits.slice(0, 3) + "-" + digits.slice(3);
      // ⭐ 핵심: 지역번호 뒤 국번이 3자리/4자리 모두 지원
      return (
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, digits.length - 4) +
        "-" +
        digits.slice(-4)
      );
    }

    return digits;
  }, []);

  // 전화번호 검증 함수
  const validateKoreanPhone = useCallback((num: string): boolean => {
    const digits = num.replace(/\D/g, "");
    return koreanPhoneRegex.test(digits);
  }, []);

  // 이메일 검증 함수 추가
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // 연락처 변경 핸들러 수정
  const handleContactChange = useCallback(
    (value: string) => {
      if (formData.contactType === "phone") {
        const formatted = formatKoreanPhone(value);
        setFormData((prev) => ({ ...prev, contact: formatted }));

        if (!validateKoreanPhone(formatted)) {
          setErrors((prev) => ({
            ...prev,
            contact: "전화번호 형식이 올바르지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, contact: "" }));
        }
      } else {
        // 이메일
        setFormData((prev) => ({ ...prev, contact: value }));

        if (!validateEmail(value)) {
          setErrors((prev) => ({
            ...prev,
            contact: "이메일 형식이 올바르지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, contact: "" }));
        }
      }
    },
    [
      formData.contactType,
      formatKoreanPhone,
      validateKoreanPhone,
      validateEmail,
    ]
  );

  // 연락처 타입 변경 핸들러
  const handleContactTypeChange = useCallback((type: string) => {
    setFormData((prev) => ({
      ...prev,
      contactType: type,
      contact: "", // 타입 변경 시 입력값 초기화
    }));
    setErrors((prev) => ({ ...prev, contact: "" })); // 에러도 초기화
  }, []);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 검증
      if (field === "companyName" || field === "managerName") {
        validateName(field as "companyName" | "managerName", value);
      }
    },
    [validateName]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      const formatted = formatKoreanPhone(value);
      setFormData((prev) => ({ ...prev, contact: formatted }));

      if (!validateKoreanPhone(formatted)) {
        setErrors((prev) => ({
          ...prev,
          contact: "전화번호 형식이 올바르지 않습니다.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, contact: "" }));
      }
    },
    [formatKoreanPhone, validateKoreanPhone]
  );

  const handleSubmit = async () => {
    // 필수 필드 체크
    if (
      !formData.companyName ||
      !formData.managerName ||
      !formData.contact ||
      !formData.inquiryType ||
      !formData.inquiryContent
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 최종 검증
    const isCompanyNameValid = validateName(
      "companyName",
      formData.companyName
    );
    const isManagerNameValid = validateName(
      "managerName",
      formData.managerName
    );

    // 연락처 검증 (전화번호 또는 이메일)
    const isContactValid =
      formData.contactType === "phone"
        ? validateKoreanPhone(formData.contact)
        : validateEmail(formData.contact);

    // 검증 실패 시 제출하지 않음
    if (!isCompanyNameValid || !isManagerNameValid || !isContactValid) {
      if (!isContactValid) {
        setErrors((prev) => ({
          ...prev,
          contact:
            formData.contactType === "phone"
              ? "전화번호 형식이 올바르지 않습니다."
              : "이메일 형식이 올바르지 않습니다.",
        }));
      }
      return;
    }

    try {
      const requestData = {
        company_name: formData.companyName,
        manager: formData.managerName,
        contact_type: formData.contactType, // "phone" 또는 "email"
        phone_number:
          formData.contactType === "phone" ? formData.contact : null,
        email: formData.contactType === "email" ? formData.contact : null,
        type: formData.inquiryType,
        content: formData.inquiryContent,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/inquiry/landing`,
        requestData
      );
      alert("문의가 성공적으로 전송되었습니다.");
      onClose();
      setFormData({
        companyName: "",
        managerName: "",
        contact: "",
        inquiryType: "",
        inquiryContent: "",
        contactType: "phone",
      });
      setErrors({
        companyName: "",
        managerName: "",
        contact: "",
      });
    } catch (error) {
      console.error("문의 전송 실패:", error);
      alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-[100] flex items-center justify-center ${
        className || "top-38 right-40"
      }`}
    >
      <div className="relative bg-white rounded-lg p-[20px] max-w-md w-full min-w-[260px] shadow-[0_10px_40px_rgba(0,0,0,0.40)]">
        <div className="flex flex-col items-center justify-center gap-[15px] ">
          <div className="text-center">
            <h2 className="text-[22px] font-bold">문의하기</h2>
            <span className="text-[14px] text-[#757575] mt-[2px]">
              빠른 시일 내 연락 드리겠습니다.
            </span>
          </div>

          <Input
            title="회사명"
            type="text"
            value={formData.companyName}
            onChange={(value) => handleChange("companyName", value)}
            error={errors.companyName}
          />

          <Input
            title="담당자 이름"
            type="text"
            value={formData.managerName}
            onChange={(value) => handleChange("managerName", value)}
            error={errors.managerName}
          />

          <Input
            title=""
            type="radio"
            value={formData.contactType}
            onChange={handleContactTypeChange}
            radioOptions={[
              { label: "전화번호", value: "phone" },
              { label: "이메일", value: "email" },
            ]}
            radioDirection="horizontal"
            showInputBelowRadio={true}
            inputValue={formData.contact}
            onInputChange={handleContactChange}
            inputPlaceholder={
              formData.contactType === "phone"
                ? "연락 받을 연락처를 입력 해주세요."
                : "이메일을 입력해주세요."
            }
            inputError={errors.contact}
          />

          <Input
            title="문의 유형"
            type="select"
            value={formData.inquiryType}
            onChange={(value) => handleChange("inquiryType", value)}
            options={["광고 문의", "제휴 문의", "연동 문의"]}
            placeholder="유형을 선택해주세요."
          />

          <Input
            title="문의 내용"
            type="textarea"
            value={formData.inquiryContent}
            onChange={(value) => handleChange("inquiryContent", value)}
            placeholder="문의 내용을 간략하게 작성해주세요."
            className="h-[70px] resize-none"
          />

          <div className="flex gap-[10px] w-full text-[14px]">
            <button
              onClick={onClose}
              className=" bg-[#E0E0E0] rounded-[6px] w-full"
            >
              닫기
            </button>
            <button
              onClick={handleSubmit}
              className="py-[7px] bg-[#2C2C2C] rounded-[6px] text-white w-full"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
