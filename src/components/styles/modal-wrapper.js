import styled from "styled-components";

export const ModalWrapper = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  justify-content: center;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  margin-top: 0;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

export const CloseButton = styled.button`
  padding: 8px;
  cursor: pointer;
  background-color: #ccc;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

