export interface ProjectMedia {
  hero?: string;
  heroAlt?: string;
  heroCaption?: string;
  architecture?: string;
  architectureAlt?: string;
  architectureCaption?: string;
  youtubeId?: string;
}

interface TechnicalDecision {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  oneLine: string;
  period: string;
  status: string;
  type: string;
  teamSize: number;
  role: string;
  stack: string[];
  repository: string;
  demo?: string;
  overview: string[];
  contributions: string[];
  implementation: string[];
  technicalDecisions: TechnicalDecision[];
  limitations: string[];
  media?: ProjectMedia;
}

export const projects: Project[] = [
  {
    slug: 'zzz',
    title: 'ZZZ',
    subtitle: '웨어러블·환경 데이터 기반 수면 지원 IoT 서비스',
    oneLine: 'Raspberry Pi 환경 센서와 웨어러블 데이터를 연결하고, 규칙 기반 수면 위험도·점수를 제공하는 서비스를 AWS 수업용 데모까지 확장했습니다.',
    period: '2026년 1학기',
    status: '완료',
    type: '팀 프로젝트',
    teamSize: 4,
    role: '전체 구조·DB·Express 대시보드·AWS 단계 통합',
    stack: [
      'Node.js',
      'Express',
      'SQLite',
      'MySQL/RDS',
      'Raspberry Pi',
      'MQTT',
      'AWS IoT Core',
      'Lambda',
      'API Gateway',
      'EC2',
      'Google Health API',
    ],
    repository: 'https://github.com/GIRIBUIN/zzz',
    demo: 'https://youtu.be/eqvWtHHWINI',
    overview: [
      '취침 전에는 환경 센서와 활동 데이터를, 기상 후에는 수면 점수와 근거를 확인할 수 있도록 Raspberry Pi, 웨어러블, 웹 대시보드를 연결한 팀 프로젝트입니다.',
      '초기 On-Premise Express·SQLite 구조에서 Fitbit 연동을 거쳐 Google Health로 전환했고, 최종 단계에서는 MySQL/RDS, AWS IoT Core, Lambda, API Gateway, EC2를 이용한 수업용 Cloud 데모로 확장했습니다.',
    ],
    contributions: [
      '센서·서버·DB·대시보드가 연결되는 전체 계층 구조를 설계했습니다.',
      '사용자, 기기, 환경·활동·수면 데이터를 위한 DB schema와 저장 구조를 구성했습니다.',
      'Express API와 대시보드를 구현하고 팀원의 각 계층을 통합했습니다.',
      'Google Health 전환과 AWS 단계의 구조를 설계하고 SQLite 데이터를 MySQL/RDS 구조로 확장했습니다.',
    ],
    implementation: [
      '팀 전체 시스템은 Raspberry Pi 환경 센서와 웨어러블 데이터 수집 경로를 통해 수면 관련 데이터를 모았습니다.',
      '수면 위험도와 점수는 학습 모델이 아니라 threshold와 weight에 따른 규칙으로 계산했습니다.',
      'Groq는 계산 모델이 아니라 규칙 계산 결과를 자연어로 설명하는 데 사용했고, 응답 실패 시 규칙 기반 문구로 대체했습니다.',
      'AWS 단계는 수업 시연 범위에서 IoT Core, Lambda, API Gateway, RDS, EC2를 연결했습니다.',
    ],
    technicalDecisions: [
      {
        title: 'On-Premise에서 Cloud로 단계적 확장',
        description: '센서와 대시보드의 로컬 동작을 먼저 검증한 뒤, 데이터 계층을 SQLite에서 MySQL/RDS로 옮기고 AWS 서비스 연결을 추가해 변경 범위를 분리했습니다.',
      },
      {
        title: 'Fitbit에서 Google Health로 전환',
        description: '웨어러블 데이터 공급원 변경에 대응해 OAuth, token 저장·갱신, 데이터 수집 경로를 Google Health 기준으로 다시 구성했습니다.',
      },
      {
        title: '점수 계산과 자연어 설명의 분리',
        description: '위험도와 점수는 재현 가능한 규칙으로 계산하고, Groq는 계산된 결과의 설명에만 사용해 생성 모델 응답이 핵심 판정을 바꾸지 않도록 했습니다.',
      },
    ],
    limitations: [
      'AWS 구성은 수업용 데모이며 production 운영 환경이 아닙니다.',
      'On-Premise 단계의 대시보드 화면을 최종 Google Health/AWS 화면으로 해석할 수 없습니다.',
      '자동화 테스트, 부하 테스트, 운영 보안 검증은 확인되지 않았습니다.',
      '센서·웨어러블 수집 계층 전체를 개인 구현으로 주장하지 않습니다.',
    ],
    media: {
      hero: '/imgs/projects/zzz/overview.png',
      heroAlt: 'ZZZ On-Premise 단계의 수면 대시보드 화면',
      heroCaption: 'Dashboard UI — On-Premise 단계',
      architecture: '/imgs/projects/zzz/architecture.png',
      architectureAlt: 'ZZZ의 Google Health 및 AWS Cloud 확장 구조도',
      architectureCaption: 'Google Health와 AWS 수업용 데모 확장 구조',
      youtubeId: 'eqvWtHHWINI',
    },
  },
  {
    slug: 'rpi-parking',
    title: 'Raspberry Pi 스마트 주차 서비스',
    subtitle: '3대의 Raspberry Pi를 MQTT로 연결한 주차장 모형',
    oneLine: '주차 공간 감지·게이트 제어·중앙 모니터링을 Raspberry Pi 3대와 MQTT로 연결하고, RPi3의 중앙 서비스와 상태 진단을 담당했습니다.',
    period: '2026.05 – 2026.06',
    status: '완료',
    type: '팀 프로젝트',
    teamSize: 3,
    role: 'RPi3 중앙 서비스·상태 진단·네트워크 통합',
    stack: [
      'C',
      'Python',
      'Linux Kernel',
      'Raspberry Pi',
      'MQTT/Mosquitto',
      'Flask',
      'SQLite',
    ],
    repository: 'https://github.com/GIRIBUIN/RPI-Parking-service-driver',
    demo: 'https://youtu.be/YD9IXrkSWf0',
    overview: [
      'Raspberry Pi 3대를 주차 공간 감지, 게이트 제어, 중앙 서비스로 나누고 MQTT로 상태와 이벤트를 전달한 임베디드 시스템 팀 프로젝트입니다.',
      'RPi1은 slot sensing, RPi2는 gate와 buzzer 제어, RPi3는 Mosquitto broker, MQTT subscriber, SQLite, Flask dashboard를 담당하는 구조입니다.',
    ],
    contributions: [
      '개인 담당 장치인 RPi3에 Mosquitto broker와 MQTT subscriber를 구성했습니다.',
      '수집한 slot·gate·event 상태를 SQLite에 저장하고 Flask dashboard로 표시했습니다.',
      '커널 status interface와 heartbeat를 이용해 장치·메시지 상태를 진단하는 흐름을 구현했습니다.',
      'RPi3를 local network/AP 중심으로 구성하고 세 Raspberry Pi의 전체 동작을 통합했습니다.',
    ],
    implementation: [
      '팀 전체 범위에서 RPi1이 초음파 센서로 두 slot의 점유 상태를 판단하고, RPi2가 gate와 buzzer를 제어했습니다.',
      'RPi3는 MQTT topic을 구독해 최신 상태와 이벤트를 DB와 대시보드에 반영했습니다.',
      'heartbeat와 Linux kernel status interface를 통해 메시지 수신과 장치 상태를 확인할 수 있게 했습니다.',
      '외부 인프라 없이 시연할 수 있도록 RPi3 중심의 local network/AP 환경을 구성했습니다.',
    ],
    technicalDecisions: [
      {
        title: 'MQTT 기반 장치 역할 분리',
        description: '감지·제어·중앙 서비스가 직접 결합되지 않도록 topic을 통해 상태와 이벤트를 교환하게 구성했습니다.',
      },
      {
        title: 'Heartbeat와 kernel status interface',
        description: '대시보드 상태만으로 원인을 찾기 어려운 상황에 대비해 heartbeat와 /dev·/proc 기반 상태 인터페이스로 진단 정보를 노출했습니다.',
      },
      {
        title: 'RPi3 중심의 로컬 네트워크',
        description: '교실 시연 환경의 네트워크 제약을 줄이기 위해 RPi3를 broker와 AP의 중심으로 두고 세 장치를 통합했습니다.',
      },
    ],
    limitations: [
      '고정된 주차장 모형과 로컬 네트워크에서 검증한 수업 프로젝트입니다.',
      '실제 주차장 규모, 번호판 인식, 인증·결제 기능은 구현 범위가 아닙니다.',
      'RPi3 장애 시 중앙 기능이 함께 중단되는 단일 장애 지점이 있습니다.',
      'RPi1 sensor/slot driver와 RPi2 gate/buzzer driver는 팀원이 구현했습니다.',
    ],
    media: {
      architecture: '/imgs/projects/smart-parking/architecture.png',
      architectureAlt: 'Raspberry Pi 3대와 MQTT로 구성한 스마트 주차 서비스 구조도',
      architectureCaption: 'RPi1 감지, RPi2 제어, RPi3 중앙 서비스를 연결한 전체 구조',
      youtubeId: 'YD9IXrkSWf0',
    },
  },
  {
    slug: 'review-analyzer',
    title: 'Review Analyzer — 딸깍 리뷰',
    subtitle: '관심 키워드로 상품 리뷰를 수집·요약하는 웹 프로토타입',
    oneLine: '쿠팡 상품 URL과 관심 키워드로 리뷰를 수집·요약하는 Flask 웹 프로토타입에서 DB·session·route·라이브러리와 화면 통합을 담당했습니다.',
    period: '2025.09 – 2025.12',
    status: '완료',
    type: '팀 프로젝트',
    teamSize: 3,
    role: 'MySQL·Flask session/routes·library·웹 통합',
    stack: [
      'Python',
      'Flask',
      'MySQL',
      'JavaScript',
      'Selenium',
      'BeautifulSoup',
      'Gemini',
      'Docker',
    ],
    repository: 'https://github.com/GIRIBUIN/Review-Analyzer',
    demo: 'https://youtu.be/s0NdfQGYFL4?si=W9RDuQmD3eyppXs3',
    overview: [
      '사용자가 쿠팡 상품 URL과 관심 keyword를 입력하면 리뷰를 crawling하고 Gemini로 분석·요약한 뒤, 결과와 관련 상품 URL을 보여 주는 Flask 웹 프로토타입입니다.',
      '팀 전체 시스템은 crawler, AI 분석, Flask route, MySQL library, JavaScript 화면으로 구성됩니다. 관련 상품은 crawler가 수집한 URL이며 개인화 AI ranking으로 검증한 결과가 아닙니다.',
    ],
    contributions: [
      'MySQL schema와 분석 결과의 저장·조회·삭제 CRUD를 구성했습니다.',
      '사용자 등록·login, Flask session, 인증 상태 확인 route를 구현했습니다.',
      '분석·추천·library 저장·조회·삭제 endpoint와 frontend 호출을 연결했습니다.',
      'Docker 개발환경과 NHN Cloud/NKS 환경을 구성하고 배포를 시도했습니다.',
      'crawler와 Gemini analyzer를 포함한 팀 결과물을 웹 화면에 최종 통합했습니다.',
    ],
    implementation: [
      '팀 전체 범위에서 Selenium·BeautifulSoup crawler가 상품과 리뷰 데이터를 수집하고 Gemini가 키워드 기준 분석·요약을 생성했습니다.',
      'Flask session과 MySQL을 이용해 사용자별 library를 저장·조회·삭제할 수 있게 구현했습니다.',
      'JavaScript 화면에서 분석, 관련 상품 조회, library 동작을 각 API endpoint와 연결했습니다.',
      '수업 시연은 로컬 환경에서 확인됐으며 crawler와 AI 핵심 구현 전체는 개인 기여 범위가 아닙니다.',
    ],
    technicalDecisions: [
      {
        title: '분석 흐름과 library 저장의 분리',
        description: '분석 요청 결과를 바로 library cache로 간주하지 않고, 사용자가 저장할 때 별도 endpoint를 호출하는 흐름으로 구성했습니다.',
      },
      {
        title: 'Session·route·화면 상태 연결',
        description: 'Flask session의 로그인 상태와 사용자 ID를 기준으로 library CRUD를 제한하고, 화면 동작을 해당 endpoint와 연결했습니다.',
      },
      {
        title: 'Cloud 제약 이후 로컬 시연 범위 확정',
        description: 'NHN Cloud/NKS 배포를 시도했지만 headless Linux 환경에서 GUI 의존 crawler가 동작하지 않아, 검증 범위를 로컬 통합 시연으로 제한했습니다.',
      },
    ],
    limitations: [
      'request-time cache와 개인화 AI ranking은 완성된 기능이 아닙니다.',
      '현재 local source의 DB query는 recommended_info column을 사용하지만 schema.sql에는 해당 column이 없어 새 DB에서 library 저장·조회가 실패할 수 있습니다.',
      'README에는 Docker 실행 절차가 남아 있지만 현재 local source에는 Dockerfile과 compose 파일이 없습니다.',
      'Cloud 배포 안정성과 추천 품질을 검증한 production 서비스가 아닙니다.',
    ],
    media: {
      hero: '/imgs/projects/review-analyzer/home.png',
      heroAlt: '딸깍 리뷰의 상품 URL 및 키워드 입력 화면',
      heroCaption: '딸깍 리뷰 웹 프로토타입 실행 화면',
      architecture: '/imgs/projects/review-analyzer/architecture.png',
      architectureAlt: '딸깍 리뷰의 웹, 인증, 크롤링, 데이터베이스, AI 분석 모듈 구성도',
      architectureCaption: '딸깍 리뷰 시스템 구성도',
      youtubeId: 'Dqj01tUyWdQ',
    },
  },
];
