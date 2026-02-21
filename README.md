# 암호화폐 가격 대시보드

Bitcoin, Ethereum, Solana의 실시간 가격과 뉴스 기반 트렌드 분석을 제공하는 대시보드

## 빠른 시작

### Windows에서 실행

**CMD (명령 프롬프트):**
```bash
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

이 스크립트는 백엔드와 프론트엔드를 자동으로 시작합니다.

#### 개별 실행

**백엔드만 시작:**
```bash
# CMD
start_backend.bat

# PowerShell
.\start_backend.ps1
```

**프론트엔드만 시작:**
```bash
# CMD
start_frontend.bat

# PowerShell
.\start_frontend.ps1
```

### 수동 실행

#### Backend
```bash
cd backend
npm install
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

#### Frontend
```bash
cd frontend
npm install
npm start
```

앱이 http://localhost:3000 에서 실행됩니다.

## 주요 기능

- **실시간 가격 조회** - Bitcoin, Ethereum, Solana 가격 30초마다 자동 갱신
- **가격 이력 차트** - 1D / 7D / 30D 범위 선택 가능한 라인 차트
- **뉴스 기반 트렌드 분석** - 키워드 감성 분석을 통한 시장 트렌드 예측
- **가격 예측 투표** - 24시간 가격 방향 투표 및 통계 시각화
- **가격 알림 설정** - 목표 가격 도달 시 알림
- **다크 모드** - 라이트/다크 테마 전환

## 기술 스택

- **Frontend:** React, React Router, Axios, Recharts
- **Backend:** Node.js, Express
- **Database:** SQLite
- **APIs:** CoinGecko (가격), CryptoPanic (뉴스)

## 프로젝트 구조

```
Bitsbit/
├── backend/
│   ├── src/
│   │   ├── config/         # 데이터베이스 설정, 상수
│   │   ├── middleware/      # 입력 유효성 검사
│   │   ├── models/         # 데이터 모델 (뉴스, 트렌드, 예측, 알림, 가격이력)
│   │   ├── routes/         # API 라우트
│   │   ├── services/       # 비즈니스 로직 (감성 분석, API 호출)
│   │   ├── utils/          # 유틸리티 (키워드 정의)
│   │   └── server.js       # 서버 진입점
│   ├── database/           # SQLite 데이터베이스 파일
│   └── .env                # 환경 변수
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React 컴포넌트 (PriceCard, PriceChart, NewsFeed 등)
│   │   ├── context/        # Context API (AppContext, ThemeContext)
│   │   ├── hooks/          # 커스텀 훅 (useSessionId, useAutoRefresh)
│   │   ├── pages/          # 페이지 컴포넌트 (Home, Prices, Trends, News, Features)
│   │   ├── services/       # API 클라이언트
│   │   ├── utils/          # 공통 유틸리티 (coinUtils)
│   │   └── App.js          # 앱 진입점
│   └── .env                # 환경 변수
│
├── start.bat               # 전체 서버 시작 (CMD)
├── start.ps1               # 전체 서버 시작 (PowerShell)
├── start_backend.bat       # 백엔드만 시작 (CMD)
├── start_backend.ps1       # 백엔드만 시작 (PowerShell)
├── start_frontend.bat      # 프론트엔드만 시작 (CMD)
├── start_frontend.ps1      # 프론트엔드만 시작 (PowerShell)
└── CLAUDE.md               # 개발자 가이드
```

## API 엔드포인트

### 가격
- `GET /api/prices` - 실시간 가격 조회 (BTC, ETH, SOL)
- `GET /api/prices/history?coin={bitcoin|ethereum|solana}&range={1d|7d|30d}` - 가격 이력 조회

### 뉴스 / 트렌드
- `GET /api/news?coin={btc|eth|sol}` - 코인별 뉴스 조회 (감성 분석 포함)
- `GET /api/trends` - 트렌드 분석 결과 (UP/DOWN/NEUTRAL)
- `POST /api/news/refresh` - 뉴스 수동 갱신

### 가격 예측 투표
- `GET /api/predictions` - 전체 투표 통계
- `GET /api/predictions/:coin` - 코인별 투표 통계
- `POST /api/predictions` - 투표 생성
- `GET /api/predictions/check/:coin/:session_id` - 세션별 투표 여부 확인

### 가격 알림
- `GET /api/alerts/:session_id` - 세션별 알림 목록
- `GET /api/alerts/check/:session_id` - 트리거된 알림 확인
- `POST /api/alerts` - 알림 생성
- `DELETE /api/alerts/:id` - 알림 삭제

## 데이터베이스

SQLite 데이터베이스는 `backend/database/crypto_dashboard.db`에 자동 생성됩니다.

테이블: `news`, `trends`, `predictions`, `alerts`, `price_history`

### 데이터 조회
```bash
# 뉴스 데이터
sqlite3 backend/database/crypto_dashboard.db "SELECT * FROM news LIMIT 5;"

# 트렌드 데이터
sqlite3 backend/database/crypto_dashboard.db "SELECT * FROM trends;"

# 가격 이력
sqlite3 backend/database/crypto_dashboard.db "SELECT * FROM price_history LIMIT 10;"
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

## 개발 가이드

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

## 라이선스

MIT
