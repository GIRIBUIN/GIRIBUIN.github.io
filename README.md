# Portfolio V2 foundation

최종 포트폴리오 문구를 작성하기 전, 콘텐츠 구조·정보 위계·Demo 연결 방식을 검증하는 로컬 프로토타입입니다.

- 위치: `D:\10_proj\portfolio-v2` (기존 저장소 기준 `../portfolio-v2/`)
- Astro 7.3.2 / TypeScript strict / Content Collections / 정적 생성
- 기존 저장소는 read-only reference. 배포·원격 저장소 연결·GitHub Pages·DNS 변경은 수행하지 않습니다.
- 소개, 경력, 프로젝트 설명·기술 목록은 검토 전 placeholder입니다. 참고 이미지는 실제 Demo와 구별합니다.
- AI chatbot/RAG, 서버, DB, Cloudflare backend는 범위에 없습니다.

## 로컬 실행

Node >=22.12.0, npm을 사용합니다. 이번 검증 환경은 Node 24.14.1 / npm 11.11.0입니다.

```powershell
cd D:\10_proj\portfolio-v2
npm ci
npm run dev -- --host 127.0.0.1
```

기본 주소: http://127.0.0.1:4321

```powershell
npm run check
npm run build
npm run preview -- --host 127.0.0.1
npm test
npm run test:browser
```

`npm test`는 실제 Astro 빌드를 수행하고 `.verification/content-*/`의 격리된 복사본에서만 콘텐츠를 변경합니다. 기존 저장소와 원본 Markdown은 변경하지 않습니다. 검증 산출물은 Git에서 제외됩니다.
브라우저 검증은 로컬 Edge → Chrome → Playwright Chromium 순으로 이용하고 서버를 종료합니다. 설치된 브라우저가 없다면 `npx playwright install chromium`이 필요합니다. 이 작업의 브라우저 검증은 실제 로컬 브라우저로 수행합니다.
별도 lint 도구는 도입하지 않았으며 `astro check`가 Astro/TypeScript 진단을 담당합니다.

## 기존 포트폴리오 분석

| 항목 | 확인 결과 |
| --- | --- |
| 기준 위치 | D:\10_proj\GIRIBUIN.github.io |
| 기준 HEAD | 3d8869a9a3facee2a47476bad56e0843f3934095 |
| 최초 상태 | git status clean |
| Framework | Astro 7.3.2 설치, package.json ^7.3.2 |
| 패키지 관리 | npm, package-lock.json |
| 테마 | 현재 코드 기준 흰 배경 #fff, 텍스트 #202020, 문서형 레이아웃. Monokai 아님 |
| 폰트 | Georgia, Times New Roman, Noto Serif KR 등 시스템 serif fallback. 로컬 폰트 파일 없음 |
| 콘텐츠 | src/data/projects/entries/*.ts / typed project objects |
| 등록 프로젝트 | ZZZ, Raspberry Pi 스마트 주차, Review Analyzer |
| 기타 정보 | 이름·연락처·GitHub·LinkedIn·학력·개발 관심 분야·이력서 PDF·개발 중 항목 |
| 자산 | ZZZ/Review Analyzer 화면·시스템 구성도, 스마트 주차 구성도, 프로필/연락 사진, SVG 아이콘, resume.pdf |

재사용한 것은 확인된 이름·계정/연락 링크와 ZZZ/Review Analyzer 참고 이미지 두 개입니다. 이미지의 원본 경로와 맥락은 `public/images/reference/README.md`에 기록했습니다.
학력/경력은 V2에서 placeholder로 두었고 기존 이력서 PDF는 최신 여부를 확정하지 않아 복사하지 않았습니다. 사진·구성도·아이콘은 재사용 가능한 후보지만 이번 화면에 필요하지 않아 복사하지 않았습니다.
기존 페이지 구조, CSS, 컴포넌트, 상세 콘텐츠 구현은 복제하지 않았습니다. Astro 기본 Welcome 및 장식 자산도 가져오지 않았습니다.

## 디렉터리

```text
portfolio-v2/
  astro.config.mjs
  package.json / package-lock.json
  tsconfig.json
  public/
    favicon.svg
    images/reference/           # 출처를 기록한 참고 이미지
  src/
    content.config.ts          # 프로젝트 schema, Markdown glob loader
    content/projects/          # 프로젝트 콘텐츠 5개
    data/site.ts               # 소개·경력·연락처·개발 과정
    lib/projects.ts            # 공개 여부·그룹·순서 정책
    layouts/Layout.astro
    components/
      Header.astro / Hero.astro / SectionHeading.astro
      ProjectShowcase.astro / ProjectDemo.astro / ToolItem.astro
      HowIBuild.astro / About.astro / Contact.astro
    pages/
      index.astro
      work/[slug].astro        # 공개 프로젝트의 정적 상세 경로
    styles/global.css
  scripts/
    verify.mjs                 # 콘텐츠 변경 실제 빌드 검증
    browser-check.mjs          # 로컬 브라우저 검증
    verify-reference.mjs       # 작업 시작 시 baseline과 기존 저장소 비교
  docs/
    VALIDATION.md
  .verification/               # 미추적: 복사본·결과 JSON·스크린샷
  dist/                        # 미추적: 정적 결과
```

## UX 결정

- Hero → Selected Work → Tools → How I Build → About → Contact의 one-page 흐름입니다.
- 이름/role, 한 줄 positioning, 대표작 진입을 첫 화면에 배치했습니다.
- 대표작은 번호·큰 제목·핵심 문장·문제/판단/결과·넓은 Demo를 가진 연속된 작품 영역입니다.
- 작은 도구는 압축된 행과 접을 수 있는 Demo로 위계를 구분합니다.
- 홈페이지의 native details로 Markdown 기록을 펼치거나 /work/[slug]/에서 읽습니다.
- sticky 메뉴는 홈에서 #work/#tools/#about/#contact로 스크롤하고 상세 페이지에서는 홈의 해당 위치로 돌아갑니다.
- charocal 배경, 따뜻한 off-white 텍스트, 절제된 연두 accent. 프로젝트 Demo가 시각적 중심입니다.
- 외부 웹폰트·UI framework·애니메이션 라이브러리 없이 시스템 sans/mono를 사용합니다.
- 모바일에서 대표작은 한 열로 전환합니다. 키보드 skip link, visible focus, semantic headings, image alt, reduced motion을 지원합니다.

## 콘텐츠 schema

필수는 `title`, `slug`, `summary`입니다. 나머지는 기본값 또는 선택 필드입니다.

| 필드 | 용도 / 기본값 |
| --- | --- |
| title / slug / summary | 이름 / 고유 경로 / 요약 |
| oneLine | 홈페이지의 핵심 한 줄. 없으면 summary 사용 |
| type | 화면의 프로젝트 분류 문구. 기본 project |
| featured | Selected Work 여부, 기본 false |
| section | work 또는 tools, 기본 work |
| order | 오름차순, 기본 100. 같으면 slug 순 |
| hidden | 홈과 정적 상세 경로에서 제외, 기본 false |
| tech | 기술 문자열 배열, 기본 빈 배열 |
| problem / decision / result | 홈페이지의 짧은 근거, 없으면 해당 행 생략 |
| visual | 선택적 url, alt(필수), caption. Demo가 없을 때 참고 이미지 |
| links | demo, source, release, video. 모두 null 허용 |
| demo | type, url, poster, format, alt, caption |
| Markdown body | 홈 펼치기와 상세 페이지에서 동일하게 렌더링 |

URL 필드는 http(s) 또는 `/images/example.png` 같은 사이트 기준 경로를 사용합니다. 이미지 Demo에는 alt를 작성합니다. slug는 소문자 영문/숫자/하이픈이고 공개 프로젝트 간 고유해야 합니다.

### 추가

`src/content/projects/new-project.md`를 추가합니다. UI 수정은 필요하지 않습니다.

```yaml
---
title: "New project"
slug: "new-project"
summary: "[임시] 프로젝트 요약"
featured: true
section: "work"
order: 10
hidden: false
tech:
  - TypeScript
links:
  demo: null
  source: null
  release: null
  video: null
demo:
  type: "iframe"
  url: null
---
## 문제와 제약
[임시] 여기에 기록합니다.
```

### 숨김 / 제거 / 이동 / 순서

- 숨김: `hidden: true`. 홈과 상세 생성에서 제외됩니다. 접근 제어 수단이 아니므로 비공개 정보를 파일에 보관하지 않습니다.
- 제거: 해당 md 파일을 삭제한 뒤 재빌드합니다.
- 대표작: `featured: true` + `section: work`.
- 일반 목록: `featured: false`이면 section과 관계없이 Tools에 표시합니다.
- Tools로 이동: `section: tools`가 featured보다 우선합니다.
- 순서: 각 영역에서 `order` 오름차순. 값이 같으면 slug 순.
- 상세 설명: Markdown body를 수정합니다. 링크: `links.source` 등을 수정합니다.
- 소개/연락처/경력/Resume: `src/data/site.ts`에서 수정합니다. Resume는 기본 null이며 실제 PDF를 public에 추가한 뒤 href를 지정합니다.

## Demo 연결

| demo.type | demo.url 연결 대상 | 표시 |
| --- | --- | --- |
| iframe | 임베드를 허용하는 웹 URL | 내부 iframe + Open Full Demo |
| video | 직접 접근 가능한 MP4/WebM | native controls, preload none |
| terminal | MP4/WebM 또는 GIF/image | format: video(기본) / image로 선택 |
| apk | Demo Mode APK 다운로드 URL | 다운로드 버튼, 기기 wireframe |
| image | PNG/JPG/WebP/SVG/GIF URL | alt와 함께 이미지 표시 |
| none | null | 기록 준비 fallback |

- URL null: visual이 있으면 참고 이미지를 표시하고, 없으면 유형에 맞는 wireframe 안내를 표시합니다. 빈 링크·깨진 src는 생성하지 않습니다.
- `links.demo`: 별도 Full Demo 주소. iframe의 demo.url과 다르면 이 값을 우선합니다.
- `links.video`: APK와 함께 시연 영상 링크를 둘 수 있습니다.
- `links.release`: APK/GitHub Release/binary release 링크.
- `demo.poster`: 영상 포스터, `demo.caption`: 설명, `demo.alt`: 이미지 설명.
- YouTube 등 일반 재생 페이지 주소를 native video에 넣지 않습니다. embed 주소는 iframe, 일반 URL은 links.video에 둡니다.
- iframe은 lazy loading과 제한된 sandbox를 사용합니다. 대상 서비스가 CSP frame-ancestors 또는 X-Frame-Options로 임베드를 금지하면 내부 표시가 제한되므로 Open Full Demo로 접근합니다. 이런 브라우저 차단은 iframe의 error 이벤트로 신뢰성 있게 감지할 수 없어 외부 버튼을 항상 제공합니다.
- 이미지/영상 네트워크 로드 실패에는 안내 문구를 제공합니다. 원본 링크는 유지됩니다.
- 현재는 실제 Demo backend/API를 연결하지 않았습니다.

## 향후 Cloudflare Pages

현재 배포 설정이나 배포 명령은 추가하지 않았습니다. 아래는 사람이 나중에 수행할 작업입니다.

1. 실제 문구·기여 범위·이미지·Demo URL·이력서의 정확성과 사용 권한을 확인합니다.
2. 도메인이 정해지면 필요에 따라 Astro site 값을 설정합니다.
3. 공개 시 Layout의 noindex/nofollow를 재검토합니다.
4. 이 독립 프로젝트용 Git 저장소와 Cloudflare Pages 프로젝트를 별도로 연결합니다.
5. Build command: `npm run build`, output: `dist`, root: 이 프로젝트 루트. 지원 Node 버전을 지정합니다.
6. 배포 전 check/build와 링크/임베드 접근성 검증을 다시 합니다.
7. 정적 배포에는 Cloudflare adapter, Worker backend, DB가 필요하지 않습니다.

공식 참고: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), [Cloudflare Pages Astro 가이드](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## 다음 사람이 결정할 사항

- Hero의 최종 positioning과 한국어/영어 표현 비중
- 실제 대표작 선정과 순서, 프로젝트별 기여·판단·결과의 밀도
- 각 Demo의 기본 표현: 내장 웹 / 영상 / APK / 이미지
- ZZZ의 과거 참고 화면을 새 샘플 데이터 Demo로 교체할 시점
- 홈 펼치기와 상세 페이지를 모두 유지할지
- 최종 타이포그래피·accent·작품 영역 크기, 최신 Resume
- 공개 시 연락처·프로필 정보·검색 노출 정책
