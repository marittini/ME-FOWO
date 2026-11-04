# 숲결 공방 (Forest Workshop)

Marinara-Engine에 설치해 실행하는 세로형 공방 게임입니다. 패키지 ID는 `forest-workshop`입니다. 캐릭터·페르소나를 공방 주민으로 맞이하고, 생산·납품·초대·탐험·주민 이야기를 즐길 수 있습니다.

원본 [Pasta-Devs/Marinara-Engine](https://github.com/Pasta-Devs/Marinara-Engine)에 아래 순서대로 설치합니다. 배포 저장소는 [ME-FOWO](https://github.com/marittini/ME-FOWO)입니다.

## 엔진 패치가 반드시 필요한가요?

**최신 원본의 공통 홈 진입점이 있는 빌드는 별도 패치가 필요 없습니다.** 숲결 공방 전용 메뉴가 엔진 소스에 하드코딩되어 있지 않아도, 설치된 패키지의 선언을 읽어 홈 탭과 실행 화면을 만듭니다.

2026-11-04 확인한 원본 2.5.1 소스에는 다음 기능이 있습니다.

| 구성 | 역할 |
| --- | --- |
| 패키지의 `contributions.slots: ["home-browser-tab"]` | 이 패키지가 독립 홈 앱이라고 알립니다. 숲결 공방 배포본에 이미 선언되어 있습니다. |
| 원본의 `selectHomeBrowserPackages()` | 설치·활성 상태와 클라이언트가 준비된 앱을 홈에 표시합니다. |
| 원본의 `HomeBrowserHub` | 앱 탭을 만들고 선택한 패키지를 `CapabilityElement`의 `view="browser"`로 실행합니다. |
| 패키지의 클라이언트·서버 | 실제 게임 화면, 저장, 생산과 AI 생성 등을 제공합니다. |

따라서 먼저 아래 설치 순서를 따르세요. 구버전이나 개인 개조 빌드에서 공통 홈 런타임 자체가 빠졌다면 원본 엔진을 업데이트해야 합니다. 실행 버튼만 추가한다고 저장·모델·패키지 로더가 생기지는 않습니다. 공통 런타임이 있는 소스에 **눈에 잘 띄는 전용 실행 버튼**을 더하고 싶을 때만 뒤의 선택형 패치를 사용합니다.

## 호환성

| 항목 | 요구 사항·확인 범위 |
| --- | --- |
| 패키지 | 현재 문서 기준 0.9.5. 설치할 버전은 배포 카탈로그에 표시된 값을 따릅니다. |
| 엔진 버전 | 매니페스트상 `>=2.5.1 <4.0.0` |
| 호스트 API | 패키지가 요구하는 capability API `1.341`을 지원하는 호환 엔진 |
| 원본 소스 확인 | [Marinara-Engine 2.5.1의 확인 커밋](https://github.com/Pasta-Devs/Marinara-Engine/commit/e5ead06ac2fe1cb3e039f8cab7e4d266b01dac44) |

엔진 표시 버전이 같아도 소스 시점에 따라 호스트 API가 다를 수 있습니다. 버전 숫자만 맞추지 말고 설치 화면의 호환성 판정을 확인하세요. 매니페스트의 `builtAgainst`는 기존 빌드 기준 기록이며 원본 엔진의 지원 기능을 대신 검사해 주는 값이 아닙니다.

원본의 홈 탭·로더·API 선언과 선택형 패치의 적용·TSX 문법은 확인했습니다. 해당 원본 엔진을 새로 설치하고 실제 모델까지 연결하는 전체 실기동 검증을 이번 문서 작업에서 수행한 것은 아닙니다.

## 설치 순서

### 1. 원본 Marinara-Engine 준비

이미 호환되는 원본 엔진을 사용 중이면 새로 설치할 필요가 없습니다. 새 사용자라면 원본의 [공식 설치 안내](https://github.com/Pasta-Devs/Marinara-Engine#installation)에 따라 엔진을 먼저 설치합니다.

이 게임은 `agents.json`만 가져오는 프롬프트 에이전트가 아닙니다. 엔진의 **커스텀 소스 등록**은 에이전트 정의·룰셋을 가져오는 경로이며, 숲결 공방의 `client.js`·`server.mjs`를 함께 설치하는 경로가 아닙니다. 다음 단계의 패키지 카탈로그를 사용하세요.

### 2. 숲결 공방 배포 카탈로그 지정

원본의 기본 공식 카탈로그에는 숲결 공방이 없습니다. 엔진이 읽는 `.env` 파일에 아래 한 줄을 추가하거나, 이미 같은 항목이 있으면 그 값을 수정합니다.

```dotenv
MARINARA_AGENT_CATALOG_URL=https://raw.githubusercontent.com/marittini/ME-FOWO/main/catalog/v2/catalog.json
```

- **소스 설치:** `Marinara-Engine` 프로젝트 루트의 `.env`에 넣습니다.
- **설치 프로그램·별도 서버:** `MARINARA_ENV_FILE`로 설정 파일을 지정한 환경이라면 그 파일을 수정합니다. 다른 폴더의 `.env`를 수정해도 실행 중인 엔진에는 반영되지 않습니다.
- **Docker Compose:** 컨테이너에 전달할 환경 변수로 설정합니다. 아래 Docker 예시를 참고하세요.

이 URL은 **카탈로그 전체를 대체**하며 현재 숲결 공방만 제공합니다. 기존 설정 값을 보관하세요. 공식 카탈로그와 이 목록이 자동으로 합쳐지지는 않습니다. 다른 공식 패키지도 계속 목록에서 설치·업데이트하려는 운영자는 별도의 통합 카탈로그 구성이 필요합니다.

위 주소는 엔진 2.x용입니다. 엔진 3.x에서 호스트 API까지 호환되는 경우에는 `/catalog/v3/catalog.json` 주소를 사용합니다. 이 문서의 원본 소스·패치 확인 대상은 2.5.1입니다.

#### Docker Compose에서 설정하는 경우

기존 `docker-compose.yml`의 `services.marinara.environment` 목록에 **다음 항목을 추가**합니다. 기존 환경 변수와 데이터 볼륨 설정은 유지합니다.

```yaml
- MARINARA_AGENT_CATALOG_URL=https://raw.githubusercontent.com/marittini/ME-FOWO/main/catalog/v2/catalog.json
```

해당 Compose 프로젝트 폴더에서 환경 변수를 반영해 컨테이너를 다시 만듭니다.

```bash
docker compose up -d --force-recreate marinara
```

서비스 이름을 바꿔 사용 중이라면 `marinara` 대신 실제 이름을 넣으세요. 단순 `docker compose restart`로는 바뀐 Compose 환경 변수가 적용되지 않습니다. 원본 기본 컨테이너의 데이터용 `.env`는 `/app/data/.env`가 사용될 수 있으며, 컨테이너 밖 프로젝트의 `.env`와는 다릅니다.

### 3. 엔진 재시작 후 패키지 설치

1. 설정을 바꾼 **엔진 서버 프로세스**를 재시작합니다. 브라우저 새로고침만으로는 서버 환경 변수 설정이 바뀌지 않습니다.
2. 엔진에서 **에이전트 → 에이전트 다운로드** (`Agents → Download Agents`) 화면을 엽니다. 원본의 언어·UI 버전에 따라 이름이 다를 수 있습니다.
3. **앱 / Apps** 분류에서 `Forest Workshop` 또는 `숲결 공방`을 찾습니다. 일반 채팅 에이전트 목록만 보고 있으면 놓칠 수 있습니다.
4. 표시된 권한과 버전을 확인하고 **설치**합니다. 원격 엔진은 해당 엔진의 관리자 권한이 있는 세션에서 설치합니다.
5. 엔진이 재시작을 요구하면 재시작합니다. 이후 클라이언트 화면도 새로고침합니다.

ZIP을 임의 폴더에 풀거나 게임의 `<script>`만 직접 넣는 방식이 아닙니다. 엔진 패키지 매니저가 매니페스트·파일 해시·클라이언트·서버·에셋을 함께 설치하도록 합니다.

### 4. 홈에서 게임 열기

**홈 → 숲결 공방** 탭을 선택합니다. 원본 엔진의 홈 브라우저는 설치된 앱을 자동으로 표시합니다. 대화가 열린 상태라면 먼저 엔진의 홈 화면으로 돌아갑니다.

숲결 공방은 채팅의 활성 에이전트에 추가하는 방식으로 실행하지 않습니다. 패키지가 일반 에이전트 목록에서 숨겨져 있어도 홈 앱 탭에서는 사용할 수 있습니다. 또한 `/api/forest-workshop`은 게임 API이지 별도의 웹페이지 주소가 아닙니다.

### 5. 처음 실행할 때 AI 연결과 주민 설정

1. 엔진 설정에서 사용 가능한 텍스트 모델 연결을 준비합니다.
2. 게임의 첫 진입 안내에서 연결을 확인합니다. 이후에는 **게임 설정 → 관리 → AI 모델 연결 설정**에서 바꿀 수 있습니다.
3. 프로필·이야기·편지에 쓸 연결을 선택합니다. 용도별로 같은 연결 또는 다른 연결을 사용할 수 있습니다.
4. 주민으로 사용할 캐릭터·페르소나를 선택하고 공방 설정을 확인합니다. 시작 주민을 고른 뒤 환영 꾸러미와 공방 진행을 시작합니다.
5. 그림은 사용자가 직접 업로드합니다. 원본 캐릭터·페르소나 아바타를 자동 복사하거나 생성하지 않습니다.

## 선택: 원본 홈에 전용 실행 버튼 추가

**설치 후 홈 탭이 잘 나타난다면 이 절은 건너뛰어도 됩니다.** 아래 패치는 원본 홈의 첫 화면에 숲결 공방 바로가기 버튼 하나를 추가합니다. 설치되어 실행 가능한 숲결 공방이 있을 때만 버튼이 보이며, 누르면 기존 홈 앱 로더로 연결됩니다. 별도 페이지·서버·인증 우회 경로를 만들지 않습니다.

- [패치 다운로드](../../patches/marinara-engine-2.5.1-forest-workshop-shortcut.patch)
- [대상 커밋·수정 위치·검증 범위](../../patches/README.ko.md)

### 소스 환경 준비

이 패치는 배포된 설치 프로그램이나 컨테이너의 실행 파일에 직접 적용하는 파일이 아닙니다. **Git으로 받은 원본 엔진 소스와 다시 빌드할 환경**이 필요합니다. 이미 소스 설치를 사용한다면 그 폴더에서 진행합니다.

새 소스 환경이 필요한 경우, Node.js 24와 Git을 준비한 후 다음과 같이 원본을 받습니다. pnpm은 엔진의 `package.json`에 지정된 버전을 사용합니다.

```bash
git clone https://github.com/Pasta-Devs/Marinara-Engine.git
cd Marinara-Engine
corepack enable pnpm
pnpm install --frozen-lockfile
```

기존 설치에서 소스 설치로 옮긴다면 원본 엔진의 이전 안내에 따라 데이터 경로와 설정을 유지하세요. 새 폴더를 만드는 것만으로 기존 세계·캐릭터·연결 설정이 이동하지는 않습니다.

### 패치 받기

**원본 엔진 루트 폴더**에서 실행합니다.

macOS·Linux·Git Bash:

```bash
curl --fail --location --output ../forest-workshop-entry.patch https://raw.githubusercontent.com/marittini/ME-FOWO/main/patches/marinara-engine-2.5.1-forest-workshop-shortcut.patch
```

Windows PowerShell:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/marittini/ME-FOWO/main/patches/marinara-engine-2.5.1-forest-workshop-shortcut.patch" -OutFile "../forest-workshop-entry.patch"
```

### 적용 확인·구축·실행

엔진을 멈춘 상태에서, 처음 적용하는 경우 아래 순서로 진행합니다.

```bash
git status --short
git switch -c local/forest-workshop-entry
git apply --check ../forest-workshop-entry.patch
git apply ../forest-workshop-entry.patch
pnpm build
pnpm start
```

`git apply --check`가 실패하면 적용 단계로 넘어가지 마세요. 파일 구조가 다른 버전이거나 이미 적용된 경우일 수 있습니다. 패치 때문에 기존 작업을 초기화하지 말고 대상 버전을 확인합니다.

엔진 루트의 카탈로그 설정은 앞 절과 동일하게 필요합니다. 브라우저에서 엔진을 열고 패키지를 설치·활성화한 다음 홈 첫 화면의 숲결 공방 버튼을 확인하세요. 이 버튼은 준비된 패키지만 표시하므로 설치 전에는 보이지 않습니다.

소스 수정 후에는 `pnpm build`로 클라이언트를 다시 빌드해야 합니다. 개발 실행을 선택한다면 `pnpm dev`를 사용할 수 있습니다. Docker에서 패치를 쓰려면 수정한 소스로 이미지를 직접 빌드해야 하며 기본 `latest` 이미지를 다시 받는 것만으로 패치가 들어가지는 않습니다.

엔진 업데이트 후에는 로컬 패치가 유지됐는지 확인합니다. 위 패치는 특정 원본 소스 기준이므로 다른 버전에서 그대로 적용된다고 보장하지 않습니다.

### 패치 되돌리기

같은 원본 엔진 폴더에서 실행합니다.

```bash
git apply --reverse --check ../forest-workshop-entry.patch
git apply --reverse ../forest-workshop-entry.patch
pnpm build
```

그다음 서버를 다시 시작합니다. 이 작업은 전용 바로가기만 제거합니다. 원본의 일반 홈 탭과 이미 설치한 숲결 공방의 데이터는 이 패치에서 수정하지 않습니다.

### 직접 다른 화면에 진입점을 만드는 개발자에게

숲결 공방 ID를 엔진의 모든 곳에 하드코딩할 필요는 없습니다. 호환되는 호스트에서는 설치 상태를 확인한 뒤 기존 `CapabilityElement`에 아래 값을 전달하는 것이 핵심입니다.

```tsx
<CapabilityElement
  packageId="forest-workshop"
  view="browser"
  className="block h-full min-h-0 w-full"
  capabilityProps={{ style: { display: "block", width: "100%", height: "100%" } }}
/>
```

이는 원본의 `packages/client/src/components/capabilities/CapabilityElement.tsx`를 사용하는 **연결 코드의 핵심 부분**이며 그 자체가 완성된 화면 패치는 아닙니다. 설치·활성·재시작 상태 판정과 패키지 클라이언트 로딩은 기존 호스트 흐름을 따르고, 부모 컨테이너에도 실제 높이를 확보해야 합니다. 위의 선택형 패치는 이미 있는 `HomeBrowserHub`의 상태 판정·마운트·포커스 처리를 재사용합니다.

`HomeBrowserHub`, `selectHomeBrowserPackages`, capability API 1.341 등 기반이 없는 엔진에는 이 JSX나 버튼만 추가해도 실행되지 않습니다. 그런 경우 호환되는 원본 버전으로 업데이트하거나 해당 호스트 기능을 먼저 구현해야 합니다.

## 실행이 안 될 때

| 증상 | 확인할 내용 |
| --- | --- |
| 다운로드 목록에 숲결 공방이 없음 | 실행 중인 서버가 읽는 `.env` 또는 컨테이너 환경 변수, 카탈로그 주소, 서버 재시작, 앱 분류·검색 필터를 확인합니다. |
| 커스텀 소스에 저장소를 등록했는데 게임이 없음 | 정의 파일 가져오기와 실행형 패키지 설치는 다릅니다. 위 카탈로그 설치 경로를 사용합니다. |
| 설치했지만 홈 탭이 없음 | 재시작 요구를 처리하고 화면을 새로고침합니다. 설치 상태가 활성인지, 호스트 API가 호환되는지, 원본의 공통 홈 탭 기능이 있는지 확인합니다. |
| `unsupported capability API` 또는 호스트 멤버 없음 | 전용 버튼 문제가 아닙니다. 요구 API를 지원하는 엔진으로 업데이트합니다. |
| 게임 API가 404 또는 활성화 실패 | 패키지 서버 모듈이 로드됐는지 서버 로그와 설치 상태를 확인합니다. HTML 파일만 따로 여는 방식으로 해결되지 않습니다. |
| 게임은 열리지만 생성 실패 | 엔진의 모델 연결과 용도별 선택을 확인합니다. 오류 안내에서 연결을 고른 뒤 재시도할 수 있습니다. |
| 패치가 적용되지 않음 | 원본 소스의 버전·파일 구조와 이미 적용했는지 확인합니다. 선택형 바로가기가 없어도 기본 홈 탭으로 실행할 수 있습니다. |

## 현재 게임 기능

- 세계를 여러 개 만들고 전환·삭제할 수 있습니다. 삭제는 이름이 표시된 확인창에서 확정하며, 다른 세계·원본 카드·공용 갤러리·내보낸 백업을 보존합니다.
- 캐릭터·페르소나를 공방 주민으로 재구축합니다. 새 프로필은 종족·성격·말투·관계 중심으로 1,500자 이내 요약을 요청하며, 기존에 직접 수정한 설정은 유지합니다.
- 5개 생산 분야와 제작법을 제공합니다. 기본 자동 생산, 전체 시설의 공통 목표 재고, 목표 물품의 재료 트리 적용을 지원합니다. 수동 켜기·재고·우선순위 설정은 펼쳐서 바꿀 수 있고, 횟수 대기열은 제거했습니다. 잠긴 시설은 별도로 해금합니다.
- 페어를 지정하면 두 공방 프로필을 바탕으로 현재 관계와 3편짜리 이야기 계획을 준비합니다. 근거 없는 공유 과거나 연애 관계를 만들지 않도록 하며 기존에 진행한 관계·발행한 장면은 보존합니다.
- 조사·순찰 후 주민 편지를 자동 준비합니다. 신뢰·알고 있는 기억·같은 주민의 이전 편지를 참고하며, 실패한 생성은 기록을 남기고 연결 선택과 재시도를 제공합니다. 알려진 실패를 다시 열었다고 자동 재호출하지 않습니다.
- 홈에는 영입 주민 중 1~6명을 표시합니다. 인원과 관계없이 크기·이동 영역을 유지하고 여섯 경로·42초 주기·발 위치에 따른 앞뒤 순서를 적용합니다. 주민을 누르면 이동을 멈추지 않고 기분 아이콘을 표시합니다.
- 집 옆 게시판으로 오늘의 납품을 열고 지면 편집에서 게시판 위치를 조절할 수 있습니다. 날씨는 기본 서울을 포함한 선택 도시의 현재 정보와 연결하며, 15분마다 갱신합니다.
- Jua 글꼴과 라이선스, 계절 표시·9종 이야기 배경·주민 상세 팝업·편집 가능한 공방 표시 이름·화살표 페이지 이동을 제공합니다.
- 창고와 판매품 분류, 재고 보호·자동 판매, 초대·돌파, 기억·AI 지침 관리, 주민 그림과 이야기를 포함한 백업을 제공합니다.
- 무료 티켓 상점에서 10·100·1,000장 묶음을 받을 수 있습니다. 결제·광고·일일 수령 제한이 없으며 골드 교환은 티켓 1장당 100골드입니다. 중복 네트워크 요청은 한 번만 반영합니다.
- 공방 배경음악과 효과음은 각각 음소거·볼륨을 조절할 수 있습니다. 사용자 조작 후 재생하며 화면이 숨겨지면 일시 정지합니다.

## 저장 데이터와 업데이트

업데이트 전 게임의 **설정 → 저장·백업**에서 백업을 내보낼 수 있습니다. 현재 저장 스키마는 15이며 이전 세계는 순차 이전합니다. 이전 패키지는 새 스키마로 저장한 세계를 읽지 못하므로 버전을 되돌릴 때는 이전 백업이 필요합니다.

스키마 13에서는 기존 제작법을 한 번 활성화하고 시작 전 횟수 요청을 정리했으며, 진행 중 작업·목표·우선순위는 유지했습니다. 이후 수동 끄기는 보존합니다. 스키마 14에서는 기존 목표 중 최댓값을 공통 목표로 채택하면서 작업·켜짐·재고·재화를 유지했습니다.

게임은 엔진의 패키지 문서 `fw-world`·`fw-command`·`fw-story` 등을 사용합니다. 주민 그림은 Global Gallery에 저장하고 참조를 유지합니다. 게임이나 바로가기 패치는 원본 캐릭터·페르소나를 수정하거나 아바타를 복사·생성하지 않습니다.

## 개발·연결 구조 참고

- [원본 홈 앱 선택기](https://github.com/Pasta-Devs/Marinara-Engine/blob/e5ead06ac2fe1cb3e039f8cab7e4d266b01dac44/packages/client/src/hooks/use-capability-packages.ts)
- [원본 홈 브라우저·패키지 마운트](https://github.com/Pasta-Devs/Marinara-Engine/blob/e5ead06ac2fe1cb3e039f8cab7e4d266b01dac44/packages/client/src/components/chat/HomeBrowserHub.tsx)
- [원본 패키지 API·홈 슬롯 스키마](https://github.com/Pasta-Devs/Marinara-Engine/blob/e5ead06ac2fe1cb3e039f8cab7e4d266b01dac44/packages/shared/src/schemas/capability-package.schema.ts)
- [패키지 매니페스트](manifest.json) · [변경 내역](CHANGELOG.md) · [개발 기록](../../docs/forest-workshop/)

게임 소스는 `src/engine/`에 있습니다. 패키지를 개발·재빌드하는 사람만 이 배포 저장소의 개발 의존성과 Engine 소스 경로가 필요합니다. 일반 사용자는 위 설치 절만 따르면 됩니다.

```bash
MARINARA_ENGINE_ROOT=/path/to/Marinara-Engine node scripts/build-feature-packages.mjs forest-workshop
```

생성된 `client.js`·`server.mjs`·매니페스트·ZIP·카탈로그는 직접 수정하지 않고 빌더로 재생성합니다.
