# Portfolio V3

## 구조

- Astro가 Home, Projects, About과 프로젝트 상세를 정적 HTML로 렌더링합니다. ProjectFilters.astro와 작은 DOM 스크립트가 필터를 처리하며 React hydration은 없습니다. 기존 React integration/dependency는 유지하지만 페이지에서 React 런타임을 요청하지 않습니다. Posts는 최종 요청에 따라 포함하지 않습니다.
- src/content/projects/*.md가 프로젝트 데이터 원본입니다. 영어 상세는 기존 src/content/project-notes/en/*.md와 새 src/content/project-translations/en/*.md를 같은 projectNotes 컬렉션으로 읽습니다. 기존 notes 폴더의 OS 쓰기 권한 제한 때문에 새 번역은 project-translations에 둡니다. notes.en은 기존 URL과 다른 번역 ID를 선택하는 선택적 필드입니다. 별도 projects.ts 데이터 복제본은 없습니다.
- MenuHome.astro는 기존 EN/KO 진입 경로를 유지하기 위해 파일명을 보존했으며 현재 정적 Home입니다. ProjectsPage와 ProjectDetail도 기존 진입 컴포넌트를 재사용합니다.
- 정식 상세 URL은 /projects/[slug]/ 및 /ko/projects/[slug]/입니다. 기존 /work/[slug]/는 동일 본문을 제공하고 새 URL을 canonical로 지정합니다. 예전 Home hash 북마크는 location.replace로 새 문서에 연결합니다.
- 기존 ko 페이지 디렉터리가 새 파일 생성을 거부해 /ko/about/와 /ko/projects/[slug]/는 Astro injectRoute와 src/routes/KoreanAbout.astro, KoreanProject.astro로 등록합니다. 모두 prerender한 정적 페이지이며 런타임 서버는 없습니다.
- 내부 이동은 Astro ClientRouter가 처리합니다. 직접 진입/새로고침/JS 비활성화 시에는 정적 문서가 그대로 동작합니다. 언어 전환은 동일 페이지/slug 링크와 목록 query를 유지하며 Back/Forward는 실제 URL history를 사용합니다.
- page-lifecycle.ts가 페이지별 AbortController와 정리 함수를 관리합니다. Header/언어 메뉴/다이어그램/이미지 fallback은 매 페이지 로드에 연결하고 swap 전에 이전 이벤트·animation frame·dialog 상태를 정리합니다. Header를 강제 persist하지 않아 locale과 active navigation이 새 HTML과 일치합니다.
- prefetch는 메뉴·홈의 전체 목록 화살표·프로젝트 링크만 hover/focus로 활성화합니다. PDF는 일반 브라우저 탐색을 사용하며 영상·외부 링크는 prefetch하지 않습니다. 불필요한 페이지 전환 애니메이션은 껐습니다.
- 초기 query 필터는 작은 inline 설정과 CSS로 첫 표시부터 반영하고, soft navigation에서는 before-swap에 새 문서의 숨김/선택/개수를 반영합니다. 잘못되거나 빈 분류는 All로 돌아갑니다.
- project-images.ts는 기존 이미지 최적화를 재사용합니다. 원본을 보존하고 프로덕션에서 800px WebP를 생성하며 개발에서는 public 원본 경로를 사용합니다.
- YouTube는 lazy iframe입니다. 중복 로컬 MP4 연결과 플레이어는 제거했습니다. 프로젝트 상세의 외부 링크는 상단 아이콘 한 곳에만 표시하며 하단 Links 섹션은 없습니다. 아이콘에 접근 가능한 이름과 tooltip을 제공합니다.
- Mermaid는 빌드 시 접근 가능한 SVG를 생성합니다. 모바일의 작은 글씨를 읽기 위한 native diagram viewer만 유지하며 프로젝트 탐색/React/외부 렌더러는 사용하지 않습니다.
- 흰 배경·진한 본문·밝은 회색 구분선의 문서 테마를 사용합니다. 노란색 계열은 흰 배경에서 읽히는 짙은 gold 포인트로 조정했습니다. 코드와 Mermaid도 light 테마입니다. 3D, Explorer window, Settings popover, hover-video 상태, How I Build dialog는 배포 페이지에서 제거했습니다.
- 브라우저 탭 제목은 모든 페이지에서 GIRIBUIN입니다. 공유용 OG 제목과 본문의 프로젝트 제목은 문맥을 유지합니다. Header는 sticky이며 아래로 읽을 때 숨고 위로 스크롤하면 나타납니다. 키보드 focus나 언어 메뉴가 열린 동안에는 숨기지 않습니다.

## 데이터와 분류

| 필드 | 의미 |
| --- | --- |
| status | planning / active / completed / archived. 진행 상태의 근거가 없으면 null |
| origin | independent / guided / foundation. 개발 과정의 근거가 불명확하면 null |
| validation | prototype / tested / in-use. status·origin과 독립이며 검증 근거가 없으면 null |
| featured | Home 노출. 현재 ZZZ, KUTODO, Convoary |
| technologies | 기존 tech를 바꾼 기술 목록. cardTech는 목록용 일부 기술 선택 |
| role | 선택적 {ko,en} 역할 설명. 기존 ownership이 있는 문서는 역할을 담은 localized summary도 재사용하며, 역할 정보가 없는 새 계획에 기여를 생성하지 않음 |
| tags | 기존 프로젝트 문서에서 확인되는 특성 |

Guided는 강의/튜토리얼을 따라 구현한 경우를 뜻합니다. 학교 프로젝트라는 이유나 AI 사용만으로 Guided로 분류하지 않습니다. Independent는 독자적인 개인 개발 과정이 명시된 Convoary, KUROOM, ct에만 지정했습니다. 나머지는 origin을 추측하지 않습니다. 목록 필터는 All / Featured / In Progress / Planned / Completed이며, 내부 status 키 active/planning은 기존 query URL 호환을 위해 유지합니다. 데이터가 없는 필터는 숨기며 Archived는 All에서 볼 수 있습니다.

Status 근거: 사용자 확인에 따라 ct·KUROOM·Convoary를 Completed, KUTODO·Spool을 In Progress(active), 콕착·KVCompact를 Planned(planning)로 표시합니다. ZZZ·Smart Parking·Review Analyzer는 기존 수업 시연 완료 기록에 따른 Completed를 유지합니다. Completed는 운영·검증 완료와 독립적이며 validation은 바꾸지 않습니다. 새 계획인 콕착·KVCompact에는 validation을 추정하지 않습니다.

Spool·KVCompact는 사용자가 지정한 systems-track의 설계와 capability 문서를 바탕으로 문제·구조·선택·검증 계획·한계를 한영 본문에 정리했습니다. Spool은 설계와 Go CLI 진입점 골격을 확인했으나 핵심 저장·복구 구현이나 실측 결과는 없습니다. KVCompact는 Python/PyTorch/Triton 기반 저장 형식·커널·통합·실험 계획이며 코드·baseline 실행·GPU 실측·품질 결과는 없습니다. 계획한 기술은 본문에서 구분하고 KVCompact의 technologies 목록이나 validation을 실제 사용·검증 성과처럼 채우지 않았습니다. 두 프로젝트의 진행 분류와 featured 선택은 유지합니다. 확인 경로와 해석 범위는 CONTENT_SOURCES.md에 기록합니다.

발주콜 항목은 콕착(Kokchack)으로 표시합니다. 기존 /projects/baljucall/ 및 /work/baljucall/ URL은 유지합니다. D:/_workspace/repos/Kokchack의 README, docs/project-definition.md, docs/design/05-kokchack-as-is.md를 읽어 현재 요구사항과 이전 Flutter·SQLite 프로토타입을 구분했습니다. 이전 구현·실패 테스트는 상세의 역사 기록에 보존하며, 현재 콕착 계획의 기술·검증 성과로 표시하지 않습니다. 예전 썸네일 자산은 보존하되 새 서비스 구현 화면처럼 노출하지 않습니다.


Tested는 전체 통합이나 실사용 검증 완료를 뜻하지 않습니다. KUTODO는 파싱/동기화 정책, KUROOM은 시간 구간과 Python/TypeScript 결과 비교, Convoary는 합성 데이터/모의 API 검증 범위입니다. ct의 In use는 문서에 명시된 개인 실사용입니다. ZZZ/Smart Parking/Review Analyzer의 시연은 프로토타입 근거이며 운영 성과가 아닙니다. 콕착의 과거 발주콜 구현과 현재 계획은 분리합니다.

## 추가 증거가 필요한 내용

- 미분류 5개 프로젝트의 origin 확인. 팀 규모/학교 소속으로 추정하지 않았습니다.
- ZZZ: 재현 가능한 테스트/측정 기록과 장기 운영 근거가 없습니다.
- Convoary: 실제 계정 OAuth/기기 간 검증은 mock과 구분해야 합니다.
- KUTODO: 현재 문서 기준 실제 계정 E2E 및 알림/위젯 전체 통합은 미검증입니다.
- KUROOM: 현재 문서가 여전히 공개 배포 준비 중이라고 설명합니다. 새 배포 URL은 확인 후 별도로 등록해야 합니다.
- Review Analyzer: Linux/headless crawler 안정화와 분석 품질 정량 평가가 필요합니다.
- Smart Parking: 복구와 장기 하드웨어 안정성은 미검증입니다.
- ct: 모든 OS clean-install 재현과 외부 사용자 성과는 확인되지 않았습니다.
- 발주콜: 보존본의 실패 테스트와 실제 기기/매장 미사용 상태를 보존했습니다.

이름·상태를 사용자 확인에 따라 갱신하고 KUROOM의 진행 표현, 콕착의 계획/과거 기록 구분을 정리했습니다. 새 경력, 성능 수치, 사용자 수나 성과를 추가하지 않았습니다.

## 검증

npm run build → npm run check → npm test → npm run test:browser → npm run test:rendering.

npm test는 실제 빌드와 .verification/content-current fixture 하나를 재사용합니다. 프로젝트/locale 전체, 원본 링크/미디어, canonical/legacy URL, 선택적 metadata/assets, static diagram, 3D dependency 제거를 검사합니다.

브라우저 검사는 기본 탐색/history, 상태 필터 저장/키보드, 언어 context, 360/390/412/430/768/1280/1440px, 영상 bounds, no-JS 가독성, 실패 이미지 fallback, diagram focus 복귀를 포함합니다. Planning 필터는 fixture에서만 검증합니다.

외부 요청은 반복 가능한 검사에서 차단하므로 실제 YouTube 재생이나 외부 사이트 생존 여부는 확인하지 않습니다. 기존 game 전용 테스트 명령은 제거된 UX와 함께 정리했습니다. GitHub Pages workflow의 보안 설정/Node 버전/배포 방식은 유지했습니다.

렌더링 검사는 새 context의 EN/KO 360/1280px에서 첫 폰트 요청, 반복 이동의 동일 문서 유지, prefetch가 영상 iframe을 생성하지 않는지, React 런타임 무요청, 초기 query 필터의 첫 표시, 뒤로가기와 dialog 정리, 헤더 scroll listener 1개 유지를 확인합니다. 로컬 자산 크기와 동작 검증이며 배포 서버의 응답 시간·캐시 hit rate를 측정한 결과는 아닙니다.

## 폰트와 작은 이미지

원본 2,057,688-byte WOFF2는 재생성 원본으로 보존합니다. scripts/subset-fonts.py가 latin(약 81KB), UI·요약 common(약 69KB), 상세 본문 content(약 23KB), 나머지 지원 문자를 unicode-range로 분리했습니다. 긴 기술 본문을 추가해도 홈용 common이 함께 커지지 않도록 본문 묶음을 분리했습니다. Mermaid 생성기 등 mjs의 UI 문자도 포함합니다. 문자 누락을 막기 위해 추가 조각도 함께 보관합니다. 파생 폰트 내부 family는 Portfolio Sans로 변경하고 원본 copyright/OFL을 보존했습니다. 첫 Home의 폰트 요청은 EN 약 81KB, KO 약 151KB이며 원본 통파일을 요청하지 않습니다. Latin만 preload합니다. 생성별 정확한 크기는 public/fonts/portfolio/manifest.json과 렌더링 검사 결과에서 확인합니다. 새 문자를 추가해도 extra 조각을 사용할 수 있으며, 묶음 최적화가 필요할 때만 Python/FontTools로 재생성합니다. 일반 빌드/CI에는 Python이 필요하지 않습니다.

학교 로고는 원본 235,660-byte PNG를 보존하고 64px WebP(4,266 bytes)로 생성해 32px로 표시합니다. 프로필 사진과 프로젝트 이미지 최적화는 유지합니다.

## 아이콘과 언어 선택

프로젝트 목록은 아이콘/thumbnail 없이 텍스트만 표시합니다. 제공된 icon.svg 및 기존 thumbnail 자산은 보존하되 목록에서 요청하지 않습니다. Header는 favicon.svg와 Home / Projects / About 텍스트 링크입니다. favicon의 G 전면은 흰 배경에서 읽히도록 진한 잉크색으로 조정했습니다. Home은 GitHub/email 아이콘 두 개, Contact/Footer는 공통 ContactLinks의 GitHub/email/LinkedIn/Velog 아이콘을 표시합니다. About은 소개·학력·기술·연락처와 실제 존재하는 Resume PDF / Portfolio PDF를 표시합니다. 중복 프로젝트 소개는 제거했습니다. 기존 `/contact/`·`/ko/contact/` 및 Home의 `#contact`는 About의 연락처로 연결합니다.

MP4 6개의 콘텐츠 참조는 제거했지만 public/videos/projects 아래 실제 파일 삭제는 OS 권한으로 거부됐습니다. 현재 페이지는 이 파일을 요청하지 않습니다. 파일 자체가 삭제되기 전에는 public 복사 규칙에 따라 배포 출력에도 미참조 파일로 남습니다.

3D pet과 렌더러는 사용하지 않습니다. About 사진은 560px WebP로 최적화하며 표시 폭은 desktop 280px, mobile 240px입니다. 학교 로고는 기존 images/background/konkuk.png입니다.

Language 아이콘의 native popover에서 한국어/English를 선택합니다. 일반 홈 최초 진입(/, hash 없음)에는 브라우저의 지원 언어 우선순위를 사용하고, 수동 선택은 localStorage에 저장해 우선합니다. /ko/ 및 상세 직접 링크의 locale은 자동 변경하지 않습니다. IP/위치 권한/외부 지역 조회는 사용하지 않습니다. storage가 차단돼도 수동 English 홈 선택이 다시 한국어로 튕기지 않도록 lang query fallback을 제공합니다.

UI 제목은 양쪽 locale에서 영어로 유지하며 이름/설명/프로젝트 원문 등 콘텐츠는 기존 한영 구조를 유지합니다.

## 파일 정리 제한

이전 V3 작업에서 소스/스타일/모델 43개와 Three.js/R3F/types 등 패키지 19개를 제거했습니다. Windows 권한으로 삭제하지 못한 옛 소스 11개는 사용하지 않으며 typecheck에서 제외했습니다. 소스 정리 패치는 .verification/v3-legacy-cleanup.patch에 있습니다. pet.png는 현재 페이지에서 사용하지 않습니다.

## 참고

https://mitchellh.com/ 의 간결한 소개/탐색, https://danluu.com/ 의 텍스트 목록 위계를 참고했습니다. 제공된 sslab.konkuk.ac.kr 및 dslab.konkuk.ac.kr 홈은 이 환경에서 가져오지 못했으며 정확한 시각 디자인을 확인했다고 주장하지 않습니다. 요청에 적힌 연구실식 정보 구조를 기반으로 구성했습니다.
