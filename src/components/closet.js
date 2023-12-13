import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Title from './styles/title';
import Button from './styles/button';
import {ModalTitle} from "./styles/modal-wrapper";
import {BagPendingModalSmallContent, BagPendingInput, BagPendingModalWrapper, BagPendingCloseButton, BagPendingModalContent, BagPendingModalTitle} from "./styles/bag-modal";
import loginHandler from "../api/login/login";

const H2 = styled.h2`
  color: #3E3E3F;
`

const NoProductMessage = styled.p`
  text-align: center;
  color: #888;
  font-size: 1.2em;
  margin-top: 20px;
`;

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
  background-color: grey;
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

const PriceInputLabel = styled.label`
  display: block;
  margin-top: 0;
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

const Closet = () => {
    const [preparingProduct, setPreparingProduct] = useState([]);
    const [sellingProduct, setSellingProduct] = useState([]);
    const [soldProduct, setSoldProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [priceInputModal, setPriceInputModal] = useState(false);
    const [priceInput, setPriceInput] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);
    const [priceSum, setPriceSum] = useState(0);

    const [bagDispatchedModal, setBagDispatchedModal] = useState(false);
    const [cancelSellModal, setCancelSellModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [bagQuantity, setBagQuantity] = useState(null);

    useEffect(() => {
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

        // 판매준비 상품 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/preparing', config)
            .then(response => {
                setPreparingProduct(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginHandler();
            });

        // 판매중 상품 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/selling', config)
            .then(response => {
                setSellingProduct(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginHandler();
            });

        // 판매 완료 상품 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/sold', config)
            .then(response => {
                setSoldProduct(response.data);
                let sum = 0;
                response.data.forEach(item => {
                    sum += item.price;
                });
                setPriceSum(sum);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginHandler();
            });
        // 판매 요청 가져오기
        axios.get(process.env.REACT_APP_API_SERVER + 'sell/history/requests', config)
            .then(response => {
                setOrderHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginHandler();
            });
    }, []);

    // 리픽백 배출 완료 버튼을 눌렀을 때 처리하는 함수
    const openBagDispatchedModal = (order) => {
        setSelectedOrder(order);
        setBagDispatchedModal(true);
    };

    const closeBagDispatchedModal = () => {
        setSelectedOrder(null);
        setBagDispatchedModal(false);
    };

    const handleBagDispatchedConfirm = () => {

        if (bagQuantity > 10) {
            alert('리픽백 최대 수량은 10개입니다.');
            return;
        }

        if (bagQuantity != null && bagQuantity < 1) {
            alert('리픽백 수량은 1개 이상이어야 합니다.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken');


        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };

        const body = {
            orderNumber: selectedOrder.orderNumber,
            bagQuantity: bagQuantity,
        }

        axios.post(process.env.REACT_APP_API_SERVER + 'sell/bag-ready', body, config)
            .then(response => {
                console.log('Bag Dispatched Success:', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Bag Dispatched Error:', error);
            });
    };

    const openCancelSellModal = (order) => {
        setSelectedOrder(order);
        setCancelSellModal(true);
    };

    const closeCancelSellModal = () => {
        setSelectedOrder(null);
        setCancelSellModal(false);
    };

    const handleCancelSellConfirm = () => {
        const accessToken = localStorage.getItem('accessToken');


        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        };

        const body = {
            orderNumber: selectedOrder.orderNumber,
        }

        axios.post(process.env.REACT_APP_API_SERVER + 'sell/cancel', body, config)
            .then(response => {
                console.log('Sell Cancel:', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Sell Cancel Error:', error);
            });
    };


    // 정산 신청 버튼 핸들러
    const handleSettlementClick = () => {
        // localStorage에 productIds 저장
        localStorage.setItem('soldProduct', JSON.stringify(soldProduct));
        // localStorage에 priceSum 저장
        localStorage.setItem('priceSum', priceSum);

        window.location.href = '/settlement';
    };

    // const handleApplyClick = () => {
    //     window.location.href = '/sell';
    // };

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

        if (!price) {
            alert('가격을 입력해주세요.');
            return;
        }
        if (price % 1000 !== 0) {
            alert('가격은 1000원 단위로 입력해주세요.');
            return;
        }

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
        axios.post(process.env.REACT_APP_API_SERVER + 'products/submit-price', null, config);
        window.location.reload();
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
                return '리픽백 배송됨';
            case 'BAG_READY':
                return '리픽백 배출됨';
            case 'CANCELLED':
                return '취소됨';
            case 'DELIVERED':
                return '리픽백 수거중';
            case 'PUBLISHED':
                return '상품 등록 완료됨';
            default:
                return sellState;
        }
    };


    const handleBagQuantityChange = (e) => {
        setBagQuantity(e.target.value);
    }

    return (
        <SellerPageContainer>
            <Title>옷장 정리</Title>
            <p>현재 {preparingProduct.length + sellingProduct.length + soldProduct.length}건의 상품이 등록되어 있습니다.</p>
            <ApplyButton>주문량 폭주로 현재 신청이 불가해요 🥲</ApplyButton>

            <ProductList>
                <H2>판매 준비 중인 상품 현황</H2>
                {preparingProduct.length > 0 ? [...preparingProduct].reverse().map((product) => (
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
                )) : <NoProductMessage>해당하는 상품이 없습니다.</NoProductMessage>}
            </ProductList>

            <ProductList>
                <H2>판매 중인 상품 현황</H2>
                {sellingProduct.length > 0 ? [...sellingProduct].reverse().map((product) => (
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
                )) : <NoProductMessage>해당하는 상품이 없습니다.</NoProductMessage>}
            </ProductList>

            <ProductList>
                <H2>판매 완료 상품 현황</H2>
                {soldProduct.length > 0 ? [...soldProduct].reverse().map((product) => (
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
                )) : <NoProductMessage>해당하는 상품이 없습니다.</NoProductMessage>}
                {soldProduct.length > 0 && (
                    <>
                        <p>총 {priceSum}원 정산 대기중입니다.</p>
                        <ApplyButton onClick={handleSettlementClick}>정산 신청하기</ApplyButton>
                    </>
                )}
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
                <H2>판매 주문 기록</H2>
                <p>총 {orderHistory.length}건의 기록이 있습니다.</p>
                {[...orderHistory].reverse().map((order) => (
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
                        {order.sellState === 'BAG_PENDING' && (
                            <Button onClick={() => openBagDispatchedModal(order)}>
                                리픽백 배출
                            </Button>
                        )}
                        {order.sellState === 'REQUESTED' && (
                            <Button onClick={() => openCancelSellModal(order)}>
                                취소하기
                            </Button>
                        )}
                    </OrderItemContainer>
                ))}
            </OrderHistoryContainer>

            <BagPendingModalWrapper show={bagDispatchedModal}>
                <BagPendingModalTitle>리픽백 배출 확인</BagPendingModalTitle>
                <BagPendingModalContent>리픽백 배출을 완료하셨나요?</BagPendingModalContent>
                <BagPendingInput type={"number"} placeholder={"살제 배출한 리픽백 수량을 입력해주세요"} value={bagQuantity} onChange={handleBagQuantityChange}></BagPendingInput>
                <BagPendingModalSmallContent>최대 수량 : 10개</BagPendingModalSmallContent>
                <BagPendingModalSmallContent>입력하지 않으면 신청 당시 수량으로 처리됩니다.</BagPendingModalSmallContent>
                <BagPendingCloseButton onClick={handleBagDispatchedConfirm}>예</BagPendingCloseButton>
                <BagPendingCloseButton onClick={closeBagDispatchedModal}>아니오</BagPendingCloseButton>
            </BagPendingModalWrapper>
            <BagPendingModalWrapper show={cancelSellModal}>
                <BagPendingModalTitle>옷장 정리 취소 확인</BagPendingModalTitle>
                <BagPendingModalContent>정말 해당 주문을 취소하시겠어요?</BagPendingModalContent>
                <BagPendingCloseButton onClick={handleCancelSellConfirm}>예</BagPendingCloseButton>
                <BagPendingCloseButton onClick={closeCancelSellModal}>아니오</BagPendingCloseButton>
            </BagPendingModalWrapper>
        </SellerPageContainer>
    );
};

export default Closet;
