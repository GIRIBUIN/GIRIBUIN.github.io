---
slug: "kutodo"
title: "KUTODO"
ownership: {"type":"team","teamSize":3}
category: "Android"
cardTech: ["Flutter","WebView","Drift / SQLite"]
featured: true
section: "work"
order: 60
trace: {"input":"eCampus HTML + 로컬 Task","decision":"원본 비교 후 선택 반영","output":"개인 일정과 학업 일정 통합"}
hidden: false
logo: "/images/projects/kutodo/icon.png"
thumbnail: "/images/projects/kutodo/thumbnail.png"
tech: ["Flutter","Dart","WebView","Drift / SQLite","HTML parsing"]
oneLine: "eCampus HTML 일정을 로컬 Task와 비교·선택 반영하는 Android 앱"
summary: "로그인 세션, HTML 수집·파싱, sourceKey 비교와 로컬 데이터 계층을 담당하고 팀 UI를 실제 데이터에 연결했습니다."
problem: "공개 API 없는 LMS 정보를 개인 일정과 연결"
decision: "WebView 세션으로 수집하고 원본 필드를 비교해 선택 반영"
result: "파싱·분류·반영 정책의 자동화 테스트 확인. 실제 계정 E2E는 미검증"
demo: {"type":"apk","url":null}
links: {"demo":null,"source":"https://github.com/GIRIBUIN/KU_GRADUATION_PROJECT","release":"https://github.com/GIRIBUIN/KU_GRADUATION_PROJECT/releases/tag/Ku-todo","video":null,"caseStudy":null}
translations: {"en":{"oneLine":"An Android app that compares eCampus HTML tasks with local tasks for selective sync.","summary":"Built session handling, HTML collection and parsing, source-key comparisons, and local data integration with the team’s UI.","problem":"Integrate LMS tasks without a public API.","decision":"Use WebView sessions and compare source fields before selective import.","result":"Parser and sync policies have automated coverage; live-account E2E remains unverified.","trace":{"input":"eCampus HTML + local tasks","decision":"Compare source fields before import","output":"Academic + personal task management"}}}
---

## 프로젝트 소개

e-campus의 과제와 개인 할 일을 한 앱에서 관리하려는 3인 졸업 프로젝트입니다. 공식 공개 API가 없어 로그인 후 HTML을 읽어야 하며, 원본 변경을 로컬 데이터에 어떻게 반영할지가 중요한 문제였습니다.

## e-campus 동기화

```mermaid
flowchart TB
  accTitle: KUTODO e-campus 동기화 흐름
  accDescr: WebView 로그인으로 얻은 쿠키 세션을 사용해 HTTP로 e-campus HTML을 수집하고 파싱합니다. 로컬 Task와 비교한 결과를 preview로 보여주며 사용자가 선택한 항목만 Drift와 SQLite에 반영합니다.
  L["WebView · e-campus 로그인"] -->|쿠키 세션| H["HTTP 수집 · HTML 파싱"]
  H --> C["sourceKey · 원본 필드 비교"]
  D[("Drift / SQLite · 로컬 Task")] -->|기존 항목| C
  C --> P["동기화 preview · 선택 반영"]
  P -->|선택한 변경 저장| D
```

가져온 목록을 바로 덮어쓰지 않고, 비교 결과를 preview로 보여준 뒤 사용자가 선택한 항목을 반영합니다.

## 담당 역할과 주요 설계 결정

WebView 세션 처리, HTTP 수집·HTML 파싱, sourceKey 비교와 Drift/SQLite 데이터 계층을 담당했습니다. 팀원이 만든 UI를 실제 데이터에 연결하고 필요한 작업 생성·상세 화면도 구현했습니다.

개인 할 일과 e-campus 할 일은 같은 Task 모델에 저장하되 출처와 원본 필드를 구분했습니다. sourceKey로 같은 항목을 식별하고 원본 변경을 비교해 재동기화 때 반영 대상을 판단합니다.

수집 오류를 항목 삭제나 완료로 오해하지 않도록 누락 항목 처리에는 성공한 수집·오류 여부·마감 조건을 확인하는 방어 정책을 두었습니다.

## 현재 상태

프로젝트는 진행 중입니다. 파싱·동기화·저장 로직에 테스트를 구성하고 중간 beta APK를 공개했지만, 실제 계정의 전체 동기화와 Android 알림·위젯 통합까지 검증을 마친 단계는 아닙니다. UI 전체와 홈 위젯은 팀원 작업이 포함된 범위이며, 통합 상태를 더 점검해야 합니다.
