import * as React from 'react'
import { DropTarget } from 'react-dnd'
import { Action, Player, ItemTypes, Starter, Substitute } from './entities'
import SubstituteItem from './substitute'
const styles = require('./styles.less')

const dropSpec = {
  drop(props, monitor, component: RightPanel) {
    const itemType = monitor.getItemType()
    const item = monitor.getItem()
    component.addSubstitute(itemType, item)
  }
}

@DropTarget([ItemTypes.player, ItemTypes.starter], dropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class RightPanel extends React.Component
  <{
    connectDropTarget?: any
    isOver?: boolean
    dispatch: (a: Action) => void
    substitutes: Substitute[]
    isShowRightDroper: boolean
  }, {}>
{
  addSubstitute(type: ItemTypes, item: Player|Starter) {
    this.props.dispatch({
      type: 'addSubstitute',
      data: {
        type, item
      }
    })
  }
  render() {
    let { connectDropTarget, dispatch, isOver, substitutes, isShowRightDroper } = this.props
    
    let droperStyle: any = {
      visibility: isShowRightDroper ? 'visible' : 'hidden',
    }

    return <div className={styles['players-wrap']}>
      <div className={styles['substitute-title']}>Substitutes</div>
      { connectDropTarget(
        <div
          className={`${styles['players-droper']} ${isOver ? styles['players-droper_hover'] : ''}`}
          style={droperStyle}
        > + </div>
      )}
      { substitutes.map(p => <SubstituteItem key={p.player.id} data={p} dispatch={dispatch} />) }
    </div>
  }
}


