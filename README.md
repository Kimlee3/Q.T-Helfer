# Q.T-Helfer

Q.T-Helfer는 매일의 묵상 말씀과 사용자 간의 소통을 위한 게시판 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **오늘의 말씀:** 매일 업데이트되는 묵상 말씀을 제공합니다.
- **게시판:** 사용자 간의 자유로운 소통과 정보 공유를 위한 공간입니다.

## 게시판 영구 저장

공개 게시판은 서버가 꺼져도 유지되어야 하므로 Postgres 계열 DB 연결을 권장합니다. `DATABASE_URL`이 없으면 Vercel production에서는 새 글 저장을 막아, 사용자가 사라질 글을 저장했다고 착각하지 않도록 합니다.

권장 설정:

```bash
npx vercel env add DATABASE_URL production
npx vercel --prod
```

지원하는 환경 변수 이름:

- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `NEON_DATABASE_URL`
- `QT_BOARD_ADMIN_TOKEN` 선택 사항. 관리자 수정/삭제가 필요할 때만 설정합니다.

로컬 테스트에서만 임시 메모리 저장을 허용하려면:

```bash
ALLOW_MEMORY_POSTS=true
```

게시글은 로그인 없이도 안전하게 다루기 위해 작성 시 브라우저에 수정 토큰을 저장합니다. 사용자는 같은 브라우저에서 작성한 글만 수정/삭제할 수 있고, 공개 목록에는 이 토큰이 노출되지 않습니다.
