# 암호화폐 가격 대시보드 구현 계획서

## 프로젝트 개요

**프로젝트명:** 실시간 암호화폐 가격 대시보드
**목적:** Bitcoin, Ethereum, Solana의 실시간 가격과 뉴스 기반 트렌드 분석을 제공하는 웹 대시보드
**개발 기간:** 약 4시간 (빠른 프로토타입 완성 목표)

## 현재 구현 상태 (최종 업데이트: 2026-02-05)

### ✅ 완료된 작업

#### 백엔드 (Backend)
- ✅ **프로젝트 구조 및 의존성 설치 완료**
  - Express, SQLite3, Axios, dotenv, cors 설치
  - 환경 변수 설정 (.env)

- ✅ **데이터베이스 구현**
  - SQLite 데이터베이스 생성 및 초기화 (`database/crypto_dashboard.db`)
  - news 테이블 스키마 구현
  - trends 테이블 스키마 구현

- ✅ **서비스 레이어 구현**
  - `coinGeckoService.js` - 실시간 가격 조회 API
  - `cryptoPanicService.js` - 뉴스 수집 및 5분마다 자동 갱신
  - `sentimentService.js` - 키워드 기반 감성 분석 및 트렌드 계산 엔진

- ✅ **데이터 모델 구현**
  - `newsModel.js` - 뉴스 CRUD 작업
  - `trendModel.js` - 트렌드 CRUD 작업

- ✅ **API 라우트 구현**
  - `GET /api/prices` - 실시간 가격 및 24h 변동률
  - `GET /api/news` - 코인별 뉴스 조회
  - `GET /api/trends` - 트렌드 분석 결과
  - `POST /api/news/refresh` - 수동 뉴스 갱신

- ✅ **감성 분석 알고리즘 구현**
  - `keywords.js` - 긍정/부정 키워드 정의 및 가중치
  - 키워드 매칭 및 점수 계산
  - UP/DOWN/NEUTRAL 트렌드 분류

#### 프론트엔드 (Frontend)
- ✅ **React 앱 생성 및 의존성 설치**
  - React, Axios 설치
  - 환경 변수 설정 (.env)

- ✅ **컴포넌트 구현**
  - `Dashboard.js` - 메인 컨테이너, 상태 관리, 자동 갱신 (30초)
  - `PriceCard.js` - 가격/변동률/트렌드 표시
  - `TrendIndicator.js` - UP/DOWN/NEUTRAL 시각화
  - `NewsFeed.js` - 뉴스 목록 및 감성 결과 표시
  - `Navigation.js` - 페이지 네비게이션

- ✅ **페이지 구현**
  - `Home.js` - 홈 페이지
  - `PricesPage.js` - 가격 전용 페이지
  - `NewsPage.js` - 뉴스 전용 페이지
  - `TrendsPage.js` - 트렌드 전용 페이지

- ✅ **API 클라이언트 구현**
  - `api.js` - Axios 기반 백엔드 통신

- ✅ **UI/UX 개선**
  - 색상 코딩 (양수/음수, 긍정/부정)
  - 자동 갱신 기능
  - 반응형 레이아웃

### 🔧 진행 중/추가 작업 필요

- ⚠️ **통합 테스트** - 전체 시스템 동작 확인 필요
- ⚠️ **에러 핸들링 개선** - 프로덕션 레벨 에러 처리 보강
- ⚠️ **성능 최적화** - 캐싱 전략 개선
- ⚠️ **로딩 상태 표시** - 데이터 로딩 중 사용자 피드백

## 기술 스택

### 백엔드 (Backend)
- **프레임워크:** Node.js + Express.js
- **데이터베이스:** SQLite
- **외부 API:**
  - CoinGecko API (암호화폐 가격 정보)
  - CryptoPanic API (암호화폐 뉴스)

### 프론트엔드 (Frontend)
- **프레임워크:** React
- **HTTP 클라이언트:** Axios
- **스타일링:** 기본 CSS

## 핵심 기능

1. **실시간 가격 표시**
   - BTC, ETH, SOL 현재 가격
   - 24시간 변동률 표시
   - 30초마다 자동 갱신

2. **뉴스 기반 감성 분석**
   - 키워드 매칭을 통한 감성 분석
   - 긍정/부정/중립 분류
   - 트렌드 점수 계산

3. **트렌드 인디케이터**
   - UP (↑) / DOWN (↓) / NEUTRAL (-) 표시
   - 색상 코딩 (초록/빨강/회색)

4. **뉴스 피드**
   - 코인별 관련 뉴스 목록
   - 감성 분석 결과 표시
   - 외부 링크 제공

## 구현 단계

### ✅ Phase 1: 백엔드 초기 설정 (30분) - 완료

**1.1 프로젝트 구조 생성**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── models/
│   ├── services/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── database/
├── .env
└── package.json
```

**1.2 의존성 설치**
```bash
npm install express sqlite3 axios dotenv cors
npm install --save-dev nodemon
```

**1.3 환경 변수 설정**
- PORT=5000
- CoinGecko API URL
- CryptoPanic API 키
- 데이터베이스 경로

**1.4 SQLite 데이터베이스 초기화**
- news 테이블 스키마 생성
- trends 테이블 스키마 생성
- 인덱스 설정

### ✅ Phase 2: 데이터 수집 서비스 구현 (45분) - 완료

**2.1 CoinGecko 서비스 (`coinGeckoService.js`)**
```javascript
// 기능:
- fetchPrices() // BTC, ETH, SOL 가격 및 24h 변동률 조회
- 에러 처리 및 재시도 로직
```

**2.2 CryptoPanic 서비스 (`cryptoPanicService.js`)**
```javascript
// 기능:
- fetchNews(coin) // 코인별 뉴스 조회
- saveNews() // 데이터베이스에 저장
- startAutoRefresh() // 5분마다 자동 갱신
```

**2.3 키워드 정의 (`utils/keywords.js`)**
```javascript
// 긍정 키워드: surge, moon, bullish, breakout, rally, pump, rise, up...
// 부정 키워드: crash, dump, plunge, collapse, hack, fall, drop...
// 가중치: high=3, medium=2, low=1
```

### ✅ Phase 3: 감성 분석 엔진 구현 (60분) - 완료

**3.1 감성 분석 서비스 (`sentimentService.js`)**
```javascript
// 핵심 비즈니스 로직:
1. analyzeSentiment(title)
   - 제목에서 키워드 검색
   - 긍정/부정 점수 계산
   - positive/negative/neutral 반환

2. calculateTrend(coin)
   - 최근 뉴스 목록 조회
   - 긍정/부정 개수 집계
   - 정규화된 트렌드 점수 계산
   - UP/DOWN/NEUTRAL 분류

3. saveTrend(coin, trendData)
   - trends 테이블에 결과 저장
```

**3.2 트렌드 계산 알고리즘**
```
score = (positive_score - negative_score) / total_score

if score > 0.15:
    trend = "UP"
elif score < -0.15:
    trend = "DOWN"
else:
    trend = "NEUTRAL"
```

### ✅ Phase 4: 데이터 모델 구현 (30분) - 완료

**4.1 뉴스 모델 (`newsModel.js`)**
```javascript
// CRUD 메서드:
- create(newsData)
- findByCoin(coin, limit)
- findRecent(hours)
- deleteOld(days)
```

**4.2 트렌드 모델 (`trendModel.js`)**
```javascript
// CRUD 메서드:
- create(trendData)
- findLatest()
- findByCoin(coin)
```

### ✅ Phase 5: API 라우트 구현 (30분) - 완료

**5.1 가격 라우트 (`routes/prices.js`)**
```javascript
GET /api/prices
// 응답:
{
  bitcoin: { price: 50000, change_24h: 2.5 },
  ethereum: { price: 3000, change_24h: -1.2 },
  solana: { price: 100, change_24h: 5.8 }
}
```

**5.2 뉴스 라우트 (`routes/news.js`)**
```javascript
GET /api/news?coin=btc&limit=10
POST /api/news/refresh
```

**5.3 트렌드 라우트 (`routes/trends.js`)**
```javascript
GET /api/trends
// 응답:
[
  { coin: "bitcoin", trend: "UP", score: 0.45, ... },
  { coin: "ethereum", trend: "NEUTRAL", score: 0.05, ... },
  { coin: "solana", trend: "DOWN", score: -0.30, ... }
]
```

### ✅ Phase 6: 프론트엔드 초기 설정 (20분) - 완료

**6.1 React 앱 생성**
```bash
npx create-react-app frontend
cd frontend
npm install axios
```

**6.2 프로젝트 구조**
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── PriceCard.js
│   │   ├── TrendIndicator.js
│   │   └── NewsFeed.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── .env
```

### ✅ Phase 7: UI 컴포넌트 구현 (45분) - 완료

**7.1 API 클라이언트 (`services/api.js`)**
```javascript
// Axios 인스턴스 생성
- getPrices()
- getNews(coin, limit)
- getTrends()
- refreshNews()
```

**7.2 PriceCard 컴포넌트**
```javascript
// Props: { coin, price, change, trend }
// 표시:
- 코인 이름 및 심볼
- 현재 가격
- 24h 변동률 (색상 코딩)
- 트렌드 인디케이터
```

**7.3 TrendIndicator 컴포넌트**
```javascript
// Props: { trend }
// UP: 초록색 ↑
// DOWN: 빨간색 ↓
// NEUTRAL: 회색 -
```

**7.4 NewsFeed 컴포넌트**
```javascript
// Props: { news[] }
// 표시:
- 뉴스 제목
- 출처 및 시간
- 감성 분석 결과 (색상 코딩)
- 외부 링크
```

**7.5 Dashboard 컴포넌트 (메인 컨테이너)**
```javascript
// 상태 관리:
- prices
- trends
- news

// 기능:
- useEffect로 초기 데이터 로드
- 30초마다 가격/트렌드 자동 갱신
- 코인 선택 시 해당 뉴스 표시
```

### ⚠️ Phase 8: 테스트 및 최적화 (20분) - 진행 필요

**8.1 백엔드 테스트**
```bash
# 서버 시작
npm start

# API 엔드포인트 테스트
curl http://localhost:5000/api/prices
curl http://localhost:5000/api/news?coin=btc&limit=5
curl http://localhost:5000/api/trends
```

**8.2 프론트엔드 테스트**
- http://localhost:3000 접속
- 3개 코인 가격 표시 확인
- 색상 코딩 정상 작동 확인
- 트렌드 인디케이터 확인
- 뉴스 피드 감성 분석 결과 확인
- 30초 대기 후 자동 갱신 확인

**8.3 통합 테스트**
- 백엔드 뉴스 자동 갱신 (5분) 확인
- 프론트엔드 가격 자동 갱신 (30초) 확인
- 트렌드 재계산 확인

## 감성 분석 알고리즘 상세

### 1. 키워드 매칭

**긍정 키워드 (High Score = 3):**
- surge, moon, bullish, breakout, rally, pump

**긍정 키워드 (Medium Score = 2):**
- rise, up, increase, growth, adoption

**부정 키워드 (High Score = 3):**
- crash, dump, plunge, collapse, hack

**부정 키워드 (Medium Score = 2):**
- fall, drop, decline, down, sell

### 2. 점수 계산

```javascript
// 예시: "Bitcoin surge amid adoption growth"
positive_score = 3 (surge) + 2 (growth) + 2 (adoption) = 7
negative_score = 0
total_score = 7

sentiment = "positive"
```

### 3. 트렌드 분류

```javascript
// 최근 20개 뉴스 분석
positive_count = 8  // 긍정 뉴스 8개
negative_count = 3  // 부정 뉴스 3개
neutral_count = 9   // 중립 뉴스 9개

positive_score = 8 * 평균_긍정_가중치
negative_score = 3 * 평균_부정_가중치

normalized_score = (positive_score - negative_score) / (positive_score + negative_score)

if (normalized_score > 0.15) trend = "UP"
else if (normalized_score < -0.15) trend = "DOWN"
else trend = "NEUTRAL"
```

## 4시간 완성 전략

### 우선순위 1 (필수 - 2.5시간)
- [x] 백엔드 기본 구조
- [x] SQLite 데이터베이스 설정
- [x] CoinGecko 가격 조회 (`backend/src/services/coinGeckoService.js`)
- [x] CryptoPanic 뉴스 수집 (`backend/src/services/cryptoPanicService.js`)
- [x] 키워드 기반 감성 분석 (`backend/src/services/sentimentService.js`, `backend/src/utils/keywords.js`)
- [x] 기본 API 엔드포인트 (prices, news, trends 라우트 구현 완료)
- [x] React 기본 UI (Dashboard, PriceCard, TrendIndicator, NewsFeed 컴포넌트 구현 완료)

### 우선순위 2 (중요 - 1시간)
- [x] 자동 갱신 기능 (백엔드 5분마다, 프론트엔드 30초마다)
- [x] 트렌드 계산 로직 (`sentimentService.js`에 구현)
- [x] UI 색상 코딩 (가격 변동률, 감성 분석 결과)
- [x] 에러 처리 (try-catch 구현)

### 우선순위 3 (선택 - 30분)
- [x] 스타일링 개선 (Navigation, 각 페이지별 스타일링)
- [ ] 상세 테스트 (통합 테스트 진행 필요)
- [ ] 코드 최적화 (리팩토링 가능)

### 시간 단축 팁
1. **단순한 에러 처리:** try-catch만 사용
2. **기본 CSS만 사용:** 복잡한 스타일링 제외
3. **외부 링크만 제공:** 뉴스 상세 페이지 제외
4. **인메모리 캐싱:** Redis 제외

## 핵심 파일 목록 (구현 완료)

### 백엔드 (Backend) - 12개 파일
1. ✅ `backend/src/server.js` - Express 서버 진입점
2. ✅ `backend/src/config/database.js` - SQLite 초기화 및 스키마
3. ✅ `backend/src/config/constants.js` - 상수 및 설정 값
4. ✅ `backend/src/services/coinGeckoService.js` - 가격 조회
5. ✅ `backend/src/services/cryptoPanicService.js` - 뉴스 수집 및 자동 갱신
6. ✅ `backend/src/services/sentimentService.js` - **핵심 로직** - 감성 분석 및 트렌드 계산
7. ✅ `backend/src/utils/keywords.js` - 감성 분석 키워드 정의
8. ✅ `backend/src/models/newsModel.js` - 뉴스 CRUD
9. ✅ `backend/src/models/trendModel.js` - 트렌드 CRUD
10. ✅ `backend/src/routes/prices.js` - 가격 API
11. ✅ `backend/src/routes/news.js` - 뉴스 API
12. ✅ `backend/src/routes/trends.js` - 트렌드 API

### 프론트엔드 (Frontend) - 12개 파일
1. ✅ `frontend/src/App.js` - 앱 진입점 (라우팅 설정)
2. ✅ `frontend/src/index.js` - React 앱 마운트
3. ✅ `frontend/src/components/Dashboard.js` - **메인 컨테이너** - 상태 관리 및 자동 갱신
4. ✅ `frontend/src/components/PriceCard.js` - 가격/변동률/트렌드 표시
5. ✅ `frontend/src/components/TrendIndicator.js` - 트렌드 인디케이터
6. ✅ `frontend/src/components/NewsFeed.js` - 뉴스 목록 및 감성 표시
7. ✅ `frontend/src/components/Navigation.js` - 페이지 네비게이션
8. ✅ `frontend/src/pages/Home.js` - 홈 페이지
9. ✅ `frontend/src/pages/PricesPage.js` - 가격 전용 페이지
10. ✅ `frontend/src/pages/NewsPage.js` - 뉴스 전용 페이지
11. ✅ `frontend/src/pages/TrendsPage.js` - 트렌드 전용 페이지
12. ✅ `frontend/src/services/api.js` - Axios 백엔드 통신

### 데이터베이스
- ✅ `backend/database/crypto_dashboard.db` - SQLite 데이터베이스 파일 (생성 완료)

## 데이터베이스 스키마

### news 테이블
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE NOT NULL,       -- 외부 API 뉴스 ID
    title TEXT NOT NULL,                    -- 뉴스 제목
    url TEXT NOT NULL,                      -- 뉴스 링크
    published_at DATETIME NOT NULL,         -- 게시 시간
    source TEXT,                            -- 뉴스 출처
    coins TEXT,                             -- JSON 형식: ["BTC", "ETH"]
    sentiment TEXT,                         -- positive/negative/neutral
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### trends 테이블
```sql
CREATE TABLE trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coin TEXT NOT NULL,                     -- bitcoin/ethereum/solana
    trend TEXT NOT NULL,                    -- UP/DOWN/NEUTRAL
    score REAL NOT NULL,                    -- -1.0 ~ 1.0
    positive_count INTEGER,                 -- 긍정 뉴스 개수
    negative_count INTEGER,                 -- 부정 뉴스 개수
    neutral_count INTEGER,                  -- 중립 뉴스 개수
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API 명세

### GET /api/prices
**설명:** BTC, ETH, SOL 현재 가격 및 24시간 변동률 반환

**응답 예시:**
```json
{
  "bitcoin": {
    "price": 50000,
    "change_24h": 2.5
  },
  "ethereum": {
    "price": 3000,
    "change_24h": -1.2
  },
  "solana": {
    "price": 100,
    "change_24h": 5.8
  }
}
```

### GET /api/news
**쿼리 파라미터:**
- `coin`: btc | eth | sol (필수)
- `limit`: 반환할 뉴스 개수 (기본값: 10)

**응답 예시:**
```json
[
  {
    "id": 1,
    "title": "Bitcoin surge continues",
    "url": "https://...",
    "published_at": "2024-01-15T10:30:00Z",
    "source": "CoinDesk",
    "sentiment": "positive"
  }
]
```

### GET /api/trends
**설명:** 최신 트렌드 분석 결과 반환

**응답 예시:**
```json
[
  {
    "coin": "bitcoin",
    "trend": "UP",
    "score": 0.45,
    "positive_count": 12,
    "negative_count": 3,
    "neutral_count": 5,
    "analyzed_at": "2024-01-15T11:00:00Z"
  }
]
```

### POST /api/news/refresh
**설명:** 수동 뉴스 갱신 트리거 (자동 갱신은 5분마다 실행)

**응답:**
```json
{
  "success": true,
  "message": "News refreshed successfully"
}
```

## 자동 갱신 동작

### 백엔드 (Backend)
- **뉴스 수집:** `cryptoPanicService.js`에서 5분(300초)마다 자동 실행
- **스케줄러:** `setInterval`을 사용한 간단한 스케줄링
- **트렌드 재계산:** 뉴스 갱신 시마다 자동으로 트렌드 재분석

### 프론트엔드 (Frontend)
- **가격 갱신:** `Dashboard.js`의 `useEffect` + `setInterval`로 30초마다 실행
- **트렌드 갱신:** 가격 갱신 시 함께 조회
- **뉴스 갱신:** 코인 선택 시 해당 코인 뉴스 조회

## 다음 단계 (Next Steps)

### 즉시 수행 가능한 작업
1. **통합 테스트**
   - 백엔드 서버 실행: `cd backend && npm start`
   - 프론트엔드 개발 서버 실행: `cd frontend && npm start`
   - API 엔드포인트 테스트 (curl 또는 Postman)
   - 브라우저에서 전체 기능 테스트

2. **데이터 확인**
   - 뉴스 데이터가 정상적으로 수집되는지 확인
   - 감성 분석 결과 검증
   - 트렌드 계산 로직 검증

3. **에러 핸들링 보강**
   - API 호출 실패 시 fallback 처리
   - 네트워크 오류 사용자 알림
   - 데이터베이스 오류 로깅

4. **UI/UX 개선**
   - 로딩 스피너 추가
   - 빈 데이터 상태 처리
   - 모바일 반응형 개선

### 선택적 개선 사항
- 데이터 캐싱 전략 최적화
- API 호출 빈도 조정
- 차트 라이브러리 추가 (가격 추이 그래프)
- 다크 모드 지원

## 향후 확장 가능성

현재 아키텍처는 다음 기능 추가를 지원합니다:

1. **사용자 인증 (User Authentication)**
   - JWT 토큰 기반 인증
   - users 테이블 추가

2. **커뮤니티 게시판 (Community Board)**
   - comments 테이블 추가
   - 사용자 의견 공유 기능

3. **가격 예측 투표 (Price Prediction Voting)**
   - predictions 테이블 추가
   - 사용자 예측 집계 및 통계

4. **실시간 알림 (Real-time Notifications)**
   - WebSocket 통합
   - 가격 급등/급락 알림
   - 중요 뉴스 푸시 알림

5. **고급 분석 기능**
   - 가격 추이 차트 (Chart.js 또는 Recharts)
   - 거래량 데이터 추가
   - 상관관계 분석

현재 설계는 프론트엔드/백엔드 분리, RESTful API 구조, 서비스 레이어 분리를 통해 이러한 확장을 용이하게 합니다.

## 프로젝트 요약

### 📊 구현 진행률
- **백엔드:** ████████████████████ 100% (12/12 파일)
- **프론트엔드:** ████████████████████ 100% (12/12 파일)
- **테스트:** ████████░░░░░░░░░░░░ 40% (통합 테스트 필요)

### 🎯 주요 성과
1. ✅ 완전한 RESTful API 백엔드 구현
2. ✅ 키워드 기반 감성 분석 엔진 완성
3. ✅ React 기반 반응형 UI 구현
4. ✅ 자동 갱신 기능 (백엔드 5분, 프론트엔드 30초)
5. ✅ SQLite 데이터베이스 및 스키마 구축

### 📝 남은 작업
- 통합 테스트 및 버그 수정
- 프로덕션 배포 준비
- 문서화 보완

---

## 개선 및 신규 기능 추가 계획 (2026-02-21 분석)

### 🐛 발견된 버그 (즉시 수정 필요)

#### Bug 1: alerts.js - 라우트 순서 충돌
- **파일:** `backend/src/routes/alerts.js`
- **문제:** `GET /:session_id`가 `GET /check/:session_id`보다 먼저 정의 → `/check/` 엔드포인트가 데드 코드
- **수정:** `GET /check/:session_id`를 먼저 선언

#### Bug 2: alerts.js - 객체에 배열 메서드 사용 (크리티컬)
- **파일:** `backend/src/routes/alerts.js` (32번째 줄)
- **문제:** `prices.find(p => p.id === alert.coin)` → prices는 배열이 아닌 객체 → 알림 트리거 완전 불동작
- **수정:** `prices[alert.coin]`으로 변경, `price.current_price` → `priceData.price`

#### Bug 3: Dashboard.js - prices 타입 불일치
- **파일:** `frontend/src/components/Dashboard.js`
- **문제:** `useState([])` 초기화 후 API 응답 객체를 그대로 저장 → `prices.map()` 오류
- **수정:** `fetchPrices()` 내에 객체→배열 변환 로직 추가 (PricesPage.js와 동일한 패턴)

#### Bug 4: 다크모드 이중 관리
- **파일:** `Navigation.js`, `Dashboard.js`
- **문제:** 두 컴포넌트가 독립적 `isDark` state 관리 → 토글 버튼 엇갈림
- **수정(임시):** Dashboard.js의 다크모드 관련 코드 제거, Navigation.js 단독 관리

---

### 🔧 단기 코드 개선 (1~2일)

#### 개선 1: 가격 변환 유틸리티 중앙화
- **신규:** `frontend/src/utils/coinUtils.js` - `COIN_META`, `formatPricesResponse()` 함수
- **수정:** Dashboard.js, PricesPage.js, FeaturesPage.js - 중복 변환 로직 교체
- **이유:** 동일 코드 3곳 중복, 코인 추가 시 다중 파일 수정 방지

#### 개선 2: 커스텀 훅 추출
- **신규:** `frontend/src/hooks/useSessionId.js` - 세션 ID 생성/관리 통합
- **신규:** `frontend/src/hooks/useAutoRefresh.js` - setInterval 메모리 누수 방지
- **수정:** Dashboard.js, FeaturesPage.js, PricesPage.js

#### 개선 3: 백엔드 입력값 검증 미들웨어
- **신규:** `backend/src/middleware/validate.js` - `validateCoin()`, `validateTargetPrice()`
- **수정:** `backend/src/routes/alerts.js`, `predictions.js`

#### 개선 4: 에러 처리 표준화
- **수정:** `VotingCard.js`, `PriceAlert.js`, `NewsFeed.js`
- **내용:** 에러 시 인라인 메시지 + 재시도 버튼 표시 (현재 console.error만)

---

### ✨ 중기 신규 기능 (3~7일)

#### 기능 1: 가격 차트 (Recharts 시계열 그래프)
- **백엔드:**
  - `database.js` - `price_history` 테이블 추가 (coin, price, recorded_at 인덱스 포함)
  - `coinGeckoService.js` - 가격 fetch 시 DB 기록 (30일 이상 자동 삭제)
  - 신규: `models/priceHistoryModel.js`, `routes/priceHistory.js`
  - API: `GET /api/prices/history?coin=bitcoin&range=1d|7d|30d`
- **프론트엔드:**
  - `npm install recharts`
  - 신규: `components/PriceChart.js` - LineChart, 범위 선택(1D/7D/30D)
  - `pages/PricesPage.js` - PriceChart 컴포넌트 통합
  - `services/api.js` - `getPriceHistory()` 추가

#### 기능 2: Context API 전역 상태 관리
- **신규:** `context/ThemeContext.js` - 다크모드 전역 관리 (Bug 4 근본 해결)
- **신규:** `context/AppContext.js` - prices, trends, sessionId 전역 관리 (중복 fetch 제거)
- **수정:** `App.js` - Provider로 감싸기, 모든 페이지 컴포넌트에서 context 소비

#### 기능 3: 지원 코인 확장 (ADA, AVAX, DOGE)
- **수정:** `backend/src/config/constants.js` - SUPPORTED_COINS에 cardano, avalanche-2, dogecoin 추가
- **수정:** `PriceAlert.js`, `NewsFeed.js` (하드코딩된 코인 목록 → 동적 렌더링)
- **수정:** `PriceCard.js` (그래디언트 색상 동적 처리)

#### 기능 4: 감성 분석 알고리즘 개선
- **수정:** `backend/src/utils/keywords.js` - ETF, halving, fork, defi, nft 등 도메인 키워드 추가
- **수정:** `backend/src/services/sentimentService.js`
  - 단어 경계 매칭 (`\bsurge\b` → "resurgence"와 구분)
  - 부정어(not/no/never) 처리로 역방향 키워드 감지

---

### 🚀 장기 신규 기능 (1주일 이상)

#### 기능 1: 포트폴리오 추적
- **DB:** `portfolio` 테이블 (session_id, coin, amount, purchase_price)
- **백엔드:** `portfolioModel.js`, `portfolio.js` 라우트
- **프론트엔드:** `Portfolio.js` 컴포넌트, `PortfolioPage.js` (Recharts PieChart 포함)
- **API:** `GET/POST/DELETE /api/portfolio/:session_id`

#### 기능 2: WebSocket 실시간 통신
- **백엔드:** `npm install ws`, `websocket/wsServer.js` - 가격 업데이트 즉시 브로드캐스트
- **프론트엔드:** `hooks/usePriceWebSocket.js` - 30초 polling → WebSocket 수신으로 교체

#### 기능 3: 사용자 인증 (JWT)
- **백엔드:** `npm install jsonwebtoken bcryptjs`, `users` 테이블, `auth.js` 라우트, `auth.js` 미들웨어
- **프론트엔드:** `AuthContext.js`, `LoginPage.js`, API 헤더에 Bearer 토큰 추가

---

### 📋 구현 우선순위

| 순서 | 항목 | 핵심 파일 | 소요 |
|------|------|-----------|------|
| 1 | Bug 1+2: alerts.js 수정 | `backend/src/routes/alerts.js` | 10분 |
| 2 | Bug 3: Dashboard 변환 | `frontend/src/components/Dashboard.js` | 15분 |
| 3 | Bug 4: 다크모드 통합 | `Navigation.js`, `Dashboard.js` | 10분 |
| 4 | 개선 1: coinUtils | `frontend/src/utils/coinUtils.js` | 2~3시간 |
| 5 | 개선 2: 커스텀 훅 | `useSessionId.js`, `useAutoRefresh.js` | 2시간 |
| 6 | 개선 3: 검증 미들웨어 | `backend/src/middleware/validate.js` | 2시간 |
| 7 | 개선 4: 에러 처리 | `VotingCard.js`, `PriceAlert.js` | 3시간 |
| 8 | 기능 C-2: Context API | `context/*.js` + 전체 페이지 수정 | 2~3일 |
| 9 | 기능 C-4: 감성 분석 개선 | `keywords.js`, `sentimentService.js` | 1~2일 |
| 10 | 기능 C-3: 코인 확장 | `constants.js` + 프론트 4개 파일 | 2일 |
| 11 | 기능 C-1: 가격 차트 | 백엔드 3개 + 프론트 3개 파일 | 3~4일 |
| 12 | 기능 D-1: 포트폴리오 | 백엔드 3개 + 프론트 3개 파일 | 7~10일 |
| 13 | 기능 D-2: WebSocket | `wsServer.js` + 훅 교체 | 5~7일 |
| 14 | 기능 D-3: 사용자 인증 | 백엔드+프론트 전반 | 2주+ |
