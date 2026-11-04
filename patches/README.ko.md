# 원본 Marinara-Engine용 숲결 공방 바로가기 패치

## 대상과 목적

[marinara-engine-2.5.1-forest-workshop-shortcut.patch](marinara-engine-2.5.1-forest-workshop-shortcut.patch)는 원본 홈 첫 화면에 전용 실행 버튼을 추가하는 **선택형 UI 패치**입니다. 최신 원본은 이미 패키지의 `home-browser-tab` 선언으로 탭을 만들기 때문에 기본 설치에 필수인 패치가 아닙니다.

- 원본: `Pasta-Devs/Marinara-Engine`
- 소스 표시 버전: 2.5.1
- 확인 커밋: `e5ead06ac2fe1cb3e039f8cab7e4d266b01dac44`
- 대상 파일: `packages/client/src/components/chat/HomeBrowserHub.tsx`
- 원본 파일 Git blob: `e1dd81cc666bd575026ccfe9a6e19b64d0db34c6`
- 확인 날짜: 2026-11-04

준비된 홈 앱 목록 중 `forest-workshop`만 찾아 버튼을 표시합니다. 표시 이름과 접근성 이름은 설치된 패키지의 지역화된 메타데이터를 사용합니다. 누르면 기존 `selectTab()`으로 전환하고 기존 콘텐츠 패널에 포커스를 옮깁니다. 직접 스크립트를 삽입하거나 패키지 API·저장·권한·인증을 수정하지 않습니다.

이 패치는 홈 로더·패키지 SDK 자체가 없는 구버전에 그 기능을 이식하지 않습니다. 다른 버전이나 개인 개조 소스에서는 적용 전 문맥을 확인해야 합니다.

## 적용과 되돌리기

[한국어 설치 안내](../packages/forest-workshop/README.md#선택-원본-홈에-전용-실행-버튼-추가)를 따릅니다. 패치를 원본 엔진 폴더의 상위에 `forest-workshop-entry.patch`로 받은 경우, **엔진 루트**에서 실행합니다.

```bash
git apply --check ../forest-workshop-entry.patch
git apply ../forest-workshop-entry.patch
pnpm build
pnpm start
```

되돌릴 때는 다음과 같이 적용 내용을 먼저 확인합니다.

```bash
git apply --reverse --check ../forest-workshop-entry.patch
git apply --reverse ../forest-workshop-entry.patch
pnpm build
```

## 검증 범위

확인 커밋의 실제 원본 파일을 사용했습니다. 원본 파일의 Git blob을 대조하고, 별도 임시 작업 폴더에서 정방향 `git apply --check`·적용·결과 대조·역방향 `--check`·복원을 확인했습니다. 패치한 전체 TSX 파일은 esbuild로 문법 변환을 검사했습니다.

원본의 `selectHomeBrowserPackages()`가 설치 상태·클라이언트·홈 선언을 검사하고, 홈이 `CapabilityElement`에 `view="browser"`를 전달하는 구조도 확인했습니다. 서버의 패키지 문서·트랜잭션·자료 읽기·모델·특권 경로 등록 API가 공개 호스트 계약에 있음을 소스에서 확인했습니다.

원본 엔진 전체의 의존성 설치·프로덕션 빌드·실기동·실제 모델 연결·실기기 조작을 이번 패치 문서 작업에서 수행한 것은 아닙니다. 정적 소스 및 패치 적용 검증을 전체 실행 호환성 검증으로 표현하지 않습니다.
