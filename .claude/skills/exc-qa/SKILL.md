# QA 품질 검증

## 설명
Bitsbit 암호화폐 대시보드 전체의 품질을 체계적으로 검증하는 스킬입니다. 백엔드 API, 감성 분석 로직, 프론트엔드 UI, 데이터베이스 무결성, 기능 E2E 흐름을 순서대로 점검합니다.

## 사용법
```bash
/exc-qa                   # 전체 QA 실행
```

범위 지정:
```bash
/exc-qa --api             # API 엔드포인트만 검증
/exc-qa --ui              # 프론트엔드 UI 체크리스트만
/exc-qa --db              # 데이터베이스 무결성만 검증
/exc-qa --sentiment       # 감성 분석 로직만 검증
/exc-qa --quick           # 핵심 항목 빠른 검증 (서버 상태 + 가격 API + DB)
```

## 동작 과정

### 1단계: 서버 상태 확인
백엔드(포트 5000)와 프론트엔드(포트 3000)가 정상 실행 중인지 확인합니다.

```bash
# 백엔드 헬스 체크
curl -s http://localhost:5000/api/prices | head -c 100

# 프론트엔드 접근 가능 여부
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

**기대 결과:**
- 백엔드: JSON 응답 반환 (200 OK)
- 프론트엔드: HTTP 200

---

### 2단계: 백엔드 API 검증
모든 엔드포인트의 응답 형식과 데이터 정확성을 검증합니다.

```bash
# 가격 API
curl -s http://localhost:5000/api/prices

# 뉴스 API (각 코인별)
curl -s "http://localhost:5000/api/news?coin=btc&limit=5"
curl -s "http://localhost:5000/api/news?coin=eth&limit=5"
curl -s "http://localhost:5000/api/news?coin=sol&limit=5"

# 트렌드 API
curl -s http://localhost:5000/api/trends

# 예측 투표 API
curl -s http://localhost:5000/api/predictions

# 알림 API (세션 ID로 조회)
curl -s "http://localhost:5000/api/alerts/test-session-qa"

# 수동 뉴스 갱신
curl -s -X POST http://localhost:5000/api/news/refresh
```

**각 엔드포인트 검증 항목:**

| 엔드포인트 | 검증 항목 |
|-----------|---------|
| `GET /api/prices` | `bitcoin`, `ethereum`, `solana` 키 존재, `current_price` 숫자, `price_change_percentage_24h` 숫자 |
| `GET /api/news` | 배열 반환, `title`/`url`/`sentiment` 필드 존재, `sentiment`는 `positive`/`negative`/`neutral` 중 하나 |
| `GET /api/trends` | 각 코인의 `trend`(UP/DOWN/NEUTRAL), `score`(-1.0~1.0 범위) |
| `GET /api/predictions` | `upVotes`/`downVotes` 숫자, `upPercent`/`downPercent` 0~100 |
| `GET /api/alerts/:session_id` | 배열 반환, `coin`/`target_price`/`direction` 필드 |

---

### 3단계: 감성 분석 로직 검증
키워드 기반 점수 계산과 트렌드 분류 정확성을 직접 확인합니다.

**검증 방법 — 소스 코드 리뷰:**
- `backend/src/utils/keywords.js` — 키워드 목록 정의 확인
- `backend/src/services/sentimentService.js` — 점수 계산 및 트렌드 분류 로직 확인

**핵심 검증 포인트:**

```
긍정 키워드 (높은 점수, 가중치 3): surge, moon, bullish, breakout, rally, pump
긍정 키워드 (중간 점수, 가중치 2): rise, up, increase, growth, adoption
부정 키워드 (높은 점수, 가중치 3): crash, dump, plunge, collapse, hack
부정 키워드 (중간 점수, 가중치 2): fall, drop, decline, down, sell

트렌드 임계값:
  score > 0.15  → UP
  score < -0.15 → DOWN
  그 외          → NEUTRAL

점수 범위: -1.0 ~ 1.0 (정규화됨)
```

**실제 뉴스 데이터로 교차 검증:**
```bash
# DB에서 뉴스 및 감성 데이터 조회
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT title, sentiment FROM news ORDER BY created_at DESC LIMIT 10;"

# 트렌드 점수 범위 확인 (-1~1 이내)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT coin, trend, score FROM trends ORDER BY analyzed_at DESC LIMIT 6;"
```

---

### 4단계: 프론트엔드 UI 검증 체크리스트
브라우저(http://localhost:3000)에서 직접 확인하는 항목입니다.

#### 가격 표시
- [ ] Bitcoin, Ethereum, Solana 3개 코인 가격 카드 표시
- [ ] 가격 포맷: `$XX,XXX` 형식 (쉼표 구분)
- [ ] 24시간 변동률: 양수면 **녹색**, 음수면 **빨간색**
- [ ] 변동률에 `+`/`-` 부호 표시
- [ ] 트렌드 아이콘: UP은 `↑`, DOWN은 `↓`, NEUTRAL은 `-`

#### 자동 갱신 (30초)
- [ ] 페이지 로드 직후 가격 표시
- [ ] 30초 경과 후 가격 자동 갱신 (타임스탬프 또는 가격 변화로 확인)
- [ ] 갱신 중 로딩 상태 표시 (있는 경우)

#### 뉴스 피드
- [ ] 뉴스 목록 표시 (제목, 출처, 시간)
- [ ] `positive` 뉴스는 녹색 배경/텍스트
- [ ] `negative` 뉴스는 빨간색 배경/텍스트
- [ ] `neutral` 뉴스는 회색/기본 색상
- [ ] 뉴스 제목 클릭 시 외부 링크 열림

#### 가격 예측 투표 (VotingCard)
- [ ] 각 코인별 UP/DOWN 투표 버튼 표시
- [ ] 투표 후 퍼센트 바 업데이트
- [ ] 24시간 내 재투표 불가 (중복 투표 방지 메시지)
- [ ] 투표 결과 숫자 및 퍼센트 표시

#### 가격 알림 (PriceAlert)
- [ ] 코인, 목표 가격, 방향(이상/이하) 입력 폼 존재
- [ ] 알림 등록 후 목록에 표시
- [ ] 알림 삭제 버튼 동작
- [ ] 목표 가격 도달 시 팝업/알림 표시

#### 세션 ID
- [ ] 브라우저 새로고침 후에도 세션 ID 유지 (localStorage)
- [ ] 다른 브라우저 탭은 다른 세션 ID

---

### 5단계: 데이터베이스 무결성 확인
SQLite 쿼리로 스키마 구조와 데이터 제약 조건을 점검합니다.

```bash
# 모든 테이블 존재 여부
sqlite3 backend/database/crypto_dashboard.db ".tables"
# 기대값: alerts  news  predictions  trends

# 각 테이블 스키마 확인
sqlite3 backend/database/crypto_dashboard.db ".schema news"
sqlite3 backend/database/crypto_dashboard.db ".schema trends"
sqlite3 backend/database/crypto_dashboard.db ".schema predictions"
sqlite3 backend/database/crypto_dashboard.db ".schema alerts"

# news 테이블: external_id UNIQUE 제약 확인
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT COUNT(*) as total, COUNT(DISTINCT external_id) as unique_ids FROM news;"
# total == unique_ids 이어야 함

# trends 테이블: score 범위 확인 (-1 ~ 1)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT coin, score FROM trends WHERE score < -1 OR score > 1;"
# 결과 없어야 함

# trends 테이블: trend 값 제약 (UP/DOWN/NEUTRAL)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT DISTINCT trend FROM trends;"
# UP, DOWN, NEUTRAL 중 하나여야 함

# predictions 테이블: direction 값 제약 (UP/DOWN)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT DISTINCT direction FROM predictions;"
# UP, DOWN 중 하나여야 함

# alerts 테이블: direction 값 제약 (ABOVE/BELOW)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT DISTINCT direction FROM alerts;"
# ABOVE, BELOW 중 하나여야 함

# news 테이블: sentiment 값 제약
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT DISTINCT sentiment FROM news;"
# positive, negative, neutral 중 하나여야 함

# 코인 값 제약 (bitcoin/ethereum/solana)
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT DISTINCT coin FROM trends;"
# bitcoin, ethereum, solana 중 하나여야 함

# 데이터 통계
sqlite3 backend/database/crypto_dashboard.db \
  "SELECT 'news' as table_name, COUNT(*) as rows FROM news
   UNION ALL SELECT 'trends', COUNT(*) FROM trends
   UNION ALL SELECT 'predictions', COUNT(*) FROM predictions
   UNION ALL SELECT 'alerts', COUNT(*) FROM alerts;"
```

---

## QA 체크리스트 요약

| 카테고리 | 대상 | 검증 방법 | 기준 |
|---------|------|---------|------|
| **API 엔드포인트** | /api/prices, /api/news, /api/trends, /api/predictions, /api/alerts | curl | HTTP 200, JSON 응답 |
| **데이터 형식** | 응답 JSON 스키마, 숫자 타입, 날짜 포맷 | curl + 파싱 | 필드 존재, 타입 일치 |
| **감성 분석** | 키워드 매칭, 점수 범위, 트렌드 임계값 | 소스 리뷰 + DB 쿼리 | -1≤score≤1, ±0.15 경계 |
| **프론트엔드 UI** | 가격 색상, 트렌드 아이콘, 자동갱신, 세션 ID | 브라우저 체크리스트 | 시각적 확인 |
| **기능 E2E** | 투표 중복 방지, 알림 트리거, 뉴스 갱신 | 시나리오 수동 실행 | 기능 정상 동작 |
| **DB 무결성** | 테이블 존재, 필드 타입, 코인 값 제약 | sqlite3 쿼리 | 스키마 일치, 제약 위반 없음 |

---

## 옵션

- `/exc-qa` - 전체 QA 실행 (1~5단계 순서대로)
- `/exc-qa --api` - 2단계: API 엔드포인트 검증만
- `/exc-qa --sentiment` - 3단계: 감성 분석 로직 검증만
- `/exc-qa --ui` - 4단계: 프론트엔드 UI 체크리스트만
- `/exc-qa --db` - 5단계: 데이터베이스 무결성 검증만
- `/exc-qa --quick` - 빠른 검증: 서버 상태 + 가격 API + DB 테이블 존재 여부

---

## 예시

### 예시 1: 전체 QA 실행
```bash
/exc-qa
```

**결과 예시:**
```
[1/5] 서버 상태 확인
  ✓ 백엔드 (포트 5000) - 응답 정상
  ✓ 프론트엔드 (포트 3000) - HTTP 200

[2/5] API 엔드포인트 검증
  ✓ GET /api/prices - bitcoin/ethereum/solana 가격 반환
  ✓ GET /api/news?coin=btc - 5개 뉴스, sentiment 필드 포함
  ✓ GET /api/trends - UP/DOWN/NEUTRAL 트렌드 반환
  ✓ GET /api/predictions - 투표 통계 반환
  ✓ GET /api/alerts/test-session - 빈 배열 반환

[3/5] 감성 분석 로직 검증
  ✓ keywords.js - 긍정/부정 키워드 정의 확인
  ✓ sentimentService.js - 트렌드 임계값 ±0.15 확인
  ✓ DB score 범위 - 모든 값 -1.0 ~ 1.0 이내

[4/5] 프론트엔드 UI 체크리스트
  ⚠️ 브라우저 수동 확인 필요 - 체크리스트 출력 완료

[5/5] 데이터베이스 무결성
  ✓ 4개 테이블 존재 (news, trends, predictions, alerts)
  ✓ external_id UNIQUE 제약 - 위반 없음
  ✓ score 범위 (-1~1) - 위반 없음
  ✓ trend 값 (UP/DOWN/NEUTRAL) - 유효

QA 완료: 자동 검증 17개 통과, 브라우저 수동 확인 10개 항목 출력
```

---

### 예시 2: API만 빠르게 확인
```bash
/exc-qa --api
```

**결과 예시:**
```
API 엔드포인트 검증 시작...

GET /api/prices
→ {"bitcoin":{"current_price":95000,...},"ethereum":{"current_price":3200,...}}
  ✓ bitcoin 가격: 95000 (숫자)
  ✓ ethereum 가격: 3200 (숫자)
  ✓ solana 가격: 185 (숫자)
  ✓ price_change_percentage_24h 필드 존재

GET /api/news?coin=btc&limit=5
→ 배열 5개 항목
  ✓ title 필드 존재
  ✓ sentiment: positive (유효값)
  ✓ published_at 날짜 형식 확인

... (각 엔드포인트 결과)

API 검증 완료: 5개 엔드포인트 모두 정상
```

---

### 예시 3: 데이터베이스만 점검
```bash
/exc-qa --db
```

**결과 예시:**
```
데이터베이스 무결성 검사...

테이블 목록: alerts news predictions trends ✓

news 테이블:
  - 총 152개 행
  - UNIQUE 위반: 0건 ✓
  - 유효하지 않은 sentiment: 0건 ✓

trends 테이블:
  - 총 12개 행
  - score 범위 위반: 0건 ✓
  - 유효하지 않은 trend: 0건 ✓

predictions 테이블:
  - 총 23개 행
  - 유효하지 않은 direction: 0건 ✓

alerts 테이블:
  - 총 5개 행
  - 유효하지 않은 direction: 0건 ✓

DB 무결성 검사 완료: 모든 제약 조건 통과
```

---

### 예시 4: 빠른 검증
```bash
/exc-qa --quick
```

**결과 예시:**
```
빠른 QA 검증 (핵심 항목만)

서버: 백엔드 ✓ / 프론트엔드 ✓
가격 API: bitcoin $95,000 / ethereum $3,200 / solana $185 ✓
DB 테이블: news ✓ / trends ✓ / predictions ✓ / alerts ✓

핵심 3개 항목 통과 — 전체 QA는 /exc-qa 실행
```

---

## 주의사항

1. **서버 실행 필요**
   - QA 실행 전 백엔드(`cd backend && npm start`)와 프론트엔드(`cd frontend && npm start`)가 모두 실행 중이어야 합니다.
   - 서버가 없으면 1단계에서 실패하고 중단합니다.

2. **CryptoPanic API 제한**
   - `CRYPTOPANIC_API_KEY=free` 사용 시 뉴스 데이터가 없거나 적을 수 있습니다.
   - 뉴스 API 검증 시 빈 배열도 정상(데이터 없음)으로 처리합니다.

3. **UI 수동 확인 필수**
   - 4단계(프론트엔드 UI)는 자동화할 수 없습니다. 체크리스트를 출력하면 브라우저에서 직접 확인해야 합니다.

4. **DB 경로**
   - 데이터베이스 파일 위치: `backend/database/crypto_dashboard.db`
   - 파일이 없으면 백엔드 서버를 한 번 실행하면 자동 생성됩니다.

5. **세션 ID 테스트**
   - 투표/알림 관련 기능은 `localStorage`의 세션 ID에 의존합니다.
   - 브라우저 개발자 도구 > Application > Local Storage에서 `sessionId` 확인 가능합니다.

6. **QA 결과 저장**
   - QA 실행 결과는 프로젝트 루트 바로 하위 `qa/` 폴더에 `result-qa.md` 파일로 저장합니다.
   - 경로: `qa/result-qa.md`
   - 파일이 이미 존재하면 덮어씁니다.

---

## 관련 명령어

- `/test` - 단위/통합 테스트 코드 작성 및 실행
- `/backend-api` - API 엔드포인트 구현
- `/frontend-ui` - UI 컴포넌트 수정
- `/git-commit` - QA 통과 후 커밋
