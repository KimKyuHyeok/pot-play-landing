"use client";

import { useState } from "react";
import Input from "../input/Input";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    contact: "",
    inquiryType: "",
    inquiryContent: "",
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-38 right-40 z-[100] flex items-center justify-center ">
      <div className="relative bg-white rounded-lg p-[20px] max-w-md w-full min-w-[260px]">
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
            onChange={handleChange("companyName")}
          />

          <Input
            title="담당자 이름"
            type="text"
            value={formData.managerName}
            onChange={handleChange("managerName")}
          />

          <Input
            title="연락처"
            type="text"
            value={formData.contact}
            onChange={handleChange("contact")}
            placeholder="연락 받을 연락처를 입력 해주세요."
          />

          <Input
            title="문의 유형"
            type="select"
            value={formData.inquiryType}
            onChange={handleChange("inquiryType")}
            options={["광고 문의", "제휴 문의", "연동 문의"]}
            placeholder="유형을 선택해주세요."
          />

          <Input
            title="문의 내용"
            type="textarea"
            value={formData.inquiryContent}
            onChange={handleChange("inquiryContent")}
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
            <button className="py-[7px] bg-[#2C2C2C] rounded-[6px] text-white w-full">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
