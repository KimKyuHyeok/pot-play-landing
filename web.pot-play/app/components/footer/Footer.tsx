"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="w-full flex flex-col  py-[30px] px-[40px]">
      <div className="flex gap-[30px] items-center justify-center">
        <Image
          src="../../../googleButton.svg"
          alt="googleButton"
          width={120}
          height={40}
        />
        <Image
          src="../../../appstoreButton.svg"
          alt="appstoreButton"
          width={120}
          height={40}
        />
      </div>
      <div className="pt-[40px]">
        <span className="text-[12px] text-[#1e1e1e] font-bold">
          Prime play Co., Ltd.
        </span>
        <div className="flex flex-col pt-[10px] text-[12px] font-regular text-[#1e1e1e]">
          <span className="">
            대표자명: 김태윤 사업자 번호: 357-86-00725 주소: 서울특별시 강남구
            광평로56길 10, 4층 30호(수서동, 광인빌딩) TEL: 02-6095-2685
          </span>
          <span>© 2022 PRIMEPLAY. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
