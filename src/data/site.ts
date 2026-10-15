import type { Locale } from '../i18n/ui';
type Localized = Record<Locale, string>;
interface Social { id: string; label: string; url: string | null; contact: boolean; }
export const site: {
  handle: string; name: Localized; role: string; intro: Localized; bio: Localized;
  focus: Localized; approach: Localized; aim: Localized; educationStatus: Localized; educationProgram: Localized;
  heroImage: string | null; heroAlt: Localized; profileImage: string | null; profileAlt: Localized;
  resumeUrl: string | null; portfolioPdfUrl: string | null; email: string | null; socials: Social[];
} = {
  handle: 'GIRIBUIN', name: { en: 'Jeong-gil Choi', ko: '최정길' }, role: 'Backend / Systems Developer',
  intro: { en: 'I build APIs, data flows, and integrations across web applications and connected devices.', ko: 'API와 데이터베이스를 바탕으로 웹 서비스와 장치를 연결하는 기능을 개발합니다.' },
  bio: { en: 'I’m interested in backend and systems software. My projects connect databases and APIs with Linux, Raspberry Pi, MQTT, and cloud services. I care about understanding why a system is designed a certain way and how it behaves.', ko: '백엔드와 시스템 소프트웨어에 관심 있는 개발자입니다. 데이터베이스와 API부터 Linux, Raspberry Pi, MQTT, 클라우드까지 여러 요소를 연결하는 프로젝트를 해왔습니다. 구현한 기능이 왜 그렇게 동작하는지 설명할 수 있는 개발을 지향합니다.' },
  focus: { en: 'Backend · Systems software · Server infrastructure', ko: '백엔드 · 시스템 소프트웨어 · 서버 인프라' },
  educationStatus: { en: 'Expected graduation: February 2027', ko: '2027년 2월 졸업 예정' },
  educationProgram: { en: 'Computer Science & Engineering · Konkuk University', ko: '건국대학교 컴퓨터공학부' },
  approach: { en: 'Understand the flow, separate responsibilities, and verify behavior.', ko: '데이터의 흐름을 먼저 파악하고, 기능별 책임을 나눈 뒤 실제 동작을 확인합니다.' },
  aim: { en: 'Make complex data and device interactions easier to use and reason about.', ko: '여러 데이터 소스나 장치가 얽힌 시스템을 연결하고, 사용하기 쉽게 만드는 문제에 관심이 있습니다.' },
  heroImage: '/images/profile/githubprofile.png', heroAlt: { en: 'GIRIBUIN robot avatar', ko: 'GIRIBUIN 로봇 아바타' },
  profileImage: '/images/profile/jeonggil.jpg', profileAlt: { en: 'Portrait of Jeong-gil Choi', ko: '최정길 프로필 사진' },
  resumeUrl: '/files/resume-public.pdf', portfolioPdfUrl: '/files/portfolio.pdf', email: 'giribuin@gmail.com',
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/GIRIBUIN', contact: true },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/jeonggil-choi-a119b8400/', contact: true },
    { id: 'velog', label: 'Velog', url: 'https://velog.io/@giribuin', contact: true },
    { id: 'instagram', label: 'Instagram', url: null, contact: false },
    { id: 'discord', label: 'Discord', url: null, contact: false },
  ],
};
