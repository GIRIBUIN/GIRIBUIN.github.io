# 로컬 검증 기록

검증일: 2026-10-13 (Asia/Seoul)

## 범위와 환경

- 독립 sibling: `D:\10_proj\portfolio-v2`
- Astro 7.3.2, Node 24.14.1, npm 11.11.0
- 실제 브라우저: 로컬 Microsoft Edge (Playwright headless)
- 검증용 서버는 127.0.0.1에만 바인딩. 테스트에서 시작한 서버/브라우저는 종료합니다.
- 콘텐츠 변경은 `.verification/content-*/` 복사본에서 수행합니다.
- 배포·Cloudflare API·GitHub Pages·DNS·production API 호출 없음.

## 실행 명령

```powershell
npm install --no-audit --no-fund
npm run check
npm run build
npm test
npm run test:browser
node scripts/verify-reference.mjs
```

브라우저 검증 스크립트가 `astro dev --host 127.0.0.1 --port 4322`를 실행하고 실제 출력된 주소에 HTTP 200을 확인합니다. 포트가 사용 중이면 Astro가 고른 다음 포트를 이용합니다. 기존 서버는 종료하지 않습니다.
최초 확인에서 `z` import deprecation hint가 나와 Astro 7의 `astro/zod`로 변경했습니다.

## 콘텐츠 / 빌드: 14개 항목

- 기본 Selected Work: KUTODO → ZZZ → KUROOM
- 기본 Tools: ct → Review Analyzer
- 새 Markdown 파일만 추가해 홈페이지/정적 상세 경로/본문 자동 생성
- hidden true: 홈페이지와 상세 경로 모두 제외
- featured false: Selected Work에서 빠지고 Tools로 이동
- section tools: featured true여도 Tools로 이동
- order 변경: 렌더링 순서 변경
- iframe / video / terminal / apk / image / none의 URL null fallback (6개)
- 실제 URL을 넣은 미디어 요소·Full Demo·APK·Release 버튼 생성
- 앵커 대상 존재 및 빈 href 부재

schema와 콘텐츠가 유효하지 않으면 Astro sync/build에서 오류를 보고합니다.
정적 빌드 결과: 홈 1개 + 프로젝트 상세 5개, 총 6페이지.

## 브라우저: 13개 항목

- desktop 1440×1000, tablet 820×1100, mobile 390×844, small mobile 360×780 (4개)
- 각 화면: 가로 넘침 없음, h1 1개, 대표작 3개, 빈 링크 없음
- 4개 앵커 이동·해시 갱신·sticky header 아래 표시
- 키보드 skip link, visible focus, native details Enter 조작
- prefers-reduced-motion 시 scroll-behavior auto
- 상세 정적 페이지와 홈 section 복귀
- 6종 null fallback 실제 브라우저 표시
- 로컬 fixture iframe 렌더링과 Open Full Demo 새 창
- 이미지 / terminal image·video / 영상 controls / APK 링크
- 이미지 404 시 읽을 수 있는 안내로 교체
- 브라우저 runtime 오류 없음

Chrome의 smooth scroll 완료 전에 다음 클릭이 진행되는 것을 피하도록 앵커 간 안정화 시간을 둡니다.
페이지 하단에서는 스크롤 최대 위치에 도달할 수 있으므로, Contact가 반드시 화면 맨 위까지 오는 것을 요구하지 않고 정상 노출되는지 확인합니다.

## 시각 확인 / 접근성

desktop Hero·전체 화면, tablet 작품 영역, mobile Hero·작품 영역 캡처를 열어 확인했습니다.
대표작과 작은 도구의 계층, 1열 모바일 전환, sticky nav, 프로젝트별 Demo 준비 화면을 확인했습니다.
시스템 폰트, semantic landmarks, h1/h2/h3, alt, 키보드 focus, reduced motion을 구현했습니다.
핵심 텍스트는 #f0f0e8 / #acaea1, 배경은 #191a17이며 차분한 연두 accent #c7db85를 사용합니다.
이 단계는 전체 WCAG 인증이나 모든 보조공학 장치에 대한 검증은 아닙니다.

## 기존 저장소 무변경 확인

시작 시 tracked file SHA-256, git status, HEAD를 V2의 미추적 검증 폴더에 저장했습니다.
`verify-reference.mjs`에서 최종 상태와 비교합니다. 상세 결과는 `.verification/reference-results.json`에 저장됩니다.
기준 HEAD: `3d8869a9a3facee2a47476bad56e0843f3934095`.
기존 저장소에서 쓰기/삭제/Git 변경 명령을 실행하지 않았습니다.

## 산출물

- `.verification/content-results.json`: 14개 콘텐츠 검증 결과 및 격리 복사본 위치
- `.verification/browser-results.json`: 브라우저 검증 결과
- `.verification/reference-results.json`: 기존 저장소 비교 결과
- `.verification/desktop.png`, `desktop-full.png`, `tablet.png`, `mobile.png`, `*-work.png`: 캡처

## 아직 검증하지 않은 실제 연결

- 실제 프로젝트 Demo, 영상 재생 콘텐츠, APK 설치, binary 실행
- 실제 외부 서비스의 iframe 허용 정책
- 최종 Resume와 최종 소개/프로젝트 문구
- Cloudflare 배포·production 도메인 동작

영상은 URL 기반 native controls와 표시 분기를 검증했으며, 실제 프로젝트 영상의 재생 호환성은 URL 연결 후 확인해야 합니다.
