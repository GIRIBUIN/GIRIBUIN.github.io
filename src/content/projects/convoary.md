---
slug: "convoary"
title: "Convoary"
ownership: {"type":"personal","teamSize":null}
category: "Browser Extension"
cardTech: ["TypeScript","React","WebExtensions","Dropbox API"]
featured: false
section: "tools"
order: 80
tech: ["TypeScript","React","Vite","WebExtensions","Dropbox API","Web Crypto","Vitest","Playwright"]
summary: "ChatGPT 대화를 탐색기처럼 정리하는 브라우저 확장입니다. 중첩 폴더·검색·다중 선택과 로컬 저장, 선택적 Dropbox 암호화 동기화를 제공합니다."
oneLine: "AI 대화를 폴더로 정리하고 검색하는 탐색기형 브라우저 확장"
problem: "길어진 대화 목록에서 필요한 대화를 다시 찾고 주제별로 정리하기 어려움"
decision: "원본 대화와 정리 데이터를 분리하고 로컬 저장을 기본으로 선택적 암호화 동기화 제공"
result: "Chrome·Edge·Firefox·Zen용 v0.1 alpha와 시연 영상 공개"
links: {"demo":null,"source":"https://github.com/GIRIBUIN/convoary","release":"https://github.com/GIRIBUIN/convoary/releases","video":"https://youtu.be/8-YvxsedAxQ","caseStudy":null}
demo: {"type":"video","url":"/videos/projects/convoary/demo.mp4"}
logo: null
thumbnail: null
hidden: false
translations:
  en:
    summary: "An Explorer-style browser extension for ChatGPT conversations, with nested folders, search, multi-selection, local storage, and optional encrypted Dropbox sync."
    oneLine: "An Explorer-style browser extension for organizing and finding AI conversations."
    problem: "Finding and organizing conversations becomes difficult as the chat list grows."
    decision: "Keep organization separate from source chats, save locally, and offer optional encrypted sync."
    result: "Published a v0.1 alpha for Chrome, Edge, Firefox, and Zen, with a demo video."
---

## 개발 배경

ChatGPT 대화가 쌓이면 필요한 대화를 다시 찾거나 주제별로 묶어 관리하기 어렵습니다. 대화 목록을 파일 탐색기처럼 정리하고, 필요한 대화를 원래 서비스에서 바로 열 수 있도록 Convoary를 만들었습니다.

현재는 ChatGPT를 지원하는 개인 프로젝트입니다. 별도 탐색기 창에서 대화의 제목·링크·폴더·색상·즐겨찾기를 관리하며, 원본 대화는 수정하지 않습니다.

## 주요 기능

- 중첩 폴더, 즐겨찾기와 색상으로 대화를 분류하고 검색·필터·정렬로 찾습니다.
- 다중 선택, 드래그 앤 드롭, 인라인 이름 변경과 키보드 단축키로 여러 항목을 정리합니다.
- 화면에 표시된 사이드바, 현재 대화 또는 열린 탭에서 대화를 가져옵니다.
- 워크스페이스와 테마를 JSON으로 내보내고 가져올 수 있으며, 로컬 백업을 제공합니다.
- 사용자가 연결한 Dropbox 계정으로 브라우저·기기 간 정리 데이터를 암호화해 동기화할 수 있습니다.

## 구현 구조와 설계 결정

TypeScript·React로 탐색기 UI를 구성하고, WebExtensions API로 별도 창·탭·로컬 저장소를 연결했습니다. 사이트에서 정보를 읽는 content script, 가져오기를 조율하는 background, 탐색기 UI, 폴더·대화 상태 모델, 저장·동기화 모듈을 나눴습니다. Vite에서 Chromium과 Firefox용 빌드를 생성합니다.

정리 데이터는 확장 프로그램의 로컬 저장소에 먼저 저장합니다. 대화 이름을 바꾸거나 폴더를 이동해도 ChatGPT의 원본 대화에는 반영하지 않으며, 대화 본문을 동기화 대상으로 삼지 않습니다. JSON 가져오기와 저장 데이터는 구조를 검증하고, 복구·마이그레이션 과정에서는 원본 백업을 남깁니다.

Dropbox 동기화는 필수 서버 없이 사용자의 계정에 직접 연결하는 선택 기능입니다. OAuth PKCE로 연결하고, 워크스페이스·테마·일부 설정을 기기에서 AES-GCM-256으로 암호화합니다. 복호화용 Sync Key는 Dropbox에 저장하지 않고, 다른 기기에서 같은 키를 입력해 사용하도록 했습니다.

동기화에서는 Dropbox revision 조건으로 오래된 데이터가 원격 파일을 덮어쓰는 것을 막습니다. 원격 데이터를 적용하기 전에 검증과 로컬 백업을 수행하고, 양쪽이 바뀐 충돌은 사용자가 선택하도록 했습니다. 네트워크나 인증에 실패해도 로컬 데이터와 미반영 변경은 유지합니다.

## 현재 상태와 한계

Chrome·Edge·Firefox·Zen용 v0.1 alpha를 공개했으며, 아직 확장 스토어 설치 대신 압축 파일을 직접 로드하는 방식입니다. Firefox·Zen의 서명되지 않은 임시 설치는 브라우저를 다시 시작하면 해제됩니다. OpenAI와 제휴하지 않은 독립 프로젝트입니다.

대화 가져오기는 ChatGPT 화면 구조에 의존하므로 모든 대화를 빠짐없이 수집한다고 보장하지 않습니다. Dropbox 연결은 Full Dropbox 권한을 요청하며, 전용 동기화 파일만 사용하는 제한은 애플리케이션 코드에서 적용합니다. Sync Key를 잃으면 Dropbox에서 복구할 수 없습니다.

Vitest 단위 테스트와 Playwright 브라우저 검증 스크립트를 구성했습니다. 자동 검증은 합성 데이터와 모의 API 응답을 사용하므로 실제 계정의 OAuth·기기 간 동기화 확인과는 구분합니다.
