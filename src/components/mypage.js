import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Title from './styles/title';

const FormContainer = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #000;
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px;
  cursor: pointer;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

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


const MyPage = () => {
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

    useEffect(() => {
        // Fetch user data using accessToken
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.get(process.env.REACT_APP_API_SERVER + 'sign/userInfo', config)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
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

    const handlePostcodeButtonClick = () => {
        // Open Daum Postcode modal when the button is clicked
        document.getElementById('postcode-modal').style.display = 'block';
    };

    const handleCloseModal = () => {
        // Close Daum Postcode modal
        document.getElementById('postcode-modal').style.display = 'none';
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'postcode-modal') {
            handleCloseModal();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update user data using accessToken
        // userData is body data
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.patch(process.env.REACT_APP_API_SERVER + 'sign/update', userData, config);
    };


    return (
        <FormContainer onClick={handleOverlayClick}>
            <form onSubmit={handleSubmit}>
                <Title>마이페이지</Title>
                <Label>
                    이름:
                    <Input type="text" value={userData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                </Label>

                <Label>
                    닉네임:
                    <Input type="text" value={userData.nickname || ''} onChange={(e) => handleInputChange('nickname', e.target.value)} />
                </Label>

                <Label>
                    우편번호:
                    <Button onClick={handlePostcodeButtonClick}>우편번호 찾기</Button>
                </Label>

                <ModalWrapper show={false} id="postcode-modal">
                    <ModalContent>
                        <DaumPostcode onComplete={handlePostcodeComplete} />
                        <CloseButton onClick={handleCloseModal}>닫기</CloseButton>
                    </ModalContent>
                </ModalWrapper>

                <Label>
                    주소:
                    <Input
                        type="text"
                        value={userData.address.mainAddress || ''}
                        onChange={(e) => handleInputChange('address.mainAddress', e.target.value)}
                    />
                </Label>

                <Label>
                    상세주소:
                    <Input
                        type="text"
                        value={userData.address.detailAddress || ''}
                        onChange={(e) => handleInputChange('address.detailAddress', e.target.value)}
                    />
                </Label>

                <Label>
                    은행명:
                    <Input
                        type="text"
                        value={userData.bank.bankName || ''}
                        onChange={(e) => handleInputChange('bank.bankName', e.target.value)}
                    />
                </Label>

                <Label>
                    계좌번호:
                    <Input
                        type="text"
                        value={userData.bank.accountNumber || ''}
                        onChange={(e) => handleInputChange('bank.accountNumber', e.target.value)}
                    />
                </Label>

                <Button type="submit">저장</Button>
            </form>
        </FormContainer>
    );
};

export default MyPage;