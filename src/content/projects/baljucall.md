---
slug: "baljucall"
title: "콕착"
ownership: {"type":"personal","teamSize":null}
category: "Store Management"
featured: false
status: planning
origin: null
validation: null
notes: {"en":"en/kokchack"}
tags: ["Orders","Bookkeeping"]
section: "work"
order: 70
technologies: []
summary: "직원 발주 요청부터 사장의 주문·지급·거래원장 관리까지 연결하는 흐름을 기획하고 있습니다."
links: {"demo":null,"source":null,"release":null,"video":null,"caseStudy":null}
logo: null
thumbnail: null
hidden: false
oneLine: "소규모 매장을 위한 발주·장부 관리 서비스 구상"
problem: "직원 발주 요청과 사장의 주문·지급·거래원장 관리 연결"
translations: {"en":{"title":"Kokchack","oneLine":"A planned service for small-store orders and bookkeeping.","summary":"Planning the flow from employee requests to owner-managed orders, payment records, and ledgers.","problem":"Connect employee requests with order, payment, and ledger management."}}
---

## 콕착

소규모 매장의 발주와 장부 관리를 지원하는 서비스를 구상하고 있습니다. 직원은 Android에서 필요한 품목을 요청하고, 사장은 Android와 PC Web에서 거래처별 주문·지급·거래원장을 관리하는 방향입니다.

현재는 요구사항과 데이터 규칙을 검토하는 기획 단계입니다. 거래처 메시지는 사용자가 복사해 외부 앱에서 직접 전송하고, 실제 대금 이체가 아니라 지급 사실을 기록하는 범위로 정리하고 있습니다.

## 이전 프로토타입 — 발주콜

아래는 이전 Flutter·SQLite 구현의 기록입니다. 콕착의 구현·배포 성과와는 구분합니다.

### 개발 배경

아버지가 매장에서 하던 발주 업무를 앱으로 옮겨 달라고 요청해 시작한 개인 프로젝트입니다. 실제 요구사항을 받아 재고 확인부터 발주·납품·지급까지 Flutter·SQLite 앱으로 연결했습니다.

재고는 보관 위치별로 확인하고, 발주는 거래처별로 묶습니다. 메시지는 사용자가 외부 앱에서 내용을 확인한 뒤 직접 전송하는 방식입니다.

### 데이터 설계와 개발 과정

매장별 SQLite DB를 사용하고, 주문에는 당시 품목·거래처 정보의 snapshot을 남깁니다. 기준정보가 나중에 바뀌어도 주문 당시 내용을 보존하는 구조입니다. Excel 입출력과 백업·복원도 연결했습니다.

아버지가 업무 요구를 설명하고 저는 이를 데이터와 화면으로 반영했습니다. AI가 생성·제안한 코드를 적극 활용해 적용·수정·통합을 반복했으며, 모든 내부 구조를 처음부터 독자적으로 설계한 것은 아닙니다.

### 보존본 검증 범위

debug APK 빌드는 확인했지만 전체 테스트가 통과하는 상태는 아니며, 실제 기기 설치나 매장 사용·외부 배포는 하지 않았습니다. 현재 구현본은 보류하고 DB와 지급·선금 구조를 다시 검토하려고 합니다.

이전 프로토타입의 데이터와 업무 흐름을 참고하되, 콕착의 새 요구사항과 구분해서 검토합니다.
