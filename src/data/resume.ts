interface ResumeItem {
  title: string;
  meta?: string;
  href?: string;
  items: string[];
}

interface ResumeSection {
  id: string;
  title: string;
  items: ResumeItem[];
}

export const resume: {
  name: string;
  interests: string;
  pdfUrl: string | null;
  sections: ResumeSection[];
} = {
  name: '최정길',
  interests: 'Backend · Server · Systems',
  pdfUrl: "/files/resume.pdf",
  sections: [
    {
      id: 'education',
      title: '학력',
      items: [
        {
          title: '건국대학교 컴퓨터공학부',
          meta: '2021.03 – 2027.02 졸업 예정',
          items: ['GPA 4.12 / 4.5'],
        },
      ],
    },
    {
      id: 'skills',
      title: '기술',
      items: [
        { title: 'Languages', items: ['JavaScript, Python, C, SQL'] },
        { title: 'Backend', items: ['Node.js, Express, Flask, REST API'] },
        { title: 'Database', items: ['MySQL, SQLite'] },
        { title: 'System', items: ['Linux, Raspberry Pi, MQTT'] },
        { title: 'API / Auth', items: ['OAuth 2.0, Google Health API'] },
      ],
    },
    {
      id: 'experience',
      title: '프로젝트 경험',
      items: [
        {
          title: 'ZZZ',
          meta: '웨어러블·환경 데이터 기반 수면 관리 서비스',
          href: '/projects/zzz/',
          items: [
            'Google Health OAuth 연동 API와 Access/Refresh Token 저장·갱신 흐름 구현',
            '심박·걸음·수면·칼로리 데이터를 수집·정규화해 SQLite에 적재하고, 기존 Fitbit 데이터와 통합해 수면 분석 feature 생성에 활용',
            '사용자별 Raspberry Pi 등록·조회 API와 사용자·기기·Topic 매핑 구조 구성',
          ],
        },
        {
          title: 'Smart Parking',
          meta: 'MQTT 기반 IoT 주차장 관리 시스템',
          href: '/projects/rpi-parking/',
          items: [
            '공유 메모리 MQTT 수집 상태 전달을 위한 Character Device와 procfs 기반 Linux Kernel Status Interface 구현',
            'MQTT Handler의 메시지 수신·오류·최근 Topic/Event 상태를 커널 인터페이스에 기록해 장애 원인 확인 구조 구성',
          ],
        },
        {
          title: 'Review Analyzer',
          meta: 'AI 기반 상품 리뷰 분석 웹 서비스',
          href: '/projects/review-analyzer/',
          items: [
            '분석 결과와 추천 상품 정보를 함께 반환하도록 MySQL 저장·조회 로직을 확장하고 JSON 데이터 저장 처리 구현',
            '저장 리뷰 삭제 후 새 데이터를 재조회하도록 동기화 흐름을 수정해 클라이언트와 서버 간 상태 불일치 문제 보완',
          ],
        },
      ],
    },
  ],
};

interface PreparationItem {
  title: string;
  status: string;
  items: string[];
}

// 날짜나 등급은 확인된 내용만 추가하세요. 완료되면 이력서 항목으로 옮길 수 있습니다.
export const preparation: PreparationItem[] = [
  {
    title: '정보처리기사',
    status: '필기 합격',
    items: [],
  },
  {
    title: '네트워크관리사',
    status: '필기 합격',
    items: [],
  },
  {
    title: 'MoaOrder',
    status: '개발 중',
    items: ['평소 발주를 문자, 카카오톡, 전화로 하던 자영업자를 위한 서비스 입니다.', '재고를 체크하면서 필요한 품목을 주문하는데 편의성을 돕는 것을 목표로 하고 있습니다.', 'self-host 버전과 local 버전을 배포할 예정입니다.'],
  },
];
