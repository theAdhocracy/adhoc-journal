export const checkAuth = (cookie: any) => {
    // Check against validation token
    const validCode = import.meta.env.AUTH_VALIDATION;
    const isAuthenticated = cookie && cookie.value === validCode;

    return isAuthenticated;
}