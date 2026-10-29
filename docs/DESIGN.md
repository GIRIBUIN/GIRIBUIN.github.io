# Dark technical editorial theme

## 디자인 기준

- 공통 색상·간격·모서리 값: `src/styles/global.css`의 `:root`.
- 배경 `#0D0E10`, 섹션 `#111316`, 표면 `#16181C`, 높은 표면 `#1B1E23`.
- Sage `#839B91`는 탐색·번호·상태, Yellow `#E4C65A`는 주요 CTA에 사용한다.
- 장식용 muted는 `#666A70`, 작은 본문·메타데이터는 대비를 위해 `#92979F`를 사용한다.
- 카드 배경보다 여백·타이포그래피·1px 구분선을 우선한다. 모서리는 3~4px.
- 제목·본문은 Pretendard, 번호·장면 캡션에만 제한적으로 monospace를 사용한다.
- 홈은 게임 메뉴·도감 UI이며 구성과 상태는 [MENU-ARCHITECTURE.md](./MENU-ARCHITECTURE.md)에 기록한다.
- 메뉴와 독립 상세는 `game-theme.css`의 `.game-theme` scoped token으로 다크 올리브 팔레트를 공유한다. 배경 `#161713`, panel `#24251F`, surface `#2C2D26`, border `#77734D`, hover border `#C2BC73`, 중요/선택 accent `#E6DB74`다. 아카이브는 원래 root token을 유지한다.
- 메뉴의 공통 Window는 title plaque와 겹치는 physical control, 짧은 solid shadow를 공유한다. `.game-item`은 프로젝트·문서·연락 항목에 재사용한다. motion은 180ms/280ms, reduced-motion에서는 transform/animation을 제거한다.
- `SectionHeading.astro`는 About window와 기존 아카이브에서 재사용한다.
- 프로젝트 순서와 이미지, 기술 목록, 번역은 기존 콘텐츠 데이터를 사용한다.
- 코드 블록은 `astro.config.mjs`, Mermaid는 `src/lib/rehype-diagrams.mjs`에서 다크 색상을 지정한다.

## Hero 캐릭터 쇼케이스

현재 홈은 정적 HTML 타이틀·하단 게임 메뉴와 별도 R3F island를 조합한다. `VisualScene.astro` → `PetScene.tsx`가 캐릭터·조명·그림자를 담당하고, `src/lib/pet-scene.ts`가 GLB 복제·머리 pivot·ref motion을 담당한다. Blender 파일은 변경하지 않는다.
캐릭터는 화면 중앙에 배치하고 desktop의 실제 높이는 viewport의 40~55%를 목표로 한다. 화면의 GIRIBUIN 이름과 조작 안내는 제거하고 접근성 설명만 유지한다. 다크 올리브 radial 배경, key/fill/rim light와 얕은 plane shadow만 사용한다. 머리는 ±12°/±6°, hover는 1.03배, 클릭은 작은 점프, 드래그는 그룹 전체 회전이다.
idle을 제외한 상태 변경은 이벤트에서 처리하고 useFrame은 ref만 갱신한다. reduced-motion·숨김 탭·열린 메뉴의 렌더링 정책과 교체 경계는 [MENU-ARCHITECTURE.md](./MENU-ARCHITECTURE.md)에 기록한다.

## 향후 Hero 영상 연결

`src/components/VisualScene.astro`가 독립된 비주얼 교체 경계다. 현재는 위의 캐릭터 scene을 표시한다.
영상을 준비하면 이 파일에 video를 추가하거나 기존 `HeroScene.astro`를 연결한다. 아래는 기존 HeroScene을 재사용할 때의 자산 설정이다.

1. 영상을 `public/videos/hero/lunar-loop.webm` 및/또는 `public/videos/hero/lunar-loop.mp4`에 둔다.
2. 정적 프레임은 `public/images/hero/lunar-poster.webp`에 둔다.
3. `scene.webm`, `scene.mp4`, `scene.poster`의 null을 해당 루트 상대 URL로 바꾼다.

```ts
const scene = {
  webm: '/videos/hero/lunar-loop.webm',
  mp4: '/videos/hero/lunar-loop.mp4',
  poster: '/images/hero/lunar-poster.webp',
};
```

실제 파일을 준비한 형식만 연결한다. MP4는 무음 H.264/yuv420p/faststart를 권장한다.
Blender 배경을 `#0D0E10`에 맞추고 지면을 하단에 배치하면 Hero 기준선과 이어진다.
영상은 `object-fit: cover`로 채우므로 캐릭터와 companion은 중앙 안전 영역에 배치한다.
좌우 가장자리에는 마스크가 적용되며, 박스·테두리·그림자는 사용하지 않는다.
캔버스를 사용할 때는 `.hero-scene-media` 내부 video를 renderer의 canvas로 교체한다.

현재 HeroScene은 홈에서 사용하지 않는다. 다시 연결할 때는 기존 정적 SVG 지형을 제거하고 준비한 poster를 fallback으로 사용한다. 영상은 화면 안에서만 무음 반복 재생하며,
화면 밖·비활성 탭·`prefers-reduced-motion`에서는 재생을 멈춘다.
정적 poster는 reduced-motion 사용자 및 재생 실패 상황을 위해 함께 준비한다.
홈 위에 여백 있는 공통 window가 열린다. title bar에는 제목과 X만 두며 global header는 그대로 유지한다. Projects는 전체 목록 → 선택 후 split 순서로 탐색한다.

## 검증

- `npm run check`: Astro/TypeScript 검사.
- `npm test`: 실제 사이트 및 콘텐츠 fixture 빌드, 콘텐츠·라우팅 검증.
- `npm run test:browser`: 360~1440px 레이아웃, 메뉴·URL·history·언어 전환·키보드·영상 회귀 검증.
- `npm run test:project-media`: 데스크톱 호버 및 모바일·태블릿 터치 미리보기 검증.
- `npm run test:hero`: 실제 GLB pivot, desktop 크기, idle·시선·드래그·점프·키보드·터치·reduced-motion 검증.
- 생성된 스크린샷과 검증 결과는 `.verification/`에만 둔다.
