import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Main from './main'

const players = require('./fake.json')

ReactDOM.render(<Main
  defaultPlayers={players}
/>, document.getElementById('main'))
