import type { Project } from '../types';

const project = {
  order: 2,
  slug: 'rpi-parking',
  title: 'Raspberry Pi 스마트 주차 서비스',
  subtitle: '3대의 Raspberry Pi를 MQTT로 연결한 주차장 모형',
  oneLine: '주차 공간 감지·게이트 제어·중앙 모니터링을 Raspberry Pi 3대와 MQTT로 연결하고, RPi3의 중앙 서비스와 상태 진단을 담당했습니다.',
  period: '2026.05 – 2026.06',
  status: '완료',
  type: '팀 프로젝트',
  teamSize: 3,
  role: 'RPi3 중앙 서비스·상태 진단·네트워크 통합',
  stack: [
    'C',
    'Python',
    'Linux Kernel',
    'Raspberry Pi',
    'MQTT/Mosquitto',
    'Flask',
    'SQLite',
  ],
  repository: 'https://github.com/GIRIBUIN/RPI-Parking-service-driver',
  demo: 'https://youtu.be/YD9IXrkSWf0',
  overview: [
    'Raspberry Pi 3대를 주차 공간 감지, 게이트 제어, 중앙 서비스로 나누고 MQTT로 상태와 이벤트를 전달한 임베디드 시스템 팀 프로젝트입니다.',
    'RPi1은 slot sensing, RPi2는 gate와 buzzer 제어, RPi3는 Mosquitto broker, MQTT subscriber, SQLite, Flask dashboard를 담당하는 구조입니다.',
  ],
  contributions: [
    '개인 담당 장치인 RPi3에 Mosquitto broker와 MQTT subscriber를 구성했습니다.',
    '수집한 slot·gate·event 상태를 SQLite에 저장하고 Flask dashboard로 표시했습니다.',
    '커널 status interface와 heartbeat를 이용해 장치·메시지 상태를 진단하는 흐름을 구현했습니다.',
    'RPi3를 local network/AP 중심으로 구성하고 세 Raspberry Pi의 전체 동작을 통합했습니다.',
  ],
  implementation: [
    '팀 전체 범위에서 RPi1이 초음파 센서로 두 slot의 점유 상태를 판단하고, RPi2가 gate와 buzzer를 제어했습니다.',
    'RPi3는 MQTT topic을 구독해 최신 상태와 이벤트를 DB와 대시보드에 반영했습니다.',
    'heartbeat와 Linux kernel status interface를 통해 메시지 수신과 장치 상태를 확인할 수 있게 했습니다.',
    '외부 인프라 없이 시연할 수 있도록 RPi3 중심의 local network/AP 환경을 구성했습니다.',
  ],
  technicalDecisions: [
    {
      title: 'MQTT 기반 장치 역할 분리',
      description: '감지·제어·중앙 서비스가 직접 결합되지 않도록 topic을 통해 상태와 이벤트를 교환하게 구성했습니다.',
    },
    {
      title: 'Heartbeat와 kernel status interface',
      description: '대시보드 상태만으로 원인을 찾기 어려운 상황에 대비해 heartbeat와 /dev·/proc 기반 상태 인터페이스로 진단 정보를 노출했습니다.',
    },
    {
      title: 'RPi3 중심의 로컬 네트워크',
      description: '교실 시연 환경의 네트워크 제약을 줄이기 위해 RPi3를 broker와 AP의 중심으로 두고 세 장치를 통합했습니다.',
    },
  ],
  limitations: [
    '고정된 주차장 모형과 로컬 네트워크에서 검증한 수업 프로젝트입니다.',
    '실제 주차장 규모, 번호판 인식, 인증·결제 기능은 구현 범위가 아닙니다.',
    'RPi3 장애 시 중앙 기능이 함께 중단되는 단일 장애 지점이 있습니다.',
    'RPi1 sensor/slot driver와 RPi2 gate/buzzer driver는 팀원이 구현했습니다.',
  ],
  media: {
    architecture: '/imgs/projects/smart-parking/architecture.png',
    architectureAlt: 'Raspberry Pi 3대와 MQTT로 구성한 스마트 주차 서비스 구조도',
    architectureCaption: 'RPi1 감지, RPi2 제어, RPi3 중앙 서비스를 연결한 전체 구조',
    youtubeId: 'YD9IXrkSWf0',
  },
} satisfies Project;

export default project;
