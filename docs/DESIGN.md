# Dark technical editorial theme

## 디자인 기준

- 공통 색상·간격·모서리 값: `src/styles/global.css`의 `:root`.
- 배경 `#0D0E10`, 섹션 `#111316`, 표면 `#16181C`, 높은 표면 `#1B1E23`.
- Sage `#839B91`는 탐색·번호·상태, Yellow `#E4C65A`는 주요 CTA에 사용한다.
- 장식용 muted는 `#666A70`, 작은 본문·메타데이터는 대비를 위해 `#92979F`를 사용한다.
- 카드 배경보다 여백·타이포그래피·1px 구분선을 우선한다. 모서리는 3~4px.
- 제목·본문은 Pretendard, 번호·장면 캡션에만 제한적으로 monospace를 사용한다.
- `SectionHeading.astro`에서 홈 섹션 번호 01~06을 표시한다.
- 프로젝트 순서와 이미지, 기술 목록, 번역은 기존 콘텐츠 데이터를 사용한다.
- 코드 블록은 `astro.config.mjs`, Mermaid는 `src/lib/rehype-diagrams.mjs`에서 다크 색상을 지정한다.

## Hero 영상 연결

`src/components/HeroScene.astro` 상단의 `scene` 객체가 연결 지점이다.

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

자산이 없을 때는 정적 SVG 지형이 표시된다. 영상이 연결되면 화면 안에서만 무음 반복 재생하며,
화면 밖·비활성 탭·`prefers-reduced-motion`에서는 재생을 멈춘다.
정적 poster는 reduced-motion 사용자 및 재생 실패 상황을 위해 함께 준비한다.
Desktop의 좌우 비율은 44:56, 700px 이하에서는 소개 → 장면 순서이며 장면 높이는 210~320px다.

## 검증

- `npm run check`: Astro/TypeScript 검사.
- `npm test`: 실제 사이트 및 콘텐츠 fixture 빌드, 콘텐츠·라우팅 검증.
- `npm run test:browser`: 대비, 360~1600px 레이아웃, 언어 전환, 링크·다이얼로그·영상 회귀 검증.
- `npm run test:project-media`: 데스크톱 호버 및 모바일·태블릿 터치 미리보기 검증.
- 생성된 스크린샷과 검증 결과는 `.verification/`에만 둔다.
