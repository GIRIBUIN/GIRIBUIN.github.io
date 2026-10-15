import type { Locale } from '../i18n/ui';
type Localized = Record<Locale, string>;
export interface PrincipleEvidence {
  id: string;
  projectSlug?: string;
  title?: string;
  description: Localized;
  sources: string[];
}
export interface BuildPrinciple {
  id: string;
  order: number;
  title: string;
  shortDescription: Localized;
  why: Localized;
  how: Localized;
  evidence: PrincipleEvidence[];
}
export const buildPrinciples: BuildPrinciple[] = [
  {
    "id": "understand",
    "order": 1,
    "title": "Understand before building",
    "shortDescription": {
      "en": "Start with the workflow and the data that actually exist.",
      "ko": "코드를 쓰기 전에 실제 작업 흐름과 데이터를 먼저 봅니다."
    },
    "why": {
      "en": "A useful feature starts with a concrete problem. Looking at real inputs and repeated work helps me decide what the tool needs to do.",
      "ko": "실제로 반복되는 작업과 입력 데이터를 살펴봐야 필요한 기능을 구체적으로 정할 수 있습니다."
    },
    "how": {
      "en": "Trace the existing workflow, inspect the source data, and define the first useful scope before expanding the implementation.",
      "ko": "기존 작업 순서와 원본 데이터를 확인하고, 먼저 해결할 범위를 정한 뒤 구현을 확장합니다."
    },
    "evidence": [
      {
        "id": "ct",
        "projectSlug": "ct",
        "description": {
          "en": "ct grew from repeatedly preparing solution files, compiler environments, and VS Code folders for coding practice. That workflow became a CLI with templates and environment checks.",
          "ko": "ct는 코딩테스트마다 풀이 파일, 컴파일 환경, VS Code 작업 폴더를 준비하던 불편에서 시작했습니다. 반복하던 작업을 템플릿과 환경 진단을 갖춘 CLI로 옮겼습니다."
        },
        "sources": [
          "EXP-031: problem / scope",
          "src/content/projects/ct.md"
        ]
      },
      {
        "id": "kuroom",
        "projectSlug": "kuroom",
        "description": {
          "en": "KUROOM normalizes campus building and room data into queryable timetable JSON. Its scope evolved from an empty-room search experiment to building and room schedule exploration.",
          "ko": "KUROOM은 건물·강의실 데이터를 정규화해 조회 가능한 시간표 JSON으로 가공했습니다. 초기 공실 검색 실험에서 건물·강의실별 일정 조회를 중심으로 범위를 조정했습니다."
        },
        "sources": [
          "EXP-032: data / scope",
          "src/content/projects/kuroom.md"
        ]
      }
    ]
  },
  {
    "id": "boundaries",
    "order": 2,
    "title": "Separate the boundaries",
    "shortDescription": {
      "en": "Separate what changes from what needs to be preserved.",
      "ko": "바뀌는 데이터와 사용자가 유지할 데이터를 먼저 나눕니다."
    },
    "why": {
      "en": "External data and a user’s local choices can have different lifecycles. Treating them as one state makes synchronization rules harder to explain.",
      "ko": "외부 시스템의 원본 데이터와 사용자가 수정하는 로컬 데이터는 변경되는 시점과 보존할 내용이 다를 수 있습니다."
    },
    "how": {
      "en": "Define source identifiers and owned fields, compare incoming source state with local state, and make the update policy explicit.",
      "ko": "원본을 식별하는 키와 각 데이터의 책임을 정하고, 수집한 상태와 로컬 상태의 차이를 비교해 반영 규칙을 분리합니다."
    },
    "evidence": [
      {
        "id": "kutodo",
        "projectSlug": "kutodo",
        "description": {
          "en": "KUTODO fetches eCampus HTML through a WebView login session and compares source keys and original fields with local tasks before selective import. Its verified local store is Drift/SQLite.",
          "ko": "KUTODO는 WebView 로그인 세션으로 eCampus HTML을 수집하고, sourceKey와 원본 필드를 로컬 Task와 비교한 뒤 선택적으로 반영합니다. 확인된 로컬 저장 계층은 Drift/SQLite입니다."
        },
        "sources": [
          "EXP-016: sync / data model",
          "src/content/projects/kutodo.md"
        ]
      }
    ]
  },
  {
    "id": "connect",
    "order": 3,
    "title": "Connect the whole flow",
    "shortDescription": {
      "en": "Follow the data across devices, services, and storage.",
      "ko": "장치와 서비스, 저장소를 오가는 데이터의 전체 흐름을 봅니다."
    },
    "why": {
      "en": "A component working alone does not establish that its interfaces work together. Integration is where assumptions about formats, state, and timing become visible.",
      "ko": "각 구성 요소가 개별적으로 동작하더라도 연결 과정에서는 데이터 형식, 상태, 처리 시점에 대한 가정이 드러납니다."
    },
    "how": {
      "en": "Connect collection, storage, processing, and output; inspect the interfaces between them and keep each team member’s responsibility clear.",
      "ko": "수집·저장·처리·출력을 연결하고, 경계에서 데이터가 어떻게 전달되는지 확인합니다. 팀 작업에서는 각자의 담당 범위도 구분합니다."
    },
    "evidence": [
      {
        "id": "zzz",
        "projectSlug": "zzz",
        "description": {
          "en": "In ZZZ, I designed schemas and Express APIs, integrated sensor and Google Health paths, and contributed to extending the SQLite-based system with AWS IoT, MySQL/RDS, and dashboard integration.",
          "ko": "ZZZ에서 스키마와 Express API를 설계하고 센서·Google Health 경로를 통합했습니다. SQLite 기반 구성을 AWS IoT, MySQL/RDS와 대시보드 흐름으로 확장하는 데 기여했습니다."
        },
        "sources": [
          "EXP-014: role / architecture",
          "src/content/projects/zzz.md"
        ]
      },
      {
        "id": "parking",
        "projectSlug": "smart-parking",
        "description": {
          "en": "In Smart Parking, I built the central RPi3 MQTT/SQLite/Flask flow, heartbeat diagnostics, kernel status interfaces, and local access point. Teammates handled the sensor and gate nodes.",
          "ko": "Smart Parking에서는 중앙 RPi3의 MQTT·SQLite·Flask 흐름, heartbeat 진단, 커널 상태 인터페이스와 로컬 AP를 구현했습니다. 센서·게이트 노드는 팀원이 담당했습니다."
        },
        "sources": [
          "EXP-015: central node / role boundaries",
          "src/content/projects/smart-parking.md"
        ]
      }
    ]
  },
  {
    "id": "run",
    "order": 4,
    "title": "Make it run",
    "shortDescription": {
      "en": "Connect a usable path from input to an observable result.",
      "ko": "입력부터 결과까지 실제로 동작하는 최소 흐름을 연결합니다."
    },
    "why": {
      "en": "Running a bounded workflow reveals problems that diagrams and isolated implementations can leave unresolved.",
      "ko": "범위를 정해 실제로 실행해 보면 설계나 개별 구현만으로는 확인하기 어려운 조건이 드러납니다."
    },
    "how": {
      "en": "Build an executable path, choose a demonstrable environment, and distinguish that result from broader deployment or usage claims.",
      "ko": "실행 가능한 흐름을 만들고 시연할 환경을 정합니다. 그 환경에서 확인한 결과와 배포·실사용 성과를 구분해 기록합니다."
    },
    "evidence": [
      {
        "id": "ct",
        "projectSlug": "ct",
        "description": {
          "en": "ct was checked with isolated CLI runs and existing-file preservation, then released as v0.3.1 binaries for Windows amd64 and Linux amd64/arm64. Editor invocation was tested with a stub.",
          "ko": "ct는 격리된 CLI 실행과 기존 파일 보존을 확인한 뒤 Windows amd64·Linux amd64/arm64용 v0.3.1 바이너리를 공개했습니다. 편집기 호출은 stub으로 검사했습니다."
        },
        "sources": [
          "EXP-031: validation / release",
          "src/content/projects/ct.md"
        ]
      },
      {
        "id": "review",
        "projectSlug": "review-analyzer",
        "description": {
          "en": "Review Analyzer connected collection and analysis output with Flask, MySQL, and the library UI for a local GUI class demonstration. The unresolved headless crawler issue meant stable cloud deployment was not achieved.",
          "ko": "Review Analyzer는 수집·분석 결과를 Flask, MySQL, 라이브러리 UI와 연결해 로컬 GUI 환경에서 수업 시연을 했습니다. headless 환경의 크롤러 문제는 해결하지 못해 안정적인 클라우드 배포로 이어지지 않았습니다."
        },
        "sources": [
          "EXP-007: integration / demo limits",
          "src/content/projects/review-analyzer.md"
        ]
      }
    ]
  },
  {
    "id": "failure",
    "order": 5,
    "title": "Verify the failure",
    "shortDescription": {
      "en": "Check boundaries and unsafe updates, as well as the normal path.",
      "ko": "정상 경로와 함께 경계 조건과 잘못 반영될 가능성을 확인합니다."
    },
    "why": {
      "en": "Ordinary inputs are only part of the behavior. Boundary times, missing items, and failed collection can change what a safe result means.",
      "ko": "시간 경계, 누락된 항목, 수집 실패처럼 조건이 달라지면 올바른 처리 결과도 달라질 수 있습니다."
    },
    "how": {
      "en": "Write checks around edge conditions, compare independent implementations where available, and record the difference between automated coverage and live verification.",
      "ko": "경계 조건을 테스트하고, 비교 가능한 구현이 있으면 결과를 대조합니다. 자동화 테스트와 실제 환경에서 확인한 범위도 구분합니다."
    },
    "evidence": [
      {
        "id": "kuroom",
        "projectSlug": "kuroom",
        "description": {
          "en": "KUROOM compares Python and TypeScript lookup results and checks interval and timezone behavior. The reviewed record passed Python, web, three-timezone tests, and a production build.",
          "ko": "KUROOM은 Python과 TypeScript의 조회 결과를 비교하고 시간 구간과 시간대 처리를 확인합니다. 확인한 기록에서는 Python·웹·세 시간대 테스트와 production build가 통과했습니다."
        },
        "sources": [
          "EXP-032: interval / timezone validation",
          "src/content/projects/kuroom.md"
        ]
      },
      {
        "id": "kutodo",
        "projectSlug": "kutodo",
        "description": {
          "en": "KUTODO limits completion of missing tasks to successful, error-free collection and eligible future-due tasks. Its reviewed snapshot passed 81 tests across data, parsing, mock HTTP, and sync policies; live-account E2E remains unverified.",
          "ko": "KUTODO는 수집이 성공하고 오류가 없으며 미래 마감 등 조건을 충족한 항목에만 누락 후 완료 처리를 적용합니다. 확인한 보존본은 데이터·파싱·mock HTTP·동기화 정책 등 81개 테스트가 통과했지만 실제 계정 E2E는 미검증입니다."
        },
        "sources": [
          "EXP-016: guarded sync / 2026-09-22 snapshot",
          "src/content/projects/kutodo.md"
        ]
      }
    ]
  },
  {
    "id": "ai",
    "order": 6,
    "title": "Use AI as leverage",
    "shortDescription": {
      "en": "Use generated implementations with clear limits on what is verified.",
      "ko": "AI로 구현을 보조하되, 확인한 동작과 남은 한계를 구분합니다."
    },
    "why": {
      "en": "AI-generated code still needs evidence of correct behavior. The amount implemented and the reliability established are different parts of the record.",
      "ko": "AI로 작성한 코드도 올바르게 동작한다는 근거가 필요합니다. 구현한 기능의 양과 검증한 수준을 함께 기록해야 합니다."
    },
    "how": {
      "en": "Keep build results, test failures, and unverified scenarios explicit. When a result is incomplete, use that limit to define the next review rather than treating generation as completion.",
      "ko": "빌드 결과와 테스트 실패, 확인하지 못한 사용 시나리오를 따로 기록합니다. 미완성 결과는 다음 검토 범위를 정하는 근거로 삼습니다."
    },
    "evidence": [
      {
        "id": "baljucall",
        "projectSlug": "baljucall",
        "description": {
          "en": "발주콜 actively used AI-generated and suggested code for store workflows. The reviewed snapshot built a debug APK, with 552 tests passing, one skipped, and 57 failing; no device or field use was verified. This demonstrates AI-assisted implementation and its verification gap, not proven reliability.",
          "ko": "발주콜은 매장 업무를 구현하며 AI 생성·제안 코드를 적극 활용했습니다. 확인한 보존본은 debug APK 빌드 성공, 테스트 552개 통과·1개 제외·57개 실패였고 실제 기기·현장 사용은 확인하지 않았습니다. AI 활용과 검증 공백을 보여주는 사례이며 신뢰성이 입증된 결과로 표현하지 않습니다."
        },
        "sources": [
          "EXP-019: AI usage / 2026-09-28 snapshot",
          "src/content/projects/baljucall.md"
        ]
      }
    ]
  }
];
