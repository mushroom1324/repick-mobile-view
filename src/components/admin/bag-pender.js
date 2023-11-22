import React, {useEffect, useState} from 'react';
import axios from 'axios';
import loginHandler from "../../api/login/login";
import styled from 'styled-components';
import Button from '../styles/button';

const Text = styled.p`
`;

const Order = styled.div`
  width: 80%;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
`;

function AdminBagPender() {

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
                window.href.location = '/';
            });

        // 판매 요청 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/admin/requested', config)
            .then(response => {
                setOrderHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });

    });


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
            sellState: "BAG_PENDING",
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

    return (
        <>
            {orderHistory.map((order) => (
                <Order key={order.id}>
                    <Text>주문 번호: {order.orderNumber}</Text>
                    <Text>이름: {order.name}</Text>
                    <Text>전화번호: {order.phoneNumber}</Text>
                    <Text>주소: {order.address.mainAddress} {order.address.detailAddress}</Text>
                    <Text>우편번호: {order.address.zipCode}</Text>
                    <Text>요청 내용: {order.requestDetail}</Text>
                    <Text>판매 상태: {order.sellState}</Text>
                    <Text>의류 수량: {order.productQuantity}</Text>
                    <Text>리픽백 수량: {order.bagQuantity}</Text>
                    <Button onClick={createBagPenderHandler(order.orderNumber)}>리픽백 배송 완료</Button>
                </Order>
            ))}
        </>
    );
}

export default AdminBagPender;