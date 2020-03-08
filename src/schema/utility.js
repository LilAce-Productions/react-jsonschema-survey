import { ANSWER_TYPE, ANSWER_TYPE_DISPLAY, ANSWER_TYPE_DEFAULT_SEL } from '../constants';
import { dropDownSchema, getDropDownUiSchema, DD_SCHEMA_PROPS, DROPDOWN_REF } from './dropdown';
import { multipleChoiceSchema, getMultipleChoiceUiSchema, MC_SCHEMA_PROPS } from './multiple-choice';
import { checkboxSchema, getCheckboxUiSchema, CB_SCHEMA_PROPS } from './checkboxes';
import { getLikertScaleUiSchema, likertScaleSchema, LS_SCHEMA_PROPS } from './likert-scale';

const parse = require('obj-parse');
const deepKeys = require('deep-keys');

export const getSchemaForAnswerType = (type) => {
  switch (type) {
    case ANSWER_TYPE.DROPDOWN:
      return dropDownSchema;
    case ANSWER_TYPE.MULTIPLE_CHOICE:
      return multipleChoiceSchema;
    case ANSWER_TYPE.CHECK_BOXES:
      return checkboxSchema;
    case ANSWER_TYPE.LIKERT_SCALE:
      return likertScaleSchema;
    default:
      break;
  }
  return null;
};

export const getUiSchemaForAnswerType = (type, qtxt, qnum) => {
  switch (type) {
    case ANSWER_TYPE.MULTIPLE_CHOICE:
      return getMultipleChoiceUiSchema(qtxt, qnum);
    case ANSWER_TYPE.DROPDOWN:
      return getDropDownUiSchema(qtxt, qnum);
    case ANSWER_TYPE.CHECK_BOXES:
      return getCheckboxUiSchema(qtxt, qnum);
    case ANSWER_TYPE.LIKERT_SCALE:
      return getLikertScaleUiSchema(qtxt, qnum);
    default:
      break;
  }
  return null;
};

export const getAnswerTypeDisplay = (type) => {
  switch (type) {
    case ANSWER_TYPE.MULTIPLE_CHOICE:
      return ANSWER_TYPE_DISPLAY[ANSWER_TYPE.MULTIPLE_CHOICE];
    case ANSWER_TYPE.CHECK_BOXES:
      return ANSWER_TYPE_DISPLAY[ANSWER_TYPE.CHECK_BOXES];
    case ANSWER_TYPE.DROPDOWN:
      return ANSWER_TYPE_DISPLAY[ANSWER_TYPE.DROPDOWN];
    case ANSWER_TYPE.LIKERT_SCALE:
      return ANSWER_TYPE_DISPLAY[ANSWER_TYPE.LIKERT_SCALE];
    default:
      return ANSWER_TYPE_DEFAULT_SEL;
  }
};

// gets question type from answer data
const getQuestionType = (data) => {
  let typesPass = false;
  const checkboxGetter = parse('uiSch.checkBoxes');
  const cb = checkboxGetter(data);
  const dropdownGetter = parse('uiSch.dropDown');
  const dd = dropdownGetter(data);
  const likertGetter = parse('uiSch.likertScale');
  const ls = likertGetter(data);
  const multipleChoiceGetter = parse('uiSch.multipleChoice');
  const mc = multipleChoiceGetter(data);
  if (cb) {
    typesPass = ANSWER_TYPE.CHECK_BOXES;
  } else if (dd) {
    typesPass = ANSWER_TYPE.DROPDOWN;
  } else if (ls) {
    typesPass = ANSWER_TYPE.LIKERT_SCALE;
  } else if (mc) {
    typesPass = ANSWER_TYPE.MULTIPLE_CHOICE;
  }
  return typesPass;
};

// gets question text from answer data
const getQuestionText = (type, data) => {
  let textPassGetter = null;
  switch (type) {
    case ANSWER_TYPE.DROPDOWN:
      textPassGetter = parse('uiSch.dropDown.ui:title');
      break;
    case ANSWER_TYPE.MULTIPLE_CHOICE:
      textPassGetter = parse('uiSch.multipleChoice.ui:title');
      break;
    case ANSWER_TYPE.CHECK_BOXES:
      textPassGetter = parse('uiSch.checkBoxes.ui:title');
      break;
    case ANSWER_TYPE.LIKERT_SCALE:
      textPassGetter = parse('uiSch.likertScale.ui:title');
      break;
    default:
      break;
  }
  return textPassGetter(data);
};

// checks if property on schema exist in library
const propsChecksOut = (prop) => {
  const allTypes = [...CB_SCHEMA_PROPS, ...DD_SCHEMA_PROPS, ...MC_SCHEMA_PROPS, ...LS_SCHEMA_PROPS];
  return allTypes.includes(prop);
};

// validates exact keys in the particular schema are in sync with original
const keysChecksOut = (currentArr, checkingArr) => {
  if (currentArr.sort().join(',') === checkingArr.sort().join(',')) {
    return true;
  }
  return false
};

const schemaChecker = (data) => {
  if (data && data.length > 0) {
    let allPassArr = [];
    let keysPass = false;
    let typesPass = false;
    let specificsPass = false;
    let textPass = false;
    for (let i = 0; i < data.length; i++) {
      const keys = deepKeys(data[i]);
      if (keys && keys.length > 0) {
        for (let k = 0; k < keys.length; k++) {
          keysPass = propsChecksOut(keys[i]);
        }
      }

      typesPass = getQuestionType(data[i]);
      if (typesPass) {
        switch (typesPass) {
          case ANSWER_TYPE.DROPDOWN:
            const specGetter = parse('sch.properties.dropDown.$ref');
            specificsPass = specGetter(data[i]) === DROPDOWN_REF && keysChecksOut(DD_SCHEMA_PROPS, keys);
            break;
          case ANSWER_TYPE.MULTIPLE_CHOICE:
            specificsPass = keysChecksOut(MC_SCHEMA_PROPS, keys);
            break;
          case ANSWER_TYPE.CHECK_BOXES:
            specificsPass = keysChecksOut(CB_SCHEMA_PROPS, keys);
            break;
          case ANSWER_TYPE.LIKERT_SCALE:
            specificsPass = keysChecksOut(LS_SCHEMA_PROPS, keys);
            break;
          default:
            break;
        }
        textPass = getQuestionText(typesPass, data[i]);
      }

      // move result to array to compare counts
      // we can check these to return specific errors
      if (keysPass && typesPass && specificsPass && textPass) {
        allPassArr.push(1);
      }
    }
    // true if all checks passes
    return data.length === allPassArr.length;
  }
  return false;
};

export const generateQuestionArray = (data) => {
  const isReady = schemaChecker(data);
  if (isReady) {
    const readyArr = [];
    for (let i = 0; i < data.length; i++) {
      const type = getQuestionType(data[i]);
      const question = {
        questionType: type,
        questionText: getQuestionText(type, data[i]),
        questionNumber: i + 1,
        jsonSchema: data[i].sch,
        jsonUiSchema: data[i].uiSch
      };
      readyArr.push(question);
    }
    return readyArr;
  }
  return false;
};

const NUM_OF_OBJ_KEYS = 4;
export const getInitalAnswerArray = (dataObj) => {
  const resultArr = [];
  let newObj = {};
  let count = 0;
  Object.keys(dataObj).forEach((e, i, p) => {
    count++;
    // get all for each type; do not overwrite what is already collected
    if (e.includes('questionNumber')) {
      newObj = {
        ...{ questionNumber: e.includes('questionNumber') ? dataObj[e] : undefined },
        ...newObj
      };
    }
    if (e.includes('questionTitle')) {
      newObj = {
        ...{ questionTitle: e.includes('questionTitle') ? dataObj[e] : undefined },
        ...newObj
      };
    }
    if (e.includes('questionType')) {
      newObj = {
        ...{ questionType: e.includes('questionType') ? dataObj[e] : undefined },
        ...newObj
      };
    }
    if (e.includes('questionAnswer')) {
      newObj = {
        ...{ questionAnswer: e.includes('questionAnswer') ? dataObj[e] : undefined },
        ...newObj
      };
    }
    // properties are in order of type, questionNumber now
    // number of properties are known so reset once divisble number is hit
    if ((count % NUM_OF_OBJ_KEYS) === 0) {
      resultArr.push(newObj);
      newObj = {};
    }
  });
  // sort array of object by questionNumber
  // looks sorted already
  return resultArr;
};

const allAnswersAreOfCorrectType = (data) => {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let res = 0;
    switch (data[i].questionType) {
      case ANSWER_TYPE.DROPDOWN:
        if (typeof data[i].questionAnswer.dropDown === 'string') {
          res = 1;
        }
        break;
      case ANSWER_TYPE.MULTIPLE_CHOICE:
        if (typeof data[i].questionAnswer.multipleChoice === 'string') {
          res = 1;
        }
        break;
      case ANSWER_TYPE.CHECK_BOXES:
        if (Array.isArray(data[i].questionAnswer.checkBoxes)) {
          res = 1;
        }
        break;
      case ANSWER_TYPE.LIKERT_SCALE:
        if (typeof data[i].questionAnswer.likertScale === 'object') {
          res = 1;
        }
        break;
      default:
        break;
    }
    result.push(res);
    res = 0;
  }
  return !result.includes(0);
};

function allPropertiesHasValue(obj) {
  for (var key in obj) {
    if (obj[key]) {
      return true;
    }
  }
  return false;
}

// keys pass, answer type pass, likert: obj keys also match
export const allAnsweredCorrectly = (answerArr, questionArr) => {
  let result = [];
  if (allPropertiesHasValue(answerArr)) {
    if (allAnswersAreOfCorrectType(answerArr)) {
      for (let i = 0; i < answerArr.length; i++) {
        let res = 0;
        switch (answerArr[i].questionType) {
          case ANSWER_TYPE.DROPDOWN:
            res = 1;
            break;
          case ANSWER_TYPE.MULTIPLE_CHOICE:
            res = 1;
            break;
          case ANSWER_TYPE.CHECK_BOXES:
            res = answerArr[i].questionAnswer && answerArr[i].questionAnswer.checkBoxes && answerArr[i].questionAnswer.checkBoxes.length > 0 ? 1 : 0;
            break;
          case ANSWER_TYPE.LIKERT_SCALE:
            // ensure that all likert questions have answers
            const likertQuestion = questionArr.filter(a => a.questionNumber === answerArr[i].questionNumber);
            if (likertQuestion) {
              const likertQuestionRowArr = likertQuestion[0].jsonSchema.properties.likertScale.rows;
              const likertQuestionArr = likertQuestionRowArr.map(a => a.text);
              res = keysChecksOut(deepKeys(answerArr[i].questionAnswer.likertScale), likertQuestionArr) ? 1 : 0;
            } else {
              res = 0;
            }
            break;
          default:
            break;
        }
        result.push(res);
        res = 0;
      }
    }
  }
  return result.length > 0 ? !result.includes(0) : false;
};
