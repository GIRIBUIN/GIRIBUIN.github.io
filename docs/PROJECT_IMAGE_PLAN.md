# 프로젝트 대표 이미지 규격·제작 계획

확정일: 2026-10-13. 작업 범위는 실제 브라우저 실측, 원본 자료 조사, 규격·촬영 목록 확정입니다. 코드·카드 문구·metadata·CSS·테마·기존 이미지를 유지합니다. 새 이미지·crop·실제 Demo·Deep Dive 구현·배포는 하지 않습니다.

## 실제 image slot

현재 dist를 로컬 서버로 제공하고 실제 Microsoft Edge headless로 검사했습니다. 외부 요청은 차단했습니다. 12개 viewport(높이 1000 CSS px)에서 7개 카드, 총 84개 .demo-stage의 getBoundingClientRect와 computed style을 읽었습니다. 아래는 border·숨겨진 toolbar/caption을 제외한 내부 영역의 CSS px입니다. 실제 기기가 아닌 viewport 분류이며 물리 픽셀과 구분합니다.

| viewport width | Featured W × H | Smaller W × H |
| --- | --- | --- |
| 320 | 236.5 × 133.0 | 225.9 × 127.1 |
| 360 | 272.5 × 153.3 | 260.3 × 146.4 |
| 390 | 299.5 × 168.5 | 286.1 × 160.9 |
| 700 | 578.5 × 325.4 | 552.7 × 310.9 |
| 701 | 470.7 × 264.8 | 265.5 × 149.3 |
| 820 | 561.2 × 315.6 | 316.6 × 178.1 |
| 1000 | 698.0 × 392.6 | 394.0 × 221.6 |
| 1001 | 382.2 × 215.0 | 309.7 × 174.2 |
| 1280 | 512.0 × 288.0 | 415.0 × 233.4 |
| 1366 | 551.9 × 310.5 | 447.4 × 251.7 |
| 1440 | 556.1 × 312.8 | 450.8 × 253.6 |
| 1920 | 556.1 × 312.8 | 450.8 × 253.6 |

- 양쪽 모두 실측 약 1.7778, computed aspect-ratio 16 / 9입니다. 소수점 반올림 오차만 있습니다.
- 실제 이미지 6개의 object-fit은 contain, object-position은 50% 50%입니다. 모든 viewport에서 동일합니다. 16:9 원본은 crop 없이 채워지고, 다른 비율은 여백을 남깁니다.
- KUTODO는 img가 없는 typography fallback이므로 object-fit 대상은 없습니다. fallback slot도 같은 16:9·높이입니다.
- 각 rail 내부의 모든 visual 높이가 12개 viewport에서 동일합니다. Featured와 Smaller끼리는 카드 폭이 달라 높이가 다릅니다.
- 1440·1920에서는 shell 최대 폭 때문에 크기가 같습니다. 1000px 이하에서는 Featured 열 폭 76%·Smaller 43%, 700px 이하에서는 90%·86%로 바뀝니다. breakpoint에서 크기는 바뀌지만 비율·fit은 유지됩니다.
- 최대 실측: Featured 698.0×392.6(1000 viewport), Smaller 552.7×310.9(700 viewport).
- rail 끝의 다음 카드가 일부만 보이는 것은 가로 스크롤 영역의 clipping이며 이미지 crop이 아닙니다. 카드를 화면 안으로 넘기면 전체가 보입니다.

원시 실측: ../.verification/image-slot-measurements.json. 재현 스크립트: ../.verification/measure-image-slots.mjs. 검증용이며 배포 asset이 아닙니다.

## 공통 규격

| 항목 | 결정 |
| --- | --- |
| 비율 | 16:9, Featured·Smaller 공통 |
| 제작 master | 1600×900 px PNG, sRGB, 불투명 배경 |
| 웹 파일 | cover.webp, 동일한 1600×900 px |
| 인코딩 | UI·terminal·diagram은 lossless WebP 우선. 사진은 quality 85 전후에서 육안 검토 |
| 용량 | 대략 150~350KB 목표, 가능하면 500KB 이하. 글자·선 품질 우선 |
| 안전 여백 | 핵심 정보를 중앙 90% 이내에 배치. 좌우 80px·상하 45px 확보 |
| 텍스트 | 프로젝트명·summary·tech 반복 없음. 필요한 node label·작은 mark만 허용 |

현재 slot과 동일한 16:9를 선택했습니다. 1600px 폭은 최대 실측 폭 약 698 CSS px의 2배를 충족합니다. 3:2는 contain 표시 시 가로 여백이 합계 약 15.6% 생겨 증거 화면이 작아지므로 선택하지 않습니다. portrait 앱 UI는 가로로 늘리지 않고 16:9 canvas 안에서 실제 화면의 핵심 부분을 크게 보여줍니다.

README·Portfolio PDF에는 같은 master를 비율 유지해 재사용합니다. OG는 추후 사용처 규격이 정해지면 파생 파일로 만듭니다. 예를 들어 1200×630을 선택하면 중앙 crop으로 원본 상하가 각각 약 3.3% 줄므로 위 안전 여백을 지킵니다. OG 설정·파생 asset은 이번 범위에 없습니다. 홈은 contain이므로 별도 mobile crop 파일이 필요하지 않습니다.

저해상도 source를 큰 canvas에 넣어도 세부가 복원되지는 않습니다. AI로 가상의 UI·장비 세부를 채우지 않습니다. 별도 theme/color 변경 없이 단순 framing을 쓰고 실제 UI의 색은 보존합니다.

## asset 경로

기존 slug를 유지합니다. 발주콜은 baljucall이며 ordercall로 바꾸지 않습니다.

~~~text
public/images/projects/
  zzz/cover.webp
  kuroom/cover.webp
  kutodo/cover.webp
  baljucall/cover.webp
  ct/cover.webp
  review-analyzer/cover.webp
  smart-parking/cover.webp
~~~

파일이 제작·검증된 후 thumbnail: /images/projects/{slug}/cover.webp만 연결합니다. 이번에는 thumbnail을 변경하지 않습니다. 기존 SVG 6개와 KUTODO null fallback을 유지하며 dark/light 파일도 삭제하지 않습니다.

public에는 최종 cover만 둡니다. 기존 원본은 Evidence 위치에 보존하고 이동하지 않습니다. 다음 단계 master·출처 기록은 비배포 경로 assets/project-covers/{slug}/cover-master.png·source.md로 관리합니다. source.md에 원본 경로·촬영일·commit/데이터 버전·crop·익명화 내역을 기록합니다. 이번에는 이 디렉터리와 이미지 파일을 만들지 않습니다.

## 프로젝트별 계획

아래 source 약칭의 전체 경로는 다음 절에 기록했습니다.

| project | 영역 | recommended visual type | source 후보 | 새 캡처 필요 여부 | 추천 crop/focus | 현재 자료 부족 여부 |
| --- | --- | --- | --- | --- | --- | --- |
| ZZZ | Featured | C. architecture / system visual | zzz-cloud.png·ZZZ_architecture_after.png·EXP-014 | 캡처 불필요; 근거 기반 cover visual 제작 필요 | 센서·웨어러블 → 수집/저장·규칙 계산 → 웹 수면 점수를 3개 묶음으로 단순화 | 구현 근거 있음. 기존 구조도는 글자가 많고 초기 UI는 On-Premise 단계 |
| KUROOM | Featured | A. 실제 UI screenshot | kuroom_timetable_desktop.png·kuroom_lookup.png | 필수 아님; 현재 UI 재캡처 권장 | 강의실명·요일·수업 block 중심. 좌우 빈 배경과 빈 시간 행 최소화 | 실제 PNG 1440×1000 확보. 기존 공실 검색 표현보다 시간표 dialog 우선 |
| KUTODO | Featured | B. 실제 실행 화면 + framing | 실제 앱 sync preview를 새로 캡처; 동기화 명세 대조 | 필요 | 신규/변경 요약·선택 항목·control 확대. 폰 외곽·긴 전체 목록 제외 | 확인된 실제 sync 캡처 없음. mockups/03_sync_result.png는 목업, data.png는 ERD |
| 발주콜 | Featured | B. 실제 실행 화면 + framing | flutter_01.png·flutter_02.png | 필수 아님; 익명 데이터 재캡처 권장 | 납품 확인 또는 거래처별 품목·수량·상태를 크게 | 개발 화면 1080×2340 확보. flutter_02에 전화번호·이름 포함. 발주/지급 대표 화면 미확보 |
| ct | Smaller | D. terminal screenshot, VS Code 화면 포함 | ct_hero.png·ct_session.txt | 필수 아님; 글자 확대 재캡처 권장 | ct 71A·Created 출력과 main.cpp 중심. Chat sidebar·긴 경로·빈 공간 축소 | 실제 화면 후보 1909×1027 및 transcript 확보. 기존 로그 시각화와 구분 필요 |
| Review Analyzer | Smaller | B. 실제 분석 결과 UI + framing | 추후 실제 local GUI 결과 화면; 기존 home.png는 참고용 | 필요 | 상품 식별 영역·키워드별 긍정/부정 요약 1~2개 | 기존 화면은 결과 없는 입력 대기 상태. 최종 결과 UI 독립 원본 없음 |
| Smart Parking | Smaller | E. hardware / physical prototype photo | 팀 보고서 4쪽 상단 주차장·게이트 사진 | 고해상도 원본 확보 또는 재촬영 필요 | 두 슬롯·잠금장치·게이트를 함께. 책상·노트북 여백 축소 | 실제 사진 있음. PDF 내 주사진 392×318, 독립 원본 미확인 |

## 직접 확인한 원본과 판단 근거

- ZZZ: D:/10_proj/zzz/assets/zzz-cloud.png, D:/99_career_scan/00_Career DB/03_Evidence/EXP-014/ZZZ_architecture_after.png. D:/10_proj/GIRIBUIN.github.io/public/imgs/projects/zzz/overview.png도 열어 초기 On-Premise 화면과 긴 세로 구성을 확인했습니다. EXP-014 Fact Sheet와 대조해 실제 구현 단계만 구조 visual에 사용합니다. 기존 상세 구조도 전체를 작은 cover에 축소하지 않습니다.
- KUROOM: D:/99_career_scan/00_Career DB/03_Evidence/EXP-032/visuals/kuroom_timetable_desktop.png·kuroom_lookup.png. Evidence README에 실제 Edge 캡처·합성/수정 없음이 기록돼 있으며 이미지를 직접 확인했습니다. 같은 프로젝트의 05_Required Assets 제작가이드도 대조했습니다. 현재 시간표의 하루 전체가 작아지지 않도록 대표 수업 block에 집중합니다. 이미지 편집으로 앱 문구를 바꾸지 않습니다.
- KUTODO: D:/10_proj/kutodo/assets/mockups/03_sync_result.png·assets/data.png를 열어 목업·ERD임을 구분했습니다. docs/specifications/e-campus 동기화 명세.md 및 EXP-016 기록상 실제 LMS E2E 미검증입니다. 후속 촬영에서 샘플 데이터로 실제 UI를 실행하면 개발용 데이터라고 출처에 기록합니다. 재현이 막히면 fallback을 유지하고 목업을 실제 결과로 대체하지 않습니다.
- 발주콜: D:/99_career_scan/reconstruction_archive/github_temp/EXP-019_order-app/flutter_01.png·flutter_02.png. 실제 파일을 열어 납품 확인·납품 목록과 공개 전 가려야 할 연락처를 확인했습니다. EXP-019 상세 기록의 개발 화면·현장 미사용 범위를 유지합니다. flutter_01은 상대적으로 단순한 후보입니다. flutter_02는 가림 또는 익명 데이터 재캡처 후 사용합니다.
- ct: D:/99_career_scan/00_Career DB/03_Evidence/EXP-031/visuals/ct_hero.png. 터미널의 ct 71A/Created와 VS Code main.cpp가 함께 보이는 캡처를 확인했습니다. D:/99_career_scan/00_Career DB/05_Required Assets/EXP-031_ct/submissions/20261013-143945-246/ct_session.txt의 생성·보존·doctor 실행을 대조했습니다. 기존 Evidence README/validation의 stub 기반 과거 시연·로그 시각화와 구분합니다. 소스 개발 빌드를 release v0.3.1로 표시하지 않습니다.
- Review Analyzer: D:/10_proj/GIRIBUIN.github.io/public/imgs/projects/review-analyzer/home.png를 열어 결과 없는 입력 화면임을 확인했습니다. D:/99_career_scan/00_Career DB/04_Portfolio/projects/EXP-007_Review_Analyzer.md에는 최종 실행 화면 독립 원본 미확인이 기록돼 있습니다. 실제 결과를 새로 캡처하거나 검증 가능한 과거 시연 원본을 확보해야 합니다. 외부 API·GUI 의존성이 막히면 결과 화면을 새로 그려 채우지 않습니다.
- Smart Parking: D:/99_career_scan/00_Career DB/03_Evidence/EXP-015/팀과제(최정길, 강현구, 박정환).pdf 4쪽을 메모리에서 렌더링해 실제 주차장 모형·게이트 사진을 확인했습니다. pdfimages -list의 embedded 크기는 392×318·235×222·235×204·175×141입니다. 사진은 추출하거나 저장하지 않았습니다. D:/10_proj/parking/docs/ESS.drawio.png는 구조 참고용입니다. 고해상도 원본/재촬영이 불가능하면 E 계획을 보류하고 별도 후속 결정으로 C 구조 visual을 검토합니다.

## 다음 제작 목록

1. ZZZ: 근거로 검증한 핵심 system visual 1장 제작.
2. KUROOM: 주간 시간표 1장, 기존 실제 PNG 재사용 가능.
3. KUTODO: 실제 sync preview 1장 새 캡처.
4. 발주콜: 납품 화면 1장, 기존 PNG 검토·익명화 또는 재캡처.
5. ct: terminal·VS Code 1장, 기존 PNG 재사용 가능하나 확대 재캡처 권장.
6. Review Analyzer: 실제 분석 결과 1장 새 캡처 또는 검증된 과거 원본 확보.
7. Smart Parking: 실제 모형 고해상도 사진 1장 확보 또는 재촬영.

추가 project title·summary·tech를 이미지에 반복하지 않습니다. AI 이미지 제작도 계획에 포함하지 않습니다. 모바일 약 300px, 작은 Smaller는 226px까지 축소되는 조건에서 핵심 대상·상태가 구분되도록 합니다. UI의 작은 글자 전체를 읽게 하려는 구성보다 주요 화면 패턴과 동작 대상에 집중합니다.

## 변경·검증 범위

- 이번 단계 변경은 이 문서 하나입니다. .verification에는 수치 측정용 스크립트·JSON만 기록했습니다.
- 코드·카드 copy·metadata·CSS·기존 public asset과 github.io의 작업 전후 해시를 비교합니다.
- 코드 변경이 없으므로 build/typecheck/content suite는 다시 실행하지 않습니다. 브라우저 실측·자료 검토·원본 보존 검사만 수행하며 이전 테스트 결과를 이번 재실행 결과로 표현하지 않습니다.

최종 보존 검사: 기존 V2 파일 76개 SHA-256 동일, 기존 github.io 추적 파일 38개 SHA-256·HEAD·clean git status 동일. 12개 viewport·84개 slot의 비율/fit/높이 검증 통과.
