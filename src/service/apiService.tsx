const API_BASE_URL = "http://192.168.1.9:5117";

export const API_ENDPOINTS = {
    GET_CART_INFO: `${API_BASE_URL}/CartInfo/GetCartInfos`,
    GET_CATEGORIES: `${API_BASE_URL}/Category/GetCategories`,
    GET_USER_INFO: `${API_BASE_URL}/UserInfo/GetUserInfos`,
    GET_PRODUCT_INFO: `${API_BASE_URL}/ProductInfo/GetProductInfos`,
    GET_PRODUCT_DETAILS: `${API_BASE_URL}/ProductInfo/GetProductDetailsById`,
    GET_PRODUCT_BY_CATEGORY: `${API_BASE_URL}/ProductInfo/GetProductsByCategoryId`,
    GET_TRANSACTIONS: `${API_BASE_URL}/CartInfo/GetAllTransactions`,
    UPDATE_CART_STATUS: `${API_BASE_URL}/CartInfo/UpdateStatusCartInfo`,
    DELETE_CART_INFO: `${API_BASE_URL}/CartInfo/DeleteCartInfo`,
};