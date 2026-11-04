# 전체 검증 — 2026-11-04

기준: PR #31 병합 main 3fd7b12b4 + PR #32의 0.9.3 커밋 62f923064. 저비용 gpt-6-luna 서브에이전트에 전체 회귀, 브라우저 3그룹, 실제 Engine 점검을 분담했다. 로그는 테스트용 /tmp에 기록했고 실제 사용자 세계를 삭제하거나 외부 AI를 호출하지 않았다.

## 최종 통과 범위

- Forest Workshop `*.regression.ts` 전체 26개. npm 기본 명령에 없던 screen-page와 world-delete도 포함했다.
- `*.browser.mjs` 전체 27개. 최초 실패 3개는 아래의 테스트 수정 후 해당 검사만 재실행해 통과했다.
- layout 브라우저 안의 14개 경로·109개 상태·548개 뷰포트/폰트 조합 모두 통과.
- ME-personal 2.5.1 기반 엄격 타입: 서버 88개·클라이언트 73개 파일 통과.
- 전체 `npm run check`, 카탈로그 레인·로케일·ZIP 해시/내용·릴리스 노트·diff 공백 검사 통과. 테스트 수정 후 변경 파일 포맷·린트도 확인했다.

## 발견·보완한 문제

1. `npm run test:forest-workshop`에 screen-page와 world-delete 회귀가 누락되어 있었다. 기본 명령에 두 파일을 추가했다.
2. memory 브라우저 테스트가 필터를 예전 선택 버튼 목록으로 조작했다. 현재 페이지 피커의 이전/다음 화살표로 이동하도록 수정했다. 비공개 기억 숨김·빈 상태·초안 보존·수정/상태 변경 검증은 유지했다.
3. starter-art 테스트가 시작 주민을 선택하지 않은 상태에서 선물 표시를 기대했다. 선택 전에는 숨겨짐을 추가 검증하고 선택 후 기존 그림·폴백 검증을 실행한다.
4. residents 테스트 데이터에 관계 화면이 사용하는 `stories.pairs`가 없었다. 필수 빈 상태를 제공했다. 제품 코드는 변경하지 않았으며 기존 검증은 유지했다.

이번 자동 검사에서 추가 제품 결함은 재현되지 않았다. 이는 모든 실제 이용 상황에 결함이 없다는 뜻은 아니다. 모델 응답은 테스트 어댑터로 제어하며 외부 AI 서비스의 실제 응답 품질·Android 실기기·실제 터치감은 자동 검사로 확인하지 않았다.

## 실행 기록

- `/tmp/fw-full-regressions.log`, `/tmp/fw-full-regressions-summary.json`
- `/tmp/fw-full-browser-core.log`, `/tmp/fw-full-browser-core.json`
- `/tmp/fw-full-browser-story.log`, `/tmp/fw-full-browser-story-summary.json` (memory 재검증은 별도 실행)
- `/tmp/fw-full-browser-layout.log`, `/tmp/fw-full-browser-layout.json`
- `/tmp/fw-full-typecheck.log`, `/tmp/fw-full-baseline.log`, `/tmp/fw-full-baseline.json`

## 실제 Engine 실행

별도 임시 데이터로 ZIP 설치와 실제 Engine 서버 활성화 검증을 완료했다. 테스트 준비 중 잘못 선택된 실행기가 Engine 의존성 설치를 시작해 중지했다. 이후 고정 lockfile 설치로 의존성을 복구했고 원래 Engine 소스에는 변경이 없다. 네트워크 프록시를 반영하지 못한 네이티브 설치 스크립트 오류는 Node의 환경 프록시 사용 설정으로 해결했다.


실제 Engine 2.5.1+b8bf28382b74 서버를 직접 실행해 아래를 확인했다.

- ZIP을 별도 임시 DATA_DIR에 설치하고 package API가 실제로 등록됨을 확인했다.
- 세계 생성(201), 목록, 상태 조회, 삭제 및 반복 삭제가 통과했다. 테스트에서 만든 세계는 정리했다.
- 설치된 `/api/capability-packages/forest-workshop/client` 응답의 SHA-256이 0.9.3 client.js와 일치했다. 종이 패널 에셋은 200/image-webp로 제공됐다.
- 시작한 테스트 서버를 종료했다. 원래 Engine 소스와 사용자 데이터는 변경하지 않았다.

Engine 개발 실행기 `dev.mjs`는 의존성 준비를 재시도하다 `ERR_PNPM_IGNORED_BUILDS`로 막혔다. 소스를 변경하거나 빌드 허용 정책을 우회하지 않고, 설치된 의존성으로 서버를 직접 실행했다. 따라서 **실제 서버/설치 경로는 통과했지만 Engine 앱 전체를 통한 모바일 UI 실행·스크린샷까지 검증한 것은 아니다.** 브라우저 27개와 548개 레이아웃 조합은 패키지 컴포넌트 검사다. 실제 로그인·PWA 설치·오프라인 재시작·외부 AI 모델 호출·Android 기기는 미검증이다.
