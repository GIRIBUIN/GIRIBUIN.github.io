---
slug: "smart-parking"
title: "Smart Parking"
ownership: {"type":"team","teamSize":3}
category: "Embedded / IoT"
cardTech: ["Raspberry Pi","C","MQTT"]
featured: false
section: "tools"
order: 20
trace: {"input":"센서·게이트 노드 상태","decision":"MQTT 수집 + heartbeat 진단","output":"중앙 주차 모형 대시보드"}
tech: ["Raspberry Pi","C","Python","MQTT","Flask","SQLite"]
oneLine: "Raspberry Pi 3대와 MQTT로 감지·게이트·모니터링을 연결한 주차장 모형"
summary: "RPi3 중앙 노드를 맡아 MQTT·SQLite·Flask 대시보드, 커널 상태 진단과 로컬 네트워크를 통합했습니다."
problem: "감지·제어 장치의 상태와 이벤트 수집"
decision: "MQTT 구독, heartbeat와 커널 상태 인터페이스"
result: "실제 센서·모터를 포함한 3-node 수업 시연 완료"
links: {"demo":null,"source":"https://github.com/GIRIBUIN/RPI-Parking-service-driver","release":null,"video":"https://youtu.be/YD9IXrkSWf0","caseStudy":null}
demo: {"type":"video","url":"/videos/projects/smart-parking/demo.mp4"}
logo: "/images/projects/smart-parking/icon.png"
thumbnail: "/images/projects/smart-parking/thumbnail.png"
hidden: false
translations: {"en":{"title":"Smart Parking","oneLine":"A three-Pi MQTT prototype for parking sensors, gates, and monitoring.","summary":"Built the RPi3 MQTT/SQLite/Flask hub, kernel status diagnostics, and local network integration.","problem":"Collect states and events from sensing and gate devices.","decision":"Use MQTT subscriptions, heartbeats, and kernel status interfaces.","result":"Demonstrated the three-node system with real sensors and motors.","trace":{"input":"Sensor + gate node state","decision":"MQTT collection + heartbeat checks","output":"Central parking-model dashboard"}}}
---

## 프로젝트 소개

Raspberry Pi 세 대로 주차 감지, 게이트 제어와 중앙 모니터링을 나눈 3인 팀 프로젝트입니다. 센서·모터가 달린 주차장 모형의 상태와 이벤트를 MQTT로 연결했습니다.

## 시스템 아키텍처

```mermaid
flowchart TB
  accTitle: Smart Parking 장치 및 중앙 서비스 구성
  accDescr: RPi1의 주차 상태와 RPi2의 게이트 이벤트를 RPi3 Mosquitto broker로 전송합니다. RPi2는 만차 상태도 구독하며 중앙 subscriber가 SQLite에 기록하고 Flask 대시보드에 제공합니다.
  subgraph devices["감지 · 제어 장치"]
    P1["RPi1 · 주차 감지 / LED"]
    P2["RPi2 · 게이트 / 부저"]
  end
  P1 -->|주차 상태 · heartbeat| B
  P2 <-->|게이트 이벤트 / 만차 상태| B
  subgraph central["RPi3 · 중앙 서비스"]
    B["Mosquitto · MQTT broker"] --> S["MQTT subscriber"]
    S --> D[("SQLite · 상태 / 이벤트")]
    D --> W["Flask · 대시보드 / API"]
  end
```

장치 제어와 중앙 저장·표시를 분리하고, MQTT topic을 통합 기준으로 사용했습니다.

## 담당 역할 · RPi3 중앙 서비스

팀원마다 Raspberry Pi 한 대씩을 맡았고, 저는 중앙 노드 RPi3를 담당했습니다.

- Mosquitto broker와 MQTT subscriber
- 상태·이벤트의 SQLite 저장과 Flask 대시보드
- heartbeat와 커널 상태 인터페이스를 이용한 장치 진단
- Wi-Fi AP와 로컬 네트워크 통합

주차 상태와 장치의 연결 상태를 따로 확인할 수 있도록 heartbeat를 받았습니다. 진단 정보는 대시보드와 /dev·/proc 인터페이스로 연결했습니다. RPi1·RPi2의 센서·게이트 드라이버는 팀원이 구현했습니다.

## 결과 및 한계

실제 센서·모터, 세 Raspberry Pi와 브라우저 대시보드를 통합해 수업 시연을 마쳤습니다. 중앙 RPi3에 의존하는 주차장 모형이며, 실제 주차장 배포나 장애 복구·장기 안정성까지 검증한 구조는 아닙니다.
