# 숲결 공방 (Forest Workshop)

[Marinara-Engine](https://github.com/Pasta-Devs/Marinara-Engine)에 설치하는 독립 공방 게임입니다. `ME-personal`은 제작자가 개인적으로 사용하는 엔진 포크이며, 다른 사용자가 설치해야 하는 필수 엔진이 아닙니다. 이 저장소 `ME-personal-A`는 숲결 공방의 패키지·카탈로그 배포 저장소입니다.

**호환되는 원본 엔진에서는 패키지를 설치하면 홈의 숲결 공방 탭이 자동으로 생깁니다.** 최신 원본 소스에 범용 홈 진입점이 있으므로 모든 사용자가 엔진 내부에 전용 코드를 추가할 필요는 없습니다. 기본 공식 카탈로그에는 이 패키지가 없어 배포 카탈로그를 지정하는 과정이 필요합니다.

- [한국어 설치·연결 안내](packages/forest-workshop/README.md#설치-순서): 카탈로그 설정, 설치, 홈 진입, AI 연결
- [전용 실행 버튼 패치 안내](packages/forest-workshop/README.md#선택-원본-홈에-전용-실행-버튼-추가): 원본 엔진의 홈에 바로가기 버튼 추가
- [패치 파일](patches/marinara-engine-2.5.1-forest-workshop-shortcut.patch) · [대상 버전과 검증 기록](patches/README.ko.md)
- [패키지 매니페스트](packages/forest-workshop/manifest.json) · [변경 내역](packages/forest-workshop/CHANGELOG.md) · [개발 기록](docs/forest-workshop/)

게임을 실행하려면 **홈 → 숲결 공방**을 선택하세요. 채팅에 붙이는 프롬프트 에이전트가 아니라, 설치된 클라이언트·서버로 작동하는 홈 앱입니다.
