import type { Project } from '../types';

const project = {
  order: 1,
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
} satisfies Project;

export default project;
