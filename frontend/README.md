# 암호화폐 가격 대시보드 - Frontend

React 기반 암호화폐 가격 및 트렌드 분석 대시보드 프론트엔드

## 기능

- **실시간 가격 표시**: Bitcoin, Ethereum, Solana의 현재 가격 및 24시간 변동률
- **트렌드 분석**: 뉴스 기반 감성 분석을 통한 시장 트렌드 파악
- **뉴스 피드**: 최신 암호화폐 뉴스와 감성 분석 결과
- **자동 갱신**: 30초마다 가격 및 트렌드 자동 업데이트
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크 모드 지원**: 시스템 설정에 따른 자동 테마 전환

## 기술 스택

- **React 18**: 함수형 컴포넌트 및 Hooks
- **Axios**: HTTP 클라이언트
- **CSS Variables**: 테마 및 스타일 관리
- **React Scripts**: 빌드 및 개발 서버

## 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

개발 서버는 http://localhost:3000에서 실행됩니다.

## 환경 변수

`.env` 파일에서 설정:

```env
REACT_APP_API_URL=http://localhost:5000/api
PORT=3000
```

## 프로젝트 구조

```
frontend/
├── public/
│   ├── index.html          # HTML 진입점
│   └── manifest.json       # PWA 설정
├── src/
│   ├── components/
│   │   ├── Dashboard.js    # 메인 컨테이너 컴포넌트
│   │   ├── Dashboard.css
│   │   ├── PriceCard.js    # 가격 카드 컴포넌트
│   │   ├── PriceCard.css
│   │   ├── TrendIndicator.js   # 트렌드 표시 컴포넌트
│   │   ├── TrendIndicator.css
│   │   ├── NewsFeed.js     # 뉴스 피드 컴포넌트
│   │   └── NewsFeed.css
│   ├── services/
│   │   └── api.js          # API 클라이언트
│   ├── App.js              # 루트 컴포넌트
│   ├── App.css             # 글로벌 스타일
│   ├── index.js            # React 진입점
│   └── index.css
├── .env                    # 환경 변수
├── .gitignore
├── package.json
└── README.md
```

## 컴포넌트 설명

### Dashboard.js
메인 컨테이너 컴포넌트:
- 가격 및 트렌드 데이터 관리
- 30초마다 자동 갱신
- 로딩 및 에러 상태 처리
- 하위 컴포넌트에 데이터 전달

### PriceCard.js
개별 코인 가격 표시:
- 코인 이름 및 심볼
- 현재 가격 (USD)
- 24시간 변동률
- 트렌드 인디케이터 (UP/DOWN/NEUTRAL)

### TrendIndicator.js
감성 분석 기반 트렌드 표시:
- 트렌드 방향 (UP/DOWN/NEUTRAL)
- 감성 점수 (-1.0 ~ 1.0)
- 긍정/중립/부정 뉴스 개수
- 시각적 감성 분포 바

### NewsFeed.js
뉴스 목록 표시:
- 코인별 필터링 (BTC/ETH/SOL)
- 감성 분석 결과 (긍정/부정/중립)
- 발행 시간 (상대 시간 표시)
- 외부 링크 제공

## API 연동

`services/api.js`를 통해 백엔드 API와 통신:

```javascript
import api from './services/api';

// 가격 조회
const prices = await api.getPrices();

// 뉴스 조회
const news = await api.getNews('btc', 10);

// 트렌드 조회
const trends = await api.getTrends();

// 뉴스 수동 갱신
await api.refreshNews();
```

## 스타일링

### CSS Variables
`App.css`에서 테마 색상 관리:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --bg-primary: #f9fafb;
  --text-primary: #111827;
}
```

### 다크 모드
시스템 설정에 따라 자동 전환:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
  }
}
```

### 반응형 디자인
모바일 우선 접근:

```css
/* 모바일 기본 */
.price-grid {
  grid-template-columns: 1fr;
}

/* 태블릿 */
@media (min-width: 768px) {
  .price-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .price-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 빌드

```bash
# 프로덕션 빌드
npm run build

# build/ 폴더에 최적화된 정적 파일 생성
```

## 테스트

```bash
# 테스트 실행
npm test
```

## 배포

빌드된 파일(`build/` 폴더)을 정적 파일 호스팅 서비스에 배포:

- **Netlify**: `netlify deploy --prod --dir=build`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: `npm run deploy`

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 성능 최적화

- 자동 코드 스플리팅
- CSS 최소화
- 이미지 최적화
- Gzip 압축

## 트러블슈팅

### CORS 에러
`package.json`에 proxy 설정 추가:

```json
{
  "proxy": "http://localhost:5000"
}
```

### API 연결 실패
1. 백엔드 서버가 실행 중인지 확인
2. `.env` 파일의 `REACT_APP_API_URL` 확인
3. 네트워크 탭에서 요청 확인

### 스타일이 적용되지 않음
1. CSS 파일 import 확인
2. 브라우저 캐시 삭제
3. 개발자 도구에서 CSS 로드 확인

## 라이선스

MIT
