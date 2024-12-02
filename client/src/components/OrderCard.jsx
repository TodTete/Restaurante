import PropTypes from "prop-types";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
      <p className="text-gray-700">
        Date: {new Date(order.date).toLocaleDateString()}
      </p>
      <p className="text-gray-700">Status: {order.status}</p>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Items:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold text-lg">Total: ${order.total}</p>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => alert(`Order ${order.id} details`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderCard;
