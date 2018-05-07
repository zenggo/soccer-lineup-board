import * as React from 'react'
import { DragLayer } from 'react-dnd'
import { ItemTypes } from './entities'
const styles = require('./styles.less')

function getItemStyles(props): any {
	const { currentClientOffset } = props
	if (currentClientOffset) {
    return {
      position: 'absolute',
      left: currentClientOffset.x,
      top: currentClientOffset.y
    }
  } else {
    return {
			display: 'none',
		}
  }
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentClientOffset: monitor.getClientOffset(),
	isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends React.Component
  <{
    item?: any
    itemType?: ItemTypes
    currentClientOffset?: any
    isDragging?: boolean
  }, {}>
{
  render() {
    const { item, itemType, isDragging } = this.props
    if (!isDragging) return null

    let avatar = (itemType == ItemTypes.player) ? item.avatar : item.player.avatar

    return (
			<div className={styles['dragger-layer']}>
				<div style={getItemStyles(this.props)}>
					<img className={styles['dragger']} src={avatar} />
				</div>
			</div>
		)
  }
}