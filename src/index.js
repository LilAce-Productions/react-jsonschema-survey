import React from 'react';
import PropTypes from 'prop-types';
import ConfirmPromiseModal from 'react-simple-promise-modal';
import QuickAlert from 'react-quick-alert';
import MultipleChoice from './components/MultipleChoice';
import CheckBoxes from './components/CheckBoxes';
import DropDown from './components/DropDown';
import LikertScale from './components/LikertScale';
import { ANSWER_TYPE_DISPLAY, ANSWER_TYPE, ANSWER_TYPE_DEFAULT_SEL, WORK_MODE } from './constants';
import { getSchemaForAnswerType, getUiSchemaForAnswerType, getAnswerTypeDisplay, generateQuestionArray, getInitalAnswerArray, allAnsweredCorrectly } from './schema/utility';
import { SchemaViewer } from './components/SchemaViewer';
import './index.css';
export { LikertScaleWidget } from './schema/likert-scale';
export { WORK_MODE } from './constants';

const postingAlertStyle = {
  time: 4000,
  showStyle: 'showAlert'
};

export class SurveySchemaGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectAnswerType = this.handleSelectAnswerType.bind(this);
    this.handleAddQuestion = this.handleAddQuestion.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.resetAlert = this.resetAlert.bind(this);
    this.alertTime = postingAlertStyle.time;
    this.showAlertStyle = postingAlertStyle.showStyle;
    this.handlePreview = this.handlePreview.bind(this);
    this.handleLeavePreview = this.handleLeavePreview.bind(this);
    this.updateQuestionArray = this.updateQuestionArray.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.onSaveAnswer = this.onSaveAnswer.bind(this);
    this.state = {
      selectedAnswerType: ANSWER_TYPE_DEFAULT_SEL,
      questionArray: [],
      questionText: '',
      alertShown: false,
      alertMessage: '',
      modalMsg: 'Are you sure you want to remove this question?',
      modalYesButton: 'Confirm',
      modalTitle: 'Notice',
      previewMode: false,
      answerData: [],
      surveyDone: false,
      resultErr: ''
    };
  }
  componentDidMount() {
    if (this.props.mode === WORK_MODE.LIVE && this.props.data && this.props.data.length > 0) {
      const qaArr = generateQuestionArray(this.props.data);
      if (!qaArr) {
        this.showAlert(`Your schema data is invalid. \n Using builder now. \n Use COPY in builder for correct schemas.`);
      } else {
        if (qaArr && qaArr.length > 0) {
          this.setState({ questionArray: qaArr });
        }
      }
    }
  }
  handleFinish(e) {
    e.preventDefault();
    const answerData = this.state.answerData;
    // organize, process, validate, save data in readable format
    // organize ansData into answer array
    let isDone = false;
    const initAnswerArr = getInitalAnswerArray(answerData);
    if (initAnswerArr && initAnswerArr.length > 0) {
      // same number of questions processed check first
      isDone = (this.state.questionArray.length === initAnswerArr.length) && allAnsweredCorrectly(initAnswerArr, this.state.questionArray);
    }
    if (isDone) {
      this.props.onFinishSurvey(initAnswerArr);
      this.setState({ resultErr: 'Thanks for participating!' }, () => this.setState({ surveyDone: true }));
    } else {
      this.setState({ resultErr: 'All Questions are not answered.' });
    }
  }
  onSaveAnswer(formData) {
    // updates answers to question by simply overwriting the property
    const all = { ...this.state.answerData, ...formData };
    this.setState({ answerData: all, resultErr: '' });
  }
  showAlert(msg) {
    this.setState({ alertMessage: msg, alertShown: true });
  }
  resetAlert() {
    this.setState({ alertShown: false });
  }
  handlePreview(e) {
    e.preventDefault();
    this.setState({ previewMode: true });
  }
  handleLeavePreview(e) {
    e.preventDefault();
    this.setState({ previewMode: false });
  }
  updateQuestionArray(data) {
    const saveArray = this.state.questionArray;
    const questionDoc = data;
    const schema = questionDoc.jsonSchema;
    const uiSchema = questionDoc.jsonUiSchema;
    const newData = {
      ...questionDoc,
      jsonSchema: schema,
      jsonUiSchema: uiSchema
    };
    for (let index = 0; index < saveArray.length; index++) {
      if (saveArray[index].questionNumber === data.questionNumber) {
        saveArray[index] = newData;
        break;
      }
    }
    this.setState({
      selectedAnswerType: ANSWER_TYPE_DEFAULT_SEL,
      questionArray: saveArray,
      questionText: ''
    });
  }
  handleSelectAnswerType(e, sel) {
    e.preventDefault();
    this.setState({ selectedAnswerType: sel });
  }
  handleAddQuestion(sl) {
    if (!this.state.questionText) {
      this.showAlert('Please add text for your question.');
      return;
    }
    if (this.state.selectedAnswerType === ANSWER_TYPE_DEFAULT_SEL) {
      this.showAlert('Please choose an Answer Input Type.');
      return;
    }
    const questArray = this.state.questionArray;
    const uiSch = getUiSchemaForAnswerType(this.state.selectedAnswerType, this.state.questionText);
    const data = {
      questionType: this.state.selectedAnswerType,
      questionText: this.state.questionText,
      questionNumber: questArray.length + 1,
      jsonSchema: getSchemaForAnswerType(this.state.selectedAnswerType),
      jsonUiSchema: uiSch
    };
    questArray.push(data);
    this.setState({
      questionArray: questArray
    });

    this.setState({ selectedAnswerType: ANSWER_TYPE_DEFAULT_SEL, questionText: '' });
  }
  saveQuestion(data) {
    this.setState({ modalYesButton: 'Okay', modalTitle: 'JSON', modalMsg: <SchemaViewer schema={data.jsonSchema} uiSchema={data.jsonUiSchema} type={data.questionType} /> });
    this.confirmModalRef.show();
  }
  removeQuestion(questionNumber) {
    this.setState({ modalYesButton: 'Confirm', modalTitle: 'Notice', modalMsg: 'Are you sure you want to remove this question?' });
    this.confirmModalRef.show()
      .then((result) => {
        if (result) {
          const saveArray = this.state.questionArray.filter(e => e.questionNumber !== questionNumber);
          // reordering question numbering
          for (let index = 0; index < saveArray.length; index++) {
            saveArray[index].questionNumber = index + 1;
          }
          this.setState({
            selectedAnswerType: ANSWER_TYPE_DEFAULT_SEL,
            questionArray: [], // setting it blank here forces an update
            questionText: ''
          }, () => this.setState({ questionArray: saveArray })); // set it back here
          this.showAlert('Question removed sucessfully.');
        } else {
          this.showAlert('Question was not removed.');
        }
      })
      .catch((err) => {
        this.showAlert('Question was not removed.', err);
      });
  }
  renderQuestions(isPreview) {
    if (this.state.questionArray && this.state.questionArray.length > 0) {
      return this.state.questionArray.map((quest, indx) => {
        const questionType = quest.questionType;
        const props = {
          key: indx,
          data: quest,
          showAlert: this.showAlert,
          removeQuestion: this.removeQuestion,
          saveQuestion: this.saveQuestion,
          previewMode: isPreview,
          updateQuestionArray: this.updateQuestionArray,
          onSaveAnswer: this.onSaveAnswer
        };
        switch (questionType) {
          case ANSWER_TYPE.MULTIPLE_CHOICE:
            return (<MultipleChoice {...props} />);
          case ANSWER_TYPE.CHECK_BOXES:
            return (<CheckBoxes {...props} />);
          case ANSWER_TYPE.DROPDOWN:
            return (<DropDown {...props} />);
          case ANSWER_TYPE.LIKERT_SCALE:
            return (<LikertScale {...props} />);
          default:
            break;
        }
        return null;
      });
    }
    return null;
  }
  render() {
    if (this.state.surveyDone) {
      return (
        <main className="container live-container">
          <div className="row justify-content-center">
            <div className="col-10 text-center">
              <p style={{ color: 'grey' }}>Complete.</p>
            </div>
          </div>
        </main>
      );
    }
    if (this.props.mode === WORK_MODE.LIVE && this.state.questionArray && this.state.questionArray.length > 0) {
      return (
        <main className="container live-container">
          <div className="row justify-content-center">
            <div className="col-10">
              <section className="row">
                <div className="col-md-12 col-lg-12">
                  <div className="mb-4">
                    <div className="row-main-wrapper">
                      <div className="one-question-wrap">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            {this.renderQuestions(true)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-6 text-left">
                  <h6 className="all-page-header spacer" style={{ color: 'red' }}>
                    {this.state.resultErr}
                  </h6>
                </div>
                <div className="col-md-6 col-lg-6 col-sm-6">
                  <h3 className="all-page-header spacer">
                    <a href="#" onClick={this.handleFinish} className="dashboard-start-btn">Finish</a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </main>
      );
    }
    return (
      <main className={`container ${this.state.previewMode ? 'flip-container hover' : ''}`}>
        <div className="row justify-content-center flipper">
          <div className="col-10 front">
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                {this.state.questionArray && this.state.questionArray.length > 0
                  ? <h3 className="all-page-header spacer">
                    <a href="#" onClick={this.handlePreview} className="dashboard-preview-btn">Preview</a>
                  </h3> : null}
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <h3 className="all-page-header spacer">
                  <a href="#" onClick={this.handleAddQuestion} className="dashboard-start-btn">Add Question</a>
                </h3>
              </div>
            </div>
            <section className="row">
              <div className="col-md-12 col-lg-12">
                <div className="mb-4">
                  <div className="row-main-wrapper">
                    <div className="one-question-wrap">
                      <div className="row">
                        <div className="col-md-9 col-lg-9 col-sm-12">
                          <div className="q-fm-wrap">
                            <div className="form-group">
                              <input type="text" value={this.state.questionText} className="form-control thick-border" placeholder="Type your question.." onChange={e => this.setState({ questionText: e.target.value })} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-lg-3 col-sm-12">
                          <div className="q-fm-wrap">
                            <div className="dropdown">
                              <button className="btn btn-default dropdown-toggle btn-subtle answer-input-dropdown full-wd" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                {getAnswerTypeDisplay(this.state.selectedAnswerType)}
                                <span className="caret" />
                              </button>
                              <ul className="dropdown-menu full-wd" aria-labelledby="dropdownMenu1">
                                <li><a onClick={e => this.handleSelectAnswerType(e, ANSWER_TYPE.MULTIPLE_CHOICE)} href="#"><i className="fa fa-dot-circle-o" />{ANSWER_TYPE_DISPLAY[ANSWER_TYPE.MULTIPLE_CHOICE]}</a></li>
                                <li><a onClick={e => this.handleSelectAnswerType(e, ANSWER_TYPE.CHECK_BOXES)} href="#"><i className="fa fa-check-circle-o" />{ANSWER_TYPE_DISPLAY[ANSWER_TYPE.CHECK_BOXES]}</a></li>
                                <li><a onClick={e => this.handleSelectAnswerType(e, ANSWER_TYPE.DROPDOWN)} href="#"><i className="fa fa-caret-square-o-down" />{ANSWER_TYPE_DISPLAY[ANSWER_TYPE.DROPDOWN]}</a></li>
                                <li><a onClick={e => this.handleSelectAnswerType(e, ANSWER_TYPE.LIKERT_SCALE)} href="#"><i className="fa fa-balance-scale " />{ANSWER_TYPE_DISPLAY[ANSWER_TYPE.LIKERT_SCALE]}</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          {this.state.questionArray.length > 0
                            ? this.renderQuestions(false)
                            : <div className="answer-input-display">This survey has no questions. Choose Add Question.</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="col-10 back" key={this.state.previewMode ? 0 : 1}>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <h3 className="all-page-header spacer">
                  <a href="#" onClick={this.handleLeavePreview} className="dashboard-preview-btn">Back</a>
                </h3>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <h3 className="all-page-header spacer">
                  <span className="dashboard-preview-title">Preview</span>
                </h3>
              </div>
            </div>
            <section className="row">
              <div className="col-md-12 col-lg-12">
                <div className="mb-4">
                  <div className="row-main-wrapper">
                    <div className="one-question-wrap">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          {this.renderQuestions(true)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <QuickAlert
          show={this.state.alertShown}
          resetAlert={this.resetAlert}
          time={this.alertTime}
          message={this.state.alertMessage}
          showStyle={this.showAlertStyle}
          alertIdentity={`snackbar-survey`}
        />
        <ConfirmPromiseModal
          onRef={ref => (this.confirmModalRef = ref)}
          modalId={`modal-survey-id`}
          labelId={`modal-label-survey`}
          yesButton={this.state.modalYesButton}
          title={this.state.modalTitle}
          render={typeof this.state.modalMsg === 'string' ? () => <span>{this.state.modalMsg}</span> : () => this.state.modalMsg}
        />
      </main>
    );
  }
}

SurveySchemaGenerator.propTypes = {
  data: PropTypes.array,
  mode: PropTypes.string,
  onFinishSurvey: PropTypes.func
};
