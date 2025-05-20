# Receipt Splitter

## 프로젝트 소개
영수증을 스캔하고 비용을 나눌 수 있는 웹 서비스입니다. OCR (Tesseract.js)을 사용하여 영수증의 텍스트를 인식하고, 각 항목을 개인별로 분배할 수 있습니다.

## 기술 스택
- **FE**: React 19, Next.js 15.2.4, TailwindCSS 4
- **DB**: Supabase
- **OCR**: Tesseract.js
- **LANG**: TypeScript

## 설치 방법

### 전제 조건
- Node.js v18 이상
- npm v9 이상

### 설치 단계
1. 저장소를 클론합니다:
```bash
git clone [저장소 URL]
cd DIVIDE_PAYMENT
```

2. 의존성을 설치합니다:
```bash
npm install
```

## 실행 방법

### 개발 서버 실행
```bash
npm run dev
```
- 개발 서버는 `http://localhost:3000`에서 실행됩니다.
- 이 모드에서는 Turbopack을 사용하여 빠른 개발 환경을 제공합니다.

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm run start
```
- 프로덕션 서버는 `http://localhost:3000`에서 실행됩니다.

### 코드 린팅
```bash
npm run lint
```

## 주요 기능
- 영수증 이미지 업로드 및 OCR 처리
- 영수증 항목 인식 및 분류
- 사용자별 비용 할당
- 최종 분할 결제 정보 공유

## 프로젝트 구조
- `src/app/`: 애플리케이션 페이지 및 라우팅
- `src/components/`: 재사용 가능한 UI 컴포넌트
- `src/lib/`: 유틸리티 함수 및 API 호출
- `src/styles/`: 전역 스타일 및 TailwindCSS 설정
- `public/`: 정적 파일 (이미지, 아이콘 등)
- `OCR_TEST_IMG/`: OCR 테스트용 이미지

## 문제 해결
- 의존성 문제가 발생하면 다음 명령어를 실행하세요: `npm install`
- 특히 @next/swc 의존성 관련 문제는 위 명령어로 해결 가능합니다.
