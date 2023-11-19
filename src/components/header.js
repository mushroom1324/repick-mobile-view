import React from 'react';
import styled from 'styled-components';
import loginHandler from '../api/login/login';
import { useEffect } from 'react';


/*
헤더 컴포넌트
포함 : 왼쪽 로고, 오른쪽 로그인/회원가입 버튼
 */

function Header() {
    function routeHandler() {
        window.location.href = '/';
    }

    useEffect(() => {
        const loginButton = document.querySelector('.header__right');
        const nickname = localStorage.getItem('nickname');
        if (nickname) {
            loginButton.innerHTML = `<button class="myPageButton">${nickname}</button>`;
            const myPageButton = document.querySelector('.myPageButton');
            myPageButton.addEventListener('click', () => {
                window.location.href = '/mypage';
            });
        }
    }, []);

    return (
        <HeaderComp className="header">
            <div className="header__left">
                <img src="https://github.com/Repick-official/repick-front/assets/76674422/30affaf1-3276-4eda-ad5f-38d54053f99a" alt="logo" onClick={routeHandler}/>
            </div>
            <div className="header__right">
                <img src="https://github.com/Repick-official/repick-front/assets/76674422/3f758b40-05b1-4a94-9b7c-66d324154ae4" alt="login" onClick={loginHandler}/>
            </div>
        </HeaderComp>
    );
}

const HeaderComp = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 80px;
    border-bottom: 1px solid #eaeaea;
    
    .header__left {
        img {
            height: 40px;
        }
    }
    
    .header__right {
        button {
            margin-left: 10px;
            padding: 5px 10px;
            border: 1px solid #eaeaea;
            border-radius: 5px;
            background-color: #fff;
            font-size: 14px;
            cursor: pointer;
            
            &:hover {
                background-color: #eaeaea;
            }
        }
    }
`;


export default Header;