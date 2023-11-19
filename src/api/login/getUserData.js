import axios from 'axios';


function getUserData() {

    // get user data using accessToken
    const accessToken = localStorage.getItem('accessToken');

    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    let data = axios.get(process.env.REACT_APP_API_SERVER + "sign/userInfo", config);

    console.log(data);
    return data;

}

export default getUserData;