import React from 'react'
import { Button, InputGroup, InputGroupAddon, FormGroup, FormInput } from 'shards-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => (
  <FormGroup className="baseInput">
    <InputGroup>
      <FormInput
        type="text"
        placeholder={props.placeholder}
        value={props.inputValue}
        onChange={e => {
          if(props.isInvalid) props.setIsInvalid(false)
          props.setInputValue(e.target.value)
        }}
        onKeyDown={e => {
          if(e.keyCode === 13) props.handleInput()
        }}
        invalid={props.isInvalid}
      ></FormInput>

      <InputGroupAddon type="append">
        <Button
          className="baseInputSide"
          onClick={props.handleInput}
        >
          <FontAwesomeIcon icon={props.buttonIcon} />
        </Button>
      </InputGroupAddon>
    </InputGroup>
      
    {props.children}
  </FormGroup>
)