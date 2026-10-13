// 프로젝트 이외의 문구와 연락처도 UI와 분리합니다. 소개·경력은 의도적인 임시 문구입니다.
export const site = {
  name: '최정길', handle: 'GIRIBUIN',
  role: 'Backend / Systems Developer',
  positioning: ['문제에서 출발해,', '동작하는 시스템으로.'],
  intro: '[임시 소개] 만들고 연결하고 검증하는 개발자. 이곳에는 프로젝트의 결과와 그 결과를 만든 판단을 기록합니다.',
  profile: '[임시 프로필] 관심 분야와 개발자로서의 방향을 두세 문장으로 정리할 자리입니다.',
  links: [
    { label: 'GitHub', href: 'https://github.com/GIRIBUIN' },
    { label: 'Email', href: 'mailto:giribuin@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jeonggil-choi-a119b8400/' },
    { label: 'Resume', href: null },
  ],
  experience: [
    { label: 'Education', value: '[임시] 학력과 기간을 입력합니다.' },
    { label: 'Experience', value: '[임시] 역할과 경험을 입력합니다.' },
    { label: 'Focus', value: '[임시] Backend · Systems · Developer tools' },
  ],
  process: [
    { title: 'Constraints', label: '제약을 먼저', text: '[임시] 해결할 문제와 바꿀 수 없는 조건을 구분합니다.' },
    { title: 'Decision', label: '판단의 근거', text: '[임시] 대안을 비교하고 선택의 이유를 남깁니다.' },
    { title: 'Implementation', label: '동작으로 연결', text: '[임시] 작은 단위로 만들고 전체 흐름을 연결합니다.' },
    { title: 'Validation', label: '증거로 확인', text: '[임시] 실제 실행과 실패 조건으로 결과를 확인합니다.' },
  ],
};
