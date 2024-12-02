import { useOrder } from "../../context/RequestContext";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faCheck, faSync } from "@fortawesome/free-solid-svg-icons";

  const RequestPage = () => {
  const { orders, updateOrderStatus, fetchOrders } = useOrder();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Órdenes Pendientes
        </h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          Actualizar Órdenes
        </button>
      </div>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.idOrder}
              className="bg-white p-4 shadow-md rounded-lg flex flex-col"
            >
              <div>
                <p className="text-lg font-medium text-gray-700">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="mr-2 text-green-500"
                  />
                  Mesa: {order.idTable}
                </p>
                <p className="text-gray-600">Estado: {order.state}</p>
                <p className="text-gray-600">
                  Descripción: {order.description}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-700 font-bold">Detalles de Orden:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {order.details.map((detail, index) => (
                    <li key={index}>
                      {detail.item} - Cantidad: {detail.quantity} - Comentarios:{" "}
                      {detail.comments}
                    </li>
                  ))}
                </ul>
              </div>
              {order.state !== "completado" && (
                <button
                  onClick={() => updateOrderStatus(order.idOrder, order.state)}
                  className="px-4 py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Cambiar estado
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No hay órdenes pendientes.</p>
      )}
    </div>
  );
};

export default RequestPage;
