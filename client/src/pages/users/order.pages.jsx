import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faCheckCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useOrder } from "../../context/OrderContext";

const OrderPage = () => {
  const {
    tables,
    articles,
    selectedTable,
    setSelectedTable,
    selectedArticle,
    setSelectedArticle,
    selectedArticles,
    handleQuantityChange,
    handleAddArticle,
    handleRemoveArticle,
    handleSubmitOrder,
    quantities,
    articleComment,
    setArticleComment,
    comments,
    setComments,
  } = useOrder();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Toma de Órdenes</h1>

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mesa:
          </label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="">Selecciona una mesa</option>
            {tables.map((table) => (
              <option key={table.idTable} value={table.idTable}>
                Mesa {table.idTable}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un artículo:
          </label>
          <select
            value={selectedArticle}
            onChange={(e) => setSelectedArticle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="">Selecciona un artículo</option>
            {articles.map((article) => (
              <option key={article.idArticle} value={article.idArticle}>
                {article.name} - ${article.price}
              </option>
            ))}
          </select>

          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={quantities[selectedArticle] || ""}
              onChange={(e) =>
                handleQuantityChange(selectedArticle, e.target.value)
              }
              placeholder="Cantidad"
              className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={articleComment}
              onChange={(e) => setArticleComment(e.target.value)}
              placeholder="Comentarios del artículo"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={handleAddArticle}
              className="text-green-600 hover:text-green-800"
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Agregar
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comentarios de la orden:
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Agrega algún comentario (opcional)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Enviar Orden
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8">Artículos Seleccionados:</h3>
      <ul className="mt-4 space-y-2">
        {selectedArticles.map((item) => (
          <li
            key={item.idArticle}
            className="flex items-center justify-between p-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <span>
              {item.name} - Cantidad: {item.quantity} - Comentarios:{" "}
              {item.comments}
            </span>
            <button
              onClick={() => handleRemoveArticle(item.idArticle)}
              className="text-red-600 hover:text-red-800"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;
