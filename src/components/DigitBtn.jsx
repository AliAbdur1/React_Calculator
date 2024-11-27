import { ACTIONS } from '../App'; // Importing ACTIONS from the App component

// This functional component represents a button for digits (e.g., 0-9, '.')
export default function DigitBtn({ digit, dispatch }) {
  return (
    // Button element that triggers a dispatch action when clicked
    <button
      onClick={() =>
        // Dispatching the ADD_DIGIT action to update the state in the reducer
        dispatch({
          type: ACTIONS.ADD_DIGIT, // Action type: adds a digit to the current operand
          payload: { digit }, // Payload: the specific digit (e.g., '1', '2', '.', etc.)
        })
      }
    >
      {/* The button's label is the digit */}
      {digit}
    </button>
  );
}
