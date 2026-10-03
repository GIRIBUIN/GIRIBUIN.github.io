import type { Project } from '../types';

const project = {
  order: 3,
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
    youtubeId: 's0NdfQGYFL4',
  },
} satisfies Project;

export default project;
