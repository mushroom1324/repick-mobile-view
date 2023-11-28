import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Title from './styles/title';
import Label from './styles/label';
import FormContainer from './styles/form-container';
import Input from './styles/input';
import Button from './styles/button';
import ErrorText from "./styles/error-text";
import loginHandler from "../api/login/login";

import { CSSTransition } from 'react-transition-group';


const ModalWrapper = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  padding: 8px;
  cursor: pointer;
  background-color: #ccc;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const MessageModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: black;
  color: white;
  border-radius: 8px;
  z-index: 1001;
`;

const MyPage = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [userData, setUserData] = useState({
        address: {
            detailAddress: '',
            mainAddress: '',
            zipCode: '',
        },
        bank: {
            accountNumber: '',
            bankName: '',
        },
        email: '',
        name: '',
        nickname: '',
        phoneNumber: '',
    });

    const [errors, setErrors] = useState({
        nickname: '',
    });

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

        axios.get(process.env.REACT_APP_API_SERVER + 'sign/userInfo', config)
            .then(response => {
                setUserData(response.data);
                if (response.data.address === null) {
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        address: {
                            detailAddress: '',
                            mainAddress: '',
                            zipCode: '',
                        }
                    }));
                }
                if (response.data.bank === null) {
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        bank: {
                            accountNumber: '',
                            bankName: '',
                        }
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                loginHandler();
            });
    }, []);

    const handleInputChange = (field, value) => {
        const fieldPath = field.split('.');
        setUserData((prevUserData) => {
            let updatedUserData = { ...prevUserData };
            let target = updatedUserData;

            for (let i = 0; i < fieldPath.length - 1; i++) {
                target = target[fieldPath[i]];
            }

            target[fieldPath[fieldPath.length - 1]] = value;
            return updatedUserData;
        });
    };

    const handlePostcodeComplete = (data) => {
        const { address, zonecode } = data;

        handleInputChange('address.zipCode', zonecode);
        handleInputChange('address.mainAddress', address);
        handleCloseModal();
    };

    const handlePostcodeButtonClick = (e) => {
        e.preventDefault();
        // Open Daum Postcode modal when the button is clicked
        document.getElementById('postcode-modal').style.display = 'block';
    };

    const handleCloseModal = () => {
        // Close Daum Postcode modal
        document.getElementById('postcode-modal').style.display = 'none';
    };

    const handleOverlayClick = (e) => {
        if (e.target.type !== 'button') {
            handleCloseModal();
        }
    };

    const validateInput = () => {
        let newErrors = {
            nickname: '',
        };

        if (!userData.nickname || userData.nickname.length === 0) {
            newErrors.nickname = '닉네임은 필수 입력값이에요.';
            alert('닉네임을 입력해주세요.');
        }

        setErrors(newErrors);

    };

    const handleSubmitBtn = (e) => {
        e.preventDefault();

        if (!validateInput()) {
            return;
        }

        localStorage.setItem('name', userData.name);
        localStorage.setItem('nickname', userData.nickname);

        // Update user data using accessToken
        // userData is body data
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.patch(process.env.REACT_APP_API_SERVER + 'sign/update', userData, config)
            .then(() => {
                setShowMessage(true);
            });

        setTimeout(() => {
            setShowMessage(false);
            window.location.reload();
        }, 2000);
    };


    return (
        <>
            <FormContainer>
                <form>
                    <Title>마이페이지</Title>
                    <Label>
                        이름:
                        <Input type="text" value={userData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                    </Label>

                    <Label>
                        닉네임:
                        <Input type="text" value={userData.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} />
                        {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
                    </Label>

                    <Label>
                        이메일:
                        <Input
                            type="text" value={userData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </Label>

                    <Label>
                        휴대폰 번호:
                        <Input
                            type="text"
                            value={userData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            placeholder="01012345678"
                        />
                    </Label>

                    <Label>
                        우편번호: {userData.address ? userData.address.zipCode : ''}
                        <Button onClick={handlePostcodeButtonClick}>우편번호 찾기</Button>
                    </Label>

                    <ModalWrapper show={false} id="postcode-modal" onClick={handleOverlayClick}>
                        <ModalContent>
                            <DaumPostcode onComplete={handlePostcodeComplete} />
                            <CloseButton onClick={handleCloseModal}>닫기</CloseButton>
                        </ModalContent>
                    </ModalWrapper>
                    <Label>
                        주소:
                        <Input
                            type="text"
                            value={userData.address ? userData.address.mainAddress : ''}
                            onChange={(e) => handleInputChange('address.mainAddress', e.target.value)}
                        />
                    </Label>

                    <Label>
                        상세주소:
                        <Input
                            type="text"
                            value={userData.address ? userData.address.detailAddress : ''}
                            onChange={(e) => handleInputChange('address.detailAddress', e.target.value)}
                        />
                    </Label>

                    <Label>
                        은행명:
                        <Input
                            type="text"
                            value={userData.bank ? userData.bank.bankName : ''}
                            onChange={(e) => handleInputChange('bank.bankName', e.target.value)}
                        />
                    </Label>

                    <Label>
                        계좌번호:
                        <Input
                            type="text"
                            value={userData.bank ? userData.bank.accountNumber : ''}
                            onChange={(e) => handleInputChange('bank.accountNumber', e.target.value)}
                        />
                    </Label>

                    <Button onClick={handleSubmitBtn}>저장</Button>
                </form>
            </FormContainer>
            <CSSTransition in={showMessage} classNames="message" unmountOnExit>
                <ModalBackground>
                    <MessageModal>수정이 완료되었습니다!</MessageModal>
                </ModalBackground>
            </CSSTransition>
        </>
    );
};

export default MyPage;