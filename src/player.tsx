import * as React from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Action, Player, ItemTypes } from './entities'
const styles = require('./styles.less')


const dragSpec = {
  beginDrag(props): Player {
    props.dispatch({ type: 'showRightDroper' })
    props.dispatch({ type: 'showFieldDroper' })
    return props.data
  },
  endDrag(props) {
    props.dispatch({ type: 'hideRightDroper' })
    props.dispatch({ type: 'hideFieldDroper' })
  }
}

@DragSource(ItemTypes.player, dragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging()
}))
export default class PlayerItem extends React.Component
  <{
    connectDragSource?: any
    connectDragPreview?: any
    dispatch: (a: Action) => void
		isDragging?: boolean
    data: Player
  }, {}>
{
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage())
  }
  render() {
    let { connectDragSource, isDragging } = this.props
    let { name, number, position, avatar } = this.props.data
    return connectDragSource(<div className={styles['player-item']}>
      <img className={styles['player-avatar']} src={avatar} />
      <span>{ name }</span>
      <span>
        <span className={styles['player-number']}>{ number }</span>
        <span>{ position }</span>
      </span>
    </div>)
  }
}