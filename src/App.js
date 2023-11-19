import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import SellerPage from './components/seller-page';
import Header from './components/header';
import LoginCode from './components/loginCode';
import MyPage from './components/mypage';

function App() {
  return (
      <>
          <Header />
          <BrowserRouter>
              <Routes>
                  // '/'로 접근할 경우 Home 컴포넌트로 렌더링
                  <Route path='/' exact element={<Home />} />
                  <Route path='/home' element={<Home />} />
                  <Route path='/sell' element={<SellerPage />} />
                  <Route path='/login/kakaoLogin' element={<LoginCode />} />
                  <Route path='/mypage' element={<MyPage />} />
              </Routes>
          </BrowserRouter>
      </>

  );
}

export default App;