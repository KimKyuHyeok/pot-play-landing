"use client";

<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Footer from "./components/footer/Footer";
import InquiryModal from "./components/modal/InquiryModal";
import Images from "./components/images/Images";
import { useCallback } from "react";

export default function Home() {
  const imageNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
  // 오버레이 이미지 번호 (1부터 13까지)
  const overlayImageNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const menuClickRef = useRef(false);
  const isWheelScrollingRef = useRef(false);
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
=======
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { LandingInquiryModal } from "../components/landing-inquiry-modal";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const PROBLEM_CARDS = [
  {
    image: "/2-1-1.png",
    badge: "Problem 1",
    title: "다양한 종류의 리워드 앱들",
    body: "현재 리워드 앱의 유저들은 보상을 목적으로만 앱을\n사용하기 때문에 실제 제품/서비스에 관심이 없습니다.",
  },
  {
    image: "/2-1-2.png",
    badge: "Problem 2",
    title: "실질적 이득 없음",
    body: "높은 CPI/CPA 대비 낮은 ROI 때문에 실제 매출로\n이어지는 비율이 낮아 수익이 좋지 않습니다.",
  },
  {
    image: "/2-1-3.png",
    badge: "Problem 3",
    title: "데이터 신뢰성 부족",
    body: "일부 사용자가 여러계정을 만들거나,\n자동화 도구를 사용하는 등의 부정 행위가 발생합니다.",
  },
] as const;

const EVIDENCE_CARDS = [
  {
    image: "/3-1-1.png",
    subtitle: "2023.02.03 해럴드 경제",
    title:
      '"걸으며 돈 버는 용돈벌이" 만보 채우려 \'휴대폰 그네\' 태운다',
  },
  {
    image: "/3-1-2.png",
    subtitle: "2024.10.23 경향신문",
    title:
      "자영업 등치는 '리워드 마케팅'...'상위 노출 보장'에 속지 마세요",
  },
  {
    image: "/3-1-3.png",
    subtitle: "2024.02.13 네이버 플레이스",
    title: "플레이스는 리뷰 클렌징 시스템을 운영하고 있습니다.",
  },
] as const;

const SOLUTION_STRIPS = [
  {
    label: "문제점",
    question: "어떤 방식을 쓸까?",
    answer:
      "앱과 물품에 대하여 명확하게 제시하기 어려운 광고 제안 방식, \n브랜드 인지도와 유저 참여를 위하여 광고 별 차이점은 뭘까?",
    emphasis: false,
  },
  {
    label: "해법",
    question: "광고 커스터마이징 가능",
    answer:
      "POT-PLAY의 광고 커스터마이징 기능으로 원하는 효과와, 저렴한 비용으로\n미션 구체화, 배너 선택 유무 등 광고 형태 구현",
    emphasis: false,
  },
  {
    label: "결과",
    question: "W to W",
    answer:
      "긍정적인 브랜드 이미지 형성, 그 외 추가 할인 등의 맞춤형 혜택 제공 기능",
    emphasis: true,
  },
] as const;

/** 첫 화면 히어로와 동일한 폰트 스택 */
const TABLET_GOTHIC_WIDE_STACK =
  '"Tablet Gothic Wide", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';

const PRODUCT_FEATURE_CARDS = [
  {
    title: "[ 슬라이드 배너 ]",
    body: "메인 화면에 노출되는 슬라이드 배너입니다.",
  },
  {
    title: "[ 특가상품 코너 ]",
    body: "특가상품 항목에서 서비스로 바로 이동할 수 있습니다.",
  },
  {
    title: "[ 미션 기능 ]",
    body:
      "포인트를 획득할 수 있는 미션 기능으로, 제휴사에 따라 커스텀이 가능합니다.",
  },
] as const;

const PARTNER_DEAL_FEATURE_CARDS = [
  {
    title: "이미지 배너",
    body: "광고의 핵심 내용을 타겟으로 한 메인 배너 페이지가 노출됩니다.",
  },
  {
    title: "랜딩 페이지 표시",
    body: "별도의 상세 페이지를 제작하여 주시는 경우 해당 랜딩 페이지를 노출합니다.",
  },
  {
    title: "광고주 페이지 바로 이동",
    body: "랜딩 페이지를 원하지 않으시는 경우 광고주가 요청하신 페이지로 이동합니다.",
  },
] as const;

const MISSION_PAGE_FEATURE_CARDS = [
  {
    title: "미션 카테고리",
    body: "광고 커스터마이징 기능을 진행하여 광고 유형에 맞춘 카테고리에 내용을 추가합니다. 고객에게 제공하는 포인트도 확인할 수 있습니다.",
  },
  {
    title: "미션 항목 노출",
    body: "퀴즈 또는 설문조사 항목 등, 설정된 카테고리 항목을 기준으로 랜덤하게 광고주와 협의된 항목으로 미션을 제작하여 노출합니다.",
  },
] as const;

const HOW_ACTION_STEPS = [
  {
    stepLabel: "Step.1",
    title: "문의",
    icon: "/11-1-1.png",
    body: "광고 게재 신청",
  },
  {
    stepLabel: "Step.2",
    title: "세부 사항 정의",
    icon: "/11-1-2.png",
    body:
      "요청 광고 유형 목록 및\n구현 기능에 대한 세부사항 정의\n이후 미션 커스터마이징 진행",
  },
  {
    stepLabel: "Step.3",
    title: "집행 시기 확인",
    icon: "/11-1-3.png",
    body: "소재 검수 및 셋팅을 진행하고\n집행 시기를 재검토 합니다.",
  },
  {
    stepLabel: "Step.4",
    title: "광고 집행",
    icon: "/11-1-4.png",
    body: "광고 집행 후 모니터링 및 경과 보고",
  },
] as const;

const EVENT_PACKAGE_ROWS = [
  {
    title: "다운로드 캠페인",
    bodyA: "CPI\n+\nCPA조합",
    bodyB: "설치당 250원\n+\n첫 구매 시 추가 800원",
    bodyC: "타 업체 대비\n20% 저렴한 비용",
  },
  {
    title: "브랜드 인지도 캠페인",
    bodyA: "CPE\n+\nCPQ조합",
    bodyB: "퀴즈 참여당 380원\n+\n공유 시 추가 120원",
    bodyC: "다양한 참여 유도",
  },
  {
    title: "이커머스 전환 캠페인",
    bodyA: "CPC\n+\nCPA 조합",
    bodyB: "클릭당 70원\n+\n구매 완료 시 1,200원",
    bodyC: "전환당 비용 최적화로 ROI 향상",
  },
] as const;

/** 행마다 위에서 아래로 살짝 연해지는 파란 제목 배경 */
const EVENT_PACKAGE_TITLE_BG = ["#2979FF", "#5294ea", "#8ebdf8"] as const;

/** web.pot-play 우측 확장 메뉴 (화면 번호 1-based → 스크롤 섹션 매핑) */
const LANDING_NAV_LIST = [
  { id: 1, name: "문제정의" },
  { id: 2, name: "맞춤형 광고 솔루션" },
  { id: 3, name: "광고 한눈에 보기" },
  { id: 4, name: "핵심 요소" },
  { id: 5, name: "유형 선택" },
  { id: 6, name: "광고별 단가" },
  { id: 7, name: "진행 방식" },
  { id: 8, name: "활용 시나리오" },
  { id: 9, name: "제안 포인트" },
] as const;

const LANDING_NAV_TO_SCREEN: Record<number, number> = {
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

const LANDING_NAV_ACTIVE_SCREENS: Partial<Record<number, number[]>> = {
  1: [2, 3],
  3: [5, 6, 7],
};

const BUSINESS_VALUE_ITEMS = [
  {
    icon: "/8-1-1.png",
    title: "광고 분류",
    body: "광고 유형에 따라 어떤 광고를 선택하는 것이 적합한지, 효과적 유형을 분류합니다.",
  },
  {
    icon: "/8-1-2.png",
    title: "투명한 데이터 확인",
    body: "설치 후 행동 데이터를 제공하여 일반 채널과 비교할 수 있는 벤치마크 데이터를 제공합니다.",
  },
  {
    icon: "/8-1-3.png",
    title: "사용자 품질 검증 시스템",
    body: "부정 사용자 필터링 알고리즘 도입으로 실제 관심이 있는 사용자가 이용하도록 유도합니다.",
  },
  {
    icon: "/8-1-4.png",
    title: "타겟팅 고도화",
    body: "단순한 앱 진입에서 끝나는 것이 아닌, 실제 고객으로 이어지도록 타겟팅 고도화를 진행합니다.",
  },
] as const;

const REVENUE_MODEL_CARDS = [
  {
    question: "어떤 타입의 광고를 선택해야하나요?",
    answerBold: "맞춤형 커스터마이징 기능으로 원하는 금액 광고를 선정합니다.",
    answerBody:
      "유연한 최소 금액 설정으로 인하여 초기 진입 장벽이 낮고, 실시간 대시보드 및 주간 상세 분석 리포트를 통하여 광고 목표량에 부합하는지 확인합니다.\n상품 또는 서비스에 맞춰 금액 대비 효과적인 광고를 제안합니다.",
  },
  {
    question: "가격은 어떻게 책정하나요?",
    answerBold: "사용자의 행동을 기준으로 책정합니다.",
    answerBody:
      "앱을 설치하거나, 특정한 액션 (회원가입, 정보 입력 등)을 진행했을 때, 혹은 브랜드 이미지를 위하여 퀴즈 등 미션을 선택하는 경우 원하는 광고의 궁극적 결과를 위하여 선택권을 확대하고, 초기 참여도와 유형에 따른 차등으로 비용 절감에 효과가 있습니다.",
  },
] as const;

function RevenueModelCardsGrid() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardElsRef = useRef<(HTMLElement | null)[]>([null, null]);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const cards = cardElsRef;

    const clearLocks = (a: HTMLElement, b: HTMLElement) => {
      a.style.removeProperty("height");
      a.style.removeProperty("min-height");
      b.style.removeProperty("height");
      b.style.removeProperty("min-height");
    };

    const syncHeights = () => {
      const a = cards.current[0];
      const b = cards.current[1];
      if (!a || !b) return;

      if (!mq.matches) {
        clearLocks(a, b);
        return;
      }

      clearLocks(a, b);
      void a.offsetHeight;

      const h = Math.max(a.offsetHeight, b.offsetHeight);
      const px = `${Math.ceil(h)}px`;
      a.style.height = px;
      a.style.minHeight = px;
      b.style.height = px;
      b.style.minHeight = px;
    };

    let raf = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncHeights);
    };

    const ro = new ResizeObserver(() => {
      scheduleSync();
    });

    const root = wrapRef.current;
    if (root) ro.observe(root);

    requestAnimationFrame(() => {
      const c0 = cards.current[0];
      const c1 = cards.current[1];
      if (c0) ro.observe(c0);
      if (c1) ro.observe(c1);
      scheduleSync();
    });
    mq.addEventListener("change", scheduleSync);
    window.addEventListener("resize", scheduleSync);
    scheduleSync();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener("change", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      const x = cards.current[0];
      const y = cards.current[1];
      if (x && y) clearLocks(x, y);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-start gap-2.5 pb-3 max-lg:min-h-0 sm:gap-3 sm:pb-6 lg:shrink-0 lg:flex-none lg:flex-row lg:items-stretch lg:justify-center lg:gap-5 lg:pb-8"
    >
      {REVENUE_MODEL_CARDS.map((card, index) => (
        <article
          key={card.question}
          data-revenue-card
          ref={(el) => {
            cardElsRef.current[index] = el;
          }}
          className="flex min-h-0 min-w-0 w-full flex-none flex-col overflow-hidden rounded-2xl border border-zinc-400/35 bg-zinc-100/95 shadow-sm backdrop-blur-sm max-lg:min-h-0 max-lg:flex-none max-lg:overflow-y-auto max-lg:overflow-x-hidden lg:overflow-hidden lg:h-[min(56dvh,27rem)] lg:min-h-[20rem] lg:w-0 lg:max-h-[27rem] lg:flex-1 lg:shrink-0"
        >
          <div className="shrink-0 px-2 pt-2 pb-3 sm:px-4 sm:pt-4 sm:pb-4 lg:p-4">
            <div className="relative rounded-xl border border-zinc-400/45 bg-zinc-200/95 px-2 py-1.5 shadow-sm sm:px-3 sm:py-3">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <span
                  className="shrink-0 select-none font-serif text-3xl font-bold leading-none text-zinc-400 sm:text-5xl lg:text-[3.25rem]"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="min-w-0 flex-1 text-center text-pretty font-extrabold leading-snug text-[#2979FF] max-lg:[font-size:var(--m-revenue-q)] lg:text-xl xl:text-[1.375rem]">
                  {card.question}
                </p>
                <span
                  className="shrink-0 select-none font-serif text-3xl font-bold leading-none text-zinc-400 sm:text-5xl lg:text-[3.25rem]"
                  aria-hidden
                >
                  &rdquo;
                </span>
              </div>
              <div
                className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
                aria-hidden
              >
                <div className="h-3 w-3 rotate-45 border-b border-r border-zinc-400/45 bg-zinc-200/95 shadow-[1px_1px_0_0_rgba(0,0,0,0.04)]" />
              </div>
            </div>
          </div>

          <div className="flex min-h-0 w-full flex-none flex-col overflow-y-auto px-2.5 pb-2 pt-2 max-lg:min-h-0 max-lg:flex-1 max-lg:px-2 max-lg:pb-3 max-lg:pt-3 sm:px-4 sm:pb-4 sm:pt-4 lg:min-h-0 lg:flex-1 lg:pt-5">
            <div className="grid min-w-0 w-full grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-0 max-lg:min-h-0 max-lg:gap-y-0 sm:gap-x-2.5 sm:gap-y-1.5 lg:min-h-0 lg:flex-1 lg:gap-y-3">
              <span className="font-extrabold leading-[1.55] text-[#2979FF] max-lg:[font-size:var(--m-revenue-a-bold)] lg:leading-[1.625] lg:text-[1.1875rem]">
                A.
              </span>
              <p className="min-w-0 text-pretty font-bold leading-[1.55] text-zinc-900 max-lg:[font-size:var(--m-revenue-a-bold)] lg:leading-[1.625] lg:text-[1.1875rem]">
                {card.answerBold}
              </p>
              <p className="col-start-2 min-w-0 text-pretty font-normal text-zinc-800 max-lg:[font-size:var(--m-revenue-body)] max-lg:leading-[1.45] lg:text-[1.125rem] lg:leading-relaxed whitespace-pre-line">
                {card.answerBody}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

const PRICE_ROWS = [
  {
    slug: "cpi",
    label: "CPI",
    title: "Cost Per Install",
    body: "앱 설치 건 당 단가를 의미\n250원/건",
  },
  {
    slug: "cpc",
    label: "CPC",
    title: "Cost Per Click",
    body: "사용자가 광고를 클릭할 때마다 과금\n70원/건",
  },
  {
    slug: "cpe",
    label: "CPE/CPA",
    title: "Engagement\nor Action",
    body: "좋아요, 댓글, 공유, 영상 시청 등 사용자의 능동적 참여 행동에 과금\n회원가입, 구매, 예약 등 광고주가 원하는 전환 행동 발생 시 과금\n350~1,500원/건",
  },
  {
    slug: "cpq",
    label: "CPQ",
    title: "Cost Per Quiz",
    body: "사용자가 퀴즈나 설문을 완료할 때마다 지불하는 비용\n380원/건",
  },
] as const;

function LogoRow({
  lightLogo,
  showDivider = true,
}: {
  lightLogo: boolean;
  showDivider?: boolean;
}) {
  return (
    <div className="absolute left-4 right-4 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-20 sm:left-10 sm:right-10 sm:top-6">
      <img
        alt="Pot Play Logo"
        loading="lazy"
        width="140"
        height="20"
        decoding="async"
        data-nimg="1"
        className={`transition-all duration-300 ${
          lightLogo ? "brightness-0 invert" : "brightness-0"
        }`}
        style={{ color: "transparent" }}
        src="/pot-play-logo.svg"
      />
      {showDivider ? (
        <div className="mt-3 h-px w-full bg-black" aria-hidden />
      ) : null}
    </div>
  );
}

function SolutionChevronDivider() {
  return (
    <div
      className="flex shrink-0 justify-center py-1 max-lg:py-0.5 lg:py-4"
      aria-hidden
    >
      <svg
        width="32"
        height="20"
        viewBox="0 0 32 20"
        className="text-zinc-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6 L16 16 L28 6"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GradientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60rem_45rem_at_15%_10%,rgba(124,58,237,0.25),transparent_55%),radial-gradient(50rem_40rem_at_85%_20%,rgba(59,130,246,0.22),transparent_55%),radial-gradient(55rem_40rem_at_70%_85%,rgba(236,72,153,0.14),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,6,23,0.75),rgba(2,6,23,0.94))]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:44px_44px]" />
    </div>
  );
}

function Screen({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle: string;
}) {
  if (index === 0) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Intro background"
          className="absolute inset-0 bg-[url('/1.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70rem_40rem_at_20%_15%,rgba(0,0,0,0.04),transparent_55%)]"
        />

        <LogoRow lightLogo showDivider={false} />

        <div
          className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-4 sm:px-6"
          style={{ fontFamily: TABLET_GOTHIC_WIDE_STACK }}
        >
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 pr-24 sm:pr-32 md:pr-0">
              <p className="font-extrabold tracking-wide text-black drop-shadow-[0_2px_12px_rgba(255,255,255,0.28)] [font-size:clamp(18px,4.5vw,30px)]">
                한번에 진행하는 PROMOTION
              </p>
              <h1 className="mt-3 whitespace-nowrap font-extrabold tracking-tight text-black drop-shadow-[0_2px_18px_rgba(255,255,255,0.28)] [font-size:clamp(48px,12.5vw,160px)] leading-none">
                POT-PLAY
              </h1>
              <p className="mt-4 font-bold text-black drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)] [font-size:clamp(14px,4.2vw,28px)]">
                Prime Play. Pot-play.
              </p>
            </div>

            <img
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              src="/1-1.png"
              className="pointer-events-none absolute right-0 top-0 block w-[120px] translate-x-1/6 -translate-y-1/6 rotate-[22deg] select-none sm:w-[160px] md:static md:w-[220px] md:translate-x-0 md:translate-y-0 md:-translate-y-14 md:shrink-0"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (index === 1) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 2 background"
          className="absolute inset-0 bg-[url('/2.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70rem_40rem_at_20%_15%,rgba(0,0,0,0.04),transparent_55%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[max(0.25rem,var(--app-safe-bottom))] pt-[var(--logo-zone)] max-lg:min-h-0 sm:px-6 sm:pb-8 lg:px-6 lg:pb-4">
          <header className="shrink-0 text-center max-lg:space-y-0.5 [@media(max-height:700px)]:space-y-0.5">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Problem
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-3 sm:max-lg:leading-snug lg:mt-3 lg:text-5xl xl:text-6xl">
              우리는 왜 <span className="text-[#2979FF]">필요</span>한가?
            </h2>
          </header>

          <div
            data-nested-scroll
            className="mt-1 flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-1 [-webkit-overflow-scrolling:touch] max-lg:min-h-0 max-lg:gap-1.5 max-lg:overflow-y-auto max-lg:overscroll-contain sm:max-lg:gap-2 lg:mt-auto lg:mb-10 lg:max-h-none lg:flex-none lg:gap-0 lg:overflow-y-auto lg:overscroll-contain lg:pt-6 xl:mb-16"
          >
            <div className="flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-1.5 max-lg:min-h-0 sm:max-lg:gap-2 lg:mx-auto lg:grid lg:flex-none lg:grid-cols-3 lg:gap-6">
              {PROBLEM_CARDS.map((card) => (
                <article
                  key={card.badge}
                  className="flex min-h-0 w-full flex-1 flex-col items-stretch overflow-hidden rounded-lg border border-black/10 bg-white/95 shadow-sm backdrop-blur-sm basis-0 max-lg:min-h-0 lg:h-[clamp(22rem,58vh,40rem)] lg:flex-none lg:rounded-2xl"
                >
                  <div className="relative w-full shrink-0 overflow-hidden max-lg:h-[var(--m-img-h)] lg:h-[52%] lg:min-h-[8rem]">
                    <img
                      alt=""
                      src={card.image}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden px-3 py-2 text-center max-lg:gap-1.5 sm:max-lg:gap-2 sm:max-lg:px-3.5 sm:max-lg:py-2.5 lg:items-center lg:justify-start lg:gap-8 lg:px-4 lg:py-6">
                    <span className="inline-flex shrink-0 self-center rounded-full bg-[#2979FF] px-2.5 py-1 font-semibold leading-tight text-white max-lg:[font-size:var(--m-fluid-label)] lg:px-4 lg:py-2 lg:text-base lg:leading-normal">
                      {card.badge}
                    </span>
                    <h3 className="line-clamp-3 w-full text-pretty text-center font-extrabold leading-snug text-black max-lg:[font-size:var(--m-fluid-card-title)] sm:max-lg:line-clamp-2 lg:line-clamp-none lg:max-w-none lg:text-xl xl:text-2xl">
                      {card.title}
                    </h3>
                    <p className="w-full flex-none text-pretty text-center leading-relaxed text-zinc-600 max-lg:[font-size:var(--m-fluid-card-body)] lg:max-w-none lg:text-sm lg:leading-relaxed lg:text-[0.9375rem] whitespace-pre-line">
                      {card.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 2) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 3 background"
          className="absolute inset-0 bg-[url('/3.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70rem_40rem_at_50%_40%,rgba(255,255,255,0.5),transparent_60%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[max(0.25rem,var(--app-safe-bottom))] pt-[var(--logo-zone)] max-lg:min-h-0 sm:px-6 sm:pb-8 lg:px-6 lg:pb-4">
          <header className="shrink-0 text-center max-lg:space-y-0.5 [@media(max-height:700px)]:space-y-0.5">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Problem
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-3 sm:max-lg:leading-snug lg:mt-3 lg:text-5xl xl:text-6xl">
              문제의 <span className="text-[#2979FF]">근거</span>
            </h2>
          </header>

          <div
            data-nested-scroll
            className="mt-1 flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-1 [-webkit-overflow-scrolling:touch] max-lg:min-h-0 max-lg:gap-1.5 max-lg:overflow-y-auto max-lg:overscroll-contain sm:max-lg:gap-2 lg:mt-auto lg:mb-10 lg:max-h-none lg:flex-none lg:gap-0 lg:overflow-y-auto lg:overscroll-contain lg:pt-6 xl:mb-16"
          >
            <div className="flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-1.5 max-lg:min-h-0 sm:max-lg:gap-2 lg:mx-auto lg:grid lg:flex-none lg:grid-cols-3 lg:gap-6">
              {EVIDENCE_CARDS.map((card, i) => (
                <article
                  key={i}
                  className="flex min-h-0 w-full flex-1 flex-col items-stretch overflow-hidden rounded-lg border border-black/10 bg-white/95 shadow-sm backdrop-blur-sm basis-0 max-lg:min-h-0 lg:h-[clamp(22rem,58vh,40rem)] lg:flex-none lg:gap-5 lg:rounded-2xl"
                >
                  <div className="relative w-full shrink-0 overflow-hidden max-lg:h-[var(--m-evidence-img-h)] lg:h-[52%] lg:min-h-[8rem]">
                    <img
                      alt=""
                      src={card.image}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-start gap-1 overflow-hidden px-2 py-1.5 text-left max-lg:gap-1 sm:max-lg:gap-1.5 sm:max-lg:px-2.5 sm:max-lg:py-2 lg:justify-start lg:gap-7 lg:px-4 lg:py-6">
                    <p className="w-full min-w-0 shrink-0 text-pretty font-semibold leading-snug tracking-tight text-zinc-600 max-lg:[font-size:var(--m-evidence-subtitle)] lg:text-base lg:leading-normal lg:tracking-normal xl:text-lg">
                      {card.subtitle}
                    </p>
                    <h3 className="line-clamp-6 w-full min-w-0 text-pretty text-left font-extrabold leading-snug text-black max-lg:[font-size:var(--m-evidence-title)] max-lg:leading-snug sm:max-lg:line-clamp-5 lg:line-clamp-none lg:text-xl xl:text-2xl">
                      {card.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 3) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden bg-zinc-100"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[max(0.5rem,var(--app-safe-bottom))] pt-[var(--logo-zone)] max-lg:min-h-0 sm:px-8 sm:pb-8 lg:px-10">
          <header className="shrink-0 text-center max-lg:space-y-0.5">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Solution
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-3 lg:text-5xl xl:text-6xl">
              맞춤형 광고 솔루션
            </h2>
          </header>

          <div
            data-nested-scroll
            className="mt-2 flex min-h-0 w-full flex-1 flex-col overflow-hidden [-webkit-overflow-scrolling:touch] max-lg:min-h-0 max-lg:justify-center max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:pb-1 sm:mt-6 lg:mt-8 lg:overflow-visible"
          >
            <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-col justify-start gap-0 max-lg:py-1 lg:min-h-0 lg:flex-1 lg:justify-center">
              {SOLUTION_STRIPS.map((strip, i) => (
                <div key={strip.label} className="flex flex-col">
                  <div
                    className={`lg:hidden ${
                      strip.emphasis
                        ? "border border-[#1e5ecc] bg-[#2979FF] text-white"
                        : "border border-black/10 bg-white/90"
                    } flex flex-col gap-2.5 rounded-xl px-[clamp(0.75rem,3.5vw,1rem)] py-3 shadow-sm backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-5`}
                  >
                    <p
                      className={`text-center font-extrabold tracking-wide max-lg:[font-size:var(--m-fluid-label)] sm:text-base ${
                        strip.emphasis ? "text-white" : "text-[#2979FF]"
                      }`}
                    >
                      {strip.label}
                    </p>
                    <h3
                      className={`text-center text-pretty font-bold leading-snug max-lg:[font-size:var(--m-fluid-sol-q)] sm:text-xl ${
                        strip.emphasis ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {strip.question}
                    </h3>
                    <div
                      className={`h-px w-full shrink-0 ${
                        strip.emphasis ? "bg-white/40" : "bg-zinc-200"
                      }`}
                      aria-hidden
                    />
                    <p
                      className={`text-pretty text-left leading-relaxed whitespace-pre-line max-lg:[font-size:var(--m-fluid-sol-a)] sm:text-base ${
                        strip.emphasis ? "text-white" : "text-zinc-600"
                      }`}
                    >
                      {strip.answer}
                    </p>
                  </div>

                  <div
                    className={`hidden min-h-[8.5rem] w-full shrink-0 grid-cols-[7.25rem_1px_minmax(0,1fr)_1px_minmax(0,1.6fr)] items-stretch gap-x-6 rounded-2xl px-8 py-4 shadow-sm backdrop-blur-sm lg:grid ${
                      strip.emphasis
                        ? "border border-[#1e5ecc] bg-[#2979FF] text-white"
                        : "border border-black/10 bg-white/90"
                    }`}
                  >
                    <div className="flex min-h-full min-w-0 items-center justify-center">
                      <p
                        className={`text-center text-base font-extrabold tracking-wide ${
                          strip.emphasis ? "text-white" : "text-[#2979FF]"
                        }`}
                      >
                        {strip.label}
                      </p>
                    </div>
                    <div
                      className={`min-h-0 w-px self-stretch justify-self-stretch ${
                        strip.emphasis ? "bg-white/40" : "bg-zinc-200"
                      }`}
                      aria-hidden
                    />
                    <h3
                      className={`min-w-0 self-center text-pretty text-left text-2xl font-bold leading-snug ${
                        strip.emphasis ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {strip.question}
                    </h3>
                    <div
                      className={`min-h-0 w-px self-stretch justify-self-stretch ${
                        strip.emphasis ? "bg-white/40" : "bg-zinc-200"
                      }`}
                      aria-hidden
                    />
                    <p
                      className={`flex min-w-0 flex-col justify-center text-pretty text-lg leading-relaxed whitespace-pre-line ${
                        strip.emphasis ? "text-white" : "text-zinc-600"
                      }`}
                    >
                      {strip.answer}
                    </p>
                  </div>
                  {i < SOLUTION_STRIPS.length - 1 ? (
                    <SolutionChevronDivider />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 4 || index === 5 || index === 6) {
    const serviceLayout =
      index === 6
        ? {
            bgAria: "Mission page background",
            kicker: "Service",
            heading: "미션 페이지",
            imgSrc: "/7-1.png",
            imgAlt: "POT-PLAY 미션 페이지 UI 예시",
            cards: MISSION_PAGE_FEATURE_CARDS,
          }
        : index === 5
          ? {
              bgAria: "Partner deal background",
              kicker: "Service",
              heading: "파트너딜 페이지",
              imgSrc: "/6-1.png",
              imgAlt: "POT-PLAY 파트너딜 페이지 UI 예시",
              cards: PARTNER_DEAL_FEATURE_CARDS,
            }
          : {
              bgAria: "Product background",
              kicker: "Product / Service",
              heading: "POT-PLAY 배너 및 특가상품 광고",
              imgSrc: "/5-1.png",
              imgAlt: "POT-PLAY 배너·특가상품 광고 UI 예시",
              cards: PRODUCT_FEATURE_CARDS,
            };

    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label={serviceLayout.bgAria}
          className="absolute inset-0 bg-[url('/5.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70rem_40rem_at_50%_35%,rgba(255,255,255,0.45),transparent_58%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-0 pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full max-w-6xl shrink-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              {serviceLayout.kicker}
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-2 lg:mt-3 lg:text-4xl xl:text-5xl">
              {serviceLayout.heading === "POT-PLAY 배너 및 특가상품 광고" ? (
                <>
                  POT-PLAY{" "}
                  <span className="text-[#2979FF]">배너 및 특가상품 광고</span>
                </>
              ) : (
                serviceLayout.heading
              )}
            </h2>
          </header>

          {/* 헤더 아래 남은 높이만 사용 → 고정 vh로 잘리지 않음. 하단은 safe-area만 */}
          <div
            data-nested-scroll
            className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] pb-[var(--app-safe-bottom)]"
          >
            <div className="flex min-h-0 flex-1 flex-col lg:min-h-0">
              <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 pt-3 sm:gap-5 sm:pt-4 lg:flex-row lg:items-stretch lg:gap-6">
                {/* 좌: 이미지 — lg에서 items-stretch + flex-1 래퍼로 실제 박스가 열 전체를 씀 (items-center만 쓰면 가로가 intrinsic에 막힘) */}
                <div className="order-2 mt-auto flex min-h-0 w-full min-w-0 flex-col items-center justify-end lg:order-none lg:mt-0 lg:h-full lg:w-0 lg:min-w-0 lg:flex-[1.1] lg:items-stretch lg:justify-end">
                  <div className="flex w-full min-h-0 max-w-full flex-col items-center justify-end max-lg:flex-none lg:flex-1 lg:items-stretch">
                    <img
                      alt={serviceLayout.imgAlt}
                      src={serviceLayout.imgSrc}
                      className="h-auto w-auto max-w-full shrink-0 object-contain object-bottom max-h-[min(58vh,38.5rem)] lg:min-h-0 lg:w-full lg:flex-1 lg:max-h-none lg:object-contain lg:object-bottom"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* 우: 카드 수만큼 세로 flex 분배 (2개·3개 동일) */}
                <div
                  className="order-1 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 sm:gap-3 lg:order-none lg:box-border lg:h-full lg:w-0 lg:min-w-0 lg:flex-[0.9] lg:gap-5 lg:py-26"
                  style={{ fontFamily: TABLET_GOTHIC_WIDE_STACK }}
                >
                  {serviceLayout.cards.map((card) => (
                    <div
                      key={card.title}
                      className="flex min-h-0 flex-1 basis-0 flex-col justify-center gap-1.5 overflow-y-auto rounded-xl border border-black/15 bg-white/90 px-5 py-2.5 shadow-sm backdrop-blur-sm sm:gap-2 sm:px-6 sm:py-3.5 lg:px-7"
                    >
                      <p className="shrink-0 font-extrabold text-[#2979FF] max-lg:text-base max-lg:leading-snug lg:text-lg lg:leading-snug xl:text-xl">
                        {card.title}
                      </p>
                      <p className="min-h-0 text-pretty font-bold leading-relaxed text-zinc-800 max-lg:text-[0.9375rem] sm:max-lg:text-base lg:text-base lg:leading-relaxed xl:text-[1.0625rem]">
                        {card.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 7) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 8 background"
          className="absolute inset-0 bg-[url('/8.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70rem_40rem_at_50%_35%,rgba(255,255,255,0.42),transparent_58%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full max-w-6xl shrink-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Business
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-2 lg:mt-3 lg:text-4xl xl:text-5xl">
              가치 창출의 <span className="text-[#2979FF]">4가지 핵심 요소</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-pretty font-medium leading-relaxed text-zinc-600 max-lg:[font-size:var(--m-fluid-card-body)] sm:mt-2 lg:mt-2.5 lg:text-lg">
              POT-PLAY만의 광고 목표 핵심 요소입니다.
            </p>
          </header>

          <div
            data-nested-scroll
            className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] pt-9 sm:pt-10 lg:pt-2.5"
          >
            <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-start lg:justify-center">
              <div className="grid w-full auto-rows-auto grid-cols-1 gap-2.5 sm:gap-4 lg:h-[clamp(24rem,42dvh,31rem)] lg:grid-cols-2 lg:gap-7 lg:[grid-template-rows:repeat(2,minmax(0,1fr))]">
                {BUSINESS_VALUE_ITEMS.map((item, i) => (
                  <div
                    key={item.title}
                    className="flex min-h-0 min-w-0 items-center gap-4 overflow-y-auto rounded-2xl border border-black/10 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:gap-4 sm:px-5 sm:py-3.5 lg:gap-5 lg:px-7 lg:py-4"
                    aria-label={`핵심 요소 ${i + 1}: ${item.title}`}
                  >
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 sm:gap-2">
                      <p className="text-pretty font-extrabold leading-snug text-[#2979FF] max-lg:text-base sm:text-lg lg:text-[1.375rem] xl:text-[1.625rem]">
                        {item.title}
                      </p>
                      <p className="text-pretty font-semibold leading-relaxed text-zinc-700 max-lg:[font-size:var(--m-fluid-card-body)] sm:max-lg:text-[0.9375rem] lg:text-[1.0625rem] lg:font-medium xl:text-[1.125rem]">
                        {item.body}
                      </p>
                    </div>
                    <div className="flex h-[5.375rem] w-[5.375rem] shrink-0 items-center justify-center rounded-full bg-[#eee] sm:h-[6rem] sm:w-[6rem] lg:h-[7.5rem] lg:w-[7.5rem]">
                      <img
                        src={item.icon}
                        alt=""
                        className="h-[74%] w-[74%] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 8) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 9 background"
          className="absolute inset-0 bg-[url('/9.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(65rem_42rem_at_50%_40%,rgba(255,255,255,0.38),transparent_60%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full max-w-4xl shrink-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Revenue Model
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-2 lg:mt-3 lg:text-4xl xl:text-5xl">
              광고의 유형은 <span className="text-[#2979FF]">어떻게</span> 선택하는가?
            </h2>
          </header>

          <div
            data-nested-scroll
            className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden overscroll-contain [-webkit-overflow-scrolling:touch] pt-3 max-lg:pt-2 sm:pt-7 lg:overflow-y-auto lg:pt-6"
          >
            <RevenueModelCardsGrid />
          </div>
        </div>
      </section>
    );
  }

  if (index === 9) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 10 background"
          className="absolute inset-0 bg-[url('/10.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(62rem_40rem_at_50%_42%,rgba(255,255,255,0.45),transparent_58%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full max-w-4xl shrink-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Price
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-2 lg:mt-3 lg:text-4xl xl:text-5xl">
              광고 별 실질 <span className="text-[#2979FF]">단가</span>
            </h2>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-start pt-1 pb-3 max-lg:min-h-0 max-lg:pb-2 lg:justify-center lg:py-6 xl:py-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8 max-lg:gap-3">
              {PRICE_ROWS.map((row) => (
                <div
                  key={row.slug}
                  className="flex min-h-0 w-full items-center gap-2.5 sm:gap-3 max-lg:flex-col max-lg:items-stretch max-lg:gap-2.5"
                >
                  <span className="flex w-fit shrink-0 items-center justify-center rounded-full bg-[#2979FF] px-3 py-1.5 text-center text-xs font-bold leading-tight tracking-wide text-white sm:px-3.5 sm:py-2 sm:text-sm max-lg:max-w-[min(100%,18rem)] max-lg:self-start lg:self-center lg:h-[4.85rem] lg:w-[13rem] lg:px-4 lg:text-3xl lg:leading-none">
                    {row.label}
                  </span>
                  <div
                    className="pointer-events-none hidden h-1 w-24 shrink-0 bg-[radial-gradient(circle_closest-side,rgb(113_113_122)_1.5px,transparent_1.65px)] bg-[length:0.4375rem_100%] bg-center [background-repeat:repeat-x] opacity-85 sm:h-1 sm:w-32 sm:bg-[length:0.5rem_100%] lg:block"
                    aria-hidden
                  />
                  <div className="flex h-[5.75rem] min-h-0 min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-zinc-400/50 bg-white/75 py-1.5 shadow-sm backdrop-blur-sm sm:h-[7rem] sm:rounded-[1.125rem] sm:py-2 max-lg:h-auto max-lg:min-h-[4.5rem] max-lg:w-full">
                    <div className="max-h-full min-h-0 w-full overflow-y-auto">
                      <div className="flex min-h-[4rem] w-full items-stretch gap-2.5 pl-2.5 pr-2.5 sm:min-h-[5.25rem] sm:gap-3 sm:pl-3 sm:pr-3">
                        <div className="flex w-[7.5rem] shrink-0 items-center justify-center sm:w-[9.75rem]">
                          <h3 className="max-w-full text-pretty text-center text-base font-bold leading-snug text-[#2979FF] sm:text-lg whitespace-pre-line">
                            {row.title}
                          </h3>
                        </div>
                        <div
                          className="w-[1.5px] shrink-0 self-stretch rounded-full bg-zinc-400/90"
                          aria-hidden
                        />
                        <div className="flex min-h-0 min-w-0 flex-1 items-center py-0.5">
                          <p className="w-full text-pretty text-left text-sm font-bold leading-relaxed text-zinc-800 sm:text-base whitespace-pre-line">
                            {row.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 10) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 11 background"
          className="absolute inset-0 bg-[url('/11.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(62rem_40rem_at_50%_38%,rgba(255,255,255,0.42),transparent_58%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.75rem,4vw,1rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full max-w-4xl shrink-0 text-center max-md:pb-0">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              How to Action
            </p>
            <h2 className="mt-1 text-balance font-bold leading-tight text-black max-lg:mt-0.5 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-2 lg:mt-3 lg:text-4xl xl:text-5xl">
              광고 진행 방식
            </h2>
            <p className="mx-auto mt-0 max-w-2xl text-pretty font-medium leading-relaxed text-zinc-600 max-md:mt-1 max-lg:[font-size:var(--m-fluid-card-body)] md:mt-2 lg:mt-3 lg:text-lg">
              업체와 상품에 맞춰 광고 커스터마이징을 거쳐 원하는 목표에 도달합니다.
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden pb-2 pt-0 max-md:min-h-0 max-md:pt-2 md:justify-center md:pb-0 md:pt-6 lg:pt-6">
            <div className="mx-auto flex w-full min-w-0 max-w-md flex-col items-stretch gap-y-2 px-2 py-0 max-md:max-h-full max-md:overflow-hidden max-md:gap-y-1.5 md:max-w-[90rem] md:flex-row md:flex-nowrap md:items-center md:justify-center md:gap-x-2.5 md:gap-y-0 md:overflow-x-auto md:overflow-y-visible md:px-1 md:py-9 lg:py-10">
                {HOW_ACTION_STEPS.map((step, i) => (
                  <Fragment key={step.stepLabel}>
                    <div
                      className={`mx-auto grid w-full max-w-md shrink-0 grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-start justify-items-stretch gap-x-3 gap-y-1 px-3 py-3 text-left min-h-0 rounded-2xl border border-zinc-400/50 bg-white/85 shadow-md backdrop-blur-sm md:mx-0 md:grid-cols-1 md:grid-rows-[auto_auto_auto_1fr] md:items-stretch md:justify-items-center md:gap-x-0 md:gap-y-0 md:px-4 md:py-2.5 md:pt-6 md:pb-6 md:text-center md:min-h-[21rem] md:w-[14.5rem] lg:min-h-[26rem] lg:w-[18rem] lg:px-5 lg:pt-7 lg:pb-7 ${
                        i % 2 === 0
                          ? "translate-y-0 md:-translate-y-2.5 lg:-translate-y-4"
                          : "translate-y-0 md:translate-y-2.5 lg:translate-y-4"
                      }`}
                    >
                      <p className="col-start-2 row-start-1 w-full shrink-0 font-extrabold leading-none tracking-wide text-[#2979FF] text-xs md:col-auto md:row-auto md:text-center md:text-sm lg:text-lg">
                        {step.stepLabel}
                      </p>
                      <h3 className="col-start-2 row-start-2 mt-0 w-full text-balance font-bold leading-snug text-black text-base md:col-auto md:row-auto md:mt-1.5 md:text-center md:text-lg lg:mt-2 lg:text-2xl">
                        {step.title}
                      </h3>
                      <div
                        className="col-start-1 row-span-3 row-start-1 flex h-16 w-16 shrink-0 items-center justify-center justify-self-start rounded-full bg-[#eee] md:col-auto md:row-span-1 md:row-auto md:mt-5 md:h-[7.75rem] md:w-[7.75rem] md:justify-self-center lg:mt-7 lg:h-[10.25rem] lg:w-[10.25rem]"
                        aria-hidden
                      >
                        <img
                          src={step.icon}
                          alt=""
                          className="h-10 w-10 object-contain md:h-[5rem] md:w-[5rem] lg:h-[6.75rem] lg:w-[6.75rem]"
                          width={128}
                          height={128}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="col-start-2 row-start-3 flex min-h-0 w-full min-w-0 flex-col items-start justify-start self-stretch md:col-auto md:row-auto md:mt-0 md:min-h-0 md:items-center md:self-stretch md:pt-4 sm:pt-5 lg:pt-5">
                        <p className="max-w-full text-pretty text-left text-xs font-medium leading-relaxed text-black md:text-center md:text-xs sm:text-sm lg:text-base whitespace-pre-line">
                          {step.body}
                        </p>
                      </div>
                    </div>
                    {i < HOW_ACTION_STEPS.length - 1 ? (
                      <>
                        <div className="flex justify-center py-1 md:hidden" aria-hidden>
                          <svg
                            className="h-[1.35rem] w-[1.3rem] rotate-90 text-zinc-400/80"
                            viewBox="-5 -5 50 66"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 6 L30 28 L6 50"
                              stroke="currentColor"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeLinejoin="miter"
                              strokeMiterlimit="8"
                            />
                          </svg>
                        </div>
                        <svg
                          aria-hidden
                          className="hidden h-[1.35rem] w-[1.3rem] shrink-0 text-zinc-400/80 sm:h-[1.45rem] sm:w-[1.35rem] lg:h-[1.55rem] lg:w-[1.45rem] md:block"
                          viewBox="-5 -5 50 66"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 6 L30 28 L6 50"
                            stroke="currentColor"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                            strokeMiterlimit="8"
                          />
                        </svg>
                      </>
                    ) : null}
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 11) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 12 background"
          className="absolute inset-0 bg-[url('/12.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(62rem_40rem_at_50%_38%,rgba(255,255,255,0.42),transparent_58%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(1rem,5vw,1.25rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-8 lg:px-10">
          <header className="mx-auto w-full min-w-0 max-w-7xl shrink-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Event Package
            </p>
            <h2 className="mt-0.5 text-balance font-bold leading-tight text-black max-lg:mt-0 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-1.5 lg:mt-2 lg:text-4xl xl:text-5xl">
              신규 광고주를 위한 추천 활용 시나리오
            </h2>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden pt-[clamp(1rem,5vw,1.25rem)] pb-[clamp(1rem,5vw,1.25rem)] max-lg:min-h-0 sm:pt-8 sm:pb-8 lg:pt-10 lg:pb-10">
            <div className="mx-auto flex h-full min-h-0 w-full min-w-0 max-w-7xl flex-1 flex-col px-0 py-0">
              <div className="flex w-full max-h-[min(72dvh,38rem)] min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-400/45 bg-white/85 p-2 shadow-md backdrop-blur-sm sm:p-2.5 md:p-3">
                <div className="flex min-h-0 flex-1 flex-col justify-center gap-8 overflow-y-auto [-webkit-overflow-scrolling:touch] px-0.5 py-1 sm:gap-8 sm:py-1.5 lg:gap-7 lg:px-0 lg:py-0" data-nested-scroll>
                  {EVENT_PACKAGE_ROWS.map((row, i) => (
                    <div
                      key={row.title}
                      className="flex min-h-0 w-full flex-col lg:flex-row lg:justify-center"
                    >
                      <div className="flex min-h-0 w-full min-w-0 flex-col gap-3 lg:grid lg:w-fit lg:max-w-full lg:grid-cols-[14rem_7rem_minmax(0,48rem)] lg:items-stretch lg:gap-x-3 lg:gap-y-0">
                      <div
                        className="flex w-fit shrink-0 items-center justify-center self-start rounded-xl px-4 py-2.5 text-center text-base font-bold leading-snug text-white shadow-sm sm:px-4 sm:py-3 sm:text-lg max-lg:self-start lg:h-full lg:w-full lg:min-w-0 lg:self-stretch lg:px-4 lg:text-xl lg:leading-snug"
                        style={{ backgroundColor: EVENT_PACKAGE_TITLE_BG[i] }}
                      >
                        {row.title}
                      </div>
                      <div
                        className="pointer-events-none hidden h-1 w-20 shrink-0 self-center bg-[radial-gradient(circle_closest-side,rgb(113_113_122)_1.5px,transparent_1.65px)] bg-[length:0.4375rem_100%] bg-center [background-repeat:repeat-x] opacity-85 sm:w-28 sm:bg-[length:0.5rem_100%] lg:block lg:self-center lg:justify-self-center"
                        aria-hidden
                      />
                      <div className="flex min-h-0 min-w-0 w-full flex-1 self-stretch overflow-hidden rounded-xl border border-zinc-400/50 bg-white/90 py-2.5 shadow-sm sm:py-3 md:py-3.5 max-lg:max-w-none lg:min-h-0 lg:w-full lg:max-w-none">
                        <div className="flex h-full max-h-full min-h-0 w-full min-w-0 overflow-x-auto overflow-y-hidden">
                          <div className="flex min-h-[4.75rem] w-full min-w-[19rem] items-stretch gap-2 px-2.5 sm:min-h-[5.25rem] sm:gap-2.5 sm:px-3 md:min-h-[5.5rem] lg:h-full lg:min-h-0">
                            {([row.bodyA, row.bodyB, row.bodyC] as const).map((text, j) => (
                              <Fragment key={j}>
                                <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center py-1 sm:py-1.5 md:py-1.5">
                                  <p className="w-full text-pretty text-center text-xs font-semibold leading-snug text-zinc-800 sm:text-sm sm:leading-snug md:text-base md:leading-snug lg:text-lg whitespace-pre-line">
                                    {text}
                                  </p>
                                </div>
                                {j < 2 ? (
                                  <div
                                    className="w-[1.5px] shrink-0 self-stretch rounded-full bg-zinc-400/90"
                                    aria-hidden
                                  />
                                ) : null}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (index === 12) {
    return (
      <section
        className="relative h-dvh w-full snap-start snap-always overflow-hidden"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <div
          aria-label="Screen 13 background"
          className="absolute inset-0 bg-[url('/13.jpg')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(58rem_38rem_at_50%_36%,rgba(255,255,255,0.5),transparent_60%)]"
        />
        <LogoRow lightLogo={false} />
        <div className="relative z-10 flex h-full min-h-0 w-full max-h-dvh flex-col overflow-hidden px-[clamp(0.875rem,4vw,1rem)] pb-[var(--app-safe-bottom)] pt-[var(--logo-zone)] sm:px-6 lg:px-8">
          <header className="mx-auto w-full min-w-0 max-w-6xl shrink-0 px-0 text-center">
            <p className="font-extrabold tracking-wide text-[#2979FF] max-lg:[font-size:var(--m-fluid-label)] lg:text-lg">
              Suggestion
            </p>
            <h2 className="mt-0.5 text-balance font-bold leading-tight text-black max-lg:mt-0 max-lg:[font-size:var(--m-fluid-h2)] sm:mt-1.5 lg:mt-2 lg:text-4xl xl:text-5xl">
              제안 포인트
            </h2>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-1 sm:py-1.5 lg:pt-8 lg:pb-2">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col">
              <div className="flex min-h-0 w-full max-h-[min(56dvh,30rem)] flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-400/45 bg-white/88 p-1.5 shadow-md backdrop-blur-sm sm:p-2 lg:max-h-[min(46dvh,22rem)] lg:p-2">
                <div
                  className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-y-5 overflow-y-auto [-webkit-overflow-scrolling:touch] sm:gap-y-6 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:items-stretch lg:gap-y-0"
                  data-nested-scroll
                >
                  <div className="flex min-h-0 min-w-0 items-center justify-center p-0 max-lg:pt-5 sm:max-lg:pt-6">
                    <img
                      alt=""
                      src="/13-1.png"
                      loading="lazy"
                      decoding="async"
                      className="h-auto max-h-[min(28dvh,13rem)] w-full max-w-full rounded-lg object-contain object-center sm:max-h-[min(32dvh,15rem)] lg:max-h-[min(36dvh,16rem)]"
                    />
                  </div>
                  <div
                    className="hidden h-px w-full shrink-0 bg-zinc-300/55 lg:block lg:h-full lg:w-px lg:min-h-0"
                    aria-hidden
                  />
                  <div className="flex min-h-0 min-w-0 items-center justify-center p-0">
                    <div className="mx-auto w-full max-w-[min(100%,26rem)] px-2 py-1 sm:px-2.5 lg:max-w-[min(100%,28rem)] lg:px-3">
                      <p className="text-pretty text-left text-sm font-medium leading-relaxed text-zinc-800 sm:text-base sm:leading-relaxed lg:text-[0.9375rem] lg:leading-7 xl:text-lg whitespace-pre-line">
                      <strong className="font-bold text-zinc-950">신규 앱의 경쟁력</strong>
                      {`. 초기에 저렴한 단가로 테스트 마케팅
기회 뿐 아니라, 높은 사용자 참여도를 확인할 수 있습니다.
초기 파트너사 특별 혜택으로 최소 광고비가 없기 때문에
적은 금액으로도 광고 테스트가 가능합니다.
기존 최소 금액 단가로 들어가야만 하는 광고 앱과 달리
성과 기반 과금으로 `}
                      <strong className="font-bold text-zinc-950">리스크를 최소화</strong>
                      {` 합니다.
상품에 맞춘 커스터마이징 기능으로 최적화를 지원합니다.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-dvh w-full snap-start snap-always bg-zinc-100"
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
    >
      <LogoRow lightLogo={false} />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-4 sm:px-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-black/60 backdrop-blur-sm">
          Screen {String(index + 1).padStart(2, "0")} / 13
        </div>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-zinc-600 sm:text-base">
          {subtitle}
        </p>
        <div className="mt-8 h-px w-full max-w-xl bg-black/10" />
      </div>
    </section>
  );
}

export default function Page() {
  const screens = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => ({
        title: i === 0 ? "" : `화면 ${i + 1}`,
        subtitle:
          "여기는 플레이스홀더입니다. 텍스트/컴포넌트/레이아웃을 원하는대로 교체하세요.",
      })),
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTargetRef = useRef<EventTarget | null>(null);

  const [contactOpen, setContactOpen] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const menuClickRef = useRef(false);
  const navScrollBusyRef = useRef(false);
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)

  const goTo = useCallback((nextIndex: number) => {
    const container = containerRef.current;
    const el = screenRefs.current[nextIndex];
    if (!container || !el) return;

    navScrollBusyRef.current = true;
    isAnimatingRef.current = true;
    setActiveIndex(nextIndex);
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      isAnimatingRef.current = false;
      navScrollBusyRef.current = false;
    }, 650);
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    let scrollTimeout: NodeJS.Timeout;
    // 초기값 설정 (의존성 배열에 currentIndex를 넣지 않는 이유: 이벤트 리스너 재등록 방지)
    lastIndexRef.current = currentIndex;
    let rafId: number | null = null;

    const handleScroll = () => {
      // 기존 raf 취소
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // requestAnimationFrame으로 다음 프레임에 처리
      rafId = requestAnimationFrame(() => {
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

        // 인덱스가 실제로 변경되었을 때만 state 업데이트
        if (lastIndexRef.current !== closestIndex) {
          setCurrentIndex(closestIndex);
          lastIndexRef.current = closestIndex;
=======
    const container = containerRef.current;
    if (!container) return;
    let scrollTimeout: number | undefined;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = container.clientHeight;
      const centerY = scrollTop + windowHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      screenRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const blockCenter =
          rect.top - containerRect.top + scrollTop + rect.height / 2;
        const distance = Math.abs(centerY - blockCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)
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
      });
<<<<<<< HEAD
    };

    const container = scrollContainerRef.current;
    if (container) {
      // passive: true로 스크롤 성능 최적화
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // 초기 실행

      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
=======

      setActiveIndex(closestIndex);
      navScrollBusyRef.current = true;
      if (scrollTimeout !== undefined) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        navScrollBusyRef.current = false;
      }, 300);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout !== undefined) clearTimeout(scrollTimeout);
    };
  }, [screens.length]);
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = clamp(activeIndex + dir, 0, screens.length - 1);
      if (next === activeIndex) return;
      goTo(next);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (isAnimatingRef.current) return;
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = clamp(activeIndex + dir, 0, screens.length - 1);
      if (next === activeIndex) return;
      goTo(next);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      touchStartTargetRef.current = e.target;
    };

    const getNestedScrollEl = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      return target.closest("[data-nested-scroll]");
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      touchStartTargetRef.current = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current == null) return;
      if (isAnimatingRef.current) return;

      const nested =
        getNestedScrollEl(touchStartTargetRef.current) ??
        getNestedScrollEl(e.target);
      if (nested instanceof HTMLElement) {
        const { scrollTop, scrollHeight, clientHeight } = nested;
        if (scrollHeight > clientHeight + 2) {
          const currentY = e.touches[0]?.clientY ?? null;
          if (currentY == null) return;
          const dy = touchStartYRef.current - currentY;
          if (Math.abs(dy) < 8) return;
          const maxScroll = scrollHeight - clientHeight;
          const scrollingDown = dy > 0;
          const scrollingUp = dy < 0;
          if (scrollingDown && scrollTop < maxScroll - 2) return;
          if (scrollingUp && scrollTop > 2) return;
        }
      }

      const currentY = e.touches[0]?.clientY ?? null;
      if (currentY == null) return;

      const dy = touchStartYRef.current - currentY;
      if (Math.abs(dy) < 24) return;

      e.preventDefault();
      touchStartYRef.current = null;
      touchStartTargetRef.current = null;

      const dir = dy > 0 ? 1 : -1;
      const next = clamp(activeIndex + dir, 0, screens.length - 1);
      if (next === activeIndex) return;
      goTo(next);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, screens.length, goTo]);

  const handleRefSet = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      imageRefs.current[index] = el;
    },
    []
  );

  // 휠 이벤트 제어: 한 페이지만 이동하도록 제한 (마지막 페이지 이후는 자유 스크롤)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const currentIdx = lastIndexRef.current;

      // 마지막 이미지(12번 인덱스)에 있고 아래로 스크롤하는 경우: 자유 스크롤 허용
      if (currentIdx === imageNumbers.length - 1 && e.deltaY > 0) {
        return; // 기본 스크롤 동작 허용
      }

      // 스크롤 중이면 무시
      if (isWheelScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // 이미지 페이지 사이에서만 기본 스크롤 동작 막기
      e.preventDefault();

      const deltaY = e.deltaY;

      // 아래로 스크롤 (양수)
      if (deltaY > 0 && currentIdx < imageNumbers.length - 1) {
        isWheelScrollingRef.current = true;
        scrollToImage(currentIdx + 1);
        setTimeout(() => {
          isWheelScrollingRef.current = false;
        }, 600);
      }
      // 위로 스크롤 (음수)
      else if (deltaY < 0 && currentIdx > 0) {
        isWheelScrollingRef.current = true;
        scrollToImage(currentIdx - 1);
        setTimeout(() => {
          isWheelScrollingRef.current = false;
        }, 600);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [imageNumbers.length]);

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-dvh">
      <GradientBackdrop />
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)

      <div
        ref={containerRef}
        className="h-dvh overflow-y-auto overscroll-none snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {screens.map((s, idx) => (
          <div
            key={idx}
            ref={(el) => {
              screenRefs.current[idx] = el;
            }}
          >
            <Screen index={idx} title={s.title} subtitle={s.subtitle} />
          </div>
        ))}
      </div>

      {activeIndex !== 0 ? (
        <>
          <div
            className="fixed top-1/2 right-[max(1rem,env(safe-area-inset-right))] z-[55] hidden lg:block lg:right-16"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setIsNavHovered(true);
            }}
            onMouseLeave={() => {
<<<<<<< HEAD
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
=======
              if (navScrollBusyRef.current) return;
              hoverTimeoutRef.current = window.setTimeout(() => {
                setIsNavHovered(false);
              }, 200);
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)
            }}
          >
            <ul
              className={`flex flex-col gap-[20px] items-end -translate-y-1/2 transition-opacity duration-300 ${
                isNavHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {Array.from({ length: 12 }, (_, i) => i + 2).map((num) => {
                const actualIndex = num - 1;
                return (
                  <li
<<<<<<< HEAD
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
=======
                    key={num}
                    onClick={() => goTo(actualIndex)}
                    className={`cursor-pointer transition-all ${
                      activeIndex === actualIndex
                        ? "h-[4px] w-[35px] bg-black"
                        : "h-[4px] w-[16px] bg-[#9d9d9d]"
                    }`}
                  />
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)
                );
              })}
            </ul>
          </div>
<<<<<<< HEAD
        )}

        {/* 이미지들 */}
        <div className="relative">
          <Images
            imageNumbers={imageNumbers}
            overlayImageNumbers={overlayImageNumbers}
            onRefSet={handleRefSet}
          />
        </div>

        {currentIndex === 0 && (
          <Image
            src="/arrow-down.svg"
            alt="arrow down"
            width={30}
            height={30}
            priority
            className="fixed left-1/2 -translate-x-1/2 bottom-[30px] z-50"
          />
        )}

        {/* 문의 모달 버튼 */}
        <Image
          src={isInquiryModalOpen ? "/Xcircle.svg" : "/send.svg"}
          alt={isInquiryModalOpen ? "close" : "send"}
          width={48}
          height={48}
          priority
          className="fixed bottom-[12%] right-[8%] z-50"
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
          className="fixed bottom-[16%] right-[12%] z-50"
        />

        {/* 푸터 */}
        <div
          className="snap-start flex-shrink-0"
          style={{ scrollSnapStop: "normal" }}
        >
          <Footer />
        </div>
      </div>
=======

          {isNavHovered ? (
            <div
              className="fixed right-10 top-40 z-[55] hidden w-[300px] rounded-[40px] bg-black/80 lg:block"
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                  hoverTimeoutRef.current = null;
                }
                setIsNavHovered(true);
              }}
              onMouseLeave={() => {
                if (navScrollBusyRef.current || menuClickRef.current) return;
                hoverTimeoutRef.current = window.setTimeout(() => {
                  setIsNavHovered(false);
                }, 300);
              }}
            >
              <ul className="flex flex-col items-center justify-center gap-[20px] py-[40px]">
                {LANDING_NAV_LIST.map((item) => {
                  const activePages = LANDING_NAV_ACTIVE_SCREENS[item.id];
                  let isActive: boolean;
                  if (activePages) {
                    isActive = activePages.some((pageNum) => activeIndex === pageNum - 1);
                  } else {
                    const targetScreenNum = LANDING_NAV_TO_SCREEN[item.id] ?? item.id;
                    isActive = activeIndex === targetScreenNum - 1;
                  }
                  const activeStyle = isActive ? "text-white" : "text-gray-500";
                  return (
                    <li
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current);
                          hoverTimeoutRef.current = null;
                        }
                        menuClickRef.current = true;
                        setIsNavHovered(true);
                        const targetScreenNum = LANDING_NAV_TO_SCREEN[item.id] ?? item.id;
                        goTo(targetScreenNum - 1);
                        window.setTimeout(() => {
                          menuClickRef.current = false;
                        }, 2000);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      className={`cursor-pointer text-[18px] font-bold transition-colors hover:text-white ${activeStyle}`}
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}

      <LandingInquiryModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      <button
        type="button"
        className="fixed bottom-[12%] right-[8%] z-50 cursor-pointer border-0 bg-transparent p-0"
        style={{ color: "transparent" }}
        aria-label={contactOpen ? "문의 닫기" : "문의 보내기"}
        onClick={() => setContactOpen((v) => !v)}
      >
        <img
          alt={contactOpen ? "close" : "send"}
          width={48}
          height={48}
          decoding="async"
          data-nimg="1"
          src={contactOpen ? "/Xcircle.svg" : "/send.svg"}
        />
      </button>
>>>>>>> c923c45 (feat: 팟 플레이 퍼블리싱)
    </div>
  );
}

