import React, { useState, useEffect, useRef } from 'react'
import BasePage from '../src/components/BasePage'
import BaseInput from '../src/components/BaseInput'

import ReactPlayer from 'react-player'
import * as socket from '../utils/socket'


let wasTriggerdByUser = true
let seeking = false
let Room = props => {
  const [inputValue, setInputValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  
  const player = useRef()
  const [playerURL, setPlayerURL] = useState({})
  const [playerIsPlaying, setPlayerIsPlaying] = useState(false)


  useEffect(() => {
    socket.connect()

    socket.getStatus(data => {
      wasTriggerdByUser = false
      if (data.time && data.action === 'PAUSE') seeking = true
      if (data.time) player.current.seekTo(data.time)
      setPlayerIsPlaying(data.action === 'PLAY')
    })
  
    socket.getMedia(url => {
      wasTriggerdByUser = false
      setPlayerURL(url)
      setInputValue(url)
      setPlayerIsPlaying(true)
    })
    return socket.disconnect
  }, [])


  function handleInput() {
    if(!ReactPlayer.canPlay(inputValue)) return setIsInvalid(true)

    socket.emitMedia(inputValue)
  }

  function togglePlayPause(action) {
    if(seeking) return seeking = false

    if(wasTriggerdByUser) socket.emitStatus({ action, time: player.current.getCurrentTime() })
    wasTriggerdByUser = true
  }





  return(
    <BasePage player>
      <h2 className="roomName">{props.room}</h2>

      <ReactPlayer
        ref={player}
        width="500px"
        height="305px"
        url={playerURL}
        playing={playerIsPlaying}
        controls
        onPlay={() => { togglePlayPause('PLAY') }}
        onPause={() => { togglePlayPause('PAUSE') }}
      />
  
      <BaseInput
        placeholder="Enter media URL"
        buttonIcon="play-circle"
        handleInput={handleInput}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isInvalid={isInvalid}
        setIsInvalid={setIsInvalid}
      />
    </BasePage>
  )
}


Room.getInitialProps = async ({ query }) => {
  return { room: query.room }
}



export default Room