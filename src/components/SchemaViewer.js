import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ANSWER_TYPE } from '../constants';

export function SchemaViewer(props) {
  return (
    <div
      style={{
        margin: '3rem 1rem',
        borderRadius: 4,
        background: '#f6f8fa',
        boxShadow: '0 0 1px  #eee inset'
      }}>
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: 11,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 500,
          padding: '.5rem',
          background: '#00c8b0',
          color: '#000',
          letterSpacing: '1px'
        }}>
        Schema and UI Schema
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <pre
              style={{
                fontSize: '.85rem',
                padding: '1.25rem 2.5rem',
                overflowX: 'scroll',
                textAlign: 'left',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
              {JSON.stringify(props.schema, null, 2)}
            </pre>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <pre
              style={{
                fontSize: '.85rem',
                padding: '1.25rem 2.5rem',
                overflowX: 'scroll',
                textAlign: 'left',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
              {JSON.stringify(props.uiSchema, null, 2)}
            </pre>
          </div>
        </div>
        {props.type === ANSWER_TYPE.LIKERT_SCALE ? <div className="row text-left p-3">
          <div className="col-12">
            <small><b>NOTE:</b>  Custom UI Widgets like 'LikertScaleWidget' has to be added on the fly. (see custom.js)</small>
          </div>
        </div> : null}
        <div className="row">
          <div className="col-12 text-center p-3">
            <CopyToClipboard text={`{sch: ${JSON.stringify(props.schema, null, 2)}, \n uiSch: ${JSON.stringify(props.uiSchema, null, 2)}}`}>
              <button className="copy-btn">COPY</button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </div>
  );
}

SchemaViewer.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};
