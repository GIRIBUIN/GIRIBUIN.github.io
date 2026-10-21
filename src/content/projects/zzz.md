---
slug: "zzz"
title: "ZZZ"
ownership: {"type":"team","teamSize":4}
category: "Web / IoT"
cardTech: ["Node.js","MySQL","MQTT","AWS"]
featured: true
section: "work"
order: 10
trace: {"input":"환경 센서 + 웨어러블 데이터","decision":"수집과 저장의 책임 분리","output":"규칙 기반 수면 위험도 + 점수"}
tech: ["Node.js","Express","MySQL","MQTT","AWS"]
oneLine: "환경 센서·웨어러블 데이터로 수면 위험도와 점수를 보여주는 웹 서비스"
summary: "전체 구조, DB 스키마, Express API·대시보드와 AWS 단계 통합을 담당했습니다."
problem: "센서·웨어러블 데이터의 수집과 피드백 흐름 통합"
decision: "계층을 분리하고 SQLite를 MySQL/RDS로 확장"
result: "실제 센서와 AWS 대시보드를 수업에서 시연"
visual: {"url":"/images/reference/zzz-overview.png","alt":"ZZZ 초기 On-Premise 단계 대시보드 참고 화면","caption":"기존 포트폴리오 참고 화면 / On-Premise 단계"}
links: {"demo":null,"source":"https://github.com/GIRIBUIN/zzz","release":null,"video":"https://youtu.be/eqvWtHHWINI","caseStudy":null}
demo: {"type":"video","url":"/videos/projects/zzz/demo.mp4"}
logo: "/images/projects/zzz/icon.png"
thumbnail: "/images/projects/zzz/thumbnail.png"
hidden: false
translations: {"en":{"oneLine":"A web dashboard for rule-based sleep risk and scores from sensor and wearable data.","summary":"Designed the system and database, built Express APIs and dashboards, and contributed to AWS integration.","problem":"Bring sensor and wearable data into one feedback flow.","decision":"Separate responsibilities; extend SQLite storage to MySQL/RDS.","result":"Demonstrated real sensor ingestion and the AWS dashboard in class.","visual":{"alt":"ZZZ dashboard from the early on-premise phase","caption":"Earlier on-premise reference screen"},"trace":{"input":"Room sensors + wearable data","decision":"Separate collection from storage","output":"Rule-based sleep risk + scores"}}}
---

## 프로젝트 소개

ZZZ는 환경 센서와 웨어러블 데이터를 연결한 4인 수업 프로젝트입니다. 취침 전에는 방의 환경과 활동 상태를, 기상 후에는 수면 점수와 그 근거를 확인할 수 있도록 만들었습니다.

## 시스템 아키텍처

```mermaid
flowchart TB
  accTitle: ZZZ AWS 시스템 아키텍처
  accDescr: Raspberry Pi 센서는 IoT Core와 센서 저장 Lambda를 통해 RDS에 저장됩니다. Google Health 데이터는 별도 수집 경로로 같은 DB에 저장하고 API Gateway와 Lambda API를 통해 EC2 Express 대시보드에 제공합니다.
  subgraph sensor["환경 데이터"]
    R["Raspberry Pi · DHT11 / MQ-5"] -->|MQTT| I["AWS IoT Core"]
    I --> L["Lambda · 센서 저장"]
  end
  subgraph health["웨어러블 데이터"]
    H["Google Health API"] --> C["OAuth · 데이터 수집"]
  end
  L --> D[("Amazon RDS · MySQL")]
  C --> D
  D -->|조회 결과| A["API Gateway · Lambda API"]
  A -->|API 응답| W["EC2 · Express 대시보드"]
```

위 구조는 AWS 수업 시연 단계의 주요 데이터 경로입니다. 초기 Express·SQLite 구성에서 센서 유입은 IoT Core·Lambda, 저장은 RDS, 일부 API는 API Gateway·Lambda, 웹은 EC2의 Express로 나눠 확장했습니다. 위험도와 수면 점수는 규칙으로 계산하고, Groq는 그 결과를 설명하는 데 사용했습니다.

## 담당 역할과 주요 설계 결정

전체 실행 구조, DB 스키마, Express API·대시보드와 팀 모듈 통합을 담당했습니다. 센서·웨어러블 수집기와 prediction·Groq 모듈은 팀원이 주로 개발했고, 저는 서비스에 연결하고 필요한 부분을 수정했습니다.

- 수집·저장·처리·서비스의 책임을 분리했습니다.
- SQLite를 사용자·기기 기준의 MySQL/RDS 구조로 확장했습니다.
- Google Health 전환에 맞춰 인증부터 수집·저장·화면 연결을 수정했습니다.
- 점수는 규칙으로 계산하고, Groq는 계산 결과를 설명하는 역할로 연결했습니다.

코드·문서·설계에는 생성형 AI를 폭넓게 활용하고, 결과를 프로젝트 구조에 맞게 통합·수정했습니다.

## 결과 및 한계

실제 센서 수집부터 AWS IoT 유입, RDS 저장과 웹 대시보드까지 연결해 수업에서 시연했습니다. 외부에서 접속 가능한 AWS 수업용 데모를 완료한 범위이며, 장기 운영이나 수면 개선 효과를 검증한 서비스는 아닙니다.
