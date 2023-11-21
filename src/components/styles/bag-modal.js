import styled from "styled-components";

export const BagPendingModalWrapper = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 300px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export const BagPendingModalTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
  text-align: center;
`;

export const BagPendingModalContent = styled.p`
  margin-bottom: 20px;
  color: #666;
  font-size: 1em;
  text-align: center;
`;

export const BagPendingCloseButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;