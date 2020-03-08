/* eslint-disable no-plusplus, react/no-did-mount-set-state, arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Form from 'react-jsonschema-form';
import SchemaBuilder from './SchemaBuilder';
import './styles/ls.css'

class LikertScale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: props.data.jsonSchema,
      uiSchema: props.data.jsonUiSchema,
      formData: {},
      choiceText: '',
      forceReset: 1,
      buildMode: !props.previewMode
    };
    this.reorderLabel = this.reorderLabel.bind(this);
    this.addQuestionRow = this.addQuestionRow.bind(this);
    this.removeQuestionRow = this.removeQuestionRow.bind(this);
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
      questionText: this.state.uiSchema.likertScale['ui:title'],
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
      [`likertScale_questionNumber_${questionNumber}`]: questionNumber,
      [`likertScale_questionTitle_${questionNumber}`]: questionTitle,
      [`likertScale_questionType_${questionNumber}`]: questionType,
      [`likertScale_questionAnswer_${questionNumber}`]: e.formData
    });
  }
  handleQuestionChange(e) {
    const val = e.target.value;
    const rest = this.state.uiSchema.likertScale;
    this.setState({ uiSchema: Object.assign({}, this.state.uiSchema, {
      likertScale: { ...rest, 'ui:title': val }
    }) }, () => this.updateQuestionArray());
  }
  reorderLabel(index, newIndex) {
    const arr = this.state.schema.properties.likertScale.rows;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    let sch = null;
    for (let i = 0; i < arr.length; i++) {
      sch = update(this.state.schema, { properties: { likertScale: { rows: { [i]: { $set: arr[i] } } } } });
    }
    this.setState({ schema: sch, forceReset: this.state.forceReset === 1 ? 0 : 1 });
  }
  addQuestionRow(prevChoiceText) {
    const choiceText = this.state.choiceText;
    const val = {
      value: choiceText,
      text: choiceText
    };
    if (choiceText) {
      const choiceArray = this.state.schema.properties.likertScale.rows;
      const textArray = choiceArray.map(a => a.text);
      if (choiceArray && choiceArray.length > 0 && !textArray.includes(choiceText)) {
        let sch = null;
        if (prevChoiceText) {
          for (let i = 0; i < choiceArray.length; i++) {
            if (choiceArray[i].text === prevChoiceText) {
              sch = update(this.state.schema, { properties: { likertScale: { rows: { [i]: { $set: val } } } } });
              break;
            }
          }
        } else {
          sch = update(this.state.schema, { properties: { likertScale: { rows: { $push: [val] } } } });
        }
        this.setState({
          schema: sch,
          choiceText: ''
        },
        () => {
          const msg = prevChoiceText ? 'Question changed.' : 'Question added.';
          this.props.showAlert(msg);
        });
      } else {
        this.props.showAlert('Question already included.');
      }
    }
  }
  removeQuestionRow(prevChoiceText) {
    const val = prevChoiceText;
    if (val) {
      const choiceArray = this.state.schema.properties.likertScale.rows;
      if (choiceArray && choiceArray.length > 0 && choiceArray.some(e => e.text === val)) {
        const index = choiceArray.findIndex(e => e.text === val);
        const sch = update(this.state.schema, { properties: { likertScale: { rows: { $splice: [[index, 1]] } } } });
        this.setState({
          schema: sch,
          choiceText: '',
          forceReset: this.state.forceReset === 1 ? 0 : 1 // reload of inputs is necessary for .map in builder
        }, () => {
          this.props.showAlert('Question removed.');
        });
      } else {
        this.props.showAlert('Question not found for removal.');
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
            questionText={this.state.uiSchema.likertScale['ui:title']}
            handleQuestionChange={this.handleQuestionChange}
            addNewInputId={`addNew${this.props.data.questionNumber}`}
            addQuestionRow={this.addQuestionRow}
            removeQuestionRow={this.removeQuestionRow}
            choiceArray={schema.properties.likertScale.rows}
            reorderLabel={this.reorderLabel}
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

LikertScale.propTypes = {
  showAlert: PropTypes.func.isRequired,
  previewMode: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  saveQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  updateQuestionArray: PropTypes.func.isRequired,
  onSaveAnswer: PropTypes.func.isRequired
};

export default LikertScale;
