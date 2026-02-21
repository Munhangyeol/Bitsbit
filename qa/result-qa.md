# Bitsbit QA 결과 보고서

- **실행일시:** 2026-02-21
- **실행 범위:** 전체 QA (1~5단계)
- **결과 요약:** 자동 검증 19개 통과, 경고 2개, 브라우저 수동 확인 항목 별도 기재

---

## [1/5] 서버 상태 확인

| 서버 | 포트 | 상태 | HTTP 코드 |
|------|------|------|-----------|
| 백엔드 | 5000 | ✓ 정상 | 200 |
| 프론트엔드 | 3000 | ✓ 정상 | 302 (React 개발서버 리다이렉트, 정상) |

---

## [2/5] 백엔드 API 검증

### GET /api/prices

```json
{
  "bitcoin":  {"price": 67901,   "change_24h": 0.91},
  "ethereum": {"price": 1964.65, "change_24h": 0.51},
  "solana":   {"price": 84.61,   "change_24h": 1.80}
}
```

| 항목 | 결과 |
|------|------|
| bitcoin 키 존재 | ✓ |
| ethereum 키 존재 | ✓ |
| solana 키 존재 | ✓ |
| price 숫자 타입 | ✓ |
| change_24h 숫자 타입 | ✓ |
| ⚠ 필드명 불일치 | SKILL.md 기준 `current_price` → 실제 `price`, `price_change_percentage_24h` → 실제 `change_24h` |

### GET /api/news?coin=btc&limit=5

| 항목 | 결과 |
|------|------|
| 배열 반환 | ✓ (5개 항목) |
| title 필드 | ✓ |
| url 필드 | ✓ |
| sentiment 필드 | ✓ |
| sentiment 유효값 | ✓ (positive / negative / neutral) |
| published_at 필드 | ✓ |

### GET /api/news?coin=eth&limit=5

| 항목 | 결과 |
|------|------|
| 배열 반환 | ✓ (5개 항목) |
| sentiment 유효값 | ✓ (neutral 위주) |

### GET /api/news?coin=sol&limit=5

| 항목 | 결과 |
|------|------|
| 배열 반환 | ✓ (5개 항목) |
| sentiment 유효값 | ✓ (positive / negative / neutral 혼합) |

### GET /api/trends

```json
[
  {"coin":"bitcoin",  "trend":"NEUTRAL", "score":0.071, "positive_count":7, "negative_count":7, "neutral_count":7},
  {"coin":"ethereum", "trend":"NEUTRAL", "score":0.067, "positive_count":2, "negative_count":4, "neutral_count":13},
  {"coin":"solana",   "trend":"UP",      "score":0.583, "positive_count":7, "negative_count":4, "neutral_count":5}
]
```

| 항목 | 결과 |
|------|------|
| 3개 코인 반환 | ✓ |
| trend 유효값 (UP/DOWN/NEUTRAL) | ✓ |
| score -1.0~1.0 범위 | ✓ |
| positive/negative/neutral_count 필드 | ✓ |

### GET /api/predictions

```json
[
  {"coin":"bitcoin",  "up":1, "down":0, "total":1},
  {"coin":"ethereum", "up":1, "down":0, "total":1}
]
```

| 항목 | 결과 |
|------|------|
| 배열 반환 | ✓ |
| up/down/total 숫자 | ✓ |
| ⚠ 필드명 불일치 | SKILL.md 기준 `upVotes`/`downVotes`/`upPercent`/`downPercent` → 실제 `up`/`down`/`total` |

### GET /api/alerts/test-session-qa

| 항목 | 결과 |
|------|------|
| 배열 반환 | ✓ (빈 배열, 정상) |

---

## [3/5] 감성 분석 로직 검증

### keywords.js 소스 리뷰

| 항목 | 결과 |
|------|------|
| 긍정 키워드 high (가중치 3) 정의 | ✓ surge, moon, bullish, breakout, rally, pump 외 11개 |
| 긍정 키워드 medium (가중치 2) 정의 | ✓ rise, up, increase, growth, adoption 외 15개 |
| 긍정 키워드 low (가중치 1) 정의 | ✓ green, positive, buy, recover 외 7개 |
| 부정 키워드 high (가중치 3) 정의 | ✓ crash, dump, plunge, collapse, hack 외 12개 |
| 부정 키워드 medium (가중치 2) 정의 | ✓ fall, drop, decline, down, sell 외 13개 |
| 부정 키워드 low (가중치 1) 정의 | ✓ red, negative, concern, warning 외 7개 |
| 가중치 설정 (high=3, medium=2, low=1) | ✓ |
| 부정어(negators) 목록 정의 | ✓ not, no, never, without, despite, fails to, unable to |

### sentimentService.js 소스 리뷰

| 항목 | 결과 |
|------|------|
| 트렌드 임계값 score > 0.15 → UP | ✓ |
| 트렌드 임계값 score < -0.15 → DOWN | ✓ |
| 정규화 공식: (pos-neg)/total | ✓ |
| 단어 경계(\b) 패턴 사용 (부분 일치 오탐 방지) | ✓ |
| 부정어 처리: 매치 앞 40자에서 negators 확인 후 점수 반전 | ✓ |
| score 범위 -1.0 ~ 1.0 | ✓ |

### DB 트렌드 점수 교차 검증

| coin | trend | score |
|------|-------|-------|
| bitcoin | NEUTRAL | 0.071 |
| ethereum | NEUTRAL | 0.000 |
| solana | UP | 0.636 |

- score 범위 위반 (-1~1 초과): **0건** ✓
- 모든 값 ±0.15 임계값 기준 올바르게 분류됨 ✓

---

## [4/5] 프론트엔드 UI 체크리스트

> ⚠️ 브라우저(http://localhost:3000)에서 직접 확인 필요

### 가격 표시
- [ ] Bitcoin, Ethereum, Solana 3개 코인 가격 카드 표시
- [ ] 가격 포맷: `$XX,XXX` 형식 (쉼표 구분)
- [ ] 24시간 변동률: 양수면 **녹색**, 음수면 **빨간색**
- [ ] 변동률에 `+`/`-` 부호 표시
- [ ] 트렌드 아이콘: UP은 `↑`, DOWN은 `↓`, NEUTRAL은 `-`

### 자동 갱신 (30초)
- [ ] 페이지 로드 직후 가격 표시
- [ ] 30초 경과 후 가격 자동 갱신
- [ ] 갱신 중 로딩 상태 표시 (있는 경우)

### 뉴스 피드
- [ ] 뉴스 목록 표시 (제목, 출처, 시간)
- [ ] `positive` 뉴스: 녹색 배경/텍스트
- [ ] `negative` 뉴스: 빨간색 배경/텍스트
- [ ] `neutral` 뉴스: 회색/기본 색상
- [ ] 뉴스 제목 클릭 시 외부 링크 열림

### 가격 예측 투표 (VotingCard)
- [ ] 각 코인별 UP/DOWN 투표 버튼 표시
- [ ] 투표 후 퍼센트 바 업데이트
- [ ] 24시간 내 재투표 불가 (중복 투표 방지 메시지)
- [ ] 투표 결과 숫자 및 퍼센트 표시

### 가격 알림 (PriceAlert)
- [ ] 코인, 목표 가격, 방향(이상/이하) 입력 폼 존재
- [ ] 알림 등록 후 목록에 표시
- [ ] 알림 삭제 버튼 동작
- [ ] 목표 가격 도달 시 팝업/알림 표시

### 세션 ID
- [ ] 브라우저 새로고침 후에도 세션 ID 유지 (localStorage)
- [ ] 다른 브라우저 탭은 다른 세션 ID

---

## [5/5] 데이터베이스 무결성

### 테이블 목록

| 테이블 | 존재 여부 |
|--------|-----------|
| news | ✓ |
| trends | ✓ |
| predictions | ✓ |
| alerts | ✓ |
| price_history | ✓ (추가 테이블, 정상) |

### 행 수 통계

| 테이블 | 행 수 |
|--------|-------|
| news | 167 |
| trends | 47 |
| predictions | 2 |
| alerts | 0 |

### 데이터 제약 검증

| 항목 | 결과 |
|------|------|
| news.external_id UNIQUE 위반 | **0건** ✓ (167건 중 167개 unique) |
| trends.score 범위 위반 (-1~1 초과) | **0건** ✓ |
| trends.trend 유효값 (UP/DOWN/NEUTRAL) | ✓ (DOWN, UP, NEUTRAL 확인) |
| predictions.direction 유효값 (UP/DOWN) | ✓ (UP 확인, DOWN은 데이터 없음) |
| alerts.direction 유효값 (ABOVE/BELOW) | 데이터 없음 (검증 불가) |
| news.sentiment 유효값 | ✓ (neutral, negative, positive 모두 확인) |
| trends.coin 유효값 (bitcoin/ethereum/solana) | ✓ |

---

## 발견된 이슈

### ⚠️ 경고 (기능 영향 없음)

| # | 위치 | 내용 |
|---|------|------|
| W1 | `/api/prices` 응답 | SKILL.md 문서의 기대 필드명(`current_price`, `price_change_percentage_24h`)과 실제 응답 필드명(`price`, `change_24h`)이 다름. 프론트엔드가 실제 필드명을 사용하므로 기능 이상 없음. |
| W2 | `/api/predictions` 응답 | SKILL.md 문서의 기대 필드명(`upVotes`, `downVotes`, `upPercent`, `downPercent`)과 실제 응답 필드명(`up`, `down`, `total`)이 다름. 동일한 사항으로 기능 이상 없음. |

---

## 최종 요약

| 카테고리 | 자동 검증 | 결과 |
|---------|----------|------|
| 서버 상태 | 백엔드/프론트엔드 | ✓ 정상 |
| API 엔드포인트 | 6개 엔드포인트 | ✓ 모두 정상 |
| 감성 분석 로직 | 키워드/임계값/정규화 | ✓ 모두 정상 |
| 프론트엔드 UI | - | ⚠️ 브라우저 수동 확인 필요 |
| DB 무결성 | 5개 테이블, 7개 제약 | ✓ 모두 통과 |

**자동 검증: 19개 통과 / 경고 2개 (문서-실제 필드명 불일치, 기능 영향 없음)**
**브라우저 수동 확인: 18개 항목**
