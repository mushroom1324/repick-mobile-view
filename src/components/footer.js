import styled from 'styled-components';
import React from "react";
import logo from '../assets/logo.svg';


const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
`;

const Info = styled.p`
  font-size: 14px;
  text-align: left;
`;

const CopyRight = styled.p`
  font-size: 10px;
  color: #888;
  text-align: center;
  margin-top: 20px;
`;

function Footer() {
    return (
        <Container>
            <Logo src={logo} alt="logo" />
            <Info>
                Repick | 대표 : 이도현 | 개인정보담당자 : 서찬혁 <br />
                메일: repick.official@gmail.com | 주소 : 서울 마포구 홍익대학교 산학협력단 Startup Lounge 1F (평일 9:00 - 17:00) | TEL : 010-2890-9773
            </Info>
            <CopyRight>
                Copyright (c) 2023 Repick 리픽 All rights Reserved.
            </CopyRight>
        </Container>
    );
}

export default Footer;
