# Day-Atmos 프로젝트 개발 진행 상황

## ✅ 완료된 기능

### 1. 현재 날씨 표시
- OpenWeatherMap API 연동
- 카카오 API로 한글 주소 변환 (동 단위)
- 온도, 날씨 상태, 습도, 풍속, 체감온도 표시

### 2. 지역 검색 기능
- korea_districts.json 기반 자동완성 검색
- shadcn Command 컴포넌트 사용
- 카카오 Geocoding API로 좌표 변환
- 공백/하이픈 정규화 처리

### 3. 즐겨찾기 기능 (완전 구현 ✨)
- Zustand + localStorage persist
- CRUD 기능 (추가/수정/삭제)
- 최대 6개 제한 및 중복 방지
- 즐겨찾기 이름 수정 가능
- Horizontal scroll 레이아웃

### 4. 상세 페이지
- Dynamic routing: `/detail/[lat]/[lon]`
- 즐겨찾기 여부에 따라 버튼 변경
- 즐겨찾기 이름 표시

### 5. SSR Hydration 에러 수정
- SearchLocation: Command 컴포넌트 클라이언트 마운트 처리
- FavoriteBoard: button 중첩 구조 개선 (div + role="button")
- DetailPage: Zustand persist hydration 처리
- useSyncExternalStore로 안전한 외부 store 구독

### 6. 날씨 아이콘 낮/밤 구분
- OpenWeatherMap icon code 기반 (d/n suffix)
- Moon, CloudMoon 등 밤 아이콘 추가
- getWeatherIcon 공용 함수로 리팩토링

### 7. 공용 컴포넌트 리팩토링
- ConfirmDialog: 재사용 가능한 확인 대화상자
- InputDialog: 텍스트 입력 대화상자
- getWeatherIcon: 날씨 아이콘 로직 통합

---

## 🚧 다음 작업 (우선순위)

### 1. ✅ 시간별 예보 구현 완료! (2026-01-13)
**구현 완료:**
- ✅ OpenWeatherMap 5-day forecast API 연동 (`/api/forecast` route)
- ✅ Forecast, ForecastItem 타입 정의
- ✅ fetchForecast 함수 및 useForecastQuery hook 작성
- ✅ HourlyForecast 컴포넌트 실제 데이터로 구현 (3시간 간격)
- ✅ 최대 8개 항목 (24시간) 표시
- ✅ Loading skeleton 및 에러 처리
- ✅ getWeatherIcon 재사용 (낮/밤 구분)
- ✅ DetailPage에 lat, lon props 전달

**참고사항:**
- OpenWeatherMap 무료 API는 3시간 간격 예보만 제공
- 1시간 단위는 유료 API 필요
- 과제 요구사항 "시간대별 기온"은 3시간 간격으로 충족

### 2. ✅ DnD 순서 변경 완료! (2026-01-13)
**구현 완료:**
- ✅ @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities 설치
- ✅ FavoriteStore에 reorderFavorites 함수 추가
- ✅ 편집/완료 버튼 토글 기능
- ✅ 편집 모드에서 드래그 핸들 표시, 수정/삭제 버튼 숨김
- ✅ Horizontal sortable 드래그앤드롭
- ✅ PointerSensor (마우스), TouchSensor (모바일), KeyboardSensor 지원
- ✅ 순서 변경 시 Zustand persist로 자동 저장

**UX 특징:**
- 편집 모드에서만 드래그 가능 (실수 방지)
- 드래그 시 투명도 0.5로 시각적 피드백
- 모바일: 200ms long-press로 드래그 시작 (스크롤과 구분)
- 데스크톱: 8px 이동 후 드래그 시작 (클릭과 구분)

---

## 🐛 알려진 이슈
없음 (모든 Hydration 에러 해결됨)

---

## 📝 기술 스택 및 패턴

### 상태 관리
- Zustand + persist middleware
- useSyncExternalStore로 hydration 처리
- favoriteStore: localStorage 기반

### API
- OpenWeatherMap: 날씨 데이터
- 카카오 Local API: 주소/좌표 변환

### SSR/Hydration 패턴
```tsx
// Zustand persist hydration 체크
const hasHydrated = useFavoriteStoreHydration()
if (!hasHydrated) return <Skeleton />

// 클라이언트 전용 렌더링
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
if (!mounted) return <Placeholder />
```

### 아이콘 관리
```tsx
// 공용 함수 사용
import { getWeatherIcon } from '@/shared/lib/getWeatherIcon'
{getWeatherIcon(iconCode, "h-6 w-6")}
```

---

## 🎯 프로젝트 목표
Real Teeth 프론트엔드 채용과제 완성
- 날씨 표시 ✅
- 검색 기능 ✅
- 즐겨찾기 ✅
- 시간별 예보 ✅ (3시간 간격)
- 상세 페이지 ✅

---

## 💡 참고사항

### 커밋 메시지 (준비됨)
```
즐겨찾기 및 상세 페이지 기능 구현
- 즐겨찾기 추가/수정/삭제 기능 (최대 6개)
- 즐겨찾기 상세 페이지 라우팅 추가
- SSR hydration 에러 수정 (SearchLocation, FavoriteBoard, DetailPage)
- Zustand persist hydration 처리 (useSyncExternalStore)
- 날씨 아이콘 낮/밤 구분 기능 추가
- 공용 Dialog 컴포넌트 및 getWeatherIcon 유틸 리팩토링
```

### 환경 변수
```env
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=***
KAKAO_REST_API_KEY=***
```

---

**마지막 업데이트:** 2026-01-13
**완료된 기능:**
- 시간별 예보 (3시간 간격) ✨
- 즐겨찾기 순서 변경 (DnD) ✨
