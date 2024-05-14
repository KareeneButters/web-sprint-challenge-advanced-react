import React from 'react'
import { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  function getXY() {
    const numRows = 3 
    const numCols = 3

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

    switch (direction) {
      case 'left':
        return  index % 3 === 0 ? index: index - 1; 
      case 'up':
        return index < 3 ? index: index - 3;
      case 'right':
        return (index - 2) % 3 === 0 ? index : index + 1;
      case 'down':
        return index > 5  ? index: index + 3;
      default:
        return index
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt, direction) {
    evt.preventDefault()

    const newIndex = getNextIndex(direction)

    setIndex(newIndex)
    setSteps(steps + 1)

    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    const { value, id } = evt.target

    switch (id) {
      case 'email':
        setEmail(value)
        break;

        default:
          break;
    }
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault()

    const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    setMessage("Please enter a valid email address.");
    return
  }
    const coordinates = getXY()

    const payload = {
      x: coordinates.x,
      y: coordinates.y,
      steps: steps,
      email: email,
    }
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
        throw new Error();
      })
      }
      return response.json();
      // Handle successful response if needed...
    })
    .then(data => {
      // Handle successful response
      setMessage(data.message);
      // Reset coordinates and steps
      setSteps(0);
      setIndex(initialIndex);
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error if needed...
    })
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
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
