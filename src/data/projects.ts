export const projects = [
  {
    slug: 'linux-web-dashboard',
    title: 'Linux Web Dashboard',
    subtitle: 'Linux의 상태를 읽는 백엔드',
    summary: 'Linux /proc 파일시스템에서 CPU, 메모리, 네트워크, 디스크 지표를 직접 수집하고 REST API로 제공하는 프로젝트입니다.',
    stack: ['Python', 'FastAPI', 'Linux'],
    repository: 'https://github.com/GIRIBUIN/Linux-Web-Dashboard',
    overview: '운영체제가 시스템 정보를 어떤 형태로 제공하는지 이해하기 위해 시작한 프로젝트입니다. /proc의 원시 데이터를 읽고, 지표로 계산하고, API 응답으로 전달하는 과정을 다룹니다.',
    sections: [
      { title: '데이터를 읽는 일부터', paragraphs: ['CPU는 /proc/stat, 메모리는 /proc/meminfo, 네트워크는 /proc/net/dev, 디스크는 /proc/diskstats를 사용합니다. 각 파일을 직접 파싱해 시스템 지표의 바탕이 되는 데이터를 수집합니다.'] },
      { title: '수집과 계산, API의 경계', paragraphs: ['Parser는 원시 파일을 읽고, Service는 수집한 값을 바탕으로 지표를 계산합니다. API 계층은 FastAPI로 엔드포인트를 제공하고, Schema 계층은 Pydantic으로 응답 구조를 정의합니다.', '파일을 읽는 방식과 외부에 제공하는 응답을 나누어, 각 계층의 책임을 구분한 구조입니다.'] },
      { title: '구현 현황', paragraphs: ['README 기준으로 CPU, 메모리, 네트워크, 디스크 지표 API와 상태 확인 엔드포인트가 구현되어 있습니다. /proc 파일과의 초기 대조 검증 및 아키텍처·API 문서가 정리되어 있습니다.'], items: ['GET /health', 'GET /metrics/cpu · /metrics/memory', 'GET /metrics/network · /metrics/disk'] },
    ],
  },
  {
    slug: 'zzz',
    title: 'ZZZ',
    subtitle: '웨어러블과 환경 데이터를 연결하는 수면 관리 서비스',
    summary: '웨어러블 데이터와 환경 센서를 함께 활용해 취침 전 수면 질을 예측하고, 기상 후 결과를 해석하는 서비스를 개발하고 있습니다.',
    stack: ['Node.js', 'Express', 'SQLite', 'Raspberry Pi'],
    repository: 'https://github.com/GIRIBUIN/zzz',
    overview: '수면이 끝난 뒤 기록을 확인하는 데서 더 나아가, 취침 전에 위험 요인을 파악하고 행동에 도움이 되는 피드백을 제공하는 것을 목표로 합니다. 실제 수면 결과와 사용자 체감을 누적해 점진적으로 개인화하는 방향의 프로젝트입니다.',
    sections: [
      { title: '데이터 수집에서 피드백까지', paragraphs: ['Raspberry Pi의 환경 센서와 Google Health 데이터를 입력으로 활용합니다. 수집·저장한 데이터로 특성을 만들고, 예측과 사후 분석을 거쳐 REST API 및 대시보드에 결과를 제공합니다.'] },
      { title: '로컬 환경을 중심으로 한 구조', paragraphs: ['현재는 Raspberry Pi를 포함한 온프레미스 환경의 구현을 우선합니다. Node.js와 Express로 서비스를 구성하고 SQLite에 데이터를 저장합니다.', '장기 저장과 처리 확장 등을 위한 클라우드 계층은 향후 확장 방향으로 구분되어 있습니다.'] },
      { title: '구현 현황과 방향', paragraphs: ['README 기준으로 개발 중인 프로젝트입니다. 센서나 외부 API 연결 없이도 시드 데이터로 데모 화면을 확인하는 실행 흐름을 제공합니다.'], items: ['취침 전 수면 질 저하 위험 예측', '기상 후 수면 결과와 사용자 만족도 해석', '누적 피드백에 따른 개인화 기준 갱신'] },
    ],
  },
  {
    slug: 'review-analyzer',
    title: 'Review Analyzer',
    subtitle: '제품 리뷰를 분석하고 요약하는 웹 서비스',
    summary: '제품 링크와 키워드를 바탕으로 리뷰를 분석·요약하고, 맞춤형 추천을 제공하는 팀 프로젝트입니다.',
    stack: ['Python', 'Flask', 'MySQL', 'Docker'],
    repository: 'https://github.com/GIRIBUIN/Review-Analyzer',
    overview: '여러 리뷰에서 필요한 정보를 찾는 시간을 줄이기 위한 웹 서비스입니다. 사용자가 제공한 제품 링크와 관심 키워드를 바탕으로 리뷰 분석과 요약, 추천을 제공하는 것을 목표로 합니다.',
    sections: [
      { title: '서비스 구성', paragraphs: ['Python과 Flask 기반 백엔드, HTML·CSS·JavaScript 프런트엔드, MySQL 데이터베이스로 구성됩니다. 저장소는 크롤링, AI 분석, 데이터베이스, 라우트와 화면 템플릿을 구분하고 있습니다.'] },
      { title: '주요 기능', paragraphs: ['README에서 소개하는 주요 기능은 다음과 같습니다.'], items: ['키워드 기반 리뷰 분석 및 요약', '데이터베이스 캐싱', 'AI 맞춤형 추천', '개인 라이브러리'] },
      { title: '팀 개발 환경', paragraphs: ['건국대학교 전공심화프로젝트로 진행한 팀 프로젝트입니다. Docker 기반 실행 환경을 사용하며, 저장소에 팀원이 동일한 방식으로 서비스를 실행할 수 있도록 환경 설정 절차를 정리했습니다.'] },
    ],
  },
];
