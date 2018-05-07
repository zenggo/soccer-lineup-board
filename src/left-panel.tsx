import * as React from 'react'
import { DropTarget } from 'react-dnd'
import { Action, Player, ItemTypes, Starter, Substitute } from './entities'
import PlayerItem from './player'
const styles = require('./styles.less')

const dropSpec = {
  drop(props, monitor, component: LeftPanel) {
    const itemType = monitor.getItemType()
    const item = monitor.getItem()
    component.addPlayer(itemType, item)
  }
}

@DropTarget([ItemTypes.substitute, ItemTypes.starter], dropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class LeftPanel extends React.Component
  <{
    connectDropTarget?: any
    isOver?: boolean
    dispatch: (a: Action) => void
    players: Player[]
    isShowLeftDroper: boolean
  }, {}>
{
  addPlayer(type: ItemTypes, item: Substitute|Starter) {
    this.props.dispatch({
      type: 'addPlayer',
      data: {
        type, item
      }
    })
  }
  render() {
    let { connectDropTarget, dispatch, players, isOver, isShowLeftDroper } = this.props

    let droperStyle: any = {
      visibility: isShowLeftDroper ? 'visible' : 'hidden',
    }
    
    return <div className={styles['players-wrap']}>
      { connectDropTarget(
        <div
          className={`${styles['players-droper']} ${isOver ? styles['players-droper_hover'] : ''}`}
          style={droperStyle}
        > + </div>
      )} 
      { players.map(p => <PlayerItem key={p.id} data={p} dispatch={dispatch} />) }
    </div>
  }
}


