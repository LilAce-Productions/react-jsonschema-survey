
const CHOICE1 = 'Choice #1';
const CHOICE2 = 'Choice #2';
const CHOICE3 = 'Choice #3';

export const multipleChoiceSchema = {
  type: 'object',
  properties: {
    multipleChoice: {
      type: 'string',
      enum: [
        CHOICE1,
        CHOICE2,
        CHOICE3
      ]
    }
  }
};

export const getMultipleChoiceUiSchema = (questionText, questionNumber) => {
  const multipleChoice = {
    classNames: 'mc-question-wrapper',
    'ui:title': questionNumber ? `${questionNumber}. ${questionText}` : questionText,
    'ui:widget': 'radio'
  };
  return { multipleChoice };
};

export const MC_SCHEMA_PROPS = [
  'sch.type',
  'sch.properties.multipleChoice.type',
  'sch.properties.multipleChoice.enum',
  'uiSch.multipleChoice.classNames',
  'uiSch.multipleChoice.ui:title',
  'uiSch.multipleChoice.ui:widget'
];
