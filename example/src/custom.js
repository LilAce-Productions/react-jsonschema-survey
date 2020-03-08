
import { LikertScaleWidget, WORK_MODE } from 'react-jsonschema-survey'

export const DATA =[{ 
  sch: {
    "type": "object",
    "properties": {
      "multipleChoice": {
        "type": "string",
        "enum": [
          "green",
          "white",
          "red",
          "blue",
          "black"
        ]
      }
    }
  },
  uiSch: {
    "multipleChoice": {
      "classNames": "mc-question-wrapper",
      "ui:title": "Choose your most favorable color.",
      "ui:widget": "radio"
  }
}}, {
  sch: {
    "type": "object",
    "properties": {
      "checkBoxes": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "To connect with an audience",
            "To promote myself",
            "To provide valuable information for my readers",
            "Meeting friends for dinner or drinks",
            "To make money",
            "I would not write a book"
          ]
        },
        "uniqueItems": true
      }
    }
  }, 
  uiSch: {
    "checkBoxes": {
      "classNames": "cb-question-wrapper",
      "ui:title": "Why would you write a book? Select all that apply.",
      "ui:widget": "checkboxes"
    }
  }
}, {
  sch: {
    "type": "object",
    "properties": {
      "likertScale": {
        "type": "string",
        "columns": [
          {
            "text": "Strongly Disagree"
          },
          {
            "text": "Disagree"
          },
          {
            "text": "Neutral"
          },
          {
            "text": "Agree"
          },
          {
            "text": "Strongly Agree"
          }
        ],
        "rows": [
          {
            "text": "Product is very affordable"
          },
          {
            "text": "Product does what it claims"
          },
          {
            "text": "Product is better than other products on the market"
          },
          {
            "text": "Product is easy to use"
          }
        ]
      }
    }
  },
  uiSch: {
    "likertScale": {
      "classNames": "ls-question-wrapper",
      "ui:title": "Please choose how you relate to the following statements.",
      "ui:widget": LikertScaleWidget
    }
  }
}, {
  sch: {
    "definitions": {
      "choiceEnum": {
        "type": "string",
        "enum": [
          "East",
          "West",
          "North",
          "South"
        ]
      }
    },
    "type": "object",
    "properties": {
      "dropDown": {
        "$ref": "#/definitions/choiceEnum"
      }
    }
  }, 
  uiSch: {
    "dropDown": {
      "classNames": "dd-question-wrapper",
      "ui:title": "Which cardinal direction most describes your physical location in the world?",
      "ui:placeholder": "Choose an answer"
    }
  }
}, {
  sch: {
    "type": "object",
    "properties": {
      "checkBoxes": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "Reading",
            "Watching TV",
            "Talking on the phone",
            "Meeting friends for dinner or drinks",
            "Surf the web",
            "Playing a sport",
            "Going to the movies"
          ]
        },
        "uniqueItems": true
      }
    }
  }, 
  uiSch: {
    "checkBoxes": {
      "classNames": "cb-question-wrapper",
      "ui:title": "In the last week, what activities have you participated in? Select all that apply.",
      "ui:widget": "checkboxes"
    }
  }
}, { 
  sch: {
    "type": "object",
    "properties": {
      "multipleChoice": {
        "type": "string",
        "enum": [
          "George Bush",
          "George Washington",
          "George Clooney",
          "Barack Obama",
          "None of the above"
        ]
      }
    }
  },
  uiSch: {
    "multipleChoice": {
      "classNames": "mc-question-wrapper",
      "ui:title": "Who was the first U.S. President?",
      "ui:widget": "radio"
  }
}}];

export const MODE = WORK_MODE.BUILDER;
