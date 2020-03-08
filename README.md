# react-jsonschema-survey

> Use react-jsonschema-form to build survey components. Consists of modes for builder/preview and live. JSON Schema can be built and copied.

[![NPM](https://img.shields.io/npm/v/react-jsonschema-survey.svg)](https://www.npmjs.com/package/react-jsonschema-survey) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-jsonschema-survey
```

## Usage
[Demo](https://calabashlabsllc.github.io/react-jsonschema-survey)

Demo Example Code [Here](https://github.com/CalabashLabsLLC/react-jsonschema-survey/tree/master/example)

```jsx
import React, { Component } from 'react'
import SurveySchemaGenerator from 'react-jsonschema-survey'
import { DATA, MODE } from './custom'

class Example extends Component {
  onFinishSurvey = (result) => {
    console.log('onFinishSurvey results:', result);
  }
  render () {
    return (
      <SurveySchemaGenerator data={DATA} mode={MODE} onFinishSurvey={this.onFinishSurvey} />
    )
  }
}
```

### Component API

`<SurveySchemaGenerator>` component:

Property | Type | Default | Required | Description
-------- | ---- | ------- | -------- |-----------
data | `Array` | n/a | yes | Array of question schemas
mode | `String` | n/a | yes | Builder or Live
onFinishSurvey | `Function` | n/a | yes | Return live survey answers

Uses npm packages [react-quick-alert](https://github.com/CalabashLabsLLC/react-quick-alert) and [react-simple-promise-modal](https://github.com/CalabashLabsLLC/react-simple-promise-modal)

## License
MIT © [calabashlabsllc](https://github.com/calabashlabsllc)

## Reference
[react-jsonschema-form documentation](https://react-jsonschema-form.readthedocs.io/)
