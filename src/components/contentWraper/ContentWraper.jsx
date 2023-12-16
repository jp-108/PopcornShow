import React from 'react'
import './style.scss'

function ContentWraper({children}) {
  return (
    <div className='contentWraper'>{children}</div>
  )
}

export default ContentWraper