# Day-Atmos

> 리얼티쓰 프론트엔드 채용 과제 - 날씨 앱

사용자의 현재 위치를 감지하여 날씨 정보를 제공하고 원하는 지역을 검색하여 즐겨찾기에 추가할 수 있는 날씨 애플리케이션입니다.

<br />

## 🚀 프로젝트 실행 방법

### 1. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요.

```bash
# OpenWeatherMap API Key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# Kakao REST API Key (Geocoding)
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

- **OpenWeatherMap API**: [https://openweathermap.org/api](https://openweathermap.org/api)에서 무료 API 키 발급
- **Kakao REST API**: [https://developers.kakao.com](https://developers.kakao.com)에서 API 키 발급

### 2. 의존성 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

<br />

## ✨ 구현한 기능

### 1. 현재 위치 기반 날씨 조회

- 앱 첫 진입 시 브라우저의 Geolocation API를 통해 사용자의 현재 위치를 자동으로 감지합니다.
- 위치 권한이 거부되거나 타임아웃 시 기본 위치(서울)의 날씨를 표시합니다.
- 현재 기온, 당일 최저/최고 기온, 습도, 풍속, 체감온도 등을 제공합니다.

### 2. 지역 검색

- 제공된 `korea_districts.json` 파일을 활용하여 대한민국 전국의 시/군/구/동 단위 검색을 지원합니다.
- 검색어 입력 시 매칭되는 지역 리스트를 실시간으로 표시합니다.
- Kakao Geocoding API를 통해 주소를 좌표로 변환하여 날씨 데이터를 조회합니다.
- 해당 장소의 날씨 정보가 없을 경우 에러 메시지를 표시합니다.

### 3. 즐겨찾기 기능

- **추가/삭제**: 검색한 장소를 즐겨찾기에 추가하거나 삭제할 수 있습니다 (최대 6개).
- **이름 수정**: 즐겨찾기에 추가된 장소의 별칭(이름)을 수정할 수 있습니다 (최대 20자).
- **드래그앤드롭**: 편집 모드에서 즐겨찾기 카드의 순서를 드래그로 변경할 수 있습니다.
- **카드 UI**: 즐겨찾기 카드에는 현재 날씨 아이콘, 온도, 최저/최고 기온이 표시됩니다.
- **상세 페이지**: 즐겨찾기 카드를 클릭하면 해당 장소의 상세 날씨 정보 페이지로 이동합니다.

### 4. 시간대별 예보

- 3시간 간격으로 향후 24시간(8개 구간)의 날씨 예보를 제공합니다.
- 각 시간대의 날씨 아이콘과 온도를 시각적으로 표시합니다.

### 5. 반응형 디자인

- 데스크탑(1024px+), 태블릿(768px), 모바일(320px+) 화면에 최적화되어 있습니다.

### 6. UI/UX 개선 사항

- 날씨 아이콘이 낮/밤, 날씨 상태에 따라 동적으로 변경됩니다.
- 아이콘 배경색이 낮(노란색)과 밤(보라색)에 따라 자동으로 전환됩니다.
- Dialog 컴포넌트가 메인 페이지의 다크 블루 테마와 조화롭게 디자인되었습니다.
- 즐겨찾기 별칭은 최대 2줄까지 표시되며 그 이상은 말줄임표로 처리됩니다.

<br />

## 🛠 기술적 의사결정 및 이유

### 1. **Next.js 16 (App Router)**

- **선택 이유**:
  - API Key 보안: API Routes로 서버 사이드에서 API를 호출하여 OpenWeatherMap, Kakao API 키를 클라이언트에 노출하지 않습니다.
  - 동적 라우팅(`/detail/[lat]/[lon]`)으로 상세 페이지를 간결하게 구현할 수 있었습니다.

### 2. **Zustand (클라이언트 상태 관리)**

- **선택 이유**:
  - 위치 정보와 즐겨찾기는 클라이언트에서만 관리하면 되므로 가벼운 상태 관리 라이브러리가 필요했습니다.
  - Redux는 보일러플레이트가 많고 Context API는 리렌더링 최적화가 어려웠습니다.
  - Zustand는 코드가 간결하면서도 `persist` 미들웨어로 LocalStorage 연동이 쉽습니다.
  - TanStack Query(서버 상태)와 Zustand(클라이언트 상태)를 명확히 분리하여 관리할 수 있었습니다.

### 3. **shadcn/ui**

- **선택 이유**:
  - Radix UI 기반으로 접근성(a11y)이 뛰어나고 키보드 네비게이션을 완벽하게 지원합니다.
  - 컴포넌트를 복사하여 프로젝트에 직접 추가하는 방식이라 커스터마이징이 자유롭습니다.
  - Tailwind CSS와 완벽히 통합되어 일관된 디자인 시스템을 유지할 수 있습니다.

### 4. **@dnd-kit (드래그앤드롭)**

- **선택 이유**:

  - 즐겨찾기 순서 변경 기능을 추가하여 사용자 경험을 개선하고자 했습니다.

  - `@dnd-kit`은 터치/마우스/키보드를 모두 지원하며 수평 스크롤 영역에서도 안정적으로 작동합니다.
  - `activationConstraint`로 클릭과 드래그를 명확히 구분하여 오작동을 방지했습니다.

### 5. **OpenWeatherMap API**

- **선택 이유**:
  - 무료 플랜으로 분당 60회 호출이 가능하여 개발 및 데모에 충분합니다.
  - Current Weather API와 5 Day / 3 Hour Forecast API를 함께 제공하여 구현이 간단합니다.
  - 아이콘 코드(`01d`, `01n`)로 낮/밤을 쉽게 구분할 수 있어 동적 UI 구현에 유리합니다.
  - 공식 문서가 상세하고 예제가 풍부합니다.

### 6. **Kakao Geocoding API**

- **선택 이유**:
  - 한국 주소 체계에 특화되어 있어 행정구역 검색 정확도가 높습니다.
  - OpenWeatherMap의 Geocoding API는 영문 주소 위주라 한글 검색 시 정확도가 떨어집니다.

### 7. **date-fns**

- **선택 이유**:
  - 시간대별 예보에서 "지금", "내일 3시", "1/15 6시" 등의 포맷팅이 필요했습니다.
  - 네이티브 `Date` API는 포맷팅이 복잡합니다.
  - `date-fns`는 트리 쉐이킹이 가능하여 필요한 함수만 번들에 포함됩니다.

<br />

## 📦 사용한 기술 스택

### 필수 요구사항

- **React 19.2** + **TypeScript 5** - UI 라이브러리 및 타입 시스템
- **TanStack Query 5.90** - 서버 상태 관리
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **FSD 아키텍처** - Feature Sliced Design 구조

### 추가 선택 기술

- **Next.js 16.1** - React 프레임워크 (App Router, API Routes)
- **Zustand 5.0** - 클라이언트 상태 관리 (위치, 즐겨찾기)
- **shadcn/ui** - Radix UI 기반 UI 컴포넌트 시스템
- **@dnd-kit** - 접근성 높은 드래그앤드롭 라이브러리
- **Lucide React** - 아이콘 라이브러리
- **date-fns** - 날짜/시간 포맷팅

### External APIs

- **OpenWeatherMap API** - 날씨 데이터 (Current Weather, 5-day Forecast)
- **Kakao Geocoding API** - 한국 주소 → 좌표 변환

<br />

## 📁 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── (routes)/            # 라우트 그룹
│   │   ├── (main)/          # 메인 페이지
│   │   └── detail/[lat]/[lon]/  # 상세 페이지
│   ├── api/                 # API Routes
│   │   ├── weather/         # 현재 날씨
│   │   ├── forecast/        # 시간대별 예보
│   │   └── geocode/         # 좌표 변환
│   └── globals.css          # 전역 스타일
├── entities/                # 비즈니스 엔티티
│   └── weather/             # 날씨 도메인
│       ├── api/             # API 함수 및 쿼리
│       └── model/           # 타입 정의
├── features/                # 독립적인 기능
│   └── search-location/     # 지역 검색
├── widgets/                 # 재사용 가능한 UI 블록
│   ├── header/              # 헤더
│   ├── search-bar/          # 검색 바
│   ├── weather-card/        # 날씨 카드
│   ├── favorite-board/      # 즐겨찾기 보드
│   └── hourly-forecast/     # 시간대별 예보
├── shared/                  # 공용 리소스
│   ├── api/                 # React Query 설정
│   ├── config/              # 환경 변수
│   ├── lib/                 # 유틸리티 함수
│   ├── store/               # Zustand 스토어
│   └── ui/                  # 공용 UI 컴포넌트
└── page-compositions/       # 페이지 조합 레이어
    └── home/
```

<br />

## 🎨 주요 기능 스크린샷

### 메인 페이지
<img width="720" height="347" alt="main-desktop" src="https://github.com/user-attachments/assets/ecd60db3-20a3-43f7-8512-f59181b0b164" />
<img width="320" height="1002" alt="main-mobile" src="https://github.com/user-attachments/assets/62643570-f672-4528-9309-5efc5dacd404" />

- 현재 날씨 정보 표시
- 즐겨찾기 보드 (최대 6개)
- 시간대별 예보 (3시간 간격)

### 상세 페이지

<img width="720" height="347" alt="detail-dektop" src="https://github.com/user-attachments/assets/348802ce-a88d-458c-9ca6-82a4e4080980" />
<img width="320" height="693" alt="detail-mobile" src="https://github.com/user-attachments/assets/39956f76-6ec5-4600-9e42-30593c4b324b" />

- 즐겨찾기 카드 클릭 시 해당 지역의 상세 날씨 정보
- 별칭과 실제 지역명 동시 표시
- 시간대별 예보 포함

### 즐겨찾기 편집 모드
![dnd-kit](https://github.com/user-attachments/assets/5224bce0-50f1-4f23-a947-3d2788d5046f)
![favorites-editing deletion](https://github.com/user-attachments/assets/7aa382cf-0de7-46f3-afb0-c2381f6927bb)

- 드래그앤드롭으로 순서 변경
- 이름 수정 및 삭제 기능

<br />

## 🌐 배포

배포 URL: https://day-atmos.vercel.app/
