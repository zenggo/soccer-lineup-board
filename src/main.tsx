import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
const styles = require('./styles.less')
import { GlobalState, Action, Player, Starter } from './entities'
import Reducers from './reducers'
import LeftPanel from './left-panel'
import Ground from './ground'
import RightPanel from './right-panel'
import CustomDragLayer from './dragLayer'


@DragDropContext(HTML5Backend)
export default class Main extends React.Component
<{
  defaultPlayers: Player[]
}, GlobalState>
{
  constructor(props) {
    super(props)
    this.state = {
      players: props.defaultPlayers,
      starters: [],
      substitutes: [],
      isShowLeftDroper: false,
      isShowRightDroper: false,
      isShowFieldDroper: false
    }
  }
  handleChange = (action: Action) => {
    Reducers[action.type] && this.setState(Reducers[action.type].call(null, this.state, action.data))
  }
  render() {
    let { players, starters, substitutes, isShowFieldDroper, isShowLeftDroper, isShowRightDroper } = this.state
    return <div className={styles['wrap']}>
      <div className={styles['left-panel']}>
        <LeftPanel dispatch={this.handleChange} players={players} isShowLeftDroper={isShowLeftDroper} />
      </div>
      <div className={styles['mid-wrap']}>
        <Ground dispatch={this.handleChange} starters={starters} isShowFieldDroper={isShowFieldDroper} />
        <img className={styles['ground-bg']} src="./imgs/ground.jpeg" />
      </div>
      <div className={styles['right-panel']}>
        <RightPanel dispatch={this.handleChange} substitutes={substitutes} isShowRightDroper={isShowRightDroper} />
      </div>
      <CustomDragLayer />
    </div>
  }
}