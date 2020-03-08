import React from 'react';
import PropTypes from 'prop-types';

const SchemaBuilder = props => (
  <React.Fragment key={props.forceReset}>
    <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-10">
        <div className="q-fm-wrap">
          <input
            type="text"
            defaultValue={props.questionText}
            className="form-control thick-border question-text-edit"
            placeholder="Edit Question Text here..."
            onChange={props.handleQuestionChange}
          />
        </div>
      </div>
    </div>
    {props.choiceArray.length > 0 && props.choiceArray.map((c, key) =>
      (<div className="one-answer-input-wrap" key={key}>
        <div className="row">
          <div className="col-md-1 col-lg-1 col-sm-6">
            <div className="ans-input-inner-wrap text-center">
              <div className="radio-wrap mt-2">
                <label className="rdcontainer">
                  <input type="radio" name="radio" id={`opt${key}`} className="group-option" />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-lg-9 col-sm-9">
            <div className="ans-input-inner-wrap">
              <div className="form-group">
                <input type="text" id={`inpt${key}`} className="form-control thick-border" placeholder="Answer here..." onChange={props.handleChoiceText} onBlur={() => props.addChoice(c)} defaultValue={typeof c === 'string' ? c : c.text} />
              </div>
            </div>
          </div>
          <div className="col-md-2 col-lg-2 col-sm-12 ans-input-col">
            <div className="ans-input-inner-wrap text-left">
              <span onClick={() => props.addChoice(c)}><i className="fa fa-plus" /></span>
              <span onClick={() => props.removeChoice(c)}><i className="fa fa-minus" /></span>
              <span onClick={key === 0 ? () => {} : () => props.reorderLabel(key, key - 1)}><i className="fa fa-arrow-up" /></span>
              <span onClick={key === (props.choiceArray.length - 1) ? () => {} : () => props.reorderLabel(key, key + 1)}><i className="fa fa-arrow-down" /></span>
            </div>
          </div>
        </div>
      </div>)
    )}
    <div className="one-answer-input-wrap">
      <div className="row">
        <div className="col-md-1 col-lg-1 col-sm-6">
          <div className="ans-input-inner-wrap text-center">
            <div className="radio-wrap mt-2">
              <label className="rdcontainer">
                <input type="radio" name="radio" className="group-option" />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-9 col-lg-9 col-sm-9">
          <div className="ans-input-inner-wrap">
            <div className="form-group">
              <input id={props.addNewInputId} type="text" className="form-control thick-border" placeholder="Answer here..." onChange={props.handleChoiceText} />
            </div>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12 ans-input-col">
          <div className="ans-input-inner-wrap text-left">
            <span onClick={() => { props.addChoice(); document.getElementById(props.addNewInputId).value = ''; }}><i className="fa fa-plus" /></span>
          </div>
        </div>
      </div>
    </div>
    <div className="text-right mt-4">
      <button onClick={() => props.saveQuestion()} type="button" className="question-action-btn">JSON</button>
    </div>
  </React.Fragment>
);

SchemaBuilder.propTypes = {
  questionText: PropTypes.string,
  choiceArray: PropTypes.array,
  reorderLabel: PropTypes.func,
  addChoice: PropTypes.func,
  removeChoice: PropTypes.func,
  handleChoiceText: PropTypes.func,
  handleQuestionChange: PropTypes.func,
  addNewInputId: PropTypes.string,
  saveQuestion: PropTypes.func,
  forceReset: PropTypes.number
};

export default SchemaBuilder;
