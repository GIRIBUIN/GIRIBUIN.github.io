# 메뉴 · 프로젝트 도감 UI

## 구성과 원본

- `/`, `/ko/`는 `MenuHome.astro`를 렌더링한다.
- 홈은 favicon·Settings, 중앙의 큰 컴패니언, 하단 메뉴 네 개로 구성한다. 이름·조작 안내는 화면에 표시하지 않고 접근성 제목·설명만 유지한다. 메뉴와 3D scene은 독립된 React island다.
- `src/content/projects/`와 `src/content/project-notes/`가 프로젝트 원본이다. 원본 문서는 변경하지 않았다.
- `src/lib/explorer-data.ts`는 빌드 시 기존 정렬·번역 함수를 사용해 UI에 필요한 데이터만 전달한다. 프로젝트별 내용을 수동으로 관리하는 별도 데이터 파일은 없다.
- About·Background·HowIBuild는 Astro 컴포넌트를 static slot으로 넣고 Skills는 핵심 기술만 표시한다. Background는 학력·회사·인턴 이력을 담는 섹션이며 현재 건국대학교 정보를 기존 site.ts에서 재사용한다. 문서는 `site.ts`의 경로와 실제 public 파일 존재 여부를 함께 확인한다.
- `/projects/`, `/ko/projects/`, `/work/[slug]/`, `/ko/work/[slug]/` 및 GitHub Pages 정적 배포를 유지한다.

## 상태와 주소

| 상태 | 주소 |
|---|---|
| Main | `/` |
| Projects 목록 | `/#projects` |
| 선택 프로젝트 | `/#projects/kuroom` |
| 상세 window | `/#projects/kuroom/details` |
| Profile | `/#about` |
| Resume | `/#resume` |
| Contact | `/#contact` |
| 독립 상세 | `/work/kuroom/` |

`ExplorerState`는 판별 가능한 union이다. `main`, 일반 window, 프로젝트 list, 특정 slug의 preview/detail 중 하나만 활성화된다.
`navigation.ts`가 hash를 읽고 부모 상태를 정의하며, React reducer가 현재 탐색 상태를 보관한다.
창 내부 이동은 History API의 replaceState로 현재 URL만 갱신하며 방문 기록을 추가하지 않는다. 브라우저 Back/Forward는 실제 문서 사이를 이동하고 popstate/hashchange/pageshow에서 UI를 복원한다.
ESC와 화면의 이전 버튼은 브라우저 history와 독립적으로 detail → preview → list → main으로 이동한다. 직접 링크·새로고침 진입에서도 부모 상태로 이동할 수 있다.
독립 상세 링크를 일반 클릭할 때는 출발 문서의 hash와 React window 상태를 flushSync로 함께 정리한 뒤 location.assign으로 실제 문서 이동을 수행한다. BFCache가 DOM을 보존해도 출발 화면에는 닫힌 dialog와 해제된 scroll lock만 남는다. 따라서 홈에서 독립 상세로 이동한 뒤 Back하면 Home이 열린다. 독립 상세 안의 도감에서 다른 독립 상세로 이동한 경우에는 이전 상세 문서로 돌아온다. 수정 키 클릭·새 탭 열기는 원래 창의 상태를 바꾸지 않는다. X는 URL이 이미 Home이어도 UI 상태를 닫는다.
기존 `#work`·`#tools`는 Projects, `#education`·`#skills`·`#process`는 About으로 연결한다.
`npm run test:history`는 Playwright의 BFCache 비활성 옵션을 해제해 실제 pageshow.persisted 복원, 한·영 홈/독립 상세 출발, Back/Forward 후 닫기 동작을 확인한다. 일반 브라우저 검사에서는 URL과 창 상태가 어긋난 경우의 X도 별도로 검사한다.

## 상세 원본 공유

DETAILS의 실제 href는 기존 상세 URL이다. 일반 클릭은 상세 window를 열고, 수정 키를 누른 클릭이나 새 탭은 독립 페이지로 이동한다.
`ProjectDetailWindow.tsx`는 같은 출처의 Astro 상세 HTML에서 `.detail-page`를 표시한다. `detail-content.ts`가 캐시와 진행 중인 요청을 공유하며 요약 진입 700ms 후 선택한 프로젝트의 HTML만 낮은 우선순위로 미리 요청한다. 데이터 절약·2G·숨겨진 탭에서는 자동 사전 요청을 생략한다. 독립 상세 링크의 hover/focus는 native document prefetch를 사용한다.
스크립트·번역용 template과 독립 페이지의 HUD/footer는 window에 복사하지 않는다. Details에서는 article의 소개 패널도 제거하고 영상과 상세 문서는 유지한다.
YouTube는 `ProjectDemo.astro`의 iframe을 정적 독립 상세와 동적으로 삽입한 Details에 그대로 표시한다. 추가 재생 덮개는 없으며 화면에 들어오면 플레이어를 로딩하고 자동 재생은 강제하지 않는다. 요약 단계의 HTML 사전 요청은 YouTube 플레이어를 열지 않는다. 로컬 MP4는 선택한 요약 화면에서만 로딩하고 떠날 때 source를 해제하며 첫 영상 프레임이 준비될 때까지 WebP 사진을 유지한다. `npm run test:project-loading`으로 실제 요청 순서·크기·중복 요청·데이터 절약 동작을 확인한다.
선택 화면과 상세 window의 title bar에 이전 버튼을 제공한다. 선택 화면에서는 전체 프로젝트 목록으로, 상세에서는 preview로 돌아간다. 프로젝트명은 window 제목 명판에 남긴다. 독립 상세의 홈 아이콘은 hash 없는 locale 홈으로 이동해 Projects를 열지 않는다.
한·영 상세는 각 locale URL에서 로드하고 메모리에 캐시한다. 실패 시 독립 페이지 링크를 유지한다.
언어를 바꿀 때 기존 본문은 번역을 불러오는 동안 유지한다. 교체 직전의 window body 위치와 본문 최소 높이를 보존하고 layout effect에서 위치를 복원해, 더 짧은 번역이나 로딩 상태 때문에 위로 이동하지 않게 한다.
원문에 없는 Requirements·수치·성과·검증 결과를 새로 작성하지 않는다. 기존 문서의 제목·단락·다이어그램을 그대로 사용한다.

## 비주얼 교체

`VisualScene.astro`는 desktop/mobile 모두 중앙에 독립적인 `PetScene.tsx` client-only React island를 배치한다. `/models/pet.glb`는 fetch preload와 GLTFLoader promise cache를 공유한다. 실패는 R3F 바깥에서 처리하며 메뉴 로딩과 상태에 의존하지 않는다.
`PetScene.tsx`에 R3F Canvas·모델·카메라·key/fill/rim 조명·shadow plane을 두고 `src/lib/pet-scene.ts`에 모델 준비와 motion 계산을 둔다. 별도 room 모델이나 Drei/OrbitControls는 추가하지 않았다. GLB/재질 원본은 유지하고 scene clone에서 `head`·`hood`·`eyes`만 attach로 공통 목 pivot에 묶는다. 해당 노드가 없으면 전체 그룹으로 mouse-look을 대체한다.
머리 시선은 ±12°/±6°에 damping을 적용하고, idle은 작은 두 sine의 합이다. hover는 1.03배, 클릭은 0.65초의 작은 점프다. pointer capture로 그룹 전체를 드래그하며 각도를 유지하고 드래그/해제 직후에는 시선 제어를 쉬게 한다. 키보드 좌우·Enter/Space·Home도 제공한다. React setState는 프레임 안에서 사용하지 않는다.
Canvas는 demand loop를 사용한다. 일반 사용자는 idle 동안 invalidate하고, reduced-motion에서는 idle·mouse-look·확대·점프를 끄며 직접 회전 입력만 감쇠 후 멈춘다. 창이 열리거나 탭이 숨겨지면 loop를 중단한다. DPR은 최대 1.5, shadow map은 1024다. 모델 로딩 실패·WebGL 미지원/손실은 기존 `pet.png`로 대체하며 메뉴·설정·URL은 정상 동작한다.

## 접근성과 미디어

- 공통 window는 홈 위에 떠 있는 native dialog다. 3px 올리브 프레임, 별도 제목 명판, 테두리에 겹치는 X를 표시한다. 프로젝트 선택/상세 화면에는 같은 physical control 스타일의 이전 버튼이 있다. X는 모든 단계에서 Home으로 닫고 ESC는 부모 단계로 이동한다. 번호·footer/status bar는 표시하지 않는다.
- 배경을 클릭/탭해도 X와 동일하게 window를 닫고 Home으로 이동하며 초점을 복귀시킨다. window 내부에서 시작한 드래그와 Settings의 외부 클릭 닫기는 부모 window를 함께 닫지 않는다.
- 홈의 상단 바는 없애고 왼쪽 홈 링크와 오른쪽 Settings를 독립 HUD로 둔다. dialog.show()와 별도 backdrop을 사용해 HUD는 계속 조작할 수 있다. 배경 타이틀과 홈 메뉴는 inert로 만들고, Tab은 HUD와 window 안에서 순환하며 닫을 때 초점을 복귀시킨다.
- 언어 전환은 `SettingsHud.astro`의 compact native popover 한 곳에 둔다. 기존 data-locale/LanguageController가 static slot과 React UI를 함께 갱신하며, 언어 상태 로직을 별도로 만들지 않는다. Settings는 desktop anchored/mobile bottom panel이고 Escape·외부 클릭·탐색 시 닫힌다. Escape는 Settings를 먼저 닫고 기존 window 상태를 유지한다.
- Projects 최초 진입은 선택이 없는 전체 thumbnail grid다. 프로젝트 선택 후 같은 window 안에서 media·이름 목록과 설명의 split으로 바뀐다. 이전 프로젝트 기억은 목록 복귀 시 초점 복원에만 사용한다.
- Desktop split은 window content 높이를 채운다. 왼쪽 media는 고정하고 이름 목록만 flex:1/min-height:0/overflow-y:auto로 스크롤한다. 오른쪽 설명은 별도 스크롤이며 왼쪽 pane과 바깥 문서, content wrapper는 스크롤하지 않는다. 전체 목록은 window body 하나에서 스크롤한다.
- 선택 프로젝트의 제목줄은 sticky top, 외부 링크 footer는 sticky bottom으로 설명 영역 안에 유지한다. Details 아이콘은 제목 옆에 두고 GitHub·영상·다운로드·Demo 등 실제 링크만 footer에 표시한다. `MenuHome.astro`의 named slot으로 기존 `ProjectActionIcon.astro` SVG를 재사용하며 모든 링크에 aria-label/title을 제공한다. 모바일에서도 설명이 보이는 동안 같은 sticky 동작을 유지한다.
- 선택 화면과 Details의 링크 영역은 `ProjectActionFooter.tsx`를 공유한다. Details에는 독립 상세 페이지 열기 아이콘을 추가하고 footer를 window body 하단에 sticky로 유지한다. 실제 링크·locale별 URL과 기존 SVG를 함께 재사용한다.
- `ProjectSplit.tsx`는 기본 52:48 비율을 Pointer Events와 pointer capture로 조절한다. separator는 1px 선/17px hit area이며 Arrow Left/Right는 1%, Shift는 5%, Home/End는 양 끝으로 조절한다. 범위는 32~68% 안에서 좁은 desktop의 설명 최소 폭도 고려한다. 선호 비율은 browser effect에서 `portfolio.project-split` localStorage에 저장하며 저장 실패에도 조작은 유지한다. 좁은 viewport에서는 표시 비율만 제한하고 넓히면 선호 비율을 복원한다.
- 700px 이하 모바일 split은 divider를 숨기고 media → 이름 목록 → 설명 순서의 단일 window body 스크롤이다. favicon 홈 링크와 언어 전환은 헤더에 남긴다.
- 데스크톱은 선택된 프로젝트 영상 하나만 무음 반복 재생한다. 전체 목록의 영상은 자동 재생하지 않는다. 이름 선택 시 media와 설명을 함께 교체하며, split의 이름 목록에는 media·번호·메타데이터를 반복하지 않는다.
- 터치·reduced-motion은 정적 이미지 중심이다. 영상 오류·재생 거부 시 이미지가 유지된다. 썸네일 없는 영상은 첫 프레임을 canvas에 보존한다.
- JS가 비활성화된 경우에도 정적 타이틀, 기존 프로젝트 목록 및 연락 링크로 접근할 수 있다.

Contact window는 기존 SVG 아이콘 4개를 desktop 1행 / mobile 2×2로 표시한다. Resume window는 실제 PDF 액션 두 개만 중앙에 표시한다.

About은 `ProfilePanel.astro`의 About Me / How I Build 두 탭으로 구성한다. About Me는 큰 사진 고정 폭 컬럼과 이름·소개·Skills·학력 컬럼을 나란히 배치하고, 모바일에서는 사진부터 세로로 배치한다. 소개는 About 전용 한/영 문구를 사용하며 Skills는 공용 아이콘으로 Java/Python/Go/SQL/Linux/Docker/Git 7개만 표시한다. 학력은 기존 site.ts의 학교명과 `2027.02`를 한 줄로 표현하고 직무·관심 분야·PDF·졸업 상태는 노출하지 않는다. `profile-menu.css`는 콘텐츠 최대 폭과 가벼운 underline 탭, 테두리 없는 기술 목록을 정의하며 How I Build의 01~06 과정 구조는 유지한다. 탭은 고정되고 `.profile-pages`만 스크롤하며 URL/history를 추가하지 않는다. native button과 tab/tabpanel ARIA, 방향키·Home·End로 탐색하고 기존 언어 전환 및 설명 dialog를 재사용한다.

## Game menu visual system

`src/styles/game-theme.css`의 `.game-theme` 범위에서 기존 semantic token을 Monokai 기반 올리브/차콜 팔레트로 재지정한다. 홈과 독립 상세가 공유하며 아카이브 및 비주얼 구현은 변경하지 않는다.
`Window.tsx`가 공통 프레임/명판을 제공하고 `.game-control`은 겹침 버튼, `.game-item`은 프로젝트·문서·연락 항목의 프레임/hover/focus/press를 공유한다. 별도 UI framework나 폰트, motion 의존성은 없다.
`.game-control`의 공통 스타일은 `src/styles/game-controls.css`, 링크 footer와 아이콘 크기/상태는 `src/styles/project-actions.css`에 둔다. Settings에는 Language만 노출하며 새 옵션은 기존 `.settings-group` 구조를 추가해 확장할 수 있다.

독립 상세 본문은 Astro 정적 페이지를 유지한다. Home/Projects·중앙 프로젝트 명판·Settings를 하나의 불투명 fixed header에 배치한다. main의 padding-top으로 header 높이를 확보하고 스크롤 본문이 controls와 겹쳐 보이지 않게 가린다. `ProjectInfo.astro`는 기존 요약·기술·외부 링크 아이콘을 정보 버튼의 native popover 안에 표시하며 하단 링크 바는 없다. hover로 열면 버튼과 팝업 밖으로 벗어날 때 닫히고, 클릭·키보드·터치로 열면 고정된다. 다시 클릭하거나 ESC·외부 클릭으로 닫는다. 모바일 명판은 내비게이션 아래 줄로 내려 겹침을 피한다. 프로젝트 window가 열린 동안 제목과 내비게이션은 inert 처리하되 Settings는 조작할 수 있다.

독립 상세의 폴더는 `StandaloneExplorer.astro`를 통해 기존 `PortfolioExplorer` island와 공통 window를 재사용한다. `/work/zzz/#projects`에서 미선택 목록을 열고 선택·Details·ESC·브라우저 history도 현재 pathname 안에서 동작한다. 닫으면 원래 문서와 스크롤 위치로 돌아간다. 본문과 링크는 window 뒤에서 inert 처리한다. 별도 프로젝트 데이터를 만들지 않으며 폴더의 JS 없는 fallback은 기존 locale `/projects/` 아카이브다. Home은 hash 없는 locale 홈으로 이동한다.

- Projects/About는 최대 1180px/78dvh, Resume/Contact는 최대 820px/460px로 여백을 확보한다. 모바일에서는 테두리 밖 버튼과 명판까지 viewport 안에 남긴다.
- 프레임과 카드에는 짧은 solid shadow를 사용하고 backdrop만 dim + 8px blur를 적용한다.
- 일반 interaction은 180ms, 열림은 280ms다. reduced-motion에서는 이동·회전·확대·등장 animation을 끄고 테두리/색과 focus outline을 유지한다.
- Resume 항목은 실제 파일명, 문서 아이콘, 기존 PDF 이름을 포함하며 카드 전체가 PDF 링크다. Contact는 기존 SVG를 같은 크기의 icon container로 표시한다. About은 원문 그대로 portrait/profile panel과 정보 구분을 정리한다.

## 검증 명령

- `npm run check`: Astro·TypeScript.
- `npm run build`: 정적 페이지 및 island 빌드.
- `npm test`: 원본과 28개 프로젝트 fixture의 빌드·콘텐츠·기존 경로 검증.
- `npm run test:browser`: 메뉴, hash/history, 키보드·focus·ESC, 한·영, overlay 원본 일치, 모바일, 영상 오류, VisualScene 독립성.
- `npm run test:project-media`: 기존 `/projects/` 아카이브의 영상·터치·상세 이동 회귀 검증.

스크린샷과 결과 JSON은 `.verification/`의 생성물이다.
