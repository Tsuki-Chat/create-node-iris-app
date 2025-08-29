# Create Node Iris App

🤖 카카오톡 봇 프로젝트를 위한 Node Iris 템플릿 생성기

## 특징

- 📦 **다양한 템플릿**: 프로젝트 요구사항에 맞는 템플릿 선택
- 🚀 **빠른 시작**: 몇 가지 질문만으로 프로젝트 생성
- 🛠 **패키지 매니저 지원**: npm, pnpm, yarn 지원
- 📝 **자동 설정**: package.json, .env 파일 자동 구성

## 사용법

### Interactive 모드

```bash
npx create-node-iris-app
```

### 직접 프로젝트 이름 지정

```bash
npx create-node-iris-app my-bot
```

### 템플릿 지정

```bash
npx create-node-iris-app my-bot --template simple
```

## 사용 가능한 템플릿

### `simple`

기본 메시지 핸들러와 컨트롤러를 포함한 심플한 봇 템플릿

**포함 기능:**

- Chat, Message 등 사용 가능한 모든 컨트롤러 예제
- 기본 데코레이터 사용 예제

## 프로젝트 생성 후

1. 프로젝트 폴더로 이동

```bash
cd your-project-name
```

2. 의존성 설치 (자동 설치를 선택하지 않은 경우)

```bash
pnpm install
# 또는
npm install
# 또는
yarn install
```

3. `.env` 파일 설정

```env
# Iris URL (IP:PORT 형식)
IRIS_URL=127.0.0.1:3000

# 최대 워커 스레드 수 (선택사항)
MAX_WORKERS=4

# 차단된 사용자 ID 목록 (쉼표로 구분, 선택사항)
BANNED_USERS=123456789,987654321

# KakaoLink 설정 (카카오링크 기능 사용시 필요)
KAKAOLINK_APP_KEY=your_kakao_app_key_here
KAKAOLINK_ORIGIN=your_origin_here

# 로그 레벨 설정
LOG_LEVEL=debug
```

4. 개발 서버 실행

```bash
pnpm run dev
# 또는
npm run dev
# 또는
yarn dev
```

5. 프로덕션 빌드

```bash
pnpm run build
pnpm start
```

## 참조

- [node-iris](https://github.com/Lunatica-Luna/node-iris)

## 라이선스

MIT

**면책 조항**: 이 프로젝트는 교육 및 연구 목적으로만 제공됩니다. 사용자는 모든 관련 법률과 서비스 약관을 준수할 책임이 있습니다.
