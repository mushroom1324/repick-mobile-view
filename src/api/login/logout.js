function logoutHandler() {
    localStorage.removeItem('nickname');
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

export default logoutHandler;