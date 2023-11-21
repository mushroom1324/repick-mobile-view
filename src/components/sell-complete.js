import React from "react";
import styled from "styled-components";
import Confetti from "react-confetti";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 57vh;
`;

const Message = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SellComplete = () => {

    const handleButtonClick = () => {
        window.location.href = "/closet";
    };

    return (
        <Container>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
            />
            <Message>신청이 완료되었습니다!</Message>
            <Button onClick={handleButtonClick}>옷장 정리 현황 보기</Button>
        </Container>
    );
};

export default SellComplete;
