# 의존성 경고 확인 — 2026-10-27

사용자가 수행한 npm 설치 로그의 audit report와 현재 `npm ls` 의존성 트리를 대조했다.
`npm audit fix` 및 `--force`는 실행하지 않았다. 이번 UI 변경을 위해 Astro나 관련 간접 의존성을 임의로 업데이트하지 않았다.

| 원인 패키지 | 설치 버전 | 경로 | 확인된 경고 |
|---|---|---|---|
| Astro | 7.3.2 | 직접 의존성 | View Transitions CSS injection · low |
| fast-uri | 3.1.8 | @astrojs/check → language-server → volar-service-yaml → yaml-language-server → ajv | URI 해석 관련 low/moderate |
| KaTeX | 0.16.47 | rehype-mermaid → mermaid-isomorphic / mermaid | prototype pollution이 이미 존재할 때 trust 제한 우회 · low |
| undici | 8.11.2 | Astro → unifont | EventSource 메모리, SRI, content-encoding 처리 · 최고 high |

원인 패키지와 npm이 집계하는 영향받는 상위 패키지 수는 동일하지 않을 수 있다.
현재 공개 배포는 GitHub Pages 정적 결과물이며 Node 서버를 운영하지 않는다.
빌드 도구의 취약점까지 해결됐다는 의미는 아니며, 별도 의존성 업데이트 작업에서 호환성과 재빌드를 확인해야 한다.

## 설치 로그에 나온 advisory

- [Astro View Transitions](https://github.com/advisories/GHSA-mpr7-6m5w-76rw)
- [fast-uri scheme decoding](https://github.com/advisories/GHSA-w74x-v6f9-j3xg)
- [fast-uri path normalization](https://github.com/advisories/GHSA-xhq7-xmqj-769h)
- [fast-uri host canonicalization](https://github.com/advisories/GHSA-wjr9-j795-jxcr)
- [fast-uri suffix references](https://github.com/advisories/GHSA-333x-w4r6-6crp)
- [KaTeX trust restrictions](https://github.com/advisories/GHSA-238p-pmpm-9mq7)
- [undici EventSource](https://github.com/advisories/GHSA-4qv8-2p9j-2685)
- [undici SRI](https://github.com/advisories/GHSA-f72v-6w45-q472)
- [undici content encodings / high](https://github.com/advisories/GHSA-xjj6-f33q-929c)
