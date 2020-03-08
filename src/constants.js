
export const ANSWER_TYPE = {
  CHECK_BOXES: 'check-boxes',
  MULTIPLE_CHOICE: 'multiple-choice',
  DROPDOWN: 'dropdown',
  LIKERT_SCALE: 'likert-scale'
};

export const ANSWER_TYPE_ARRAY = [
  ANSWER_TYPE.CHECK_BOXES,
  ANSWER_TYPE.MULTIPLE_CHOICE,
  ANSWER_TYPE.DROPDOWN,
  ANSWER_TYPE.LIKERT_SCALE
];

export const ANSWER_TYPE_DISPLAY = {
  [ANSWER_TYPE.CHECK_BOXES]: 'Checkboxes',
  [ANSWER_TYPE.MULTIPLE_CHOICE]: 'Multiple Choice',
  [ANSWER_TYPE.DROPDOWN]: 'Dropdown',
  [ANSWER_TYPE.LIKERT_SCALE]: 'Likert Scale'
};

export const ANSWER_TYPE_DEFAULT_SEL = 'Answer Input Types';

export const WORK_MODE = {
  BUILDER: 'builder',
  LIVE: 'live'
};
