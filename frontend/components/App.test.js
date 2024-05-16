import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional';
import '@testing-library/jest-dom/extend-expect';

describe('AppFunctional component', () => {
 

  test('initial email state is an empty string', () => {
    render(<AppFunctional />);
    const emailInput = screen.getByPlaceholderText('type email');
    expect(emailInput.value).toBe('');
  });

  test('initial steps state is 0', () => {
    render(<AppFunctional />);
    const stepsElement = screen.getByText(/You moved/);
    expect(stepsElement.textContent).toBe('You moved 0 times');
  });

  test('initial index state is 4', () => {
    render(<AppFunctional />);
    const bSquare = screen.getByText('B');
    expect(bSquare).toHaveClass('active');
  });

  test('move function updates index state correctly when moving left', () => {
    render(<AppFunctional />);
    const leftButton = screen.getByText('LEFT');
    fireEvent.click(leftButton);
    const bSquare = screen.getByText('B');
    expect(bSquare).toHaveClass('active');
  });

  test('clicking LEFT button moves "B" left in the grid', () => {
    render(<AppFunctional />);
    const bSquare = screen.getByText('B'); // Find the element that contains the "B" character
    const initialIndex = parseInt(bSquare.parentNode.getAttribute('data-index')); // Get the initial index of "B"
    
    const leftButton = screen.getByText('LEFT'); // Find the LEFT button
    fireEvent.click(leftButton); // Click the LEFT button
  
    const updatedBSquare = screen.getByText('B'); // Find the updated element that contains the "B" character
    const updatedIndex = parseInt(updatedBSquare.parentNode.getAttribute('data-index')); // Get the updated index of "B"
  
    // Assert that the updated index is one less than the initial index, indicating that "B" moved left
    expect(updatedIndex).toBe(initialIndex - 1);
  });
});
