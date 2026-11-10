# GIRIBUIN — Portfolio V3

정보 중심의 Astro + React 포트폴리오입니다. 작업 폴더 이름 portfolio-v2는 유지합니다.

- /, /ko/: 이름·지원 분야·연락처·대표 프로젝트 3개
- /projects/, /ko/projects/: 기존 프로젝트와 계획 단계 프로젝트, 경량 필터
- /projects/[slug]/, /ko/projects/[slug]/: Content Collections 기반 정적 상세
- /about/, /ko/about/: 소개·학력·기술·문서·연락처
- /work/[slug]/와 기존 Home hash 링크는 호환 경로로 유지

Node >=22.12.0. npm install 후 npm run dev로 개발합니다.

검증: npm run build → npm run check → npm test → npm run test:browser → npm run test:rendering.

프로젝트 원본은 src/content/projects/, 영어 상세는 src/content/project-notes/en/ 및 src/content/project-translations/en/에 있습니다. 모두 같은 projectNotes 컬렉션에서 읽으며 기존 문서 경로의 수정 권한 제한 때문에 새 번역은 project-translations에 둡니다. notes.en으로 특정 번역 ID를 선택할 수 있습니다. status/origin/validation/featured/technologies/role/tags를 같은 frontmatter에서 관리합니다. 없는 경험·성과를 추가하지 않습니다.

내부 이동은 Astro ClientRouter로 처리하며 직접 URL·새로고침·JS 없는 문서 탐색도 지원합니다. 메뉴와 프로젝트 링크만 선택적으로 hover/focus prefetch하고 PDF·외부 사이트·영상은 선로딩하지 않습니다. 필터는 React hydration 없이 동작하며 URL 초기 필터는 첫 화면부터 적용합니다.

웹폰트는 기존 글꼴에서 생성한 로컬 unicode-range 서브셋입니다. 원본 및 OFL은 public/fonts/에 보존합니다. 영문, UI·프로젝트 요약 문자, 상세 본문 문자를 나눠 긴 문서가 추가돼도 홈의 폰트 요청이 함께 커지지 않게 합니다. 나머지 문자도 추가 조각으로 보존합니다. 자주 쓰는 문자 묶음을 갱신하려면 FontTools 설치 후 `python scripts/subset-fonts.py`를 실행합니다. 파생 폰트의 family 이름은 Portfolio Sans이며 모양은 기존 글꼴입니다. 생성한 public/fonts/portfolio/와 src/styles/font-face.css를 함께 보관하므로 빌드/배포에 Python은 필요하지 않습니다.

자산 원본은 public/, 빌드 출력은 dist/, 검증 생성물은 .verification/입니다. 생성물을 직접 편집하지 않습니다. npm run clean은 생성물만 정리합니다.

main에 push하면 기존 GitHub Actions가 타입 검사와 정적 빌드 후 GitHub Pages에 배포합니다. 배포 구조와 보안 설정은 유지했습니다. Mermaid 빌드에는 Chromium이 필요합니다.

자세한 구조·분류 근거·검증 범위·추가 작성 항목·파일 권한에 따른 정리 제한은 [docs/PORTFOLIO-V3.md](docs/PORTFOLIO-V3.md)에 있습니다. 원문/미디어 출처는 [docs/CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md)를 참고하세요.
