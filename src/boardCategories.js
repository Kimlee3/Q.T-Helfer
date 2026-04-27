export const BOARD_CATEGORIES = {
  meditation: {
    label: '묵상 나눔',
    eyebrow: 'Shared Devotion',
    description: '오늘 말씀을 통해 받은 마음과 적용을 나누는 공간입니다.',
  },
  completion: {
    label: '통독 완주 기록',
    eyebrow: 'Reading Completion',
    description: '구약, 신약, 전체 통독 완주와 진행의 흔적을 남기는 공간입니다.',
  },
};

export function normalizeCategory(value) {
  return BOARD_CATEGORIES[value] ? value : 'meditation';
}
