import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'
const styles = require('./field.less')
import { Player, Starter, Substitute, ItemTypes, Action, POSITION } from './entities'

const dropSpec = {
  canDrop(props, monitor) {
    return monitor.isOver({ shallow: true })
  },
  drop(props, monitor, component: Field) {
    const itemType = monitor.getItemType()
    if (itemType == ItemTypes.player || itemType == ItemTypes.substitute) {
      let item: Player|Substitute = monitor.getItem()
      let groundClientOffset = getGroundOffset(component)
      let dropPoint = monitor.getClientOffset()
      let finalClientOffset = {
        left: dropPoint.x - groundClientOffset.left,
        top: dropPoint.y - groundClientOffset.top
      }
      component.addStarter(itemType, item, finalClientOffset.left, finalClientOffset.top)
    } else if (itemType == ItemTypes.starter) {
      let item: Starter = monitor.getItem()
      let delta = monitor.getDifferenceFromInitialOffset()
		  component.moveStarter(item, item.left + delta.x, item.top + delta.y)
    }
	}
}

function getGroundOffset(component) {
  let fieldNode = ReactDOM.findDOMNode(component) as Element
  let { left, top } = fieldNode.parentElement.getBoundingClientRect()
  return { left, top }
}

@DropTarget([ItemTypes.player, ItemTypes.starter, ItemTypes.substitute], dropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true })
}))
export default class Field extends React.Component
  <{
    connectDropTarget?: any
    isOver?: boolean
    dispatch: (a: Action) => void
    position: POSITION
  }, {}>
{
  addStarter(type: ItemTypes, item: Player|Substitute, left: number, top: number) {
    this.props.dispatch({
      type: 'addStarter',
      data: {
        type, item, left, top,
        position: this.props.position
      }
    })
  }
  moveStarter(starter: Starter, newLeft: number, newTop: number) {
    this.props.dispatch({
      type: 'moveStarter',
      data: {
        starter, newLeft, newTop,
        position: this.props.position
      }
    })
  }
  render() {
    let { position, connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div className={`${styles['field-item']} ${styles[`field_${position}`]} ${isOver ? styles['field-item_hover'] : ''}`}>
        <span className={styles['field-name']}>{ position }</span>
      </div>
    )
  }
}