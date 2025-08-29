# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 개발 환경 설정

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env` 파일을 수정하여 봇 설정을 완료하세요:

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

### 3. 개발 서버 실행

```bash
pnpm run dev
```

### 4. 프로덕션 빌드

```bash
pnpm run build
pnpm start
```

## 프로젝트 구조

```
src/
├── controllers/          # 컨트롤러 클래스들
│   ├── CustomChatController.ts         # 모든 채팅 이벤트 핸들러
│   ├── CustomMessageController.ts      # 메시지 핸들러
│   ├── CustomNewMemberController.ts    # 새 멤버 입장 핸들러
│   ├── CustomDeleteMemberController.ts # 멤버 퇴장 핸들러
│   ├── CustomFeedController.ts         # 피드 핸들러
│   ├── CustomUnknownController.ts      # Unknown 명령어 핸들러
│   └── CustomErrorController.ts        # 에러 핸들러
├── app.ts               # 봇 인스턴스 설정
└── index.ts             # 애플리케이션 진입점
```

## 컨트롤러 가이드

### 채팅 컨트롤러 (CustomChatController)

모든 채팅 이벤트를 포괄적으로 처리하는 컨트롤러입니다.

```typescript
@ChatController
export default class CustomChatController {
  @Command
  async onChatEvent(context: ChatContext) {
    // 모든 채팅 이벤트에 대한 공통 처리
    this.logger.debug("Chat event received");
  }
}
```

### 메시지 컨트롤러 (CustomMessageController)

일반 메시지를 처리하는 컨트롤러입니다.

```typescript
@MessageController
@Prefix("!")
export default class CustomMessageController {
  @BotCommand("안녕", "인사 명령어")
  async hello(context: ChatContext) {
    await context.reply("안녕하세요!");
  }
}
```

### 새 멤버 컨트롤러 (CustomNewMemberController)

새로운 멤버가 채팅방에 입장했을 때의 이벤트를 처리하는 컨트롤러입니다.

```typescript
@NewMemberController
export default class CustomNewMemberController {
  @Command
  async onNewMember(context: ChatContext) {
    await context.reply("새로운 멤버를 환영합니다! 🎉");
  }
}
```

### 멤버 퇴장 컨트롤러 (CustomDeleteMemberController)

멤버가 채팅방에서 퇴장했을 때의 이벤트를 처리하는 컨트롤러입니다.

```typescript
@DeleteMemberController
export default class CustomDeleteMemberController {
  @Command
  async onDeleteMember(context: ChatContext) {
    this.logger.info("Member left the chat");
    // 퇴장 멤버 처리 로직
  }
}
```

### 피드 컨트롤러 (CustomFeedController)

채팅방 이벤트(입장, 퇴장 등)를 처리하는 컨트롤러입니다.

```typescript
@FeedController
export default class CustomFeedController {
  @OnInviteUserFeed
  async onUserJoin(context: ChatContext) {
    await context.reply("새로운 멤버가 들어왔습니다!");
  }
}
```

### 에러 컨트롤러 (CustomErrorController)

봇에서 발생하는 에러를 처리하는 컨트롤러입니다.

```typescript
@ErrorController
export default class CustomErrorController {
  @Command
  async onError(context: ChatContext) {
    this.logger.error("Error occurred:", context);
    // 에러 처리 로직
  }
}
```

### Unknown 컨트롤러 (CustomUnknownController)

등록되지 않은 명령어나 알 수 없는 요청을 처리하는 컨트롤러입니다.

```typescript
@UnknownController
export default class CustomUnknownController {
  @Command
  async onUnknown(context: ChatContext) {
    await context.reply("알 수 없는 명령어입니다.");
  }
}
```

## 사용 가능한 데코레이터

### 클래스 데코레이터

- `@ChatController`: 모든 채팅 이벤트 처리
- `@MessageController`: 메시지 이벤트 처리
- `@NewMemberController`: 새 멤버 입장 이벤트 처리
- `@DeleteMemberController`: 멤버 퇴장 이벤트 처리
- `@FeedController`: 피드 이벤트 처리
- `@UnknownController`: 알 수 없는 명령어 처리
- `@ErrorController`: 에러 이벤트 처리

### 메소드 데코레이터

- `@BotCommand('명령어', '설명')`: 봇 명령어 등록
- `@Command`: 컨트롤러에 이벤트가 수신된 경우 자동으로 실행되는 명령어로 등록
- `@Prefix('!')`: 컨트롤러의 기본 prefix 설정
- `@HelpCommand('도움말')`: 도움말 명령어 등록
- `@OnMessage`: 모든 메시지에 반응
- `@OnPhotoMessage`: 사진 메시지에만 반응
- `@OnFeedMessage`: 피드 메시지에만 반응
- `@Throttle(횟수, 시간)`: 명령어 사용 빈도 제한

### 조건부 데코레이터

- `@HasParam`: 파라미터가 있는 메시지만 처리
- `@IsReply`: 답장 메시지만 처리
- `@IsAdmin`: 관리자만 사용 가능
- `@HasRole(['HOST', 'MANAGER'])`: 특정 역할만 사용 가능

## 예제

### 기본 명령어

```typescript
@BotCommand('안녕', '인사 명령어')
async hello(context: ChatContext) {
  await context.reply('안녕하세요!');
}
```

### 파라미터가 있는 명령어

```typescript
@BotCommand('반복', '메시지 반복')
@HasParam
async echo(context: ChatContext) {
  const message = context.message.param;
  await context.reply(`반복: ${message}`);
}
```

### 관리자 전용 명령어

```typescript
@BotCommand('공지', '공지사항 전송')
@IsAdmin // 또는 @HasRole(['HOST', 'MANAGER'])
@HasParam
async announce(context: ChatContext) {
  const announcement = context.message.param;
  await context.reply(`📢 공지: ${announcement}`);
}
```

### 사용 빈도 제한

```typescript
@BotCommand('날씨', '날씨 정보 조회')
@Throttle(3, 60000) // 1분에 3번만 허용
async weather(context: ChatContext) {
  await context.reply('오늘 날씨는 맑습니다!');
}
```

## 참조

- [node-iris](https://github.com/Lunatica-Luna/node-iris)

## 문제 해결

### 봇이 연결되지 않는 경우

1. `.env` 파일의 설정값들이 올바른지 확인
2. 카카오 계정의 2단계 인증 설정 확인
3. API 키가 유효한지 확인

### 명령어가 작동하지 않는 경우

1. 컨트롤러가 올바르게 등록되었는지 확인
2. prefix 설정이 올바른지 확인
3. 데코레이터가 올바르게 적용되었는지 확인

## 라이선스

MIT

**면책 조항**: 이 프로젝트는 교육 및 연구 목적으로만 제공됩니다. 사용자는 모든 관련 법률과 서비스 약관을 준수할 책임이 있습니다.
