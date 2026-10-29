import type { Locale } from '../../i18n/ui';
const en = {
  main: 'Main menu', back: 'Back', close: 'Close window', collection: 'Project collection',
  select: 'Select a project to inspect its work, decisions, and results.', scope: 'Contribution / scope',
  stack: 'Technologies', result: 'Result', details: 'DETAILS', demo: 'DEMO', github: 'GITHUB',
  download: 'DOWNLOAD', watch: 'WATCH VIDEO', separate: 'Open standalone page',
  loading: 'Loading project notes…', error: 'Project notes could not be loaded. Open the standalone page to continue.',
  preview: 'Quick preview', image: 'Project preview', noMedia: 'Preview not available',
  controls: 'Select to explore', return: 'Back to collection', count: 'projects',
  heading: { projects: 'Projects', about: 'About', resume: 'Resume', contact: 'Contact' },
};
const ko: typeof en = {
  ...en, main: '메인 메뉴', back: '이전', close: '창 닫기', collection: '프로젝트 도감',
  select: '프로젝트를 선택하면 구현 범위와 설계, 결과를 살펴볼 수 있습니다.', scope: '담당 역할 · 구현 범위',
  stack: '주요 기술', result: '결과', separate: '독립 상세 페이지 열기',
  loading: '프로젝트 설명을 불러오는 중…', error: '프로젝트 설명을 불러오지 못했습니다. 독립 상세 페이지에서 확인해 주세요.',
  preview: '프로젝트 미리보기', image: '프로젝트 이미지', noMedia: '등록된 미리보기가 없습니다',
  controls: '메뉴를 선택해 둘러보세요', return: '프로젝트 목록으로', count: '개 프로젝트',
};
export const getExplorerUi = (locale: Locale) => locale === 'ko' ? ko : en;
