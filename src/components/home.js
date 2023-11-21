import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import banner1 from '../assets/landing/1.png';
import banner2 from '../assets/landing/2.png';
import banner3 from '../assets/landing/3.png';
import banner4 from '../assets/landing/4.png';
import banner5 from '../assets/landing/5.png';
import cta from '../assets/landing/cta.png';


const BannerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const BannerImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  margin-bottom: 50px;
  
`;

const BannerImage2 = styled.img`
    width: 80%;
    height: auto;
    margin-bottom: 50px;
`;

const BannerImage3 = styled.img`
    width: 80%;
    height: auto;
    margin-bottom: 50px;
`;

const BannerImage4 = styled.img`
    width: 100%;
    height: auto;
    margin-bottom: 50px;
`;

const BannerImage5 = styled.img`
    width: 100%;
    height: auto;
    margin-bottom: 50px;
`;

const CTAButton = styled.img`
  position: fixed;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CTAButtonFixed = styled.img`
  bottom: -100px;
  width: 100%;

  @media (min-width: 768px) {
    display: none;
  }
`;

const DesktopButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopButton = styled.button`
  padding: 20px 40%;
  margin-bottom: 50px;

  font-size: 24px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;

function Home() {
    const handleScroll = () => {
        if (window.scrollY < 1969.5) {
            document.getElementById("cta").style.bottom = "0px";
            document.getElementById("cta-fixed").style.bottom = "0px";

        } else {
            document.getElementById("cta").style.bottom = "-100px";
            document.getElementById("cta-fixed").style.bottom = "-100px";
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClickBtn = () => {
        window.location.href = "/closet";
    };

    return (
        <>
            {window.innerWidth < 768 ? (
                <BannerContainer>
                    <BannerImage src={banner1} alt="Banner 1" />
                    <BannerImage2 src={banner2} alt="Banner 2" />
                    <BannerImage3 src={banner3} alt="Banner 3" />
                    <BannerImage4 src={banner4} alt="Banner 4" />
                </BannerContainer>
            ) : (
                <BannerImage5 src={banner5} alt="Banner 5" />
            )}
            <CTAButton id={"cta"} src={cta} onClick={handleClickBtn} alt="CTA" />
            <CTAButtonFixed id={"cta-fixed"} src={cta} onClick={handleClickBtn} alt="CTA" />
            <DesktopButtonContainer>
                <DesktopButton onClick={handleClickBtn}>옷장 신청하러 가기</DesktopButton>
            </DesktopButtonContainer>
        </>
    );
}


export default Home;