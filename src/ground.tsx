import * as React from 'react'
const styles = require('./styles.less')
import { Starter, POSITION } from './entities'
import StarterItem from './starter'
import Field from './field'

export default function Ground(props) {
  let { isShowFieldDroper, starters, dispatch } = props

  return <div className={styles['ground']}>
    <div
      className={styles['field-wrap']}
      style={{visibility: isShowFieldDroper ? 'visible' : 'hidden'}}
    >
      {
        Object.keys(POSITION).map(key => {
          return <Field key={key} position={POSITION[key]} dispatch={dispatch} />
        })
      }
    </div>
    { 
      starters.map(starter => {
        const { player, left, top } = starter
        return <StarterItem
         key={player.id} data={starter} dispatch={dispatch}
         isShowFieldDroper={isShowFieldDroper} 
        />
      })
    }
  </div>
}