---
slug: "review-analyzer"
title: "Review Analyzer"
ownership: {"type":"team","teamSize":3}
category: "Web"
cardTech: ["Python","Flask","MySQL"]
featured: false
section: "tools"
order: 30
trace: {"input":"상품 URL + 관심 키워드","decision":"분석 결과와 개인 저장 관계 분리","output":"리뷰 요약 + 개인 라이브러리"}
tech: ["Python","Flask","MySQL","JavaScript"]
summary: "MySQL, Flask 세션·라우트와 개인 라이브러리를 담당하고 팀의 수집·분석 결과를 UI에 통합했습니다."
visual: {"url":"/images/projects/review-analyzer/reference.png","alt":"기존 포트폴리오의 Review Analyzer 상품 URL 및 키워드 입력 참고 화면","caption":"기존 포트폴리오 참고 화면 / 최종 구현 검증 자료 아님"}
links: {"demo":null,"source":"https://github.com/GIRIBUIN/Review-Analyzer","release":null,"video":"https://youtu.be/Dqj01tUyWdQ?si=Hp_Wj2bwxYAjc2qD","caseStudy":null}
demo: {"type":"video","url":"/videos/projects/review-analyzer/demo.mp4"}
logo: null
thumbnail: null
hidden: false
oneLine: "상품 URL·키워드로 리뷰를 수집·요약하는 웹 프로토타입"
problem: "많은 리뷰에서 관심 키워드의 장단점 파악"
decision: "분석 결과와 사용자별 라이브러리 관계 분리"
result: "로컬 GUI 수업 시연 완료. 안정적인 Cloud 배포 미완료"
translations: {"en":{"oneLine":"A web prototype for collecting and summarizing reviews by URL and keyword.","summary":"Built MySQL data flows, Flask sessions and routes, and a personal library; integrated the team’s collection and analysis output.","problem":"Find relevant pros and cons in a large set of reviews.","decision":"Separate analysis records from each user’s saved library.","result":"Completed a local GUI class demo; stable cloud deployment was not achieved.","visual":{"alt":"Review Analyzer input screen from the previous portfolio","caption":"Earlier reference screen; not final implementation evidence"},"trace":{"input":"Product URL + topic keywords","decision":"Separate analyses from saved relations","output":"Review summaries + personal library"}}}
---

## 프로젝트 소개

상품 리뷰를 모두 읽기 어려울 때 관심 있는 장단점을 빠르게 확인하도록 만든 3인 팀 웹 프로토타입입니다. 쿠팡 상품 URL과 키워드를 입력하면 리뷰를 수집·요약하고, 사용자가 결과를 라이브러리에 저장할 수 있습니다.

## 시스템 아키텍처

```mermaid
flowchart TB
  accTitle: Review Analyzer 웹 애플리케이션 구성
  accDescr: JavaScript 화면이 Flask에 요청하고 Facade가 리뷰 수집과 Gemini 분석을 호출합니다. Flask의 세션 및 라이브러리 기능은 MySQL과 연결됩니다.
  U["JavaScript · 입력 / 결과 화면"] <-->|HTTP| F["Flask · routes / session"]
  F --> A["Facade · 수집 / 분석 통합"]
  A <-->|리뷰 수집| C["Selenium · BeautifulSoup"]
  A <-->|키워드 분석| G["Gemini"]
  F <-->|사용자 · 분석 결과 · 라이브러리| D[("MySQL")]
```

크롤러와 Gemini 분석은 팀원이 주로 개발했습니다. 저는 결과가 사용자 화면과 저장 기능으로 이어지는 부분을 맡았습니다.

## 담당 역할과 주요 설계 결정

MySQL 스키마·CRUD, Flask 세션·라우트, 라이브러리와 JavaScript 화면 통합을 담당했습니다.

분석 결과 자체와 사용자별 저장 관계를 분리했습니다. 사용자가 저장을 선택하면 결과와 키워드를 기록하고 라이브러리 관계를 연결합니다. 저장 단계의 중복 처리는 있지만, 분석 요청 전에 수집·AI 호출을 생략하는 캐시는 구현하지 않았습니다.

Docker 개발환경과 NHN Cloud 배포도 시도했습니다. 하지만 GUI 없는 Linux/NKS에서 크롤러를 안정화하지 못해 최종 시연은 Chrome GUI가 동작하는 로컬 환경으로 정했습니다.

## 결과 및 한계

실제 상품 URL의 리뷰 수집, Gemini 결과 생성과 웹·라이브러리 흐름을 수업에서 시연했습니다. 외부 사용자 운영, 안정적인 클라우드 배포와 요약·추천 품질의 정량 평가까지 완료한 프로젝트는 아닙니다.
