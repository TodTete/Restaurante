/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { getOrdersRequest, updateOrderRequest } from "../api/api.client";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const RequestProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const ordersResponse = await getOrdersRequest();
      const pendingOrders = ordersResponse.data.filter(
        (order) => order.state !== "completado"
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
      toast.error("Hubo un problema al cargar las órdenes.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, currentStatus) => {
    let newStatus;
    let successMessage;

    if (currentStatus === "sin_atender") {
      newStatus = "en_espera";
      successMessage =
        "El estado de la orden ha sido actualizado a 'En espera'.";
    } else if (currentStatus === "en_espera") {
      newStatus = "completado";
      successMessage =
        "El estado de la orden ha sido actualizado a 'Completado'.";
    } else {
      return;
    }

    try {
      await updateOrderRequest(orderId, { state: newStatus });
      const updatedOrders = orders
        .map((order) =>
          order.idOrder === orderId ? { ...order, state: newStatus } : order
        )
        .filter((order) => order.state !== "completado");
      setOrders(updatedOrders);
      toast.success(successMessage);
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      toast.error("No se pudo actualizar el estado de la orden.");
    }
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

RequestProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
