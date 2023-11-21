import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';


function LoginCode() {
    const code = new URL(document.location.toString()).searchParams.get('code');
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    const queryParams = {
        code: code,
        redirect_uri: REDIRECT_URI,
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_SERVER + "oauth/kakao", {
            params: queryParams,
        }).then((response) => {
            // get nickname, accessToken from response.data
            // save nickname, accessToken to localStorage
            localStorage.setItem('nickname', response.data.nickname);
            localStorage.setItem('accessToken', response.data.accessToken);

            console.log(response.data);
            window.location.href = '/';



        }).catch((error) => {
                console.log(error);
                window.location.href = '/';
        });
    }, []);

    return <div>로그인 중입니다.</div>;
}

export default LoginCode;