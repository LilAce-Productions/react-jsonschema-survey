
const OPTION1 = 'Option #1';
const OPTION2 = 'Option #2';

export const DROPDOWN_REF = '#/definitions/choiceEnum';
export const dropDownSchema = {
  definitions: {
    choiceEnum: {
      type: 'string',
      enum: [
        OPTION1,
        OPTION2
      ]
    }
  },
  type: 'object',
  properties: {
    dropDown: {
      $ref: DROPDOWN_REF
    }
  }
};

export const getDropDownUiSchema = (questionText, questionNumber) => {
  const dropDown = {
    classNames: 'dd-question-wrapper',
    'ui:title': questionNumber ? `${questionNumber}. ${questionText}` : questionText,
    'ui:placeholder': 'Choose an answer'
  };
  return { dropDown };
};

export const DD_SCHEMA_PROPS = [
  'sch.definitions.choiceEnum.type',
  'sch.definitions.choiceEnum.enum',
  'sch.type',
  'sch.properties.dropDown.$ref',
  'uiSch.dropDown.classNames',
  'uiSch.dropDown.ui:title',
  'uiSch.dropDown.ui:placeholder'
];
