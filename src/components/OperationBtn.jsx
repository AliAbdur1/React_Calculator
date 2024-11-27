import { ACTIONS } from '../App'; // Importing the ACTIONS object from the parent App component

// This functional component represents a button for operations like '+', '-', '*', or '÷'
export default function OperationBtn({ dispatch, operation }) {
  return (
    // Button element that triggers a dispatch action when clicked
    <button
      onClick={() =>
        // Dispatching the CHOOSE_OPERATION action to update the state in the reducer
        dispatch({
          type: ACTIONS.CHOOSE_OPERATION, // Action type: selects an operation
          payload: { operation }, // Payload: the specific operation (e.g., '+', '-', etc.)
        })
      }
    >
      {/* The button's label is the operation symbol */}
      {operation}
    </button>
  );
}
