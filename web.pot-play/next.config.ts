import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 환경 변수는 빌드 시점에 주입됩니다
  // 로컬: .env.local 사용 (http://localhost:3000/api/v1)
  // 개발: npm run build:dev → https://dev-pot-api.pot-play.com/api/v1
  // 프로덕션: npm run build:prod → https://pot-api.pot-play.com/api/v1
  // 클라이언트 컴포넌트는 정적으로 빌드되지만 런타임에 동적으로 작동합니다
};

export default nextConfig;
