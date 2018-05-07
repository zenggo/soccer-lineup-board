import { GlobalState, Player, Starter, ItemTypes, POSITION } from './entities'

export default class Reducers {
  
  static showLeftDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowLeftDroper: true
    }
  }
  static hideLeftDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowLeftDroper: false
    }
  }
  static showRightDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowRightDroper: true
    }
  }
  static hideRightDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowRightDroper: false
    }
  }
  static showFieldDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowFieldDroper: true
    }
  }
  static hideFieldDroper(state: GlobalState): GlobalState {
    return {
      ...state,
      isShowFieldDroper: false
    }
  }

  // middle ground
  static addStarter(state: GlobalState, data: any): GlobalState {
    let { type, item, left, top, position } = data
    let { players, starters, substitutes } = state

    if (starters.length >= 11) {
      alert('已经11人了') // TODO:
      return null
    }

    if (type == ItemTypes.player) { // 从左侧面板加入
      let playerIdx = players.findIndex(p => p.id === item.id)
      let newPlayers = [...players.slice(0, playerIdx), ...players.slice(playerIdx + 1)]
      let newStarters = starters.concat([{
        player: {...item},
        left, top,
        position
      }])
      return {
        ...state,
        players: newPlayers,
        starters: newStarters
      }
    } else if (type == ItemTypes.substitute) { // 从右侧替补加入
      let substituteIdx = substitutes.findIndex(s => s.player.id === item.player.id)
      let newSubstitutes = [...substitutes.slice(0, substituteIdx), ...substitutes.slice(substituteIdx + 1)]
      let newStarters = starters.concat([{
        player: {...item.player},
        left, top,
        position
      }])
      return {
        ...state,
        substitutes: newSubstitutes,
        starters: newStarters
      }
    }
  }

  static moveStarter(state: GlobalState, data: any): GlobalState {
    let { starter, newLeft, newTop, position } = data
    let starters: Starter[] = state.starters
    let starterIdx = starters.findIndex(s => s.player.id == starter.player.id)
    let newStarter = {
      ...starter,
      left: newLeft,
      top: newTop,
      position
    }
    let newStarters = [...starters.slice(0, starterIdx), newStarter, ...starters.slice(starterIdx + 1)]
    return {
      ...state,
      starters: newStarters
    }
  }

  static replaceStarter(state: GlobalState, data: any): GlobalState {
    let { type, item } = data, target: Starter = data.target
    let { players, starters, substitutes } = state
    let targetIdx = starters.findIndex(s => s.player.id == target.player.id)
    if (type == ItemTypes.player) { // 从左侧面板移入
      let playerIdx = players.findIndex(p => p.id == item.id)
      let newPlayers = [...players.slice(0, playerIdx), {...target.player}, ...players.slice(playerIdx + 1)]
      let newStarters = [...starters.slice(0, targetIdx), {
        ...target,
        player: { ...item }
      }, ...starters.slice(targetIdx + 1)]
      return {
        ...state,
        players: newPlayers,
        starters: newStarters
      }
    } else if (type == ItemTypes.substitute) { // 从右侧替补移入
      let substituteIdx = substitutes.findIndex(s => s.player.id == item.player.id)
      let newSubstitutes = [...substitutes.slice(0, substituteIdx), { player: {...target.player} }, ...substitutes.slice(substituteIdx + 1)]
      let newStarters = [...starters.slice(0, targetIdx), {
        ...target,
        player: { ...item.player }
      }, ...starters.slice(targetIdx + 1)]
      return {
        ...state,
        substitutes: newSubstitutes,
        starters: newStarters
      }
    } else if (type == ItemTypes.starter && item.player.id !== target.player.id) { // 首发替换位置
      let starterIdx = starters.findIndex(s => s.player.id == item.player.id)
      let newStarters = starters.map((s, idx) => {
        if (idx == targetIdx) {
          return {
            ...target,
            player: {
              ...item.player
            }
          }
        } else if (idx == starterIdx) {
          return {
            ...item,
            player: {
              ...target.player
            }
          }
        } else {
          return s
        }
      })
      return {
        ...state,
        starters: newStarters
      }
    }
  }

  static changePosition(state: GlobalState, data: any): GlobalState {
    let { playerId, newPosition } = data
    let { starters } = state
    let starterIdx = starters.findIndex(s => s.player.id == playerId)
    let newStarter = {
      ...starters[starterIdx],
      position: newPosition
    }
    return {
      ...state,
      starters: [
        ...starters.slice(0, starterIdx),
        newStarter,
        ...starters.slice(starterIdx + 1)
      ]
    }
  }

  // left panel
  static addPlayer(state: GlobalState, data: any): GlobalState {
    let { type, item } = data
    let { players, starters, substitutes } = state
    if (type == ItemTypes.substitute) { // 从替补移过来
      let substituteIdx = substitutes.findIndex(s => s.player.id == item.player.id)
      let newSubstitutes = [...substitutes.slice(0, substituteIdx), ...substitutes.slice(substituteIdx + 1)]
      let newPlayers = players.concat([{
        ...item.player
      }])
      return {
        ...state,
        players: newPlayers,
        substitutes: newSubstitutes
      }
    } else if (type == ItemTypes.starter) { // 从首发移过来
      let starterIdx = starters.findIndex(s => s.player.id == item.player.id)
      let newStarters = [...starters.slice(0, starterIdx), ...starters.slice(starterIdx + 1)]
      let newPlayers = players.concat([{
        ...item.player
      }])
      return {
        ...state,
        players: newPlayers,
        starters: newStarters
      }
    }
  }

  // right panel
  static addSubstitute(state: GlobalState, data: any): GlobalState {
    let { type, item } = data
    let { players, starters, substitutes } = state
    if (type == ItemTypes.player) { // 从左侧列表移过来
      let playerIdx = players.findIndex(p => p.id == item.id)
      let newPlayers = [...players.slice(0, playerIdx), ...players.slice(playerIdx + 1)]
      let newSubstitutes = substitutes.concat([{
        player: {...item}
      }])
      return {
        ...state,
        players: newPlayers,
        substitutes: newSubstitutes
      }
    } else if (type == ItemTypes.starter) { // 从首发移过来
      let starterIdx = starters.findIndex(s => s.player.id == item.player.id)
      let newStarters = [...starters.slice(0, starterIdx), ...starters.slice(starterIdx + 1)]
      let newSubstitutes = substitutes.concat([{
        player: {...item.player}
      }])
      return {
        ...state,
        starters: newStarters,
        substitutes: newSubstitutes
      }
    }
  }

}