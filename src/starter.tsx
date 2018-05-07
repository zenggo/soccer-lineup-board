import * as React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
const styles = require('./styles.less')
import { Action, Player, Starter, ItemTypes, Substitute, POSITION } from './entities'


const dragSpec = {
  beginDrag(props): Starter {
    props.dispatch({ type: 'showLeftDroper' })
    props.dispatch({ type: 'showRightDroper' })
    props.dispatch({ type: 'showFieldDroper' })
    return props.data
  },
  endDrag(props) {
    props.dispatch({ type: 'hideLeftDroper' })
    props.dispatch({ type: 'hideRightDroper' })
    props.dispatch({ type: 'hideFieldDroper' })
  }
}

const dropSpec = {
  canDrop(props, monitor) {
    return monitor.isOver({ shallow: true })
  },
  drop(props, monitor, component: StarterItem) {
    const itemType = monitor.getItemType()
    const item = monitor.getItem()
    component.replaceStarter(itemType, item)
  }
}


@DragSource(ItemTypes.starter, dragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget([ItemTypes.player, ItemTypes.starter, ItemTypes.substitute], dropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
export default class StarterItem extends React.Component
  <{
    connectDropTarget?: any
    connectDragSource?: any
    connectDragPreview?: any
    isDragging?: boolean
    isOver?: boolean
    dispatch: (a: Action) => void
    isShowFieldDroper: boolean
    data: Starter
  }, {}>
{
  replaceStarter(type: ItemTypes, item: Player | Starter | Substitute) {
    this.props.dispatch({
      type: 'replaceStarter',
      data: {
        type, item,
        target: this.props.data
      }
    })
  }
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage())
  }
  render() {
    let { connectDropTarget, connectDragSource, isShowFieldDroper, isDragging, isOver, data, dispatch } = this.props
    let { player, left, top, position } = data

    const style: any = {
      position: 'absolute',
      left, top, width: 0, height: 0,
      opacity: isDragging ? 0.6 : 1
    }

    return connectDragSource(
      connectDropTarget(
        <div style={style}>

          <div className={styles['starter-item']}>

            {
              connectDropTarget(
                <div>
                  <div
                    className={styles['starter-replacer']}
                    style={{ visibility: isOver && !isDragging ? 'visible' : 'hidden' }}
                  >
                    <span>↔</span>
                  </div>
                  <img className={styles['starter-avatar']} src={player.avatar} />
                </div>
              )
            }

            {
              isShowFieldDroper ? null :
              [
                <span key="name">{player.name}</span>,
                <span key="pos">
                  <span className={styles['player-number']}>{player.number}</span>
                  <PositionSelector
                    value={position}
                    onChange={e => dispatch({
                      type: 'changePosition',
                      data: {
                        playerId: player.id,
                        newPosition: e.target.value
                      }
                    })}
                  />
                </span>
              ]
            }

          </div>
        </div>
      )
    )
  }
}


function PositionSelector(props) {
  let { value, onChange } = props
  return <select onChange={onChange} value={value}>
    { Object.keys(POSITION).map(pos => {
      return <option key={pos} value={pos}>
        { pos }
      </option>
    }) }
  </select>
}