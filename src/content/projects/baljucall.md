---
slug: "baljucall"
title: "발주콜"
ownership: {"type":"personal","teamSize":null}
category: "Mobile"
cardTech: ["Flutter","Dart","SQLite"]
featured: true
section: "work"
order: 70
trace: {"input":"매장 재고·발주·정산 업무","decision":"로컬 DB + 주문 시점 snapshot","output":"재고·거래 기록 앱 구현본"}
tech: ["Flutter","Dart","SQLite"]
summary: "아버지의 매장 요구를 Flutter·SQLite 앱으로 옮겼습니다. AI 생성·제안 코드를 적극 활용한 개인 프로젝트입니다."
links: {"demo":null,"source":null,"release":null,"video":null,"caseStudy":null}
demo: {"type":"apk","url":null}
logo: null
thumbnail: null
hidden: false
oneLine: "매장 재고·발주·납품·지급 내역을 SQLite에 기록하는 앱"
problem: "재고 확인·거래처별 발주와 정산 업무 연결"
decision: "매장별 로컬 DB와 주문 시점의 snapshot 보존"
result: "보존본 debug 빌드 성공. 테스트 57개 실패·현장 사용 없음"
translations: {"en":{"oneLine":"A local SQLite app for store inventory, orders, deliveries, and payments.","summary":"An AI-assisted Flutter/SQLite project based on my father’s store workflow. Currently on hold.","problem":"Connect stock checks, supplier orders, and settlement records.","decision":"Use per-store local databases and preserve order-time snapshots.","result":"Debug build succeeded; 57 tests failed in the reviewed snapshot. No field use.","trace":{"input":"Store stock, orders + settlements","decision":"Local DB + order-time snapshots","output":"Inventory + transaction app prototype"}}}
---

## 개발 배경

아버지가 매장에서 하던 발주 업무를 앱으로 옮겨 달라고 요청해 시작한 개인 프로젝트입니다. 실제 요구사항을 받아 재고 확인부터 발주·납품·지급까지 Flutter·SQLite 앱으로 연결했습니다.

재고는 보관 위치별로 확인하고, 발주는 거래처별로 묶습니다. 메시지는 사용자가 외부 앱에서 내용을 확인한 뒤 직접 전송하는 방식입니다.

## 데이터 설계와 개발 과정

매장별 SQLite DB를 사용하고, 주문에는 당시 품목·거래처 정보의 snapshot을 남깁니다. 기준정보가 나중에 바뀌어도 주문 당시 내용을 보존하는 구조입니다. Excel 입출력과 백업·복원도 연결했습니다.

아버지가 업무 요구를 설명하고 저는 이를 데이터와 화면으로 반영했습니다. AI가 생성·제안한 코드를 적극 활용해 적용·수정·통합을 반복했으며, 모든 내부 구조를 처음부터 독자적으로 설계한 것은 아닙니다.

## 현재 상태와 후속 계획

debug APK 빌드는 확인했지만 전체 테스트가 통과하는 상태는 아니며, 실제 기기 설치나 매장 사용·외부 배포는 하지 않았습니다. 현재 구현본은 보류하고 DB와 지급·선금 구조를 다시 검토하려고 합니다.

같은 업무를 PC·모바일 동기화와 self-hosting 관점에서 다시 설계하는 방향은 후속 프로젝트 MoaOrder로 이어졌습니다. 발주콜 자체의 서버 전환이 완료된 것은 아닙니다.
