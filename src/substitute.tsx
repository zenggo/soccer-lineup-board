import * as React from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Action, Substitute, ItemTypes } from './entities'
const styles = require('./styles.less')


const dragSpec = {
  beginDrag(props): Substitute {
    props.dispatch({ type: 'showLeftDroper' })
    props.dispatch({ type: 'showFieldDroper' })
    return props.data
  },
  endDrag(props) {
    props.dispatch({ type: 'hideLeftDroper' })
    props.dispatch({ type: 'hideFieldDroper' })
  }
}

@DragSource(ItemTypes.substitute, dragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging()
}))
export default class SubstituteItem extends React.Component
  <{
    connectDragSource?: any
    connectDragPreview?: any
    dispatch: (a: Action) => void
		isDragging?: boolean
    data: Substitute
  }, {}>
{
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage())
  }
  render() {
    let { connectDragSource, isDragging } = this.props
    let { name, number, position, avatar } = this.props.data.player
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