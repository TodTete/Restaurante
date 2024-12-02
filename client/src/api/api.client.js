//Creado por: Ricardo Vallejo Sánchez
//Vallejoricardo3@gmail.com
// 249-210-8702

import axios from "axios";

const API_URL = "http://localhost:3000";

export const createUserRequest = async (user) =>
  await axios.post(`${API_URL}/users`, user);

export const getOrdersRequest = async () =>
  await axios.get(`${API_URL}/orders`);

export const updateOrderRequest = async (idOrder, newFields) =>
  await axios.put(`${API_URL}/orders/${idOrder}`, newFields);

export const deleteOrderRequest = async (idOrder) =>
  await axios.delete(`${API_URL}/orders/${idOrder}`);

export const createOrderRequest = async (order) =>
  await axios.post(`${API_URL}/orders`, order);

export const getTablesRequest = async () =>
  await axios.get(`${API_URL}/tables`);

export const loginUserRequest = async (user) =>
  await axios.post(`${API_URL}/login`, user);

export const getSalesRequest = async () => await axios.get(`${API_URL}/sales`);

export const createSaleRequest = async (sale) =>
  await axios.post(`${API_URL}/sales`, sale);

export const getArticlesRequest = async () =>
  await axios.get(`${API_URL}/articles`);

export const createArticleRequest = async (article) =>
  await axios.post(`${API_URL}/articles`, article);

export const updateArticleRequest = async (idArticle, newFields) =>
  await axios.put(`${API_URL}/articles/${idArticle}`, newFields);

export const deleteArticleRequest = async (idArticle) =>
  await axios.delete(`${API_URL}/articles/${idArticle}`);

export const getDetailSalesRequest = async (idSale) =>
  await axios.get(`${API_URL}/sales/${idSale}/details`);

export const getUsersRequest = async () => await axios.get(`${API_URL}/users`);

export const deleteUserRequest = async (id) =>
  await axios.delete(`${API_URL}/users/${id}`);

export const getTableStatusRequest = async () =>
  await axios.get(`${API_URL}/tables/status`);

export const finalizeTableSaleRequest = async (tableId) =>
  await axios.post(`${API_URL}/tables/${tableId}/finalize`);

export const getDailySalesTotalRequest = async (saleDate) =>
  await axios.get(`${API_URL}/dashboard/daily-sales-total`, {
    params: { saleDate },
  });

export const getCurrentOrdersSummaryRequest = async () =>
  await axios.get(`${API_URL}/dashboard/current-orders-summary`);

export const getLowStockArticlesRequest = async () =>
  await axios.get(`${API_URL}/dashboard/low-stock-articles`);