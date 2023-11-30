import React, {useEffect} from "react";
import styled from "styled-components";
import Button from "../styles/button";
import axios from "axios";
import loginHandler from "../../api/login/login";

const ButtonContainer = styled.div`
    margin: 10px 0;
`;

const AdminContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
    align-content: center;
    justify-content: center;
    text-align: center;
`;


function AdminMain() {

    useEffect(() => {

        console.log('AdminMain useEffect')

        // Fetch user data using accessToken
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            alert('로그인이 필요합니다.');
            loginHandler();

        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.get(process.env.REACT_APP_API_SERVER + 'sign/role', config)
            .then(response => {
                if (response.data !== 'ADMIN') {
                    alert('관리자 권한이 필요합니다.');
                    window.href.location = '/';

                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                alert('에러가 발생했습니다.');
                loginHandler();

            });

    }, []);

    return (
        <AdminContainer>
            <h1>관리자 페이지 (베타)</h1>
            <ButtonContainer>
                <Button onClick={() => window.location.href = '/admin/sell-requests'}>최초 주문 리스트</Button>
            </ButtonContainer>
            <ButtonContainer>
                <Button onClick={() => window.location.href = '/admin/bag-pending'}>리픽백 발송 후 대기중 주문 리스트</Button>
            </ButtonContainer>
            <ButtonContainer>
                <Button onClick={() => window.location.href = '/admin/bag-ready'}>리픽백 배출된 주문 리스트</Button>
            </ButtonContainer>
            <ButtonContainer>
                <Button onClick={() => window.location.href = '/admin/product-submit'}>상품 등록</Button>
            </ButtonContainer>
        </AdminContainer>
    );
}

export default AdminMain;