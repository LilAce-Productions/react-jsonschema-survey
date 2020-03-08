/* eslint-disable no-plusplus, react/no-did-mount-set-state, arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Form from 'react-jsonschema-form';
import SchemaBuilder from './SchemaBuilder';
import './styles/cb.css'

class CheckBoxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: props.data.jsonSchema,
      uiSchema: props.data.jsonUiSchema,
      choiceText: '',
      forceReset: 1,
      formData: {},
      buildMode: !props.previewMode
    };
    this.reorderLabel = this.reorderLabel.bind(this);
    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleChoiceText = this.handleChoiceText.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
    this.getQuestionDataSetup = this.getQuestionDataSetup.bind(this);
    this.updateQuestionArray = this.updateQuestionArray.bind(this);
  }
  getQuestionDataSetup() {
    const questionDoc = this.props.data;
    const schema = this.state.schema;
    const uiSchema = this.state.uiSchema;
    return {
      ...questionDoc,
      questionText: this.state.uiSchema.checkBoxes['ui:title'],
      jsonSchema: schema,
      jsonUiSchema: uiSchema
    };
  }
  updateQuestionArray() {
    const data = this.getQuestionDataSetup();
    this.props.updateQuestionArray(data);
  }
  onChangeForm(e) {
    // sets state within <Form /> component
    this.setState({
      formData: Object.assign({}, this.state.formData, { ...e.formData })
    });
    const questionNumber = this.getQuestionDataSetup().questionNumber;
    const questionTitle = this.getQuestionDataSetup().questionText;
    const questionType = this.getQuestionDataSetup().questionType;
    this.props.onSaveAnswer({
      [`checkBoxes_questionNumber_${questionNumber}`]: questionNumber,
      [`checkBoxes_questionTitle_${questionNumber}`]: questionTitle,
      [`checkBoxes_questionType_${questionNumber}`]: questionType,
      [`checkBoxes_questionAnswer_${questionNumber}`]: e.formData
    });
  }
  handleQuestionChange(e) {
    const val = e.target.value;
    const rest = this.state.uiSchema.checkBoxes;
    this.setState({ uiSchema: Object.assign({}, this.state.uiSchema, {
      checkBoxes: { ...rest, 'ui:title': val }
    }) }, () => this.updateQuestionArray());
  }
  reorderLabel(index, newIndex) {
    const arr = this.state.schema.properties.checkBoxes.items.enum;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    let sch = null;
    for (let i = 0; i < arr.length; i++) {
      sch = update(this.state.schema, { properties: { checkBoxes: { items: { enum: { [i]: { $set: arr[i] } } } } } });
    }
    this.setState({ schema: sch, forceReset: this.state.forceReset === 1 ? 0 : 1 }, () => this.updateQuestionArray());
  }
  addChoice(prevChoiceText) {
    const val = this.state.choiceText;
    if (val) {
      const choiceArray = this.state.schema.properties.checkBoxes.items.enum;
      if (choiceArray && choiceArray.length > 0 && !choiceArray.includes(val)) {
        let sch = null;
        if (prevChoiceText) {
          for (let i = 0; i < choiceArray.length; i++) {
            if (choiceArray[i] === prevChoiceText) {
              sch = update(this.state.schema, { properties: { checkBoxes: { type: { $set: 'array' }, items: { type: { $set: 'string' }, enum: { [i]: { $set: val } } } } } });
              break;
            }
          }
        } else {
          sch = update(this.state.schema, { properties: { checkBoxes: { type: { $set: 'array' }, items: { type: { $set: 'string' }, enum: { $push: [val] } } } } });
        }
        this.setState({
          schema: sch,
          choiceText: ''
        },
        () => {
          this.updateQuestionArray();
          const msg = prevChoiceText ? 'Choice changed.' : 'Choice added.';
          this.props.showAlert(msg);
        });
      } else {
        this.props.showAlert('Choice already included.');
      }
    }
  }
  removeChoice(prevChoiceText) {
    const val = prevChoiceText;
    if (val) {
      const choiceArray = this.state.schema.properties.checkBoxes.items.enum;
      if (choiceArray && choiceArray.length === 2) {
        this.props.showAlert('Multiple Choice must maintain at least two choices.');
        return;
      }
      if (choiceArray && choiceArray.length > 0 && choiceArray.includes(val)) {
        const index = choiceArray.findIndex(e => e === val);
        const sch = update(this.state.schema, { properties: { checkBoxes: { type: { $set: 'array' }, items: { type: { $set: 'string' }, enum: { $splice: [[index, 1]] } } } } });
        this.setState({ schema: sch,
          choiceText: '',
          forceReset: this.state.forceReset === 1 ? 0 : 1 // reload of inputs is necessary for .map in builder
        }, () => {
          this.props.showAlert('Option removed.');
        });
      } else {
        this.props.showAlert('Option not found for removal.');
      }
    }
  }
  handleChoiceText(e) {
    const val = e.target.value;
    this.setState({ choiceText: val });
  }
  saveQuestion() {
    // called when JSON button is clicked
    // question are saved one component at a time
    this.props.saveQuestion(this.getQuestionDataSetup());
  }
  cancelEditQuestion() {
    this.setState({ buildMode: false, previewMode: true });
  }
  removeQuestion() {
    this.props.removeQuestion(this.props.data.questionNumber);
  }
  render() {
    const schema = this.state.schema;
    const uiSchema = this.state.uiSchema;
    return (
      <div className={this.state.buildMode ? 'question-separator' : ''}>
        {this.state.buildMode ? <div className="answer-input-display">
          <SchemaBuilder
            forceReset={this.state.forceReset}
            choiceText={this.state.choiceText}
            addNewInputId={`addNew${this.props.data.questionNumber}`}
            questionText={this.state.uiSchema.checkBoxes['ui:title']}
            choiceArray={schema.properties.checkBoxes.items.enum}
            reorderLabel={this.reorderLabel}
            addChoice={this.addChoice}
            removeChoice={this.removeChoice}
            handleQuestionChange={this.handleQuestionChange}
            handleChoiceText={this.handleChoiceText}
            saveQuestion={this.saveQuestion}
          />
        </div> : null}
        <div className="one-question-view-wrap">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <div className="view-only-answers-display">
                <div className="project-question-number">{`# ${this.props.data.questionNumber}`}</div>
                <React.Fragment key={this.state.forceReset}>
                  <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    idPrefix={`dfdd_${this.props.data.questionNumber}`}
                    formData={this.state.formData}
                    onChange={this.onChangeForm}>
                    <br />
                  </Form>
                </React.Fragment>
                {this.state.buildMode ? <div className="text-right">
                  <button type="button" onClick={this.removeQuestion} className="question-action-btn">Remove Question</button>
                </div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CheckBoxes.propTypes = {
  showAlert: PropTypes.func.isRequired,
  previewMode: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  saveQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  updateQuestionArray: PropTypes.func.isRequired,
  onSaveAnswer: PropTypes.func.isRequired
};

export default CheckBoxes;
