"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Footer from "./components/footer/Footer";
import InquiryModal from "./components/modal/InquiryModal";

export default function Home() {
  const imageNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
  // 오버레이 이미지 번호 (1부터 13까지)
  const overlayImageNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const menuClickRef = useRef(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const navList = [
    { id: 1, name: "문제정의" },
    { id: 2, name: "맞춤형 광고 솔루션" },
    { id: 3, name: "광고 한눈에 보기" },
    { id: 4, name: "핵심 요소" },
    { id: 5, name: "유형 선택" },
    { id: 6, name: "광고별 단가" },
    { id: 7, name: "진행 방식" },
    { id: 8, name: "활용 시나리오" },
    { id: 9, name: "제안 포인트" },
  ];

  // navList id를 실제 이미지 번호로 매핑
  const navToImageMap: { [key: number]: number } = {
    1: 2,
    2: 4,
    3: 5,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12,
    9: 13,
  };

  // 각 navList 항목이 활성화될 이미지 번호 배열
  const navActivePages: { [key: number]: number[] } = {
    1: [2, 3], // 문제정의: 페이지 2, 3
    3: [5, 6, 7], // 광고 한눈에 보기: 페이지 5, 6, 7
    // 나머지는 기본값으로 navToImageMap의 값만 사용
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastIndex = currentIndex;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const windowHeight = container.clientHeight;
      const centerY = scrollTop + windowHeight / 2;

      // 각 이미지의 중앙까지의 거리를 계산
      let closestIndex = 0;
      let closestDistance = Infinity;

      imageRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const imageCenterY =
          rect.top - containerRect.top + scrollTop + rect.height / 2;
        const distance = Math.abs(centerY - imageCenterY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (lastIndex !== closestIndex) {
        setCurrentIndex(closestIndex);
        lastIndex = closestIndex;
      }

      // 스크롤 중 플래그 설정
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);

      // 스크롤이 멈춘 후 플래그 해제
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
        // 스크롤이 끝나면 메뉴 클릭 플래그도 해제하여 호버가 정상적으로 작동하도록
        menuClickRef.current = false;
      }, 300);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // 초기 실행

      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const scrollToImage = (index: number) => {
    const ref = imageRefs.current[index];
    const container = scrollContainerRef.current;
    if (ref && container) {
      const containerRect = container.getBoundingClientRect();
      const refRect = ref.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const targetScroll = refRect.top - containerRect.top + scrollTop;

      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="bg-zinc-50 font-sans dark:bg-black overflow-y-scroll snap-y snap-mandatory h-screen"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {/* fixed 요소들을 최상위 레벨로 이동 - 1번 페이지에서는 숨김 */}
      {currentIndex !== 0 && (
        <div
          className="fixed top-1/2 right-16 z-50"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            // 기존 타임아웃 클리어
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }

            // menuClickRef가 true면 (클릭 후), 스크롤 중이어도 즉시 호버 끄기
            if (menuClickRef.current) {
              menuClickRef.current = false;
              setIsHovered(false);
              return;
            }

            // 스크롤 중이면 호버 유지 (클릭하지 않은 경우)
            if (isScrollingRef.current) return;

            hoverTimeoutRef.current = setTimeout(() => {
              setIsHovered(false);
              hoverTimeoutRef.current = null;
            }, 200);
          }}
        >
          <ul
            className={`flex flex-col gap-[20px] items-end -translate-y-1/2 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            {imageNumbers.slice(1).map((num, index) => {
              // 1번 페이지를 제외하고 2번부터 시작하므로 실제 인덱스는 index + 1
              const actualIndex = index + 1;
              return (
                <li
                  key={num}
                  onClick={() => scrollToImage(actualIndex)}
                  className={`cursor-pointer transition-all ${
                    currentIndex === actualIndex
                      ? "bg-black w-[35px] h-[4px]"
                      : "bg-[#9d9d9d] w-[16px] h-[4px]"
                  }`}
                ></li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-col w-full max-w-[1920px] mx-auto relative">
        {isHovered && (
          <div
            className="fixed top-40 right-10 w-[300px]  bg-black z-50 rounded-[40px] opacity-80"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              // 기존 타임아웃 클리어
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }

              // menuClickRef가 true면 (클릭 후), 스크롤 중이어도 즉시 호버 끄기
              if (menuClickRef.current) {
                menuClickRef.current = false;
                setIsHovered(false);
                return;
              }

              // 스크롤 중이면 호버 유지 (클릭하지 않은 경우)
              if (isScrollingRef.current) return;

              hoverTimeoutRef.current = setTimeout(() => {
                setIsHovered(false);
                hoverTimeoutRef.current = null;
              }, 300);
            }}
          >
            <ul className="flex flex-col gap-[20px] py-[40px] justify-center items-center">
              {navList.map((item) => {
                // navActivePages에 정의된 활성 페이지 배열이 있으면 사용, 없으면 기본값으로 단일 페이지만 체크
                const activePages = navActivePages[item.id];
                let isActive: boolean;

                if (activePages) {
                  // 여러 페이지 중 하나라도 현재 페이지와 일치하면 활성화
                  // currentIndex는 0부터 시작하므로, 이미지 번호와 비교하려면 -1 필요
                  isActive = activePages.some(
                    (pageNum) => currentIndex === pageNum - 1
                  );
                } else {
                  // 기본값: navToImageMap에서 매핑된 이미지 번호 사용
                  const targetImageNum = navToImageMap[item.id] || item.id;
                  isActive = currentIndex === targetImageNum - 1;
                }

                const activeStyle = isActive ? "text-white" : "text-gray-500";
                return (
                  <li
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      // 호버 상태 유지
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = null;
                      }
                      menuClickRef.current = true;
                      setIsHovered(true);
                      // navToImageMap에서 매핑된 이미지 번호를 가져오고, 없으면 기본값으로 item.id 사용
                      const targetImageNum = navToImageMap[item.id] || item.id;
                      // 이미지 번호를 인덱스로 변환 (num: 2 → index: 1, num: 4 → index: 3)
                      const targetIndex = targetImageNum - 1;
                      scrollToImage(targetIndex);
                      // 스크롤이 끝나면 handleScroll에서 menuClickRef.current를 false로 설정하므로
                      // 여기서는 별도 타임아웃이 필요 없음
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    className={`${activeStyle} text-[18px] font-bold cursor-pointer transition-colors hover:text-white`}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* 이미지들 */}
        <div className="relative">
          {imageNumbers.map((num, index) => {
            // 6번, 7번은 5번 배경 사용
            const backgroundImagePath =
              num === 6 || num === 7 ? `/5.jpg` : `/${num}.jpg`;
            const overlayImagePath = `/${num}-1.png`;

            return (
              <div
                key={num}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className={`relative w-full h-screen snap-start flex-shrink-0 ${
                  index === imageNumbers.length - 1 ? "" : "snap-always"
                }`}
                style={{
                  scrollSnapAlign: "start",
                  scrollSnapStop:
                    index === imageNumbers.length - 1 ? "normal" : "always",
                  willChange: "transform", // GPU 가속
                }}
              >
                {/* 각 페이지의 로고와 선 - absolute로 배치 */}
                <div className="absolute top-4 left-10 z-50">
                  <Image
                    src="/pot-play-logo.svg"
                    alt="Pot Play Logo"
                    height={20}
                    width={140}
                    className={`transition-all duration-300 ${
                      index === 0 ? "brightness-0 invert" : "brightness-0"
                    }`}
                  />
                </div>
                {/* 1번 페이지가 아닐 때만 선 표시 */}
                {index !== 0 && (
                  <div className="absolute left-0 right-0 top-[70px] px-[40px] z-50">
                    <div className="w-full h-[1px] bg-black"></div>
                  </div>
                )}

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[1920px]">
                    <Image
                      src={backgroundImagePath}
                      alt={num.toString()}
                      fill
                      className="object-cover"
                      sizes="1920px"
                      priority={index < 3} // 처음 3개 이미지는 우선 로딩
                      {...(index >= 3 && { loading: "lazy" })}
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        console.error(
                          `배경 이미지 로드 실패: ${backgroundImagePath}`,
                          e
                        );
                      }}
                    />
                  </div>
                  {overlayImageNumbers.includes(num) && (
                    <div
                      className={`absolute inset-0 z-10 pointer-events-none ${
                        num === 1
                          ? "flex items-end justify-start"
                          : "flex items-center justify-center"
                      }`}
                    >
                      {num === 1 ? (
                        <div className="p-10">
                          <Image
                            src={overlayImagePath}
                            alt={`${num}-1`}
                            width={1200}
                            height={1200}
                            className="object-contain"
                            style={{ width: "auto", height: "auto" }}
                            loading={index === 0 ? "eager" : "lazy"}
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              console.error(
                                `오버레이 이미지 로드 실패: ${overlayImagePath}`,
                                e
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className={`relative flex items-center justify-center ${
                            num === 3 || num === 5 || num === 6 || num === 7
                              ? "w-[100%] h-[100%]"
                              : "w-[80%] h-[80%]"
                          }`}
                        >
                          <Image
                            src={overlayImagePath}
                            alt={`${num}-1`}
                            fill
                            className="object-contain"
                            loading={index === 0 ? "eager" : "lazy"}
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              console.error(
                                `오버레이 이미지 로드 실패: ${overlayImagePath}`,
                                e
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Image
          src={isInquiryModalOpen ? "/Xcircle.svg" : "/send.svg"}
          alt={isInquiryModalOpen ? "close" : "send"}
          width={48}
          height={48}
          className="fixed bottom-30 right-20 z-50 cursor-pointer"
          onClick={() => {
            if (isInquiryModalOpen) {
              setIsInquiryModalOpen(false);
            } else {
              setIsInquiryModalOpen(true);
            }
          }}
        />
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
        />
        <div
          className="snap-start flex-shrink-0"
          style={{ scrollSnapStop: "normal" }}
        >
          <Footer />
        </div>
      </div>
    </div>
  );
}
