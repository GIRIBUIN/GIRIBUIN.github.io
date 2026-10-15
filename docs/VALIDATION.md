# 로컬 검증

## Projects 터치 미리보기 (2026-10-15)

- 첫 탭은 카드 선택·무음 미리보기, 같은 카드의 다음 탭은 locale 상세로 이동하도록 변경했습니다. 두 탭 사이 시간 제한은 없습니다.
- 드래그·pointercancel은 선택하지 않고, 가상 마우스 leave는 터치 선택을 해제하지 않습니다. 마우스 hover와 한 번 클릭, 키보드 Enter의 상세 이동을 유지합니다.
- npm run test:project-media로 390×844(1열), 844×390·1024×768(2열), desktop 1440×1000을 검증했습니다. 이전 영상 정지, 화면 밖 해제, EN/KO 전환, 영상 없는 카드, reduced-motion, 재생 거부 후 상세 이동을 포함합니다.
- 실제 단말 대신 Edge의 터치·모바일 에뮬레이션과 CDP 터치 드래그로 검사했습니다. iOS Safari의 실제 기기 사용감은 별도 확인 대상입니다.

## GitHub Pages 전환 준비 (2026-10-15)

- 현재 V2를 GIRIBUIN/GIRIBUIN.github.io의 main으로 배포하도록 workflow를 구성했습니다. 기존 커밋은 V2 이력에 연결하며 강제 push를 사용하지 않습니다.
- npm run check: 45개 파일, 오류·경고·힌트 0건. npm test: 실제 정적 빌드와 fixture를 포함한 콘텐츠 검사 20개 통과.
- EN/KO 상세 14개, 1440·820·390·360px 중앙 배치, 모바일 overflow, Mermaid 접근성·키보드 스크롤, 언어 전환 시 위치·YouTube context 유지를 확인했습니다.
- 실제 YouTube 재생·기본 전체화면 동작을 확인했습니다. 공개 빌드에서는 로컬용 noindex를 제거합니다.
- workflow는 Ubuntu에서 Chromium을 설치한 뒤 타입 검사·빌드·Pages 배포를 수행합니다. 공개 반영 여부는 Actions 결과와 실제 URL에서 별도로 확인합니다.

## Hero 직무 라벨·Quick Trace 상단 라벨 제거 (2026-10-14)

- Hero 중앙의 `Backend / Systems Developer`와 Quick Trace의 `ON THIS PAGE` 표시를 제거했습니다. 이름·소개·trace·섹션 이동·접근성 이름은 유지합니다.
- 브라우저에서 두 문구가 렌더링되지 않는지와 Hero 중앙 배치를 확인합니다.

## Projects 영상 첫 프레임 선로딩 (2026-10-14)

- 기존 100px 앞 로딩을 홈에서는 viewport 높이의 1.5배, 전체 목록에서는 1배(최소 800px) 앞 로딩으로 조정했습니다. 영상은 계속 일시정지 상태로 첫 프레임만 canvas에 표시하고, hover 재생 정책은 유지합니다.
- Projects가 화면 아래에 있는 상태에서 ZZZ·Smart Parking의 첫 프레임이 준비되는 브라우저 검사를 추가했습니다. 콘텐츠/빌드 19개와 브라우저 검사를 통과했습니다.

## Hero 파스텔 배경 (2026-10-14)

- Hero의 `.shell` 폭 제한을 배경에서 분리해 화면 전체 폭으로 이어지게 했습니다. 중앙 콘텐츠는 기존 너비를 유지합니다. 양옆에 옅은 teal·purple 원형 선과 정적인 파스텔 음영을 배치했고 모바일에서는 원형 선을 숨겨 halo와 grid만 유지합니다. `aria-hidden` 장식이며 pointer 입력을 받지 않습니다.
- production/fixture build·content 19개 통과. 1440×900 및 390×844 화면 캡처에서 배경의 전체 폭, 원형 선 전체, 텍스트·프로필·버튼 가림과 가로 넘침이 없는지 확인했습니다. 캡처: .verification/layout-hero-full-bleed-1440-hero.png, layout-hero-full-bleed-390-hero.png.
- 수정: Hero.astro, README, 이 문서.

## KO 섹션명 고정 (2026-10-14)

- KO 전환 시 Quick Trace Rail의 접근성 이름·여섯 섹션명과 Education 제목을 영어로 유지합니다. Header·본문 섹션 제목도 같은 영어 표기를 사용하고 설명 본문은 한국어를 유지합니다.
- 수정: ui.ts, browser-check.mjs, README, 이 문서. production/fixture build·content 19개, browser 19개 그룹, Astro/TypeScript 오류·경고·hint 0개.

## Skills 기술 배치 (2026-10-14)

- 그룹 장식 기호 4개와 사용하지 않는 `mark` 데이터를 제거했습니다. 기술 22개는 기존 SVG를 사용하며 아이콘 아래에 이름이 오도록 정렬했습니다.
- 기술 타일은 모든 화면에서 88×96px로 통일했습니다. 그룹 너비를 넘으면 그룹 안에서 가로 스크롤하며 body는 넘치지 않습니다. desktop/mobile 캡처에서 장식 기호 제거와 아이콘·이름 정렬을 확인했습니다.
- production/fixture build·content 19개, browser 19개 그룹 통과. Astro/TypeScript 오류·경고·hint 0개. 수정: Skills.astro, skills.ts, global.css, browser-check.mjs, README, 이 문서.

## 섹션 높이·앵커 위치 조정 (2026-10-14)

- 섹션 내부의 큰 상단 padding을 외부 간격으로 옮겼습니다. desktop 간격은 화면 높이에 따라 64~104px(짧은 섹션 48~80px), mobile은 56px/48px입니다. Hero 크기·여백과 About 사진 크기를 조정했고 긴 콘텐츠는 높이를 제한하지 않습니다.
- 실제 Header 높이를 ResizeObserver로 측정합니다. 제목 이동 위치는 Header + desktop 24px/mobile 16px입니다. 1440×900에서 기존 200~240px 대신 101px, mobile에서는 107px에 제목이 놓입니다. Contact는 화면 기준 최소 높이를 제거해 링크 아래의 큰 빈 공간을 없앴습니다. 문서 끝에서는 스크롤 한계에 따라 제목이 더 아래에 보일 수 있습니다.
- Contact 링크 아래 여백은 desktop 32px/mobile 24px입니다. 1440×900에서 Contact 높이는 799→303px, 390×844에서 737→275px로 줄었고 footer가 바로 이어집니다. 실제 화면 캡처는 .verification/layout-compact-contact-1440-contact.png 및 layout-compact-contact-390-contact.png입니다.
- Trace Rail은 제목 근처의 읽기 위치를 기준으로 추적하며 frame 단위 scroll 보정을 추가했습니다. 짧은 Education을 건너뛰던 경우와 페이지 끝의 Contact 표시를 수정했습니다.
- 상단 바·Rail 실제 링크 이동, 양방향 이동, smooth/reduced-motion, EN/KO 위치·현재 상태, legacy #work/#tools, Header hide/reveal 검증 통과. 7개 너비와 720px 높이 laptop을 포함했습니다.
- production/fixture build·content 19개, browser 19개 그룹 통과. Astro/TypeScript 43개 파일 오류·경고·hint 0개. 원본 github.io 추적 파일 38개 무변경. 배포 없음.
- 수정: global.css, Header.astro, TraceRail.astro, Projects.astro(전체 목록 간격), browser-check.mjs, README, 이 문서. 측정 결과·화면 캡처는 .verification/section-layout-before.json, section-layout-after.json, layout-after-*.png입니다.

## 제목 칩·아이콘·원칙 팝업 조정 (2026-10-14, 현재 UI)

- Projects 제목의 `| )` 칩은 제거하고 배경·패딩 없는 일반 텍스트로 표시합니다. 목록 이동은 섹션 제목 오른쪽 화살표 아이콘, 전체 목록과 프로젝트 상세의 홈 복귀는 집 아이콘입니다. 세 이동 아이콘은 Resume PDF·Portfolio PDF와 같은 밝은 기본 배경·테두리, 짙은 charcoal hover/누름 배경을 사용합니다. EN/KO aria-label/title과 기존 route를 유지합니다.
- How I Build 소개는 전체 섹션 너비를 사용합니다. desktop 1440px에서 EN/KO 모두 한 줄을 검사했습니다. 좁은 화면은 자연스럽게 줄바꿈합니다.
- 원칙 팝업의 EN/KO 버튼을 제거하고 닫기를 둥근 X 버튼으로 변경했습니다. 닫기도 이동 아이콘과 같은 밝은 기본 배경·테두리, 짙은 charcoal hover/누름 배경을 사용합니다. WHY/HOW/EVIDENCE에는 teal/yellow/purple 배경 띠를 적용했습니다. 기존 Escape·Tab trap·포커스 복귀·언어 context 처리를 유지합니다.
- Contact EN/KO 소개에 명시적 문장 줄바꿈을 넣었습니다. desktop 1440px에서 두 줄을 검사했고 mobile overflow 없음도 확인했습니다.
- 변경: Projects.astro, ProjectDetail.astro, SectionHeading.astro(action slot), ProjectCard.astro, HowIBuild.astro, ui.ts, global.css, browser-check.mjs, README/이 문서.
- production/fixture build 및 콘텐츠 19개, browser 19개 그룹 통과. Astro/TypeScript 43개 파일 오류·경고·hint 0개.
- 캡처: .verification/pastel-refinements-projects.png, pastel-refinements-process.png, pastel-refinements-contact.png, pastel-final-dialog.png.

## Single terracotta accent + paper background (2026-10-14, 현재 시각 테마)

- olive/sage 및 sky blue 토큰을 제거했습니다. #F2ECDE 종이색 배경, #F8F3E8 surface, 옅은 청록색 상단 바와 terracotta #B85F4B / teal #7FB8B2 / coral #F28F79 / yellow #F0CD54 / purple #AB91E8 / green #85CDAA를 사용합니다.
- terracotta는 main accent이며 점·선·글자·focus에 동일한 #B85F4B를 사용합니다. yellow는 View Work CTA, Hero는 terracotta 14% + purple 10% halo입니다. grid는 2.5%입니다.
- 프로젝트는 order 순서대로 coral → teal → purple → green을 hover border에 반복합니다. 제목 글자와 카드 전체 배경은 neutral이며 content/schema/순서는 변경하지 않았습니다.
- pill 버튼·About → Projects → Contact 메뉴·반응형·영상/첫 프레임·Deep Dive·별도 Projects 목록·EN/KO 동작은 유지합니다.
- 변경: global.css, ProjectCard.astro(style), TraceRail.astro(style), Layout.astro(theme-color), favicon.svg, README와 이 문서.
- production/fixture build 및 content 19개, browser 19개 그룹 통과. Astro/TypeScript 43개 파일 오류·경고·hint 0개. 원본 github.io HEAD·clean 상태·추적 파일 38개 해시 무변경. 배포 없음.
- 대표 텍스트 최소 대비 4.90:1, focus 5.78:1. desktop/mobile Hero, Projects, dialog 등의 캡처를 직접 확인했습니다. 캡처: .verification/pastel-teal-hero.png, pastel-teal-mobile.png, pastel-teal-projects.png 등.

아래는 이전 시각 테마와 구조 검증 기록입니다.

## Warm light theme (2026-10-14, 이전 시각 테마)

- 기존 레이아웃·폰트 hierarchy·정보·기능을 유지하고 전역/컴포넌트 CSS 색상만 변경했습니다. Hero/How I Build/ProjectCard/ProjectThumbnail/Projects/TraceRail의 markup·script가 작업 전과 같음을 비교했습니다.
- 제안된 warm palette를 그대로 토큰화하고 --ink/--panel alias를 보존했습니다. 밝은 배경에서 작은 글자에 부족한 원래 muted/pastel 대비는 별도 읽기용 foreground 토큰으로 보완했습니다.
- 먼저 밝은 테마 화면을 검토한 뒤 Hero에만 약한 정적 halo·technical grid를 추가했습니다. 모바일 trace 점이 clipping에 걸리지 않도록 가로 여백 8px을 확보했습니다.
- nav·버튼·기존 카드·모달·상세 미디어 표면을 밝은 테마에 맞췄습니다. Projects 카드의 별도 큰 panel은 추가하지 않았습니다. native video/fullscreen·canvas 정지 프레임·2열/1열·More 페이지 정책은 유지합니다.
- code syntax 기본값은 github-light이며 pre 배경은 warm surface를 사용합니다. 현재 콘텐츠에는 fenced code block이 없어 syntax token별 실제 대비 검증은 포함하지 않았습니다.
- 변경: src/styles/global.css, src/layouts/Layout.astro(theme-color), Hero.astro·HowIBuild.astro·ProjectCard.astro·ProjectThumbnail.astro·Projects.astro·TraceRail.astro(style만), astro.config.mjs, public/favicon.svg, scripts/browser-check.mjs, README와 이 문서.
- 검증: production/fixture build 및 content 19개 검사, browser 19개 그룹 통과. Astro/TypeScript 43개 파일 오류·경고·hint 0개. 최종 모바일 trace 보정도 production build와 캡처로 확인했습니다.
- 대표 UI 104개 text sample의 최소 대비 4.67:1, focus sample 4.75:1. page gradient는 가장 어두운 paper token을 배경으로 보수적으로 계산했습니다. 결과: .verification/theme-contrast.json.
- 캡처: .verification/warm-base-*.png(장식 전), warm-final-hero.png, warm-final-mobile.png, warm-final-projects.png, warm-final-dialog.png, warm-final-detail.png 등. desktop/mobile 화면을 열어 직접 확인했습니다.
- 원본 github.io HEAD·clean 상태·추적 파일 38개 해시 무변경. 배포 없음.

아래는 Projects 구조와 이전 구현의 검증 기록입니다.

## 홈 4개 + 별도 Projects 페이지 (2026-10-14, 현재 구현)

- 홈: ZZZ(10) → Smart Parking(20) → Review Analyzer(30) → ct(40), 2열 × 2행. 모바일은 1열입니다.
- 중앙 View More Projects →는 /projects/ 또는 /ko/projects/로 이동합니다. 홈 안에서 펼치는 script/button은 제거했습니다.
- 전체 목록: 같은 Projects/ProjectCard/ProjectThumbnail을 재사용해 7개를 모두 표시합니다. 이후 KUROOM(50) → KUTODO(60) → 발주콜(70)입니다. order 누락·hidden 정책도 유지합니다.
- 새 Markdown 추가는 전체 목록에 자동 반영되며 홈에는 order 상위 4개가 표시됩니다. 27개 fixture로 이를 검사합니다.
- 기존 영상 hover·첫 프레임 canvas·클리핑·카드 상세 route·EN/KO 위치·Header/Trace Rail·legacy anchors를 유지합니다.
- Deep Dive의 별도 미디어 확대 버튼·팝업 JS/CSS를 제거했습니다. 영상 기본 controls와 native fullscreen, inline image, 오류 fallback은 유지합니다.
- 추가: ProjectsPage.astro, src/pages/projects/index.astro, src/pages/ko/projects/index.astro. 수정: Projects.astro, ui.ts, 프로젝트 6개 order, 검증 스크립트와 README/이 문서.
- 캡처: .verification/desktop-projects-section.png.
- 검증 완료: production/fixture build 및 콘텐츠 19개 검사, 브라우저 18개 검사 그룹 통과. Astro/TypeScript 43개 파일 오류·경고·hint 0개.

아래는 이전 구현의 검증 기록입니다.

## 2열 Projects + thumbnail hover (2026-10-14, 이전 구현)

- 640px 이상 2열, 그 미만 1열. 16:9 미디어·제목·짧은 설명만 표시하며 Floating Inspector 및 관련 연결/스크립트를 제거했습니다.
- 영상은 이미지 fallback 없이 원본 첫 프레임을 표시합니다. thumbnail 영역에 200ms hover하면 muted/loop/playsinline으로 해당 영상 하나만 재생합니다. hover 종료·언어 전환·화면 밖 이동 시 pause/reset합니다.
- keyboard는 일반 링크 Tab/Enter, mobile/touch 및 reduced-motion은 정지 첫 프레임과 Deep Dive 이동입니다. 외부 액션·크게 보기는 기존 상세 페이지에 유지합니다.
- order·초기 8개·8개 단위 더 보기·EN/KO scroll/expanded count·Header/Trace Rail와 legacy anchors를 유지합니다.
- 수정: Projects.astro, ProjectCard.astro, ProjectThumbnail.astro, ui.ts, scripts/verify.mjs·browser-check.mjs, README와 이 문서. 삭제: ProjectInspector.astro, src/lib/project-inspector.ts.
- 영상 가림 대응: 정지 첫 프레임을 canvas로 표시하고 active video만 노출합니다. thumbnail의 paint/stacking을 격리하고 legacy rail 링크 CSS 적용 범위를 제한했습니다. ZZZ↔KUROOM 및 ct↔Review Analyzer hover 전후 인접 thumbnail의 픽셀이 같은지 비교합니다. 첨부 error.png의 원래 증상은 headless 환경에서 재현되지 않아 실제 사용자 브라우저에서 재확인이 필요합니다.
- 검증 완료: production/fixture build 및 콘텐츠 19개 검사, 브라우저 18개 검사 그룹 통과. Astro/TypeScript 40개 파일 오류·경고·hint 0개. 2/1열·단독 hover 재생·첫 프레임 복귀·상세 이동·언어/더 보기 상태 보존 확인.
- 원본 github.io HEAD·clean 상태·추적 파일 38개 해시 무변경. 배포 없음.
- 캡처: .verification/desktop-projects.png, mobile-projects.png, desktop-project-hover.png.

아래는 이전 구현의 검증 기록입니다.

## Floating Project Inspector (2026-10-14, 이전 구현)

- Grid: 1200px 이상 3열, 640~1199px 2열, 639px 이하 1열. 기본 카드는 16:9 정지 미디어·제목·짧은 설명만 표시합니다.
- 기본 Grid에는 metadata·tech·외부 액션·크게 보기·Input/Decision/Output이 없습니다. 영상이 있는 프로젝트는 이미지 fallback 없이 영상 첫 프레임을 표시하고, 화면 근처에서만 metadata를 lazy load하며 자동재생하지 않습니다. 숨겨진 카드의 source는 연결하지 않습니다.
- 공유 Inspector 하나만 열며 큰 미디어·설명·ownership/category·핵심 기술·실제 액션을 표시합니다. 카드 오른쪽/왼쪽으로 배치하고 viewport 안으로 보정합니다.
- hover 150ms 후 열고 card → Inspector 이동 시 유지하며 양쪽 pointer/focus를 벗어나면 200ms 후 닫습니다. 카드 교체·Escape·언어 변경에서도 닫습니다.
- Inspector 영상은 열릴 때 source를 연결하고 pointer hover에서만 autoplay합니다. keyboard/reduced-motion은 정지 첫 프레임, 닫힘은 pause/reset/source 해제입니다. Mobile/touch에는 Inspector 없이 기본 영상의 정지 첫 프레임을 표시합니다.
- 기존 fullscreen viewer, localized Deep Dive, Header/Trace Rail와 #work/#tools 호환은 재사용합니다. EN/KO 전환에서 scrollY·Show more expanded count를 유지합니다.
- 27개 fixture의 8 → 16 → 24 → 27 확장, content-only 추가·정렬·누락/hidden/null metadata도 검사합니다.
- 변경: Projects.astro, ProjectCard.astro, 신규 ProjectThumbnail.astro·ProjectInspector.astro·src/lib/project-inspector.ts, ProjectDemo.astro, ui.ts, global.css, 검증 스크립트와 이 문서/README. 기존 project-previews.ts는 제거했습니다.
- KUROOM·ct를 포함한 영상 metadata에서 이전 poster 연결을 제거했습니다. 영상 프로젝트는 첫 프레임, 미디어가 없는 프로젝트는 neutral placeholder를 사용하며 새 미디어를 만들지 않았습니다.
- 작업 직전 .verification/inspector-baseline과 비교해 Hero/About/Education/Skills/How I Build/Contact 및 Header/Trace Rail 무변경을 확인했습니다.
- 결과: npm test의 실제 production/fixture build 및 콘텐츠 19개 검사, npm run test:browser 16개 검사 그룹 통과. npm run check 42개 파일 오류·경고·hint 0개.
- 원본 github.io: HEAD·clean 상태·추적 파일 38개 해시 무변경. 배포 없음.
- 캡처: .verification/desktop-projects.png, mobile-projects.png, desktop-project-inspector.png.

아래 통합 검증은 Inspector 도입 이전의 기록이며, 열 수·hover overlay·카드 액션에 관한 현재 정책은 위 내용을 따릅니다.

## Projects Grid 통합 검증 (2026-10-14)

- 기본 7개 프로젝트를 하나의 Grid에 order 10~70 순서로 한 번씩 표시합니다.
- 1600/1440px 4열, 1280px 3열, 820px 2열, 390/360px 1열을 실제 브라우저에서 확인했습니다. 카드 높이·16:9 slot·row-major 순서·body overflow를 검사합니다.
- Markdown만 추가한 27개 fixture에서 초기 8개 → 16 → 24 → 27개 확장과 마지막 버튼 숨김을 검사합니다. order: 15 중간 삽입, order 누락 시 마지막 배치, hidden 제외, legacy featured/section 무관 노출도 검사합니다.
- 초기 MP4 요청 0개, 250ms hover intent, hovered video 단독 재생, hover 종료 pause/reset, reduced-motion/touch 무자동재생을 검사합니다.
- 기존 자료로 작성한 optional trace의 hover/keyboard 표시와 trace 미지정 생략, 실제 링크 액션·크게 보기·Escape·포커스 복귀를 검사합니다.
- Projects Header/Trace Rail, #work/#tools 호환 anchor, 기존 EN/KO 상세 주소와 #projects 돌아가기를 검사합니다.
- 6개 폭에서 EN/KO scrollY 유지, fixture expanded count 유지, 기존 원칙 modal context·focus trap·Header 숨김/복원을 검사합니다.
- npm test: 콘텐츠/빌드 19개 검사. npm run check: 40개 파일, 오류·경고·hint 0개.
- npm run test:browser: 15개 검사 그룹 통과. 초기 MP4 요청 없음, 카드/외부 액션 분리, touch 크게 보기와 상세 이동까지 확인했습니다.
- node scripts/verify-reference.mjs: 원본 github.io HEAD·clean 상태·추적 파일 38개 해시 무변경 확인.
- 새 미디어 제작 및 배포 없음. poster에는 기존 이미지 자산만 사용했습니다.
- 캡처: .verification/desktop-projects.png, mobile-projects.png, desktop-project-hover.png.

이번 통합 작업에서 변경한 파일:

- 신규: src/components/Projects.astro, ProjectCard.astro, src/lib/project-previews.ts.
- 홈·내비게이션: src/components/HomePage.astro, Header.astro, Hero.astro(CTA 앵커만), TraceRail.astro, ProjectDetail.astro(돌아가기만).
- 미디어·액션·언어: src/components/ProjectDemo.astro, ProjectActions.astro, ProjectActionIcon.astro, LanguageController.astro.
- 데이터·스타일: src/content.config.ts, src/lib/projects.ts, src/i18n/ui.ts, runtime.ts, src/styles/global.css.
- 콘텐츠: src/content/projects/zzz.md, kuroom.md, kutodo.md, baljucall.md, ct.md, review-analyzer.md, smart-parking.md. order·trace·영문 trace 및 기존 poster 경로를 반영했으며 상세 본문은 유지했습니다.
- 검증·안내: scripts/verify.mjs, scripts/browser-check.mjs, README.md, docs/VALIDATION.md.

작업 전 .verification/projects-baseline과 파일 해시를 비교했습니다. About/Education/Skills/How I Build/Contact 컴포넌트는 수정하지 않았습니다.

아래는 통합 이전 작업의 검증 기록입니다.

작업 범위: D:/10_proj/portfolio-v2. 장면형 레이아웃 재설계와 페이지 이동 없는 언어 전환을 검증했습니다.

## 결과

- Astro check: 34개 파일, 오류·경고·hint 0개.
- Production build: English/Korean 홈과 프로젝트 상세, 총 16페이지.
- 콘텐츠·빌드 검증: 19개 항목 통과.
- Microsoft Edge 브라우저 검증: 21개 항목 통과.
- 화면 크기: 1440×1000, 820×1100, 390×844, 360×780.
- 현재 개발 서버 http://127.0.0.1:4322에서도 새 Hero·Skills·썸네일·모달과 언어 전환 무이동을 확인했습니다.
- 원본 github.io 추적 파일 38개·HEAD·clean status 무변경 확인.
- 별도 lint 스크립트는 없으며 Astro/TypeScript 진단과 production build를 사용합니다.

## 변경된 동작 확인

| 항목 | 확인 |
| --- | --- |
| Hero | 중앙 정렬, 첫 화면 높이, githubprofile.png, View Work 우선 CTA |
| PDF | config 기반 별도 Resume/Portfolio PDF, null fixture에서 생략 |
| About | Hero 다음, 큰 jeonggil.jpg, 소개·관심·성향·문제·학력 |
| me.jpg | 사이트 본문에서 참조하지 않음 |
| Skills | 4개 경험 중심 분류, 퍼센트 없음, 원본 포폴·프로젝트 기술만 사용 |
| Featured | 1행 rail, desktop 약 2개와 다음 카드 일부, 이미지가 카드 첫 요소 |
| Smaller | 모든 화면 1행 rail, 이미지·제목·한 줄 설명·짧은 스택·링크 |
| 홈 카드 | Problem/Decision/Result 목록 제거, 기존 상세 내용 유지 |
| 썸네일 | 실제 SVG 6개 decode 성공, 16:9 전체 표시, KUTODO 텍스트 fallback |
| 데이터 확장 | 추가·숨김·순서·featured·section fixture로 자동 렌더링 확인 |
| 선택적 미디어 | logo·thumbnail·Demo null 및 URL 추가 fixture 정상 |
| How I Build | 원칙 6개 클릭, 이유·사례·기여 설명, 상세 링크 |
| Modal 접근성 | native dialog, Escape·닫기·배경 클릭, 원래 버튼 포커스 복귀 |
| EN/KO | DOM 문구만 교체, URL·main 노드 유지, 페이지 로드나 route 이동 없음 |
| 위치 보존 | 4개 폭 × About/Skills/Work/Tools/Process/Contact × EN/KO 전환, scrollY·두 rail scrollLeft 차이 1px 이내 |
| 언어 입력 | 실제 좌표 마우스 클릭과 키보드 Enter로 검증 |
| Header | 최상단 표시, 아래 36px 숨김·위 20px 노출, 포커스 시 표시 |
| Navigation | anchor·smooth scroll·reduced motion·skip link 정상 |
| Contact/Footer | 공통 social config와 Email, footer @giribuin |
| Mobile | 본문 가로 넘침 없음, rail 내부만 가로 스크롤 |
| Runtime | 브라우저 pageerror 없음, 외부 요청 차단 상태에서 검사 |

언어별 텍스트와 링크 영역의 최대 높이를 같은 폭에서 측정해 확보합니다. 카드·rail 노드는 교체하지 않으며, 언어 변경 전후 문서와 rail 좌표를 즉시 복원합니다. 프로젝트 소개와 본문은 최초 렌더링 언어를 유지할 수 있고 공통 UI와 프로필·원칙 설명을 전환합니다. /는 항상 English로 시작합니다.

## 재현과 캡처

~~~powershell
npm run check
npm test
npm run test:browser
node scripts/verify-reference.mjs
~~~

npm test는 실제 프로젝트와 .verification/content-*/ 격리 fixture를 빌드합니다. 브라우저 스크립트는 임시 로컬 정적 서버만 직접 생성·정리합니다. 실행 중인 개발 서버는 종료하지 않습니다.

- .verification/content-results.json
- .verification/browser-results.json
- .verification/reference-results.json
- .verification/desktop.png, mobile.png
- .verification/*-about.png, *-skills.png, *-work.png, *-tools.png, *-process.png
- .verification/*-principle.png

Hero/About/Skills, 실제 프로젝트 이미지, 원칙 모달의 desktop/mobile 캡처를 열어 확인했습니다. 제공된 이미지 자체는 편집하지 않았습니다. 원본 github.io·Career DB는 수정하지 않았으며, 배포·remote·DNS·도메인 작업은 하지 않았습니다.
