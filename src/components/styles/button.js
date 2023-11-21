import styled from "styled-components";

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }
`;

export default Button;