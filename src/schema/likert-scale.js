import React from 'react';
import PropTypes from 'prop-types';

export class LikertScaleWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }
  onChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value
      }, () => this.props.onChange(this.state));
    };
  }
  render() {
    return (
      <div className="input-group">
        <div className="table-responsive-sm">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" />
                {this.props.schema.columns.length > 0 && this.props.schema.columns.map((c, i) => (<th scope="col" key={i}><span>{c.text}</span></th>))}
              </tr>
            </thead>
            <tbody>
              {this.props.schema.rows.length > 0 && this.props.schema.rows.map((r, ix) => (
                <tr className="form-group" key={ix}>
                  <td><span>{r.text}</span></td>
                  {this.props.schema.columns.length > 0 && this.props.schema.columns.map((c, key) => (
                    <td className="radio-inline" key={key}>
                      <input
                        type="radio"
                        className="form-control"
                        name={r.text}
                        value={c.text}
                        onChange={this.onChange(r.text)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

LikertScaleWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export const likertScaleSchema = {
  type: 'object',
  properties: {
    likertScale: {
      type: 'string',
      columns: [{
        text: 'Strongly Disagree'
      }, {
        text: 'Disagree'
      }, {
        text: 'Neutral'
      }, {
        text: 'Agree'
      }, {
        text: 'Strongly Agree'
      }],
      rows: [{
        text: 'Product is affordable'
      }, {
        text: 'Product does what it claims'
      }, {
        text: 'Product is better than other products on the market'
      }, {
        text: 'Product is easy to use'
      }]
    }
  }
};

export const getLikertScaleUiSchema = (questionText, questionNumber) => {
  const likertScale = {
    classNames: 'ls-question-wrapper',
    'ui:title': questionNumber ? `${questionNumber}. ${questionText}` : questionText,
    'ui:widget': LikertScaleWidget,
    'ui:options': {
      answers: []
    }
  };
  return { likertScale };
};

export const LS_SCHEMA_PROPS = [
  'sch.type',
  'sch.properties.likertScale.type',
  'sch.properties.likertScale.columns',
  'sch.properties.likertScale.rows',
  'uiSch.likertScale.classNames',
  'uiSch.likertScale.ui:title',
  'uiSch.likertScale.ui:widget'
];
