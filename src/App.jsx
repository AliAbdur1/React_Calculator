import { useReducer } from 'react'; // Importing useReducer for state management
import DigitBtn from './components/DigitBtn'; // Component for digit buttons
import OperationBtn from './components/OperationBtn'; // Component for operation buttons
import './App.css'; // Importing styling
import './styles.css'; // Additional styles

// Defining the different action types used in the reducer
export const ACTIONS = {
  ADD_DIGIT: 'add-digit', // Adding a digit to the current operand
  CHOOSE_OPERATION: 'choose-operation', // Choosing an operation (+, -, etc.)
  CLEAR: 'clear', // Clearing all values
  DELETE_DIGIT: 'delete-digit', // Deleting the last digit
  EVALUATE: 'evaluate', // Evaluating the current expression
};

// Reducer function to manage the state of the calculator
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // If an operation was just evaluated, overwrite the current operand
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // Prevent adding multiple leading zeros
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      // Prevent adding multiple decimal points
      if (payload.digit === '.' && state.currentOperand?.includes('.')) {
        return state;
      }
      // Add the digit to the current operand
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      // Do nothing if no operands exist
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // Allow changing the operation if an operation is already selected
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      // Move the current operand to the previous operand and set the operation
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // Evaluate the current expression and prepare for the next operation
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      // Reset the state completely
      return {};

    case ACTIONS.DELETE_DIGIT:
      // If the result was just evaluated, reset the current operand
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      // Do nothing if there's no current operand
      if (state.currentOperand == null) return state;
      // Remove the last character of the current operand or set it to null if only one character remains
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      // If any of the necessary values are missing, do nothing
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      // Evaluate the expression and set the result as the current operand
      return {
        ...state,
        overwrite: true, // Flag to indicate that the result should be replaced
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state; // Return the current state if no matching action is found
  }
}

// Helper function to evaluate the current expression
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand); // Convert previous operand to a number
  const current = parseFloat(currentOperand); // Convert current operand to a number
  if (isNaN(prev) || isNaN(current)) return ''; // Return empty string if invalid inputs
  let computation = ''; // Variable to store the result
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
    default:
      break;
  }
  return computation.toString(); // Convert result to string
}

// Formatter to display large numbers in a readable format
const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

// Helper function to format operands (handles decimals and integers)
function formatOperand(operand) {
  if (operand == null) return; // Return nothing if operand is null
  const [integer, decimal] = operand.split('.'); // Split into integer and decimal parts
  if (decimal == null) return INTEGER_FORMATTER.format(integer); // Format integer if no decimal
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // Format both parts
}

// Main App component
function App() {
  // State managed by useReducer
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className='calculator-grid'>
        {/* Display area for operands and operation */}
        <div className='output'>
          <div className='previous-operand'>
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>

        {/* Buttons for calculator functionality */}
        <button
          className='span-two'
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationBtn operation='÷' dispatch={dispatch} />
        <DigitBtn digit='1' dispatch={dispatch} />
        <DigitBtn digit='2' dispatch={dispatch} />
        <DigitBtn digit='3' dispatch={dispatch} />
        <OperationBtn operation='*' dispatch={dispatch} />
        <DigitBtn digit='4' dispatch={dispatch} />
        <DigitBtn digit='5' dispatch={dispatch} />
        <DigitBtn digit='6' dispatch={dispatch} />
        <OperationBtn operation='+' dispatch={dispatch} />
        <DigitBtn digit='7' dispatch={dispatch} />
        <DigitBtn digit='8' dispatch={dispatch} />
        <DigitBtn digit='9' dispatch={dispatch} />
        <OperationBtn operation='-' dispatch={dispatch} />
        <DigitBtn digit='.' dispatch={dispatch} />
        <DigitBtn digit='0' dispatch={dispatch} />
        <button
          className='span-two'
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
