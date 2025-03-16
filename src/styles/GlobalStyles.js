import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #f8c8dc; /* Pink */
    --secondary-color: #c8e6f8; /* Light Blue */
    --tertiary-color: #f8e6c8; /* Light Orange */
    --quaternary-color: #d8f8c8; /* Light Green */
    --background-color: #fff9fb; /* Very Light Pink */
    --text-color: #5a5a5a; /* Dark Gray */
    --shadow-color: rgba(0, 0, 0, 0.1);
    --completed-color: #c8f8d8; /* Light Mint */
    --error-color: #f8c8c8; /* Light Red */
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s ease-in-out;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  input, textarea {
    font-family: 'Poppins', sans-serif;
    border: 1px solid var(--shadow-color);
    border-radius: 8px;
    padding: 10px;
    outline: none;
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(248, 200, 220, 0.3);
    }
  }
`;

export default GlobalStyles;
