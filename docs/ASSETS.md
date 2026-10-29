# 폴더와 자산 관리

## 작업 원본과 생성물

| 경로 | 용도 | 관리 |
| --- | --- | --- |
| `src/` | 페이지·콘텐츠·설정 | Git에 보관 |
| `public/` | 실제 배포할 이미지·영상·PDF·폰트 | Git에 보관하는 자산 원본 |
| `scripts/` | 검사·정리 명령 | Git에 보관 |
| `docs/` | 자산 출처·설계·검증 기록 | Git에 보관 |
| `dist/` | `npm run build` 결과 | 자동 생성, 수동 편집하지 않음 |
| `.astro/` | Astro 타입·콘텐츠 캐시 | 자동 생성 |
| `.verification/` | 테스트 fixture·결과·스크린샷 | 임시 생성물 |
| `node_modules/` | npm 의존성 | `npm ci`로 설치, 일반 정리에서는 유지 |

`dist/`는 로컬 미리보기와 배포에 사용하는 출력입니다. 삭제해도 소스는 유지되며, 다음 빌드가 다시 생성합니다. GitHub Actions도 매번 빌드하므로 로컬 `dist/`를 저장소에 넣을 필요가 없습니다.

## 자산 위치

```text
public/
  images/
    profile/                  # Hero·About 사진
    background/               # 학력·회사·인턴 이력 이미지 (현재 konkuk.png)
    skills/                   # 기술 아이콘
    projects/
      [slug]/
        icon.png              # 선택: 프로젝트 아이콘
        thumbnail.png         # 선택: 공통 16:9 썸네일
        reference.png         # 선택: 이전 구현 참고 화면
  videos/projects/[slug]/
    demo.mp4                  # 선택: 무음 카드 미리보기
  files/                      # 이력서·포트폴리오 PDF
  models/pet.glb               # 홈 companion 원본 모델
  fonts/                      # 폰트와 라이선스
```

프로젝트 이미지는 해당 slug 폴더에 모읍니다. dark/light 썸네일을 따로 만들지 않으며, 현재 제공된 썸네일은 1280×720입니다. 이미지와 영상은 선택 사항입니다. 표시·호버 재생 규칙은 루트 [README](../README.md)의 미디어 표를 따릅니다.

배포 빌드의 메뉴 폴더·요약 화면은 `explorer-data.ts`에서 Astro 이미지 파이프라인으로 생성한 800px WebP를 사용합니다. 개발 서버는 Windows 이미지 변환 경로 문제를 피하도록 public의 원본 PNG를 직접 사용합니다. 컬렉션의 원본 PNG 경로는 유지하며 `dist/_astro/`의 파생 파일을 직접 관리하지 않습니다. 폴더는 영상 요소 없이 썸네일만 로딩하고 요약에서 선택한 영상만 요청합니다. Details/독립 상세의 YouTube는 재생 버튼을 누른 뒤에만 연결됩니다.

`dist/`, `.astro/`, `.verification/`에는 원본 이미지를 보관하지 않습니다. 프로젝트 저장소의 `assets/`에서 가져온 자산은 이 포트폴리오의 `public/`에 한 번만 복사해 연결합니다.

## 참고 이미지 출처

| 현재 파일 | 원본 |
| --- | --- |
| `public/images/projects/zzz/reference.png` | 기존 GIRIBUIN.github.io의 `public/imgs/projects/zzz/overview.png` |
| `public/images/projects/review-analyzer/reference.png` | 기존 GIRIBUIN.github.io의 `public/imgs/projects/review-analyzer/home.png` |

두 파일은 원본 바이트를 유지한 이전 구현 참고 자료입니다. ZZZ는 초기 On-Premise 단계이며 최종 AWS·Google Health 화면을 의미하지 않습니다. Review Analyzer는 기존 웹 프로토타입의 입력 화면이며 최종 분석 결과를 증명하지 않습니다.

`public/models/pet.glb`는 2026-10-29 사용자 Downloads의 `pet.glb`를 원본 그대로 복사했다. 크기 1,366,392 bytes, SHA-256 `D61360CD559E0183D391D6D53D7DF17172F9D9BF1F4A6B34E91415392FEB59BE`. Blender glTF 2.0 모델이며 현재 animation clip은 없다. 수정본은 이 public 경로에 교체한다.

프로필·PDF·프로젝트 아이콘과 썸네일의 상세 출처는 [CONTENT_SOURCES](CONTENT_SOURCES.md), 기술 아이콘 출처는 [TECH_ICON_SOURCES](TECH_ICON_SOURCES.md)에 기록합니다.

## 정리 명령

```sh
npm run clean                # dist·.astro·.verification·error.png, 비어 있는 루트 assets 폴더 정리
npm run clean:verification   # 검증 결과·스크린샷만 정리
```

두 명령은 소스·배포 자산·의존성을 보존합니다. 미리보기에는 `npm run build`를, 전체 브라우저 검사에는 `npm test`를 먼저 실행해 필요한 생성물을 준비합니다.

`npm test`는 `.verification/content-current/` 한 개를 재사용합니다. 실행할 때 이전 fixture를 교체하므로 복사본이 계속 쌓이지 않습니다.
