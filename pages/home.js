import React, { useState } from 'react'
import { Router } from '../utils/routes'
import slugify from 'slugify'

import BasePage from '../src/components/BasePage'
import BaseInput from '../src/components/BaseInput'

export default props => {
  const [inputValue, setInputValue] = useState('')
  
  function handleInput() {
    let slug = slugify(inputValue, { lower: true, remove: /[^\w ]+/g })
    let room = slug !== '' ? slug : Math.random().toString(36).substring(7)

    Router.pushRoute('room', { room })
  }



  return(
    <BasePage>
      <h1 className="mainTitle">WatchWith</h1>
      <h2 className="subtitle">Watch media from Youtube, Twitch, Facebook, direct files and more synchronously</h2>

      <BaseInput
        placeholder="Enter room name"
        buttonIcon="check-circle"
        handleInput={handleInput}
        inputValue={inputValue}
        setInputValue={setInputValue}
      >
        <small className="form-text text-muted">Leave empty to generate one</small>
      </BaseInput>
    </BasePage>
  )
}