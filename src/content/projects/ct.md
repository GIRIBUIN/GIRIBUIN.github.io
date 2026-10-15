---
slug: "ct"
title: "ct"
ownership: {"type":"personal","teamSize":null}
category: "CLI"
cardTech: ["Go","VS Code"]
featured: false
section: "tools"
order: 40
trace: {"input":"언어별 풀이 파일·환경 준비","decision":"파일 보존 + 진단·설치 분리","output":"템플릿과 환경 진단 CLI"}
tech: ["Go","JSON","GitHub Actions","VS Code"]
summary: "풀이 파일 생성, VS Code 연동과 환경 진단을 제공하는 개인 실사용 도구입니다. Windows·Linux 바이너리를 배포했습니다."
links: {"demo":null,"source":"https://github.com/GIRIBUIN/ct","release":"https://github.com/GIRIBUIN/ct/releases/tag/v0.3.1","video":"https://youtu.be/NN1xVfZOhDg?si=binFhCB4yua3H-Tc","caseStudy":null}
demo: {"type":"terminal","url":"/videos/projects/ct/demo.mp4","format":"video"}
logo: null
thumbnail: null
hidden: false
oneLine: "풀이 파일 생성·VS Code 실행·환경 진단을 돕는 CLI"
problem: "언어별 풀이 파일과 개발환경의 반복 준비"
decision: "기존 파일 보존, 환경 진단과 설치 계획 분리"
result: "v0.3.1 Windows·Linux 바이너리 공개 배포"
translations: {"en":{"oneLine":"A CLI for solution files, VS Code launch, and environment checks.","summary":"Generates solution files, opens VS Code, and diagnoses the local environment. Used personally and released for Windows and Linux.","problem":"Repeated setup of solution files and language environments.","decision":"Preserve existing files; separate diagnosis from installation.","result":"Published v0.3.1 binaries for Windows and Linux.","trace":{"input":"Repeated coding workspace setup","decision":"Preserve files; separate checks + setup","output":"Templates + environment-check CLI"}}}
---

## 개발 배경

코딩테스트를 풀 때마다 파일·컴파일 환경·VS Code 작업 폴더를 준비하는 과정이 번거로워 만든 Go CLI입니다. 혼자 개발하고 직접 사용하면서 풀이 생성과 환경 관리 기능을 확장했습니다.

문제 입력, 설정·템플릿, 파일 생성과 편집기 연결의 책임을 나눴습니다. 머신별 설정과 풀이 파일의 저장 위치도 분리했습니다.

## 주요 설계 결정

- 같은 문제를 다시 실행해도 기존 풀이 파일을 덮어쓰지 않습니다.
- doctor는 환경을 진단하고, setup은 계획을 보여준 뒤 설치합니다.
- 내장 정의를 수정하지 않고 사용자 언어·플랫폼을 등록할 수 있습니다.

CLI·템플릿·레지스트리·VS Code 연동부터 테스트·설치 스크립트·릴리스까지 직접 담당했습니다. 반복해서 쓰는 도구인 만큼 새 기능보다 기존 파일을 보존하고 변경 전에 동작을 알 수 있도록 하는 데 신경 썼습니다.

## 결과 및 한계

Windows·Linux 바이너리를 공개 배포했고 개인적으로 사용하며 개선하고 있습니다. 기존 파일 보존과 환경 진단을 테스트하고 있지만, 모든 OS의 깨끗한 설치 재현이나 외부 사용자 성과까지 확인한 단계는 아닙니다.
