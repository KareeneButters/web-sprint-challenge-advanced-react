import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  function getXY() {

    let x  
    let y  

    if(index === 0 || index === 3 || index === 6){
      x = 1
    }
    else if(index === 1 || index === 4|| index === 7 ){
      x = 2
    }
    else{
      x = 3
    }

    if(index < 3){
      y = 1
    }
    else if(index < 6) {
      y = 2
    }
    else{
      y = 3
    }
    
    return { x, y}
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
     
  }
  
  function getXYMessage() {
    const { x, y } = getXY()
    return `Coordinates (${x}, ${y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getNextIndex(direction) {
    let newIndex = index;
  
    switch (direction) {
      case 'left':
        newIndex = index % 3 === 0 ? index : index - 1;
        break;
      case 'up':
        newIndex = index < 3 ? index : index - 3;
        break;
      case 'right':
        newIndex = (index - 2) % 3 === 0 ? index : index + 1;
        break;
      case 'down':
        newIndex = index > 5 ? index : index + 3;
        break;
      default:
        break;
    }
  
    return { newIndex, isValidMove: newIndex !== index };
  }
  
  function move(evt, direction) {
    evt.preventDefault();
  
    const { newIndex, isValidMove } = getNextIndex(direction);
  
    if (!isValidMove) {
      switch (direction) {
        case 'left':
          setMessage("You can't go left");
          break;
        case 'up':
          setMessage("You can't go up");
          break;
        case 'right':
          setMessage("You can't go right");
          break;
        case 'down':
          setMessage("You can't go down");
          break;
        default:
          break;
      }
    } else {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    }
  }
 
  function onChange(evt) {
    const { value } = evt.target
    setEmail(value)
    }
    // You will need this to update the value of the input.
  

  function onSubmit(evt) {
    evt.preventDefault()

    // if (email === "foo@bar.baz") {
    //   setMessage("foo@bar.baz failure");
    //   setEmail(initialEmail)
    //   return;
    // }

   
    const {x,y} = getXY()
    let message
    axios.post('http://localhost:9000/api/result', {email, steps, x, y})

    .then(response => {
     message = response.data.message
    })
    .catch(error => {
      message = error.response.data.message
      // Handle error if needed...
      console.log(error.response)
    })
    .finally (() => {
      setMessage(message)
      setEmail(initialEmail)
    })
    // Use a POST request to send a payload to the server.
   
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps == 1 ? '' :'s'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(evt) => move(evt, 'left')}>LEFT</button>
        <button id="up" onClick={(evt) => move(evt, 'up')}>UP</button>
        <button id="right" onClick={(evt) => move(evt, 'right')}>RIGHT</button>
        <button id="down" onClick={(evt) => move(evt, 'down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}