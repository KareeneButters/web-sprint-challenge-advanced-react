import React from 'react'
import { useState } from 'react'

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
    const numRows = 3 
    const numCols = 3

    const x = index % numCols
    const y = Math.floor(index / numRows)
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
    const numRows = 3
    const numCols = 3

    const currentRow = Math.floor(index / numCols)
    const currentCol = index % numCols

    switch (direction) {
      case 'left':
        return currentCol > 0 ? index - 1 : index;
      case 'up':
        return currentRow > 0 ? index - numCols : index;
      case 'right':
        return currentCol < numCols - 1 ? index + 1 : index;
      case 'down':
        return currentRow < numRows - 1 ? index + numCols : index;
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

    setMessage(getXYMessage())
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
        throw new Error('Failed to submit the form');
      }
      // Handle successful response if needed...
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
        <h3 id="coordinates">{message}</h3>
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
        <h3 id="message"></h3>
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
