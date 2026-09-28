import { memo } from "react";

interface ImagesProps {
  imageNumbers: number[];
  overlayImageNumbers: number[];
  onRefSet: (index: number, el: HTMLDivElement | null) => void;
}

const Images = memo(function Images({
  imageNumbers,
  overlayImageNumbers,
  onRefSet,
}: ImagesProps) {
  return (
    <>
      {imageNumbers.map((num, index) => {
        const backgroundImagePath =
          num === 6 || num === 7 ? `/5.jpg` : `/${num}.jpg`;
        const overlayImagePath = `/${num}-1.png`;

        return (
          <div
            key={num}
            ref={(el) => onRefSet(index, el)}
            className={`relative w-full h-screen snap-start flex-shrink-0 ${
              index === imageNumbers.length - 1 ? "" : "snap-always"
            }`}
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop:
                index === imageNumbers.length - 1 ? "normal" : "always",
              willChange: "transform",
            }}
          >
            {/* 각 페이지의 로고와 선 */}
            <div className="absolute top-4 left-10 z-50">
              <img
                src="/pot-play-logo.svg"
                alt="Pot Play Logo"
                height={20}
                width={140}
                className={`transition-all duration-300 ${
                  index === 0 ? "brightness-0 invert" : "brightness-0"
                }`}
              />
            </div>
            {index !== 0 && (
              <div className="absolute left-0 right-0 top-[70px] px-[40px] z-50">
                <div className="w-full h-[1px] bg-black"></div>
              </div>
            )}

            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-[1920px]">
                <img
                  src={backgroundImagePath}
                  alt={num.toString()}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
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
                      <img
                        src={overlayImagePath}
                        alt={`${num}-1`}
                        width={1200}
                        height={1200}
                        className="object-contain"
                        style={{ width: "auto", height: "auto" }}
                        onError={(e) => {
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
                      <img
                        src={overlayImagePath}
                        alt={`${num}-1`}
                        className="absolute inset-0 h-full w-full object-contain"
                        onError={(e) => {
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
    </>
  );
});

export default Images;
