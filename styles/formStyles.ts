import { css } from '@emotion/react';

export const formStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
  form {
    display: flex;
    flex-direction: column;
    flex-direction: center;
    align-items: center;
    margin: 50px;
    border: 1px solid #b9e25e;
    border-radius: 16px;
    padding: 24px;
    gap: 8px;
  }
  input {
    background-color: #b9e25e;
    color: black;
  }
  button {
    margin: 5px;
    padding: 5px;
    border: 1px solid #b9e25e;
    background-color: black;
    color: #b9e25e;
    transition: all linear 0.2s;
  }
  button:hover {
    background-color: #b9e25e;
    color: black;
  }
`;
