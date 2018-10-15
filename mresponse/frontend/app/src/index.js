import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Api from './utils/api'

const apiBaseUrl = 'http://mresponse.local:8000'

ReactDOM.render(<App constructApi={token => new Api(apiBaseUrl, token)} />, document.getElementById('root'))
// registerServiceWorker();
