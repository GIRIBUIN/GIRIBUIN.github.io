# 콘텐츠와 재사용 자산의 근거

모든 외부 자료는 읽기 전용으로 확인했습니다. 수정 범위는 D:/10_proj/portfolio-v2입니다.

## 프로젝트

| 프로젝트 | 읽은 근거 | 반영 범위 |
| --- | --- | --- |
| ZZZ | Career DB/04_Portfolio/projects/EXP-014_ZZZ.md; 기존 github.io | 전체 구조·DB·Express와 AWS 통합, 수업 시연, 역할·운영 검증 한계 |
| KUROOM | Career DB/04_Portfolio/projects/EXP-032_KUROOM.md | 시간표 정제·직접 조회·반응형 UI·시간대·계산 결과 비교, 검증된 데이터 규모 |
| KUTODO | Career DB/02_Details/[EXP-016] KU Todo 상세 기록; D:/10_proj/kutodo의 명세·코드 | 명시적 WebView 로그인, HTML 파싱, sourceKey·원본 필드 비교, preview·선택 반영, Drift/SQLite |
| 발주콜 | Career DB/02_Details/[EXP-019] 발주콜 상세 기록 | 매장 발주·납품·지급·원장, AI 활용, 보류·미사용, 보존본 debug 빌드와 실패 테스트 |
| ct | Career DB/04_Portfolio/projects/EXP-031_ct.md | Go CLI·템플릿·파일 보존·환경 진단·registry·v0.3.1 배포 |
| Review Analyzer | Career DB/04_Portfolio/projects/EXP-007_Review_Analyzer.md; 기존 github.io | MySQL·Flask session/routes·library·통합, 팀 담당 분리·local GUI 범위·schema 불일치 |
| Smart Parking | Career DB/04_Portfolio/projects/EXP-015_Smart_Parking.md; 기존 github.io | RPi3 중앙 노드·MQTT·SQLite·Flask·kernel status·heartbeat·AP 통합 |

Convoary 추가(2026-10-21): D:/_workspace/repos/chatgpt-explorer의 README.md, docs/SYNC.md, SECURITY.md, package.json, public/manifest.json, src/models/types.ts, src/storage/index.ts, src/sync/payload.ts를 확인했습니다. 탐색기형 ChatGPT 대화 정리·로컬 저장·선택적 Dropbox 암호화 동기화·v0.1 alpha 범위를 반영했습니다. README의 YouTube 영상(8-YvxsedAxQ)을 상세에 연결했습니다. 사용자가 제공한 C:/Users/healt/Videos/convorary/demo.mkv를 음성·부가 스트림 제거, H.264/yuv420p·30fps·CRF 28·faststart로 변환해 public/videos/projects/convoary/demo.mp4에 연결했습니다. 카드에는 사용자가 dist/images/projects/covoary/thumbnail.png로 제공한 1280×720 공통 썸네일을 public/images/projects/convoary/thumbnail.png로 복사해 기본 표시합니다. 호버 시 영상을 재생하고 벗어나면 썸네일로 복귀합니다. dark/light 파일을 나누지 않았습니다. 원본 영상과 원본 프로젝트는 수정하지 않았습니다.

Career DB 루트: D:/99_career_scan/00_Career DB.

KUTODO에서 읽은 로컬 자료:

- docs/이캠퍼스 연동 구조 분석.md
- docs/데이터 모델.md
- docs/specifications/e-campus 동기화 명세.md
- lib/data/local/app_database.dart
- lib/data/services/ecampus_todo_parser.dart
- lib/data/services/ecampus_sync_classifier.dart

확인된 저장소는 @DriftDatabase 기반이므로 Room을 기술로 추가하지 않았습니다. NEW/CHANGED/REMOVED 개념을 현재 코드의 상태 이름과 혼동하지 않으며, 사라진 미래 마감 항목의 제한적 자동 완료 정책과 live E2E 미검증을 상세에 기록했습니다. 세션은 매 동기화 직후 반드시 종료된다고 주장하지 않습니다. PDF의 표현보다 실제로 읽은 코드·명세의 좁은 확인 범위를 우선했습니다.

발주콜은 구현본과 UI가 존재하지만 실제 기기·매장 사용·외부 배포는 없습니다. 2026-09-28 보존본 검증은 debug APK 성공, 552 통과·1 제외·57 실패입니다. 보류 상태와 AI 생성·제안 코드 활용을 명시했으며 비공개 source를 공개 링크로 노출하지 않았습니다.

## 프로필과 PDF

| V2 복사본 | 읽기 전용 원본 |
| --- | --- |
| public/files/resume-public.pdf | D:/99_career_scan/01_이력서/resume-public.pdf |
| public/files/portfolio.pdf | D:/99_career_scan/02_포트폴리오/포트폴리오.pdf |
| public/images/profile/jeonggil.jpg | D:/10_proj/GIRIBUIN.github.io/public/imgs/profile.jpg |

PDF 내용은 수정하지 않고 첫 페이지를 렌더링해 확인했습니다. 소개·관심 분야는 기존 Contact/Profile과 PDF에서 확인한 Backend·Systems 방향을 짧게 번역·정리했습니다. 학력은 공개 이력서와 기존 resume.ts의 건국대학교 컴퓨터공학부·2027년 2월 졸업 예정 정보를 사용했습니다. 이메일은 공개 이력서와 기존 사이트의 giribuin@gmail.com을 사용합니다. 제공한 Portfolio PDF 안의 다른 이메일 표기는 원문을 그대로 유지했습니다.

GitHub·LinkedIn·Velog URL은 기존 사이트에서 확인한 값을 공통 config로 옮겼습니다. Instagram·Discord는 null로 두었습니다. 기존 프로젝트 참고 이미지의 출처는 public/images/reference/README.md에 유지합니다.

## Skills와 개발 원칙

- src/data/skills.ts: V2 프로젝트 tech와 원본 src/data/resume.ts·projects/entries/review-analyzer.ts에서 확인한 기술만 사용했습니다. Docker는 Review Analyzer 개발 환경·배포 시도 경험이며 운영 성공을 의미하지 않습니다. 근거 없는 Java·Kotlin·Oracle Cloud·C++는 추가하지 않았습니다.
- src/data/buildPrinciples.ts: 원칙의 자기소개 문장은 포트폴리오용으로 정리한 표현입니다. 프로젝트 사례는 기존 7개 Markdown의 검증된 범위만 사용합니다. AI 활용과 미검증 범위도 함께 남겼습니다.
- Hero는 제공된 githubprofile.png, About은 jeonggil.jpg를 사용합니다. me.jpg는 연결하지 않았습니다.

## 홈 카드 정보 재검증 (2026-10-13)

- 최종 문구·ownership/teamSize·category·cardTech·action·빈 정보는 [HOME_CARD_AUDIT.md](HOME_CARD_AUDIT.md)에 기록했습니다.
- EXP Fact Sheet 5개와 EXP-016·EXP-019 상세 기록, workspace README·구현 명세 및 기존 github.io project data를 읽기 전용으로 대조했습니다.
- 이동된 발주콜 보존본은 D:/99_career_scan/reconstruction_archive/github_temp/EXP-019_order-app의 CURRENT_FLOW_DESIGN.md 및 SQLite schema로 확인했습니다. MoaOrder의 서버 기술 계획을 발주콜 기술로 사용하지 않았습니다.
- KUTODO는 Flutter·WebView·Drift/SQLite이며 category는 Android입니다. 공개 중간 beta URL을 Release에 연결했습니다.
- Review Analyzer는 기존 github.io에 영상 URL이 있지만 EXP-007은 공개 영상 미확인으로 기록하므로 신규 action을 추가하지 않았습니다.
- Case Study는 7개 모두 null이며 명시적 URL이 있을 때만 자동 노출합니다. 상세 body와 기존 notes는 보존합니다.
- 기존 제공 썸네일 6개와 KUTODO null을 유지했으며 이미지 제작·교체·배포는 하지 않았습니다.

## Deep Dive 본문 재작성 (2026-10-15)

- 수정 대상은 projects의 한국어 본문 7개와 project-notes/en의 영어 본문 7개다. 프로젝트 frontmatter는 수정 전 SHA-256과 비교해 보존 여부를 확인한다.
- 원본 사이트의 src/data/projects/entries/zzz.ts, smart-parking.ts, review-analyzer.ts와 Portfolio PDF를 읽기 전용으로 대조했다.
- Career DB의 02_Details에서 EXP-007·014·015·016·019·031·032 상세 기록을 확인했다. EXP-007·014·015·031·032는 04_Portfolio/projects의 Fact Sheet도 함께 사용했다.
- 한국어는 작성자가 직접 배경·담당 범위·구현을 설명하는 합니다/했습니다 문장으로, 영어는 같은 사실 범위의 1인칭 설명으로 정리했다. 자료에 없는 장애 경험·감정·성과·독자 설계 서사는 추가하지 않았다.
- 공개 본문의 조사자 시점 표현과 Career DB·로컬 경로 나열을 제거했다. 출처와 충돌 판단은 이 문서에서 관리하며, 테스트 시점·팀 기여 경계·미완성 상태는 본문에도 유지했다.

| 프로젝트 | 본문에서 풀어 쓴 내용 | 유지한 사실 경계 |
| --- | --- | --- |
| ZZZ | 수집·저장·처리·서비스, 단계적 AWS 확장, Google Health 전환, 규칙 계산과 설명 생성 | 팀원 수집기·prediction 담당, 광범위한 AI 활용, 수업 시연 범위, live 데이터·운영 검증 한계 |
| Smart Parking | RPi3 broker·저장·대시보드, MQTT 구독, heartbeat·커널 상태 인터페이스, AP 통합 | RPi1·RPi2 드라이버는 팀원 담당, RPi3 단일 장애 지점, 수업용 모형 |
| Review Analyzer | 분석과 라이브러리 관계, 세션·라우트·화면 통합, Linux/NKS 배포 시도의 한계 | 저장 중복 처리와 request-time cache 구분, 크롤러·Gemini 팀 담당, recommended_info 스키마 불일치 |
| ct | 기존 파일 보존, doctor/setup 분리, registry 쓰기 보호, 릴리스 | 개인 실사용, 2026-10-13 검증과 editor stub, 모든 OS 설치 재현·외부 성과 미확인 |
| KUROOM | 정적 JSON 흐름, 직접 조회, 주간·시간대 경계, Python/TypeScript 비교 | 시간표 정보와 실제 점유 구분, 2026-10-13 릴리스·테스트 수치, 공개 주소 미확정 |
| KUTODO | WebView·HTML·sourceKey, 공통 Task와 원본 필드, preview·선택 반영, 누락 항목 방어 정책 | PDF의 즉시 세션 종료 설명을 사용하지 않음, Drift/SQLite, 2026-09-22 테스트와 후속 위젯 통합 빌드 실패 구분, 실제 계정 E2E 미검증 |
| 발주콜 | 실제 업무 요구, AI 반복 구현, 매장별 DB·주문 snapshot·납품·지급·선금 | 독자 설계 서사 없음, 2026-09-28의 552 통과·1 제외·57 실패, 실제 설치·현장 사용 없음, 보류와 MoaOrder 후속 기획 구분 |

Career DB·원본 사이트·PDF·프로젝트 코드에는 쓰기 작업을 하지 않았다. 프로젝트 자체의 재실행·학교 서버 접근·새 배포 없이 기존 검증 기록을 시점과 함께 사용했다.

## Deep Dive 구조도 간소화 (2026-10-15)

- 공개 본문의 ASCII 흐름도를 Mermaid로 교체했다. 각 프로젝트는 입력·핵심 처리·저장·사용자 접점의 큰 관계만 한 장으로 표현한다.
- 세부 파일명·변경하기 쉬운 테스트 수치·기능 나열은 줄이고 배경, 담당 범위, 핵심 판단, 현재 상태를 남겼다. 자료에 없는 관계나 비어 있는 항목은 추가하지 않는다.
- Mermaid는 Markdown 빌드 시 SVG로 렌더링한다. 한국어·영어 본문에 각각 접근성 제목과 설명을 포함하며, 브라우저용 Mermaid 스크립트는 추가하지 않는다.
- 프로젝트 frontmatter, 홈 카드, 상세 route와 YouTube 재생 방식은 유지한다.

## 구조도 및 상세 제목 재검토 (2026-10-15)

- EXP-014·015·007·032 Fact Sheet, EXP-016 상세와 원본 portfolio entries를 다시 대조했다. ZZZ의 기존 zzz-cloud.png와 KUROOM의 kuroom_architecture.mmd도 읽기 전용으로 확인했다.
- ZZZ는 AWS 시연 단계의 센서 수집(IoT Core·Lambda), Google Health 수집, RDS, API Gateway·Lambda API, EC2 Express 경로를 구분했다. 규칙 계산과 Groq 설명의 역할은 본문에 남겼다. 구버전 로컬 구성이나 계획 리소스를 현재 운영 구성처럼 합치지 않았다.
- Smart Parking은 감지·제어 장치와 RPi3 내부 broker·subscriber·SQLite·Flask를 구분하고 RPi2의 만차 상태 구독을 표현했다.
- Review Analyzer는 JavaScript UI, Flask, Facade, Selenium·BeautifulSoup, Gemini, MySQL 사이의 요청·호출 관계로 수정했다. 미구현 request cache와 실패한 Cloud 배포는 구조도에 추가하지 않았다.
- KUROOM은 Python 데이터 준비와 TypeScript 브라우저 조회를 분리했다. Python 기준 엔진과 비교 테스트는 본문으로 설명한다.
- KUTODO는 WebView 로그인 세션, HTTP 수집·파싱, 기존 Task 비교, preview와 선택 반영의 동기화 흐름을 표현했다. 자동 동기화나 완성되지 않은 위젯 연동은 포함하지 않는다.
- ct와 발주콜은 본문만으로 설명 가능한 단순 도식을 제거했다. 구조도는 선택 사항이며 없는 프로젝트에 빈 섹션을 만들지 않는다.
- 상세 제목을 프로젝트 소개·개발 배경·시스템 아키텍처·담당 역할과 주요 설계 결정·현재 상태 등으로 정리했다. 그래프의 자연 크기를 유지해 모바일에서는 그래프 내부만 가로 스크롤된다.

## 남은 제작·판단

- 제공받은 프로젝트 썸네일 6쌍을 public/images/projects/[slug]/에 정리하고 dark 버전을 카드에 연결했습니다. ORDER는 발주콜, PARKING LOT은 Smart Parking에 연결했습니다. KUTODO 썸네일과 프로젝트별 logo, 새 라이브 Demo는 아직 없으며 KUTODO는 텍스트 fallback을 표시합니다.
- 영어 문구는 읽은 근거의 번역·요약이며 사용자 최종 검토가 필요합니다.
- 대표작 순서·선정, 카드 높이와 미리보기 비율, 모바일 Header의 두 줄 배치를 실제 사용감으로 판단할 수 있습니다.
- PDF는 원문을 보존했으므로, 사이트의 기술·검증 범위·연락처와 PDF 문구의 최종 일치는 사람이 별도 검토할 수 있습니다.

## 프로젝트 아이콘·썸네일 추가 (2026-10-21)

- 사용자가 제공한 zzz, parking, ct, kuroom 저장소의 assets/icon.png·thumbnail.png를 public/images/projects/[slug]/에 원본 그대로 복사했습니다. parking은 smart-parking slug에 연결했습니다.
- 아이콘은 기존 logo 필드에, 썸네일은 thumbnail 필드에 연결했습니다. 기존 MP4 호버 재생과 상세 YouTube 링크를 유지하며 dark/light 구분은 없습니다.
- Review Analyzer·KUTODO·발주콜에는 새 자산을 추가하지 않았습니다.
