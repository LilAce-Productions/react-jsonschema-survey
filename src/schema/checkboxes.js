
const ITEM1 = 'Item #1';
const ITEM2 = 'Item #2';
const ITEM3 = 'Item #3';

export const checkboxSchema = {
  type: 'object',
  properties: {
    checkBoxes: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          ITEM1,
          ITEM2,
          ITEM3
        ]
      },
      uniqueItems: true
    }
  }
};

export const getCheckboxUiSchema = (questionText, questionNumber) => {
  const checkBoxes = {
    classNames: 'cb-question-wrapper',
    'ui:title': questionNumber ? `${questionNumber}. ${questionText}` : questionText,
    'ui:widget': 'checkboxes'
  };
  return { checkBoxes };
};

export const CB_SCHEMA_PROPS = [
  'sch.type',
  'sch.properties.checkBoxes.type',
  'sch.properties.checkBoxes.items.type',
  'sch.properties.checkBoxes.items.enum',
  'sch.properties.checkBoxes.uniqueItems',
  'uiSch.checkBoxes.classNames',
  'uiSch.checkBoxes.ui:title',
  'uiSch.checkBoxes.ui:widget'
];
