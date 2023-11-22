import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Closet from './components/closet';
import SellerForm from './components/sell';
import SellComplete from './components/sell-complete';
import SettlementForm from './components/settlement';
import SettlementComplete from './components/settlement-complete';
import Header from './components/header';
import LoginCode from './components/login-code';
import MyPage from './components/mypage';
import Footer from './components/footer';

function App() {
    return (
        <div>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path='/' exact element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/closet' element={<Closet />} />
                    <Route path='/login/kakaoLogin' element={<LoginCode />} />
                    <Route path='/mypage' element={<MyPage />} />
                    <Route path='/sell' element={<SellerForm />} />
                    <Route path='/sell-complete' element={<SellComplete />} />
                    <Route path='/settlement' element={<SettlementForm />} />
                    <Route path='/settlement-complete' element={<SettlementComplete />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
);
}

export default App;