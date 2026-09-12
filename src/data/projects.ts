export const projects = [
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
  {
    slug: 'rpi-parking',
    title: 'RPI Parking',
    subtitle: '센서 감지부터 중앙 모니터링까지, IoT 주차장 시스템',
    summary: '초음파 센서로 주차 공간의 점유 상태를 판단하고, 차단기 제어와 중앙 모니터링을 MQTT로 연결하는 팀 프로젝트입니다.',
    stack: ['C', 'Python', 'Raspberry Pi', 'MQTT', 'SQLite'],
    repository: 'https://github.com/GIRIBUIN/RPI-Parking-service-driver',
    overview: '주차 슬롯 두 곳과 입구 차단기로 구성한 모형을 대상으로, 차량 감지·장치 제어·상태 수집을 연결하는 임베디드 시스템 프로젝트입니다. 주차 공간의 점유 상태와 입출차 이벤트를 중앙 서버에서 모아 확인하는 구조를 설계합니다.',
    sections: [
      { title: '세 장치의 역할 분리', paragraphs: ['첫 번째 Raspberry Pi는 초음파 센서로 슬롯의 점유 상태를 판단합니다. 두 번째 장치는 차량 접근과 출차 요청에 따라 차단기를 제어합니다. 세 번째 장치는 MQTT 브로커와 중앙 서버를 맡아 상태 및 이벤트를 저장하고 대시보드에 표시하는 구조입니다.'] },
      { title: '상태와 이벤트를 전달하는 방식', paragraphs: ['MQTT 토픽을 슬롯 상태, 센서 거리값, 전체 주차장 상태, 차단기 상태, 입출차 이벤트로 나누어 정의합니다. 각 장치가 발행하거나 구독하는 메시지를 구분해 감지 장치와 제어 장치, 중앙 서버를 연결합니다.', '슬롯은 EMPTY와 OCCUPIED, 주차장은 AVAILABLE과 FULL, 차단기는 OPEN과 CLOSED로 상태를 구분합니다. 입차와 출차 이벤트는 상태 정보와 별도로 전달하도록 설계합니다.'] },
      { title: '동작 시나리오와 설계 기준', paragraphs: ['README에는 정상 입차, 만차, 출차 시나리오와 메시지 형식이 정리되어 있습니다. 초음파 센서 간 간섭을 줄이기 위해 순차적으로 측정하고, 일정 시간 동안 감지 상태가 유지되는지를 기준으로 점유 여부를 판단하는 방식을 설명합니다.'], items: ['슬롯 점유 상태와 전체 만차 여부 판단', '차량 접근 및 출차 요청에 따른 차단기 제어', '중앙 서버의 상태 저장과 최근 이벤트 모니터링'] },
    ],
  },
];
