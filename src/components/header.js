import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import loginHandler from '../api/login/login';
import logoutHandler from '../api/login/logout';
import { CSSTransition } from 'react-transition-group';
import logo from '../assets/logo.svg';
import kakao_logo from '../assets/kakao_login_small.png';

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const nicknameFromStorage = localStorage.getItem('nickname');
        if (nicknameFromStorage) {
            setNickname(nicknameFromStorage);
        }

    }, []);

    const handleMyPageClick = () => {
        setShowMenu(!showMenu);
    };

    return (
        <HeaderComp className="header">
            <div className="header__left">
                <img src={logo} alt="logo" onClick={() => window.location.href = '/'} />
            </div>
            <div className="header__right">
                {nickname
                    ? <button onClick={handleMyPageClick}>{nickname}</button>
                    : <img src={kakao_logo} alt="login" onClick={loginHandler} />
                }
            </div>
            <CSSTransition in={showMenu} timeout={200} classNames="menu" unmountOnExit>
                <Menu>
                    <MenuItem onClick={() => window.location.href = '/mypage'}>마이페이지</MenuItem>
                    <MenuItem onClick={() => window.location.href = '/closet'}>옷장 정리</MenuItem>
                    <MenuItem onClick={() => window.location.href = 'https://repick-official.oopy.io/574d9964-a932-444b-8c16-a88403984e5d'}>자주 묻는 질문</MenuItem>
                    <MenuItem onClick={logoutHandler}>로그아웃</MenuItem>
                </Menu>
            </CSSTransition>
        </HeaderComp>
    );
}

const HeaderComp = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  border-bottom: 1px solid #eaeaea;

  .header__left img {
    height: 40px;
  }

  .header__right button {
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

  .menu-enter {
    position: absolute;
    right: 0;
    transform: translateX(100%);
    transition: transform 200ms ease-out;
  }

  .menu-enter-active {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }

  .menu-exit {
    position: absolute;
    right: 0;
    transform: translateX(0);
    transition: transform 200ms ease-in;
  }

  .menu-exit-active {
    transform: translateX(100%);
    transition: transform 200ms ease-in;
  }
`;

const Menu = styled.div`
    position: absolute;
    top: 80px;
    right: 0;
    width: 200px;
    background-color: white;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    padding: 20px;
`;

const MenuItem = styled.p`
    margin-bottom: 10px;
    cursor: pointer;
    
    &:hover {
        color: #eaeaea;
    }
`;

export default Header;
