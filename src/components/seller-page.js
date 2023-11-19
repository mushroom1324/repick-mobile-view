import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Title from './styles/title';

const SellerPageContainer = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
`;

const ApplyButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
`;

const ProductList = styled.div`
  margin-top: 30px;
`;

const Product = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 5px;
`;

const PriceInputModal = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 300px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
`;

const PriceInputLabel = styled.label`
  display: block;
  margin-top: 0px;
  margin-bottom: 10px;
`;

const PriceInput = styled.input`
  width: calc(100% - 16px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PriceInputButton = styled.button`
  padding: 10px;
  cursor: pointer;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
`;

const ProductTitle = styled.h3`
  margin: 5px 0;
  font-size: 1.2em;
`;

const ProductPrice = styled.p`
  margin: 10px 0;
  font-size: 1em;
`;

const OrderHistoryContainer = styled.div`
  margin-top: 30px;
`;

const OrderItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

const OrderItemInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const QuantityContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`;

const QuantityLabel = styled.p`
  margin: 0 10px 0 0;
`;

const OrderItemDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;

const OrderItemPrice = styled.p`
  margin-top: 15px;
  font-weight: bold;
  white-space: nowrap; 
  overflow: hidden;
  font-size: 1em;
`;

const OrderItemTitle = styled.h3`
  margin: 5px 0;
  font-size: 1.2em;
`;

const SellerPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [priceInputModal, setPriceInputModal] = useState(false);
    const [priceInput, setPriceInput] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        console.log(process.env.REACT_APP_API_SERVER)
        const accessToken = localStorage.getItem('accessToken');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/published', config)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/requests', config)
            .then(response => {
                setOrderHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });
    }, []);

    const handleApplyClick = () => {
        // Handle apply action
    };

    const openPriceInputModal = (product) => {
        setSelectedProduct(product);
        setPriceInputModal(true);
    };

    const closePriceInputModal = () => {
        setSelectedProduct(null);
        setPriceInput('');
        setPriceInputModal(false);
    };

    const handlePriceInputChange = (e) => {
        setPriceInput(e.target.value);
    };


    const handlePriceInputSubmit = () => {
        const { productId } = selectedProduct;
        const price = priceInput;

        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                productId,
                price,
            },
        };

        // POST 요청을 통해 가격 수정
        axios.post(process.env.REACT_APP_API_SERVER + 'products/submit-price', null, config)
            .then(response => {
                console.log('Price Input Success:', response.data);

                // 로컬 데이터를 직접 수정
                const updatedProducts = products.map((product) => {
                    if (product.productId === productId) {
                        return {
                            ...product,
                            productState: 'SELLING',
                            price: price,
                        };
                    }
                    return product;
                });

                setProducts(updatedProducts);
                closePriceInputModal();
            })
            .catch(error => {
                console.error('Price Input Error:', error);
                // 에러 처리 로직
            });
    };

    const parseCreatedDate = (createdDate) => {
        const date = new Date(createdDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    };

    const parseSellState = (sellState) => {
        switch (sellState) {
            case 'REQUESTED':
                return '옷장 정리 요청됨';
            case 'BAG_PENDING':
                return '취소됨';
            case 'BAG_READY':
                return '리픽백 배송됨';
            case 'CANCELLED':
                return '리픽백 배출됨';
            case 'DELIVERED':
                return '리픽백 수거됨';
            case 'PUBLISHED':
                return '상품 등록 완료됨';
            default:
                return sellState;
        }
    };


    return (
        <SellerPageContainer>
            <Title>옷장 정리</Title>
            <p>현재 {products.length}건의 상품이 등록되어 있습니다.</p>
            <ApplyButton onClick={handleApplyClick}>옷장 정리 신청하러 가기</ApplyButton>

            <ProductList>
                <h2>판매중인 상품 현황</h2>
                {products.map((product) => (
                    <Product key={product.productId}>
                        <ProductImage src={product.mainImageFile.imagePath} alt="Product" />
                        <div>
                            <ProductTitle>{product.name}</ProductTitle>
                            {(product.productState === 'BEFORE_SMS' ||
                                    product.productState === 'PREPARING') &&
                                !product.price && (
                                    <PriceInputButton onClick={() => openPriceInputModal(product)}>
                                        가격 입력하기
                                    </PriceInputButton>
                                )}
                            {product.price && <ProductPrice>가격: {product.price}원</ProductPrice>}
                        </div>
                    </Product>
                ))}
            </ProductList>

            <PriceInputModal show={priceInputModal}>
                <ModalTitle>{selectedProduct && selectedProduct.name}</ModalTitle>
                <PriceInputLabel>상품 가격 등록</PriceInputLabel>
                <PriceInput
                    type="number"
                    placeholder="상품 가격을 입력해주세요"
                    value={priceInput}
                    onChange={handlePriceInputChange}
                />
                <PriceInputButton onClick={handlePriceInputSubmit}>확인</PriceInputButton>
                <PriceInputButton onClick={closePriceInputModal}>취소</PriceInputButton>
            </PriceInputModal>

            <OrderHistoryContainer>
                <h2>판매 주문 기록</h2>
                <p>총 {orderHistory.length}건의 기록이 있습니다.</p>
                {orderHistory.map((order) => (
                    <OrderItemContainer key={order.orderId}>
                        <OrderItemInfo>
                            <OrderItemTitle>{parseCreatedDate(order.createdDate)}</OrderItemTitle>
                        </OrderItemInfo>
                        <OrderItemDetails>
                            <QuantityContainer>
                                <QuantityLabel>의류 수량: {order.productQuantity}</QuantityLabel>
                            </QuantityContainer>
                            <QuantityContainer>
                                <QuantityLabel>리픽백 수량: {order.bagQuantity}</QuantityLabel>
                            </QuantityContainer>
                        </OrderItemDetails>
                        <OrderItemPrice>{parseSellState(order.sellState)}</OrderItemPrice>
                    </OrderItemContainer>
                ))}
            </OrderHistoryContainer>
        </SellerPageContainer>
    );
};

export default SellerPage;
