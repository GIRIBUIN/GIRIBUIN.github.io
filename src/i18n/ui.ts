export type Locale = 'en' | 'ko';
export const defaultLocale: Locale = 'en';
export const languages = [{ code: 'en', label: 'EN' }, { code: 'ko', label: 'KO' }] as const;
export function localePath(pathname: string, locale: Locale): string {
  const base = pathname.replace(/^\/ko(?=\/|$)/, '') || '/';
  return locale === 'ko' ? '/ko' + base : base;
}
const en = {
  nav: { projects: 'Projects', work: 'Work', tools: 'Tools', about: 'About', contact: 'Contact' },
  navigation: 'Main navigation', socialLinks: 'Social links', language: 'Language', skip: 'Skip to content', home: 'Portfolio home',
  pageTitle: 'Backend / Systems Developer', pageDescription: 'Projects and notes by Jeong-gil Choi, a backend and systems developer.',
  hero: { positioning: 'APIs, data, and the systems that connect them.', resume: 'Resume PDF', portfolio: 'Portfolio PDF', work: 'View Work' },
  trace: {
    navigation: 'Reading context', flow: 'From problem to working system',
    problem: 'Unclear constraints', structure: 'Boundaries · data flow', system: 'A working whole',
    principles: 'PRINCIPLES',
  },
  about: { title: 'About Me', note: 'The person behind the projects', focus: 'Interests', approach: 'How I think', aim: 'Problems I’m drawn to', education: 'Education' },
  skills: { title: 'Skills', note: 'A toolkit shaped by projects', intro: 'Technologies I’ve used to build, connect, and understand systems.' },
  work: { title: 'Featured Projects', note: 'Selected work', empty: 'Projects are on the way.' },
  tools: { title: 'Tools & Side Projects', note: 'More to explore', empty: 'More projects are on the way.' },
  projectSection: { title: 'Projects', empty: 'Projects are on the way.', more: 'View More Projects', back: 'Back to home', count: 'Projects shown', pending: 'Preview coming soon' },
  process: { title: 'How I Build', note: 'Decisions, demonstrated in projects', intro: 'The reasoning, the actions, and the projects behind them. Open a topic to see the evidence and its limits.', why: 'WHY', how: 'HOW', evidence: 'EVIDENCE', close: 'Close explanation', open: 'View evidence' },
  contact: { title: 'Contact', intro: 'Have a question about a project, or a systems problem to discuss?\nI’d be happy to hear from you.', email: 'Email' },
  footer: { navigation: 'Footer links', projects: 'All Projects', home: 'Home' },
  rail: { navigation: 'Project navigation', hint: 'Scroll to explore', previous: 'Previous projects', next: 'Next projects' },
  project: { problem: 'Problem', decision: 'Key decision', result: 'Result', demo: 'Demo', liveDemo: 'Live Demo', source: 'Source', caseStudy: 'Case Study', deepDive: 'Deep Dive', notes: 'Project notes', back: 'Back to Projects', untranslated: 'Detailed notes are currently available in Korean.' },
  media: {
    labels: { iframe: 'Web preview', video: 'Video walkthrough', terminal: 'CLI preview', apk: 'App preview', image: 'Image preview', none: 'Project preview' },
    thumbnail: 'Project image', preview: 'Preview', pending: 'Demo coming soon', reference: 'Reference image', referencePending: 'Live demo not connected',
    imageAlt: 'project preview', frameTitle: 'web demo', videoTitle: 'demo video', videoOpen: 'Open video', apkReady: 'A demo APK is available.',
    fullDemo: 'Open Full Demo', apk: 'Download APK', video: 'Watch video', release: 'Release', original: 'Open original', enlarge: 'Enlarge media', close: 'Close media',
    error: 'This preview could not be loaded. Please use the original link or project notes.',
  },
};
// Keep shared names, section headings, and developer-facing actions in English.
// Korean copy is written for this portfolio rather than translated word for word.
const ko: typeof en = {
  ...en,
  navigation: '주 메뉴', socialLinks: '소셜 링크', language: '언어',
  skip: '본문으로 건너뛰기', home: '포트폴리오 홈',
  pageDescription: '최정길의 백엔드·시스템 개발 프로젝트와 구현 기록입니다.',
  hero: { ...en.hero, positioning: '데이터의 흐름을 이해하고, 시스템을 연결합니다.' },
  trace: {
    ...en.trace, flow: '문제에서 동작하는 시스템까지',
    problem: '아직 모호한 조건', structure: '책임의 경계 · 데이터 흐름', system: '하나로 연결해 동작하게',
  },
  about: { ...en.about, note: '소개와 관심 분야', focus: '관심 분야', approach: '개발할 때의 기준', aim: '관심 있는 문제' },
  skills: { ...en.skills, note: '프로젝트에서 사용한 기술', intro: 'API 구현부터 장치 연동, 개발 도구 제작까지 프로젝트에 직접 사용한 기술입니다.' },
  work: { ...en.work, note: '주요 프로젝트', empty: '등록된 프로젝트가 없습니다.' },
  tools: { ...en.tools, note: '직접 만든 도구와 팀 프로젝트', empty: '등록된 프로젝트가 없습니다.' },
  projectSection: { ...en.projectSection, empty: '등록된 프로젝트가 없습니다.', more: '프로젝트 더 보기', back: '홈으로 돌아가기', count: '표시된 프로젝트 수', pending: '미리보기 준비 중' },
  process: {
    ...en.process, note: '프로젝트 경험으로 설명하는 개발 방식',
    intro: '개발할 때의 판단과 행동을 실제 프로젝트 사례로 정리했습니다. 항목을 누르면 구현한 내용과 확인한 범위를 볼 수 있습니다.',
    close: '설명 닫기',
  },
  contact: { ...en.contact, intro: '프로젝트에 관해 궁금한 점이나 함께 논의하고 싶은 내용이 있다면\n연락해 주세요.' },
  footer: { navigation: '하단 링크', projects: '전체 프로젝트', home: '홈' },
  rail: { ...en.rail, navigation: '프로젝트 탐색', hint: '좌우로 넘겨보세요', previous: '이전 프로젝트', next: '다음 프로젝트' },
  project: {
    ...en.project, problem: '해결할 문제', decision: '설계 판단', result: '결과',
    back: '프로젝트 목록으로', untranslated: '이 프로젝트의 상세 설명은 한국어로 제공됩니다.',
  },
  media: {
    ...en.media, pending: 'Demo 준비 중', referencePending: '라이브 Demo는 아직 연결하지 않았습니다.',
    imageAlt: '프로젝트 이미지', frameTitle: 'Demo', videoTitle: 'Demo 영상',
    apkReady: 'Demo APK를 내려받을 수 있습니다.', enlarge: '크게 보기', close: '닫기',
    error: '미리보기를 불러오지 못했습니다. 원본 링크나 Deep Dive에서 확인해 주세요.',
  },
};
export const getUi = (locale: Locale = defaultLocale) => locale === 'ko' ? ko : en;
