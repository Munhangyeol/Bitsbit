# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드 문서입니다.

## 프로젝트 개요

**암호화폐 가격 대시보드** - Bitcoin, Ethereum, Solana의 실시간 가격과 뉴스 기반 트렌드 분석을 제공하는 대시보드

**기술 스택:** React + Node.js/Express + SQLite

## 아키텍처

### 백엔드 (Node.js/Express)
- **진입점:** `backend/src/server.js` - Express 서버 초기화 및 라우트 등록
- **데이터베이스:** SQLite, 스키마 초기화는 `backend/src/config/database.js`에서 처리
- **서비스 레이어:**
  - `coinGeckoService.js` - CoinGecko API에서 실시간 가격 조회
  - `cryptoPanicService.js` - CryptoPanic API에서 뉴스 조회, 5분마다 자동 갱신
  - `sentimentService.js` - **핵심 비즈니스 로직** - 키워드 기반 감성 분석 및 트렌드 계산
- **데이터 모델:** `newsModel.js`와 `trendModel.js`가 SQLite CRUD 작업 처리
- **라우트:** 가격, 뉴스, 트렌드를 위한 RESTful API 엔드포인트

### 프론트엔드 (React)
- **메인 컨테이너:** `Dashboard.js` - 상태 관리 및 자동 갱신 로직 (가격은 30초마다)
- **컴포넌트:** `PriceCard.js`, `TrendIndicator.js`, `NewsFeed.js`
- **API 클라이언트:** `services/api.js` - Axios 기반 백엔드 통신

## 데이터베이스 스키마

### news 테이블
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE NOT NULL,      -- 외부 API 뉴스 ID
    title TEXT NOT NULL,                   -- 뉴스 제목
    url TEXT NOT NULL,                     -- 뉴스 URL
    published_at DATETIME NOT NULL,        -- 게시 시간
    source TEXT,                           -- 뉴스 출처
    coins TEXT,                            -- JSON 형식: ["BTC", "ETH"]
    sentiment TEXT,                        -- positive/negative/neutral
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### trends 테이블
```sql
CREATE TABLE trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coin TEXT NOT NULL,                    -- bitcoin/ethereum/solana
    trend TEXT NOT NULL,                   -- UP/DOWN/NEUTRAL
    score REAL NOT NULL,                   -- -1.0 ~ 1.0
    positive_count INTEGER,                -- 긍정 뉴스 개수
    negative_count INTEGER,                -- 부정 뉴스 개수
    neutral_count INTEGER,                 -- 중립 뉴스 개수
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API 엔드포인트

- `GET /api/prices` - BTC, ETH, SOL의 현재 가격 및 24시간 변동률 반환
- `GET /api/news?coin={btc|eth|sol}&limit=10` - 감성 분석이 포함된 캐시된 뉴스 반환
- `GET /api/trends` - 각 코인의 최신 트렌드 분석(UP/DOWN/NEUTRAL) 반환
- `POST /api/news/refresh` - 수동 뉴스 갱신 (자동 갱신은 5분마다 실행)

## 개발 명령어

### Backend
```bash
cd backend
npm install
npm start                    # Express 서버 시작 (포트 5000)
npm run dev                  # nodemon으로 시작 (설정된 경우)
```

### Frontend
```bash
cd frontend
npm install
npm start                    # React 개발 서버 시작 (포트 3000)
```

### Database
```bash
# 뉴스 데이터 조회
sqlite3 backend/database/crypto_dashboard.db "SELECT * FROM news LIMIT 5;"

# 트렌드 데이터 조회
sqlite3 backend/database/crypto_dashboard.db "SELECT * FROM trends;"

# 데이터베이스 리셋 (삭제 후 서버 재시작하여 재생성)
rm backend/database/crypto_dashboard.db
```

## 환경 변수

### backend/.env
```
PORT=5000
COINGECKO_API_URL=https://api.coingecko.com/api/v3
CRYPTOPANIC_API_KEY=free
CRYPTOPANIC_API_URL=https://cryptopanic.com/api/v1
DATABASE_PATH=./database/crypto_dashboard.db
NEWS_REFRESH_INTERVAL=300000
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 감성 분석 알고리즘

**`sentimentService.js`의 핵심 비즈니스 로직:**

1. **키워드 매칭:**
   - 긍정 키워드 (높은 점수): surge, moon, bullish, breakout, rally, pump
   - 긍정 키워드 (중간 점수): rise, up, increase, growth, adoption
   - 부정 키워드 (높은 점수): crash, dump, plunge, collapse, hack
   - 부정 키워드 (중간 점수): fall, drop, decline, down, sell

2. **트렌드 계산:**
   - 뉴스 제목에서 키워드 출현 횟수 집계
   - 가중치 적용 (high=3, medium=2, low=1)
   - 정규화된 점수: (positive_score - negative_score) / total_score
   - 트렌드 분류: score > 0.15 → UP, score < -0.15 → DOWN, 그 외 → NEUTRAL

3. **키워드 정의 위치:** `backend/src/utils/keywords.js`

## 테스트

### 백엔드 API 테스트
```bash
# 가격 엔드포인트 테스트
curl http://localhost:5000/api/prices

# 뉴스 엔드포인트 테스트
curl http://localhost:5000/api/news?coin=btc&limit=5

# 트렌드 엔드포인트 테스트
curl http://localhost:5000/api/trends

# 수동 뉴스 갱신 트리거
curl -X POST http://localhost:5000/api/news/refresh
```

### 프론트엔드 테스트
1. http://localhost:3000 접속
2. 3개 코인 가격 표시 확인
3. 색상 코딩 확인 (양수는 초록색, 음수는 빨간색)
4. 트렌드 인디케이터 확인 (UP ↑ / DOWN ↓ / NEUTRAL -)
5. 감성 색상이 포함된 뉴스 피드 확인
6. 30초 대기 후 자동 갱신 작동 확인

## 자동 갱신 동작

- **가격:** 30초마다 갱신 (`Dashboard.js`에서 `useEffect` + `setInterval`로 구현)
- **뉴스:** 백엔드에서 5분마다 자동 조회 (`cryptoPanicService.js`의 스케줄러)
- **트렌드:** 뉴스 갱신 시마다 재계산

## 핵심 파일

1. **backend/src/services/sentimentService.js** - 핵심 감성 분석 및 트렌드 계산 로직
2. **backend/src/config/database.js** - SQLite 초기화 및 스키마 생성
3. **backend/src/server.js** - Express 서버 진입점 및 라우트 등록
4. **frontend/src/components/Dashboard.js** - 상태 관리 및 자동 갱신을 포함한 메인 UI 컨테이너
5. **frontend/src/components/PriceCard.js** - 코인 가격/변동률/트렌드 표시

## 구현 우선순위

**필수 구현 (Phase 1-4):**
- CoinGecko 가격 조회
- CryptoPanic 뉴스 수집
- 키워드 기반 감성 분석
- 기본 대시보드 UI

**시간 제한 시 단순화 가능:**
- 복잡한 에러 처리 (기본 try-catch 사용)
- 고급 스타일링 (순수 CSS만 사용)
- 뉴스 상세 페이지 (외부 링크만 제공)
- 캐싱 최적화 (인메모리로 충분)

## 향후 확장 가능성

현재 아키텍처는 다음 기능 추가를 지원합니다:
- 사용자 인증 (JWT + users 테이블)
- 커뮤니티 게시판 (comments 테이블)
- 가격 예측 투표 (predictions 테이블)
- 실시간 알림 (WebSocket 통합)

현재 설계는 프론트엔드/백엔드 분리, RESTful API 구조, 서비스 레이어 분리를 통해 이러한 확장을 용이하게 합니다.
