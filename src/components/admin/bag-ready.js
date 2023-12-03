import React, {useEffect, useState} from 'react';
import axios from 'axios';
import loginHandler from "../../api/login/login";
import styled from 'styled-components';
import Button from '../styles/button';
import moment from "moment/moment";
import {Container} from '../styles/container';

const Text = styled.p`
`;

const Order = styled.div`
  width: 80%;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
`;

function AdminBagReady() {

    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {

        console.log('AdminBagPender useEffect')

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

        // 판매 요청 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/admin/bag_ready', config)
            .then((response) => {
                setOrderHistory(response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });

    }, []);


    const createBagPenderHandler = (orderNumber) => (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
        const data = {
            orderNumber: orderNumber,
            sellState: "DELIVERED",
        }

        axios.post(process.env.REACT_APP_API_SERVER + 'sell/admin/update', data, config)
            .then(response => {
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating order:', error);
            });
    }

    let count = 1;

    return (
        <Container>
            <h1>리픽백 배출 완료 주문 리스트</h1>
            <Text>총 주문 수: {orderHistory.length}개</Text>
            {orderHistory.map((order) => (
                <Order key={order.id}>
                    {count++}
                    <Text>주문 번호: {order.orderNumber}</Text>
                    <Text>이름: {order.name}</Text>
                    <Text>전화번호: {order.phoneNumber}</Text>
                    <Text>우편번호: {order.address.zipCode}</Text>
                    <Text>주소: {order.address.mainAddress}</Text>
                    <Text>상세주소: {order.address.detailAddress}</Text>
                    <Text>요청 내용: {order.requestDetail}</Text>
                    <Text>의류 수량: {order.productQuantity}</Text>
                    <Text>리픽백 수량: {order.bagQuantity}</Text>
                    <Text>신청일: {moment(order.createdDate).format('YYYY년 MM월 DD일 H시 m분')}</Text>
                    <Button onClick={createBagPenderHandler(order.orderNumber)}>리픽백 수거 신청 완료하기</Button>
                </Order>
            ))}
        </Container>
    );
}

export default AdminBagReady;