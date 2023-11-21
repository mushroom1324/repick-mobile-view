import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from './styles/title';
import Label from './styles/label';
import FormContainer from './styles/form-container';
import Input from './styles/input';
import Button from './styles/button';

const SettlementForm = () => {
    const [name, setName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.get('https://repick.seoul.kr/api/sign/userInfo', config)
            .then(response => {
                if (response.data.name) {
                    setName(response.data.name);
                }
                if (response.data.bank) {
                    setBankName(response.data.bank.bankName);
                    setAccountNumber(response.data.bank.accountNumber);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const soldProduct = JSON.parse(localStorage.getItem('soldProduct'));

        console.log('soldProduct:', soldProduct)

        const productIds = soldProduct.map(product => product.productId);

        axios.post('https://repick.seoul.kr/api/sell/settlement', { productIds }, config)
            .then(response => {
                console.log('Settlement Request Success:', response.data);
                window.location.href = '/settlement-complete';
            })
            .catch(error => {
                console.error('Settlement Request Error:', error);
                // 에러 처리 로직
            });
    };

    return (
        <FormContainer>
            <Title>정산 계좌 정보 입력</Title>
            <Label htmlFor="name">예금주</Label>
            <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Label htmlFor="bankName">은행</Label>
            <Input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
            />
            <Label htmlFor="accountNumber">계좌번호</Label>
            <Input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
            />
            <Button onClick={handleSubmit}>정산 신청하기</Button>
        </FormContainer>
    );
};


export default SettlementForm;