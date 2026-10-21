# 대표 이미지 추가 캡처 요청

> 이전 대표 이미지 제작 단계의 요청 기록입니다. 현재 제공 자산과 관리 규칙은 [ASSETS.md](ASSETS.md)를 따릅니다.

현재 C 그룹은 KUTODO·Review Analyzer입니다. 실제 실행 화면 원본이 없어 cover를 만들지 않았습니다. 기존 목업·입력 대기 화면을 실제 결과로 대체하지 않습니다. 아래 두 캡처만 사용자 직접 실행으로 확보하면 됩니다. 에이전트는 프로젝트를 실행하거나 외부 API·학교 계정에 접속하지 않았습니다.

## KUTODO

Project: KUTODO

Capture: 실제 Android 앱의 eCampus 동기화 preview/선택 반영 화면. 가능하면 같은 실행에서 반영 후 Task 목록도 별도 PNG 1장.

State: 실제 앱이 실행되고, 신규 항목과 원본이 변경된 항목이 preview에 표시되는 상태. 삭제·제외·완료는 현재 앱이 실제로 표시할 때만 포함. NEW/CHANGED/REMOVED라는 이름을 이미지 편집으로 만들어 넣지 않음. 개발용 샘플 데이터를 사용하면 그 사실을 메모에 기록.

Window size: 기기/에뮬레이터 기본 해상도 원본 PNG. 가능하면 폭 1080px 이상, 예: 1080×2400. 16:9로 미리 자르지 않고 전체 화면 제공.

What must be visible: 동기화 결과 제목, 신규·변경 상태 요약, 항목 제목과 상태 badge, 선택 checkbox, 가져오기/반영 control. 변경된 날짜/제목 차이가 실제 UI에 보이면 포함.

What must not be visible: 학교 ID·비밀번호, cookie·token, 로그인 폼 개인정보, 타인 이름·비공개 강의 정보, 알림 내용, 디버그 overlay, 목업을 실제 앱처럼 보이게 하는 장식 프레임.

Recommended crop: 실제 앱의 상태 요약과 2~3개 항목을 중심으로 16:9 cover 안에 확대 배치. 원본에서 중요한 항목과 선택 control을 잘라내지 않도록, 긴 화면은 PNG 두 장으로 분리 가능. 원본 UI 텍스트·출력은 재작성하지 않음.

캡처가 막히면 화면을 만들지 말고 현재 실행 상태/막힌 이유만 기록합니다. 실제 LMS E2E 성공을 확인하지 않았다면 성공으로 표현하지 않습니다.

## Review Analyzer

Project: Review Analyzer

Capture: 실제 local GUI 환경의 리뷰 분석 결과 화면 PNG 1장. 검증 가능한 과거 최종 시연 원본도 가능.

State: 상품 URL과 관심 키워드를 입력한 뒤 실제 분석 결과가 표시된 상태. 키워드별 긍정·부정 요약 1~2개가 충분하며, 빈 입력 화면·loading·오류 화면을 성공 결과로 대체하지 않음.

Window size: 브라우저 viewport 1440×900 이상, 권장 1600×1000, 확대율 100%. 개발자 도구를 닫고 브라우저 내장 screenshot 등으로 원본 PNG 저장.

What must be visible: 상품 식별 영역, 입력한 관심 키워드, 실제 생성된 분석 결과/요약. 원본 데이터와 결과 상태를 함께 확인할 수 있는 영역. library 저장 성공은 확인한 경우에만 추가 촬영.

What must not be visible: 로그인 개인정보·API key·token, 개발자 도구·terminal secrets, 불필요한 탭·북마크·브라우저 프로필, 이미지 편집으로 채운 분석 결과, 기존 기획 UI를 최종 동작으로 보이게 한 화면.

Recommended crop: 결과 본문의 상품 식별 정보와 키워드 요약 영역 중심. 빈 sidebar·Chat 공간은 제외하되 결과가 어디에 속하는지 알 수 있는 UI를 남김. 스크롤이 길면 상단 결과와 세부 요약을 실제 화면 두 장으로 촬영.

외부 연동이 재현되지 않으면 실제 과거 시연 원본의 경로/촬영 맥락을 제공하거나 미확보 상태로 유지합니다. 가상의 결과 UI는 만들지 않습니다.

## 나머지 프로젝트

ZZZ·KUROOM·발주콜·ct·Smart Parking은 기존 실제 자료로 cover를 제작했습니다. 추가 캡처는 필수가 아닙니다. ZZZ는 초기 On-Premise 화면이며 최종 AWS 화면으로 주장하지 않습니다. KUROOM의 lookup과 시간표는 서로 다른 실제 캡처를 조합했습니다. 발주콜은 현장 미사용 개발 화면입니다. ct는 개발 실행이며 release binary 인증 결과가 아닙니다. Smart Parking은 PDF 저해상도 사진 대신 저장소의 실제 1919×1079 모형 사진을 사용했습니다.
