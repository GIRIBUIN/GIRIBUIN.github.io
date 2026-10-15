# 홈 프로젝트 카드 정보 확정

검증일: 2026-10-13 (KST). 수정 범위: portfolio-v2의 카드용 문구·메타데이터·조건부 action 및 관련 검증·문서.

레이아웃·CSS·테마·rail·How I Build 구성·기존 thumbnail/logo를 유지했습니다. 새 이미지·실제 Demo·Deep Dive 페이지 구현·배포는 하지 않았습니다. 이전 미커밋 변경도 보존했습니다.

## 최종 카드 정보

홈은 oneLine을 우선 표시합니다. 장문의 summary와 Problem·Decision·Result, 한국어 body·영어 project-notes는 그대로 보존합니다. Featured는 ownership/teamSize와 category를 함께, Smaller는 category만 표시합니다.

| title | 영역 | ownership | teamSize | category | cardTech | final oneLine (KO) | available actions | thumbnail | 자료 부족·확인 한계 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ZZZ | Featured | Team | 4 | Web / IoT | Node.js · MySQL · MQTT · AWS | 환경 센서·웨어러블 데이터로 수면 위험도와 점수를 보여주는 웹 서비스 | Source · Watch video | 기존 SVG 유지 (16:9) | 라이브 Demo·Case Study 미제공; 영상 실시간 접근 미확인 |
| KUROOM | Featured | Personal | null | Web | TypeScript · Python · Vite | 학교 시간표를 정제해 건물·강의실별 주간 일정을 조회하는 웹 서비스 | Source | 기존 SVG 유지 (16:9) | 공개 Demo URL·Case Study 미확정 |
| KUTODO | Featured | Team | 3 | Android | Flutter · WebView · Drift / SQLite | eCampus HTML 일정을 로컬 Task와 비교·선택 반영하는 Android 앱 | Source · Release | null · typography fallback | 라이브 Demo·Case Study·thumbnail 없음; beta 접근 재확인 불가 |
| 발주콜 | Featured | Personal | null | Mobile | Flutter · Dart · SQLite | 매장 재고·발주·납품·지급 내역을 SQLite에 기록하는 앱 | 없음 | 기존 SVG 유지 (16:9) | 공개 Source·Release·Demo·Case Study 없음 (비공개 저장소) |
| ct | Smaller | Personal | null | CLI | Go · VS Code | 풀이 파일 생성·VS Code 실행·환경 진단을 돕는 CLI | Source · Release | 기존 SVG 유지 (16:9) | Demo·Case Study 없음; 릴리스 현재 접근 재확인 불가 |
| Review Analyzer | Smaller | Team | 3 | Web | Python · Flask · MySQL | 상품 URL·키워드로 리뷰를 수집·요약하는 웹 프로토타입 | Source | 기존 SVG 유지 (16:9) | Demo·Case Study 없음; 기존 영상 URL과 EXP 기록 상충 |
| Smart Parking | Smaller | Team | 3 | Embedded / IoT | Raspberry Pi · C · MQTT | Raspberry Pi 3대와 MQTT로 감지·게이트·모니터링을 연결한 주차장 모형 | Source · Watch video | 기존 SVG 유지 (16:9) | 라이브 Demo·Case Study 없음; 영상 실시간 접근 미확인 |

| title | final oneLine (EN) |
| --- | --- |
| ZZZ | A web dashboard for rule-based sleep risk and scores from sensor and wearable data. |
| KUROOM | A web app for building and room timetable lookup from normalized campus schedules. |
| KUTODO | An Android app that compares eCampus HTML tasks with local tasks for selective sync. |
| 발주콜 | A local SQLite app for store inventory, orders, deliveries, and payments. |
| ct | A CLI for solution files, VS Code launch, and environment checks. |
| Review Analyzer | A web prototype for collecting and summarizing reviews by URL and keyword. |
| Smart Parking | A three-Pi MQTT prototype for parking sensors, gates, and monitoring. |

## 직접 대조한 자료

Career DB 루트: D:/99_career_scan/00_Career DB.

- ZZZ: 04_Portfolio/projects/EXP-014_ZZZ.md; workspace zzz/README.md·PROJECT_STRUCTURE.md; 기존 github.io src/data/projects/entries/zzz.ts. 초기 README의 On-Premise 단계와 EXP의 후반 AWS 시연 단계를 구분했습니다.
- KUROOM: 04_Portfolio/projects/EXP-032_KUROOM.md; workspace kuroom/web/README.md. 공식 서비스·실시간 점유로 표현하지 않았습니다.
- KUTODO: 02_Details/[EXP-016] KU Todo 상세 기록; workspace kutodo/README.md·docs/specifications/e-campus 동기화 명세.md·lib/data/local/app_database.dart. README의 초기 계획보다 현재 명세·Drift 코드를 우선했습니다. 3인 팀과 Android 중심 범위를 확인했습니다.
- 발주콜: 02_Details/[EXP-019] 발주콜 상세 기록; reconstruction_archive/github_temp/EXP-019_order-app/README.md·docs/CURRENT_FLOW_DESIGN.md·lib/core/db/app_database_schema.dart. workspace moaorder/README.md는 후속 프로젝트 자료라 현재 발주콜 기술 근거로 쓰지 않았습니다.
- ct: 04_Portfolio/projects/EXP-031_ct.md; workspace ct/README.md. 풀이 파일 생성·VS Code 실행·doctor/setup을 확인했습니다.
- Review Analyzer: 04_Portfolio/projects/EXP-007_Review_Analyzer.md; 기존 github.io src/data/projects/entries/review-analyzer.ts. DB·Flask·라이브러리와 팀 수집·분석 범위를 구분했습니다.
- Smart Parking: 04_Portfolio/projects/EXP-015_Smart_Parking.md; workspace parking/README.md·docs/MQTT_TOPICS.md·rpi3/README.md; 기존 github.io src/data/projects/entries/smart-parking.ts. 3인 팀·세 장치와 MQTT를 확인했습니다.

## 링크 점검과 비워둔 정보

- Source: ZZZ·KUROOM·KUTODO·Review Analyzer·Smart Parking 공개 저장소 페이지 접근 확인. ct는 EXP-031 및 README의 실제 URL을 유지했으며 현재 조회 환경에서는 접근 확인이 되지 않았습니다.
- Release: ct v0.3.1은 EXP-031의 게시 근거를 유지했습니다. KUTODO는 EXP-016 E-11의 https://github.com/GIRIBUIN/KU_GRADUATION_PROJECT/releases/tag/Ku-todo를 추가했습니다. 2026-05-10 중간 prerelease이며 최종 제출·실사용 검증 결과가 아닙니다. 두 릴리스의 실시간 접근은 web cache miss·로컬 네트워크 제한으로 재확인하지 못했습니다.
- 영상: ZZZ·Smart Parking은 EXP와 기존 사이트에 있는 URL을 Watch video로 유지했습니다. live Demo로 표시하지 않습니다. 영상 재생·현재 공개 상태는 이번 환경에서 재확인하지 못했습니다. Review Analyzer는 기존 사이트에 영상 URL이 있으나 EXP-007의 공개 영상 미확인 기록과 상충해 links.video를 null로 유지했습니다.
- Demo와 links.caseStudy는 7개 모두 null입니다. placeholder나 생성된 상세 URL을 사용하지 않으며, 향후 실제 URL을 metadata에 추가하면 action이 나타납니다.
- 발주콜은 private source를 공개 action으로 표시하지 않으며 Release도 없습니다.
- 개인 프로젝트 teamSize는 null입니다. 팀 4·3·3·3명은 각각 자료로 확인해 유지했으며 미확인 팀 인원을 채우지 않았습니다.
- thumbnail은 기존 제공 SVG 6개 유지, KUTODO null 유지입니다. 모든 logo도 null입니다. 이미지 영역 비율 16:9와 fallback 구조를 유지했습니다.

## 검증 결과

- Astro build: 성공 (npm test 내부 실제 production 및 격리 fixture 빌드).
- Astro/TypeScript check: 34개 파일, errors 0·warnings 0·hints 0.
- 콘텐츠 검사: 22개 통과. 7개 프로젝트·4/3 분류·ownership/teamSize·cardTech 제한·미제공 action 숨김·Case Study URL 자동 노출·null fallback·기존 상세 본문 생성 확인.
- 브라우저 검사: 21개 그룹 통과, JS runtime error 없음. 1440·820·390·360px에서 EN/KO 카드의 제목·summary·metadata 넘침 및 rail별 동일 높이 확인. Featured summary 최대 4줄·Smaller 최대 3줄, metadata 최대 2줄 제한 내에서 통과.
- 기존 가로 rail 조작, EN/KO 전환 시 페이지·rail 스크롤 보존, How I Build 6개 dialog와 닫기·포커스 복귀 모두 통과.
- 상세 Markdown body·summary·problem·decision·result·영어 notes와 CSS·기존 이미지의 작업 전후 바이트 비교: 보존 확인.
- 기존 github.io: HEAD 3d8869a9a3facee2a47476bad56e0843f3934095·clean git status·추적 파일 38개의 SHA-256이 모두 작업 전과 동일합니다.

실제 외부 Demo 실행·학교 서버 접근·앱 설치·하드웨어 재시연은 이 포트폴리오 검증 범위에 포함하지 않습니다.

## 이번 작업에서 수정한 파일

- README.md
- docs/CONTENT_SOURCES.md
- docs/HOME_CARD_AUDIT.md
- scripts/browser-check.mjs
- scripts/verify.mjs
- src/components/ProjectActions.astro
- src/components/ProjectDemo.astro
- src/content.config.ts
- src/content/projects/baljucall.md
- src/content/projects/ct.md
- src/content/projects/kuroom.md
- src/content/projects/kutodo.md
- src/content/projects/review-analyzer.md
- src/content/projects/smart-parking.md
- src/content/projects/zzz.md
- src/i18n/ui.ts
- src/lib/projects.ts
