# GIRIBUIN portfolio V2

Astro 포트폴리오입니다. 기본 언어는 English이며 /ko/에서 Korean을 제공합니다. 프로젝트는 하나의 responsive Projects Grid에서 탐색합니다.

## 배포

- 저장소: GIRIBUIN/GIRIBUIN.github.io
- 공개 주소: https://giribuin.github.io/
- main에 push하면 GitHub Actions가 의존성·Mermaid 빌드용 Chromium을 설치하고 타입 검사·정적 빌드 후 dist를 GitHub Pages에 배포합니다.
- 기존 포트폴리오의 커밋 이력은 보존합니다. V2 코드는 portfolio-v2 작업 폴더에서 관리합니다.
- 로컬 개발에서는 noindex를 유지하고 공개 빌드에서는 검색 제한을 제거합니다.
- 나중에 호스팅을 옮길 때 SITE_URL 환경 변수로 사이트 주소를 지정할 수 있습니다. 빌드 명령은 npm run build, 출력 폴더는 dist입니다. Mermaid 빌드에는 Chromium이 필요하므로 Cloudflare 전환 시에도 빌드 환경을 준비하거나 Actions에서 만든 dist를 업로드합니다.

## 시각 테마

채도를 낮춘 종이색 배경(#F2ECDE), charcoal 본문, terracotta/teal/coral/yellow/purple/green 포인트를 사용합니다. olive/sage와 sky 테마 토큰은 제거했습니다. 토큰은 src/styles/global.css의 :root에 모으고 기존 --ink/--panel은 호환 alias로 유지합니다. 주요 포인트의 점·선·글자·포커스는 #B85F4B로 통일하고 CTA는 yellow를 사용합니다.

body에는 옅은 노란 종이색 gradient를 적용하고 상단 바는 별도의 옅은 청록색으로 구분합니다. Hero에만 terracotta(14%)/purple(10%) halo와 희미한 48px grid를 적용합니다. Hero 배경은 화면 전체 폭으로 이어지고 콘텐츠는 중앙 너비를 유지합니다. 양옆의 정적인 파스텔 원형 선은 잘리지 않게 배치하며 모바일에서는 halo와 grid만 남깁니다. 기존 카드에 얇은 border·작은 neutral shadow를 적용하고 Projects의 2열 미디어 중심 구성은 유지합니다. 프로젝트 순서에 따라 coral → teal → purple → green 색이 hover 테두리에 반복됩니다. 제목은 칩 없는 charcoal 텍스트입니다. code block은 github-light syntax palette와 밝은 surface를 사용합니다.

## 실행과 검증

Node >=22.12.0, npm을 사용합니다.

~~~powershell
npm run dev -- --host 127.0.0.1
npm run check
npm test
npm run test:browser
npm run test:project-media
~~~

npm test는 실제 프로덕션 빌드와 격리된 콘텐츠 fixture 빌드를 수행합니다. npm run build로 빌드만 실행할 수도 있습니다. 브라우저 검증은 생성된 dist와 fixture를 별도 임시 로컬 서버에서 열고, 종료 시 서버·브라우저를 정리합니다. 외부 요청은 차단합니다. 별도 lint 도구는 도입하지 않았고 Astro/TypeScript 진단은 npm run check로 수행합니다.

## 화면과 분류

Hero → About Me → Education → Skills → Projects → How I Build → Contact → Footer.

EN/KO를 전환해도 Header·Quick Trace Rail·섹션 제목은 영어로 유지합니다. 소개와 설명 본문은 선택한 언어로 표시합니다.

Hero에는 직무 라벨 없이 이름·소개·system trace·버튼을 표시합니다. Quick Trace Rail에는 섹션명만 표시하고 별도 상단 라벨은 두지 않습니다.

섹션은 콘텐츠 높이를 유지하면서 화면 높이에 따라 간격을 조절합니다. Hero는 첫 화면을 기준으로 맞추고 About 사진은 최대 360px(mobile 280px) 너비로 제한합니다. 앵커 이동은 실제 Header 높이 + desktop 24px/mobile 16px를 비우며, Trace Rail은 제목 근처의 읽기 위치와 페이지 끝을 추적합니다. Contact는 내용 높이에 맞추고 링크 아래 여백만 유지합니다.

Projects는 640px 이상 2열, 639px 이하 1열입니다. 홈에는 order 순서대로 첫 4개(ZZZ → Smart Parking → Review Analyzer → ct)를 표시합니다. 제목은 배경·패딩 없는 일반 텍스트입니다. 섹션 제목 오른쪽의 화살표 아이콘은 /projects/ 또는 /ko/projects/ 전체 목록 페이지로 이동합니다. 전체 목록과 프로젝트 상세의 집 아이콘은 홈 Projects로 돌아갑니다. 세 이동 아이콘과 Hero의 Resume PDF·Portfolio PDF 버튼, How I Build 닫기 버튼은 같은 밝은 기본 배경·테두리와 짙은 charcoal hover/누름 배경을 사용합니다. 이동 아이콘에는 localized aria-label/title이 있습니다. 전체 목록은 같은 카드와 Grid를 재사용하며 현재 7개와 향후 추가 프로젝트를 order 순서대로 모두 표시합니다. 홈 안에서 펼치지 않습니다.

기본 카드는 16:9 미디어·제목·짧은 설명만 표시하며 클릭하면 해당 언어의 상세 페이지로 이동합니다. 영상 프로젝트는 이미지 poster/thumbnail/visual을 사용하지 않고 원본 영상의 정지된 첫 프레임을 표시합니다. 홈에서는 영상이 화면 약 1.5개 높이 앞에 있을 때 metadata와 첫 프레임을 준비하고, 전체 목록에서는 약 1개 높이 앞에서 준비합니다. 홈에 표시하지 않는 프로젝트는 카드/video를 렌더링하지 않습니다. 영상이 없는 프로젝트는 기존 image/thumbnail/visual 또는 neutral placeholder를 사용합니다. KUROOM·ct의 제작된 SVG 포스터는 연결하지 않으며 새 미디어를 만들지 않았습니다.

Floating Inspector는 제거했습니다. 640px 이상 fine pointer 환경에서 thumbnail 영역에 200ms hover하면 해당 영상만 muted/loop/playsinline으로 재생합니다. 제목·설명 hover나 keyboard focus로는 재생하지 않습니다. thumbnail을 벗어나거나 다른 영상에 이동하면 pause 후 첫 프레임으로 돌아갑니다. 마우스 클릭과 키보드 활성화는 바로 Deep Dive로 이동합니다.

Mobile/touch에서는 첫 탭으로 카드를 선택해 올림·그림자 효과와 무음 영상 미리보기를 표시합니다. 선택된 같은 카드를 한 번 더 탭하면 Deep Dive로 이동하며 두 탭 사이 시간 제한은 없습니다. 작은 안내 문구를 EN/KO로 표시하고 영상이 없는 카드도 같은 선택·상세 이동 규칙을 사용합니다. 다른 카드나 바깥을 탭하거나 선택 카드가 화면 밖으로 이동하면 선택과 재생을 해제합니다. 드래그·스크롤은 선택이나 상세 이동으로 처리하지 않습니다. 언어 전환·탭 비활성화·reduced-motion 변경 시에도 정지합니다. reduced-motion에서는 첫 탭으로 선택만 하고 영상 재생·올림 효과는 생략합니다. 열 개수와 무관하게 실제 터치 입력에 적용하며 마우스·키보드 동작은 유지합니다.

외부 액션은 기존 Deep Dive에서 제공합니다. Deep Dive 영상은 links.video의 YouTube 플레이어를 사용하며, 자체 확대 버튼이나 영상 위아래 안내 바 없이 플레이어의 기본 전체화면 기능을 사용합니다. npm run test:project-media는 빌드된 dist로 터치 미리보기와 데스크톱 영상 동작만 검증합니다.

정지된 첫 프레임은 원본 영상에서 canvas로 표시하고, 재생 중인 video 레이어만 보이게 합니다. thumbnail마다 paint/stacking 영역을 분리해 인접 영상이 가려지는 현상을 방지합니다. 별도 poster 파일은 만들지 않습니다.

## 공통 설정

src/data/site.ts에서 프로필과 링크를 관리합니다.

- resumeUrl: /files/resume-public.pdf
- portfolioPdfUrl: /files/portfolio.pdf
- heroImage: /images/profile/githubprofile.png
- profileImage: /images/profile/jeonggil.jpg (About 전용)
- me.jpg는 본문에서 사용하지 않습니다.
- profileAlt: EN/KO 대체 텍스트
- name, intro, bio, focus, educationStatus, educationProgram: 언어별 문구
- email, socials: Header·Contact가 공유하는 단일 URL 데이터

PDF 두 파일과 프로필 사진은 원본을 수정하지 않고 V2 public에 복사했습니다. PDF URL·사진 URL은 null을 허용하며 해당 요소를 생략합니다. socials의 url이 null인 항목도 숨깁니다. 현재 GitHub·LinkedIn·Velog를 표시하고 Instagram·Discord는 null입니다. Email은 기존 포폴과 공개 이력서에서 확인한 giribuin@gmail.com을 사용합니다.

## Localization

- src/i18n/ui.ts: UI 문구, 언어 목록, Locale 타입, localePath 함수
- /: English 홈, /ko/: Korean 홈
- /projects/: 전체 Projects 목록, /ko/projects/: Korean 전체 목록
- /work/[slug]/: English 상세, /ko/work/[slug]/: Korean 상세
- HomePage.astro·ProjectDetail.astro: 언어별 경로가 공유하는 구성
- EN/KO 전환: 버튼으로 현재 DOM의 공통 UI·프로필·원칙 문구만 변경합니다. 페이지 reload, route 변경, scroll-to-top이 없습니다.
- LanguageController.astro: 문서 scrollY·열린 모달 위치 보존, 언어별 텍스트·링크 영역 높이 확보. 홈/전체 목록에서 Projects DOM을 교체하지 않습니다.
- i18n/runtime.ts: UI·프로필·Skills·원칙 데이터의 공통 문구 조회

컴포넌트는 getUi(locale)와 공통 프로필 설정을 읽습니다. 최초 접속 /는 English입니다. 프로젝트 소개·trace는 translations.en/ko를 사용하며, 상세 본문은 기존 metadata/notes 구조를 사용합니다. 섹션 UI는 projectSection 키를 사용합니다. projects 키는 프로젝트별 문구 데이터이므로 섹션 제목 번역 키로 재사용하지 않습니다.

Skills.astro는 data/skills.ts의 프로젝트 경험 기반 분류를 표시합니다. 기술 타일은 같은 크기이며 아이콘 아래에 이름을 표시합니다. 그룹 너비를 넘는 기술은 화면 크기와 관계없이 그룹 안에서 옆으로 스크롤합니다. HowIBuild.astro는 data/buildPrinciples.ts의 여섯 원칙을 native dialog로 열며, 이유·근거 프로젝트·기여 방식을 설명합니다. Escape·닫기·배경 클릭과 포커스 복귀를 지원합니다.

## 프로젝트 콘텐츠

src/content/projects/[slug].md 한 파일이 프로젝트 identity, 분류, 링크, 미디어와 기본 한국어 문구를 관리합니다. 영어 문구는 같은 파일의 translations.en에 둡니다.

~~~yaml
---
slug: example
title: Example
summary: 한국어 요약
featured: true
section: work
order: 10
ownership:
  type: personal
category: Backend
tech: [Go, Docker]
cardTech: [Go, Docker]
trace:
  input: 짧은 입력 설명
  decision: 짧은 설계 판단
  output: 짧은 출력 설명
hidden: false
logo: null
thumbnail: null
translations:
  en:
    summary: A concise English summary.
    oneLine: A short description.
    type: Personal · Web
    problem: The problem.
    decision: The key decision.
    result: The verified outcome.
    trace:
      input: Short input description.
      decision: Short design decision.
      output: Short output description.
links:
  demo: null
  liveDemo: null
  source: null
  caseStudy: null
  release: null
  video: null
demo:
  type: none
  url: null
---
## 한국어 상세 기록
~~~

- featured·section은 legacy metadata로 허용하지만 홈의 분류·노출에는 사용하지 않습니다. section의 허용 값은 기존 work/tools를 유지합니다.
- order 오름차순이며 같은 값이면 slug 순입니다. order 미지정은 마지막입니다. 현재 순서는 10~70이며 중간 삽입은 order: 15처럼 지정합니다.
- trace는 기존 optional metadata로 보존합니다. 홈 카드에서는 INPUT/DECISION/OUTPUT 또는 trace overlay를 렌더링하지 않습니다.
- 새 Markdown 한 파일만 추가하면 전체 목록·홈 order 상위 4개·thumbnail hover에 자동 반영됩니다. 필수 필드는 title·slug·summary입니다.
- hidden: true는 홈과 두 언어의 상세 생성에서 제외합니다. Demo 유무는 노출 조건이 아닙니다.
- title·slug·summary가 필수입니다. 순서·노출·URL은 언어와 관계없이 공유하고 translations는 문구만 변경합니다.
- translations.ko도 지원하므로 필요하면 기본 한국어 문구를 override할 수 있습니다.
- logo·thumbnail에는 http(s) 또는 사이트 루트 기준 경로를 넣습니다. 로고가 없어도 제목 텍스트를 표시합니다. 현재 사용하는 Smart Parking cover는 public/images/projects/smart-parking/cover.webp에 둡니다. 기존 SVG dark/light 쌍은 보존합니다.
- 기본 카드는 실제 영상이 있으면 영상 첫 프레임을 우선합니다. 영상이 없으면 thumbnail → 실제 image 미디어 → visual 순서로 이미지를 표시하며 모두 없으면 neutral placeholder를 표시합니다.
- 상세 영상은 links.video의 YouTube 주소를 사용하며 MP4를 렌더링하지 않습니다. 이미지·웹 Demo·APK와 미디어가 없는 경우의 fallback은 기존 metadata를 사용합니다.

## Deep Dive와 Demo

기본 Markdown 본문은 한국어 상세 기록입니다. src/content/project-notes/en/[slug].md가 영어 상세 기록입니다. 향후 다른 언어의 본문도 해당 locale/slug 파일로 추가할 수 있습니다. 번역 본문이 없으면 한국어 원문과 번역 안내를 표시하고 원문에 lang=ko를 지정합니다.

상세 화면은 최대 900px의 중앙 문서 열입니다. Astro의 기본 Markdown 렌더링과 github-light 코드 강조를 재사용합니다. 제목 구분선, 순서 목록, 인용, 표, 코드 블록을 README처럼 표시하며 긴 표·코드는 본문 안에서 가로 스크롤됩니다. 한국어 본문은 src/content/projects/[slug].md의 frontmatter 아래를, 영어 본문은 src/content/project-notes/en/[slug].md를 수정하면 됩니다.

큰 구조는 `mermaid` 코드 블록으로 작성하면 빌드 시 SVG로 변환됩니다. 각 그래프에는 `accTitle`과 `accDescr`를 넣고, 자료로 확인한 주요 구성 요소와 관계만 그립니다. 클라이언트용 Mermaid 스크립트는 추가하지 않습니다.

~~~mermaid
flowchart TB
  accTitle: 서비스 구조
  accDescr: 수집한 데이터를 저장하고 API로 제공합니다.
  A["데이터 수집"] --> B["저장"]
  B --> C["API"]
~~~

빌드 렌더러는 Windows에서 설치된 Edge/Chrome을 찾습니다. 다른 환경에서는 Playwright Chromium을 설치하거나 `MERMAID_BROWSER_PATH`로 Chromium 계열 실행 파일을 지정합니다. 이는 빌드 환경에만 필요합니다.

links.video에 youtu.be 또는 youtube.com/watch·shorts·embed 주소를 넣으면 YouTube iframe으로 변환합니다. 자동재생하지 않고, lazy loading과 기본 플레이어 controls/fullscreen을 사용합니다. YouTube 주소가 없거나 유효하지 않은 영상 프로젝트는 MP4 대신 기존 정적 fallback을 표시합니다. 홈·전체 Projects의 MP4 첫 프레임/hover 재생 정책은 유지합니다.

ProjectActions.astro는 Source·Watch video·Release·Live Demo 중 URL이 있는 액션만 표시합니다. Live Demo는 links.liveDemo 또는 기존 links.demo를 사용합니다. Grid 카드의 Deep Dive는 항상 기존 언어별 /work/[slug]/ 상세 경로입니다. links.caseStudy는 legacy metadata로 보존합니다. How I Build 팝업에는 WHY/HOW/EVIDENCE 설명만 유지합니다.

| demo.type | 연결 대상 |
| --- | --- |
| iframe | 임베드 가능한 웹 URL |
| video | 직접 접근 가능한 MP4/WebM |
| terminal | video 또는 format: image 미디어 |
| apk | APK 다운로드 URL |
| image | alt를 포함한 이미지 |
| none | 콘텐츠/typography fallback |

현재 7개 모두 새 포트폴리오용 라이브 Demo는 미연결입니다. ZZZ·Smart Parking의 과거 시연 영상, ct v0.3.1과 KUTODO의 중간 beta release 링크는 기존 근거에 따라 제공합니다. 발주콜은 비공개 저장소이므로 공개 Source·APK 링크를 노출하지 않습니다. iframe 차단 정책과 실제 프로젝트 영상 재생·APK 실행은 URL 연결 후 별도 확인해야 합니다.

## Header와 접근성

Header.astro는 sticky header에 data-hidden을 적용합니다. requestAnimationFrame으로 스크롤을 묶고, 같은 방향의 누적 이동이 아래 36px·위 20px일 때 숨김·노출을 전환합니다. 최상단 24px 이내와 키보드 탐색 시에는 표시합니다. prefers-reduced-motion에서는 transition과 smooth scroll을 제거합니다.

Projects·About·Contact는 홈에서 section anchor로, 상세에서는 같은 언어의 홈 section으로 연결됩니다. Projects의 canonical id는 #projects이며 기존 #work/#tools는 같은 위치의 호환 anchor입니다. 모든 상세 페이지의 돌아가기 링크도 #projects를 사용합니다. Footer는 @giribuin만 표시합니다. Skip link, visible focus와 이미지 alt를 지원합니다.

콘텐츠 출처와 확인 범위는 docs/CONTENT_SOURCES.md, 검증 결과는 docs/VALIDATION.md를 참고하세요.
