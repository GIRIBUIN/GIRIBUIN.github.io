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
  profileImage: string | null;
  sections: ResumeSection[];
} = {
  name: '최정길',
  interests: 'Backend · Systems Software',
  pdfUrl: '/files/resume.pdf',
  profileImage: '/imgs/profile.jpg',
  sections: [
    {
      id: 'education',
      title: '학력',
      items: [
        {
          title: '건국대학교 컴퓨터공학부',
          meta: '2021.03 – 2027.02 졸업 예정',
          items: ['GPA 4.13 / 4.5'],
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
        { title: 'Systems', items: ['Linux, Linux Kernel, Raspberry Pi, MQTT'] },
        { title: 'Cloud / IoT', items: ['AWS IoT Core, Lambda, API Gateway, EC2'] },
        { title: 'API / Auth', items: ['OAuth 2.0, Google Health API'] },
      ],
    },
    {
      id: 'experience',
      title: '프로젝트 경험',
      items: [
        {
          title: 'ZZZ',
          meta: '웨어러블·환경 데이터 기반 수면 지원 IoT 서비스',
          href: '/projects/zzz/',
          items: [
            '전체 구조와 DB schema를 설계하고 Express API·dashboard 및 팀별 계층 통합',
            'On-Premise SQLite 구조를 MySQL/RDS와 AWS IoT Core·Lambda·API Gateway·EC2를 사용한 수업용 Cloud demo로 확장',
            'Fitbit 기반 단계를 Google Health OAuth·token·data integration 구조로 전환',
          ],
        },
        {
          title: 'Smart Parking',
          meta: 'MQTT 기반 IoT 주차장 관리 시스템',
          href: '/projects/rpi-parking/',
          items: [
            'RPi3의 Mosquitto broker·MQTT subscriber·SQLite·Flask dashboard와 local network 통합',
            'heartbeat 및 /dev·/proc 기반 kernel status interface로 장치·메시지 상태 진단',
            '팀원이 구현한 감지·게이트 장치를 포함해 Raspberry Pi 3대의 전체 system integration 수행',
          ],
        },
        {
          title: 'Review Analyzer',
          meta: '키워드 기반 상품 리뷰 분석 웹 프로토타입',
          href: '/projects/review-analyzer/',
          items: [
            'MySQL schema·CRUD와 사용자 등록·login·Flask session·library route 구현',
            'crawler·Gemini 분석 결과를 JavaScript 화면과 연결하고 팀 결과물 최종 통합',
            'Docker 개발환경과 NHN Cloud/NKS 환경을 구성했으나 crawler 제약으로 local demo 범위에서 검증',
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
