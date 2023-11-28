import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Closet from './components/closet';
import SellerForm from './components/sell';
import SellComplete from './components/sell-complete';
import SettlementForm from './components/settlement';
import SettlementComplete from './components/settlement-complete';
import LoginCode from './components/login-code';
import MyPage from './components/mypage';

import Header from './components/header';
import Footer from './components/footer';

import AdminMain from './components/admin/admin-main';
import AdminProductSubmitForm from "./components/admin/product-submit";
import AdminBagPender from "./components/admin/bag-pender";
import AdminBagReady from "./components/admin/bag-ready";

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
                    <Route path='/admin' element={<AdminMain />} />
                    <Route path='/admin/product-submit' element={<AdminProductSubmitForm />} />
                    <Route path='/admin/sell-requests' element={<AdminBagPender />} />
                    <Route path='/admin/bag-ready' element={<AdminBagReady />} />
                </Routes>
            </BrowserRouter>
            <Footer />  
        </div>
);
}

export default App;