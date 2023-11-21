import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Title from './styles/title';
import Label from './styles/label';
import FormContainer from './styles/form-container';
import Input from './styles/input';
import Button from './styles/button';
import ErrorText from "./styles/error-text";
import {ModalWrapper, ModalContent, CloseButton } from './styles/modal-wrapper';


const SellerForm = () => {
    const [step, setStep] = useState(1);
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
        bagQuantity: 0,
        productQuantity: 0,
        requestDetail: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bagQuantity: '',
        productQuantity: '',
        zipCode: '',
        mainAddress: '',
        detailAddress: '',
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

    useEffect(() => {
        console.log(step);
        if (step === 1) {
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
        }
        if (step === 2) {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('step3').style.display = 'none';
        }
        if (step === 3) {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
        }
    }, [step]);

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

    const handleCloseModal = (e) => {
        // Close Daum Postcode modal
        document.getElementById('postcode-modal').style.display = 'none';
    };

    const handleOverlayClick = (e) => {
        e.preventDefault();

        if (e.target.type !== 'button') {
            handleCloseModal();
        }
    };

    const validateInputStep1 = () => {
        let newErrors = {
            name: '',
            email: '',
            phoneNumber: '',
        };

        if (!userData.name) {
            newErrors.name = '이름을 입력해주세요.';
        }

        if (!userData.email) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(userData.email)) {
            newErrors.email = '올바른 이메일 형식으로 입력해주세요.';
        }

        if (!userData.phoneNumber) {
            newErrors.phoneNumber = '전화번호를 입력해주세요.';
        } else if (!/^010\d{8}$/.test(userData.phoneNumber)) {
            newErrors.phoneNumber = '전화번호를 01012345678 형식으로 입력해주세요.';
        }

        setErrors(newErrors);

        // If there are no errors, return true
        return Object.values(newErrors).every((error) => !error);
    };

    const validateInputStep2 = () => {
        let newErrors = {
            bagQuantity: '',
            productQuantity: '',
        };

        if (userData.bagQuantity == null || userData.bagQuantity < 1) {
            newErrors.bagQuantity = '리픽백 수량을 1개 이상 입력해주세요.';
        }

        if (userData.productQuantity == null || userData.productQuantity < 1) {
            newErrors.productQuantity = '의류 수량을 1개 이상 입력해주세요.';
        }

        setErrors(newErrors);

        // If there are no errors, return true
        return Object.values(newErrors).every((error) => !error);
    };

    const validateInputStep3 = () => {
        let newErrors = {
            zipCode: '',
            mainAddress: '',
            detailAddress: '',
        };

        if (!userData.address.zipCode) {
            newErrors.zipCode = '우편번호를 입력해주세요.';
        }

        if (!userData.address.mainAddress) {
            newErrors.mainAddress = '주소를 입력해주세요.';
        }

        if (!userData.address.detailAddress) {
            newErrors.detailAddress = '상세주소를 입력해주세요.';
        }

        setErrors(newErrors);

        // If there are no errors, return true
        return Object.values(newErrors).every((error) => !error);
    };

    const handleStep1 = (e) => {
        e.preventDefault();

        if (!validateInputStep1()) {
            return;
        }

        // change localStorage data (name, nickname)
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
                setStep(2);
            });
    };

    const handleStep2 = (e) => {
        e.preventDefault();

        if (!validateInputStep2()) {
            return;
        }

        setStep(3);
    }


    const handleStep3 = (e) => {
        e.preventDefault();

        if (!validateInputStep3()) {
            return;
        }

        // Update user data using accessToken
        // userData is body data
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        axios.patch(process.env.REACT_APP_API_SERVER + 'sign/update', userData, config);
        axios.post(process.env.REACT_APP_API_SERVER + 'sell', userData, config)
            .then(() => {
                window.location.href = '/sell-complete';
            });
    }

    return (
        <>
            <FormContainer>
                <form>
                    <Title>옷장 정리하기</Title>
                    <h4>단 세 단계면 끝납니다!</h4>
                    <div id={"step1"}>
                        <Label>
                            <p>1단계 : 기본 정보</p>
                            <Label>
                                이름:
                                <Input
                                    type="text" value={userData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="실명을 입력해주세요"
                                />
                                {errors.name && <ErrorText>{errors.name}</ErrorText>}
                            </Label>

                            <Label>
                                이메일:
                                <Input
                                    type="text" value={userData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="전화번호가 잘못되었을 경우 비상 연락망"
                                />
                                {errors.email && <ErrorText>{errors.email}</ErrorText>}
                            </Label>

                            <Label>
                                휴대폰 번호:
                                <Input
                                    type="text"
                                    value={userData.phoneNumber || ''}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder="01012345678"
                                />
                                {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
                            </Label>
                        </Label>
                        <Button onClick={handleStep1}>저장하고 계속</Button>
                    </div>
                    <div id={"step2"}>
                        <Label>
                            <p>2단계 : 의류 및 리픽백 수량 정보</p>
                            <Label>
                                의류 수량:
                                <Input
                                    type="number"
                                    value={userData.productQuantity}
                                    onChange={(e) => handleInputChange('productQuantity', e.target.value)}
                                />
                                {errors.productQuantity && <ErrorText>{errors.productQuantity}</ErrorText>}
                            </Label>

                            <Label>
                                리픽백 수량:
                                <Input
                                    type="number"
                                    value={userData.bagQuantity}
                                    onChange={(e) => handleInputChange('bagQuantity', e.target.value)}
                                />
                                {errors.bagQuantity && <ErrorText>{errors.bagQuantity}</ErrorText>}
                            </Label>
                        </Label>
                        <Button onClick={handleStep2}>저장하고 계속</Button>
                    </div>
                    <div id={"step3"}>
                        <p>3단계 : 배송 정보</p>
                        <Label>
                            배송지 주소:
                            <Label>
                                우편번호: {userData.address.zipCode + '  ' || ''}
                                <Button onClick={handlePostcodeButtonClick}>우편번호 찾기</Button>
                                {errors.zipCode && <ErrorText>{errors.zipCode}</ErrorText>}
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
                                    value={userData.address.mainAddress || ''}
                                    onChange={(e) => handleInputChange('address.mainAddress', e.target.value)}
                                />
                                {errors.mainAddress && <ErrorText>{errors.mainAddress}</ErrorText>}
                            </Label>

                            <Label>
                                상세주소:
                                <Input
                                    type="text"
                                    value={userData.address.detailAddress || ''}
                                    onChange={(e) => handleInputChange('address.detailAddress', e.target.value)}
                                />
                                {errors.detailAddress && <ErrorText>{errors.detailAddress}</ErrorText>}
                            </Label>

                            <Label>
                                배송 요청사항:
                                <Input
                                    type="text"
                                    value={userData.address.request || ''}
                                    onChange={(e) => handleInputChange('address.request', e.target.value)}
                                    placeholder={'배송 시 요청사항을 입력해주세요'}
                                />
                            </Label>
                        </Label>

                        <Button onClick={handleStep3}>신청하기</Button>
                    </div>
                </form>
            </FormContainer>
        </>
    );
};

export default SellerForm;