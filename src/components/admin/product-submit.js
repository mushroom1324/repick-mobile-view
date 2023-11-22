import React, {useEffect, useState} from 'react';
import axios from 'axios';
import loginHandler from "../../api/login/login";
import styled from 'styled-components';
import Button from '../styles/button';

const Text = styled.p`
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80%;
  box-sizing: border-box;
`;

const Order = styled.div`
  width: 80%;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function AdminProductSubmit() {

    const [mainImageFile, setMainImageFile] = useState(null);
    const [detailImageFiles, setDetailImageFiles] = useState([null]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [request, setRequest] = useState({
        name: '',
        detail: '',
        size: '',
        sellOrderNumber: '',
    });

    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
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
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/admin/delivered', config)
            .then(response => {
                setOrderHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });

    });

    const handleFileChange = (e, index) => {
        if (e.target.files) {
            if (e.target.name === 'mainImageFile') {
                setMainImageFile(e.target.files[0]);
            } else if (e.target.name === 'detailImageFiles') {
                const newDetailImageFiles = [...detailImageFiles];
                newDetailImageFiles[index] = e.target.files[0];
                setDetailImageFiles(newDetailImageFiles);
            }
        }
    };

    const addImageInput = () => {
        setDetailImageFiles(prev => [...prev, null]);
    };

    const removeImageInput = (index) => {
        setDetailImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const addCategoryId = () => {
        setCategoryIds(prev => [...prev, '']);
    };

    const removeCategoryId = (index) => {
        setCategoryIds(prev => prev.filter((_, i) => i !== index));
    };

    const handleCategoryIdChange = (e, index) => {
        const newCategoryIds = [...categoryIds];
        newCategoryIds[index] = Number(e.target.value);
        setCategoryIds(newCategoryIds);
    };

    const handleInputChange = (e) => {
        setRequest({...request, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');

        console.log(categoryIds);

        const formData = new FormData();
        formData.append('mainImageFile', mainImageFile);
        detailImageFiles.forEach((file, index) => {
            formData.append(`detailImageFiles[${index}]`, file);
        });
        formData.append('categoryIds', JSON.stringify(categoryIds));
        Object.keys(request).forEach(key => {
            formData.append(key, request[key]);
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            }
        }


        axios.post(process.env.REACT_APP_API_SERVER + 'products/register', formData, config)
            .then(response => {
                if (response.status === 200) {
                    alert('상품 등록에 성공했습니다.');
                } else {
                    alert('상품 등록에 실패했습니다.');
                }
            })
            .catch(error => {
                console.log(formData.get('request'));
                console.error('Error:', error);
                alert('상품 등록에 실패했습니다.');
            });

    };

    return (
        <Form onSubmit={handleSubmit}>
            <Text>대표 이미지</Text>
            <Input type="file" name="mainImageFile" onChange={handleFileChange} />
            <Text>상세 이미지</Text>
            {detailImageFiles.map((_, index) => (
                <div key={index}>
                    <Input type="file" name="detailImageFiles" onChange={(e) => handleFileChange(e, index)} />
                    <div>
                        <Button type="button" onClick={() => addImageInput()}>+</Button>
                        {detailImageFiles.length > 1 && <Button type="button" onClick={() => removeImageInput(index)}>-</Button>}
                    </div>
                </div>
            ))}
            <Text>카테고리</Text>
            <Text>카테고리</Text>
            {categoryIds.map((_, index) => (
                <div key={index}>
                    <RadioWrapper>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={1} onChange={(e) => handleCategoryIdChange(e, index)} />티셔츠</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={2} onChange={(e) => handleCategoryIdChange(e, index)} />블라우스/셔츠</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={3} onChange={(e) => handleCategoryIdChange(e, index)} />스웨터/니트</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={4} onChange={(e) => handleCategoryIdChange(e, index)} />후드/스웨터 셔츠</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={5} onChange={(e) => handleCategoryIdChange(e, index)} />재킷/블레이저</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={6} onChange={(e) => handleCategoryIdChange(e, index)} />드레스/원피스</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={7} onChange={(e) => handleCategoryIdChange(e, index)} />팬츠</label>
                        <label><input type="radio" name={`categoryIds[${index}]`} value={8} onChange={(e) => handleCategoryIdChange(e, index)} />스커트</label>
                    </RadioWrapper>
                    <button type="button" onClick={() => addCategoryId()}>+</button>
                    {categoryIds.length > 1 && <button type="button" onClick={() => removeCategoryId(index)}>-</button>}
                </div>
            ))}
            <Text>상품명</Text>
            <Input type="text" name="name" onChange={handleInputChange} value={request.name} />
            <Text>상품 설명</Text>
            <Input type="text" name="detail" onChange={handleInputChange} value={request.detail} />
            <Text>사이즈</Text>
            <Input type="text" name="size" onChange={handleInputChange} value={request.size} />
            <Text>판매 주문 번호</Text>
            <Input type="text" name="sellOrderNumber" onChange={handleInputChange} value={request.sellOrderNumber} />

            <Button type="submit">제출</Button>
            {orderHistory.map((order) => (
                <Order key={order.id}>
                    <Text>주문 번호: {order.orderNumber}</Text>
                    <Text>이름: {order.name}</Text>
                    <Text>전화번호: {order.phoneNumber}</Text>
                    <Text>주소: {order.address.mainAddress} {order.address.detailAddress}</Text>
                    <Text>우편번호: {order.address.zipCode}</Text>
                    <Text>요청 내용: {order.requestDetail}</Text>
                    <Text>판매 상태: {order.sellState}</Text>
                </Order>
            ))}
        </Form>
    );
}

export default AdminProductSubmit;