import React, { Component } from 'react'
import { SurveySchemaGenerator, WORK_MODE } from 'react-jsonschema-survey'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import logo from './cllogo.svg';
import github from './github.png';
import { DATA, MODE } from './custom';

window.jQuery = $;
require('bootstrap');

export default class App extends Component {
  onFinishSurvey = (result) => {
    console.log('onFinishSurvey results:', result);
  }
  render () {
    return (
      <div>
        <div className="header-top">
          <div className="cl-logo-wrap"><a href="https://calabashlabsllc.github.io"><img src={logo} width="115px" alt="Calabash Labs Logo" /></a></div>
          <div className="github-logo-wrap"><a href="https://github.com/CalabashLabsLLC/react-jsonschema-survey/"><img src={github} className="github-logo" alt="Github Logo" /></a></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-6 col-sm-6">
              <h2 className="all-page-header spacer text-center p-3">
                {MODE === WORK_MODE.LIVE ? 'Impressive Survey' : 'Survey Builder'}
              </h2>
            </div>
          </div>
        </div>
        <SurveySchemaGenerator data={DATA} mode={MODE} onFinishSurvey={this.onFinishSurvey} />
      </div>
    )
  }
}
