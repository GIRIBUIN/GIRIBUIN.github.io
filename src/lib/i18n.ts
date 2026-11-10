export type Locale = 'en' | 'ko';
export function localePath(pathname: string, locale: Locale): string {
  const base = pathname.replace(/^\/ko(?=\/|$)/, '') || '/';
  return locale === 'ko' ? '/ko' + base : base;
}
const en = {
  nav: { home: 'Home', projects: 'Projects', about: 'About' },
  navigation: 'Main navigation', language: 'Language', skip: 'Skip to content',
  description: 'Jeong-gil Choi — Backend, systems, and platform engineering. Project decisions, implementation, and validation.',
  selected: 'Selected projects', allProjects: 'All projects', archiveIntro: 'Projects, experiments, and the engineering behind them.',
  filters: 'Filter projects', projectCount: 'projects', empty: 'No projects match this filter.',
  filter: { all: 'All', featured: 'Featured', planning: 'Planned', active: 'In Progress', completed: 'Completed' },
  filterHelpTitle: 'About these filters',
  filterDescriptions: {
    all: 'All projects',
    featured: 'Selected projects',
    planning: 'Ideas and plans, not yet in development',
    active: 'In development',
    completed: 'Implementation or demo complete',
  },
  projectStatus: { planning: 'Planned', active: 'In Progress', completed: 'Completed', archived: 'Archived' },
  projectOrigin: { independent: 'Independent', guided: 'Guided', foundation: 'Foundation' },
  validation: { prototype: 'Prototype', tested: 'Tested', 'in-use': 'In use' },
  origin: 'Origin', status: 'Status', validationLabel: 'Validation', technologies: 'Technologies', role: 'My contribution', overview: 'Overview', problem: 'Problem',
  decision: 'Design decision', result: 'Validation & results', notes: 'Architecture, implementation & decisions', links: 'Links', demo: 'Demo',
  personal: 'Personal project', team: 'Team project', people: 'people', back: 'All projects',
  education: 'Education', skills: 'Core technologies', contact: 'Contact', resume: 'Resume PDF', portfolio: 'Portfolio PDF',
  aboutTitle: 'About', experience: 'Experience in projects', translationNote: 'These detailed notes are currently available in Korean.',
  mediaError: 'Media could not be loaded. Use the original link below.', openImage: 'Project image', legacy: 'This project has moved.', continue: 'Open project',
};
const ko: typeof en = {
  ...en, navigation: '주요 탐색', language: '언어 선택', skip: '본문으로 건너뛰기',
  description: '최정길 — 백엔드, 시스템, 플랫폼 엔지니어링. 프로젝트의 설계 판단과 구현, 검증 경험을 정리합니다.',
  archiveIntro: '프로젝트와 실험, 그 안에서 내린 기술적 판단을 기록합니다.',
  filters: '프로젝트 필터', projectCount: '개 프로젝트', empty: '이 분류에 해당하는 프로젝트가 없습니다.',
  filterHelpTitle: '프로젝트 분류 안내',
  filterDescriptions: {
    all: '전체 프로젝트',
    featured: '대표 프로젝트',
    planning: '아이디어·계획 단계',
    active: '개발·개선 중',
    completed: '구현·시연 완료',
  },
  personal: '개인 프로젝트', team: '팀 프로젝트', people: '인',
  translationNote: '상세 문서는 현재 한국어로 제공됩니다.', mediaError: '미디어를 불러오지 못했습니다. 아래 원본 링크에서 확인할 수 있습니다.', openImage: '프로젝트 화면',
  legacy: '프로젝트 주소가 변경되었습니다.', continue: '프로젝트 열기',
};
export const getUi = (locale: Locale) => locale === 'ko' ? ko : en;
