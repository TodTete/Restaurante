import { useClient } from "../../context/ClientContext";
import Modal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArticleList = () => {
  const {
    articles,
    editingArticle,
    newArticle,
    isModalOpen,
    setNewArticle,
    setIsModalOpen,
    handleCreate,
    handleEdit,
    handleDelete,
    handleUpdate,
    editedFields,
    setEditedFields,
    setEditingArticle,
  } = useClient();

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Lista de Artículos</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlusSquare} size="2xl" className="mr-2" />
          Agregar Artículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.idArticle}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{article.name}</h2>
            <p className="text-gray-600">Precio: ${article.price}</p>
            <p className="text-gray-600">Stock: {article.stock}</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="text-blue-500 hover:text-blue-600"
                onClick={() => handleEdit(article)}
              >
                <FontAwesomeIcon icon={faEdit} size="2xl" />
              </button>
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDelete(article.idArticle)}
              >
                <FontAwesomeIcon icon={faTrash} size="2xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Agregar Nuevo Artículo"
        onSave={handleCreate}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3"
            value={newArticle.name}
            onChange={(e) =>
              setNewArticle({ ...newArticle, name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Precio</label>
          <input
            type="number"
            className="border rounded w-full py-2 px-3"
            value={newArticle.price}
            onChange={(e) =>
              setNewArticle({ ...newArticle, price: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            className="border rounded w-full py-2 px-3"
            value={newArticle.stock}
            onChange={(e) =>
              setNewArticle({ ...newArticle, stock: e.target.value })
            }
          />
        </div>
      </Modal>

      {editingArticle && (
        <Modal
          isOpen={!!editingArticle}
          title="Editar Artículo"
          onSave={handleUpdate}
          onCancel={() => setEditingArticle(null)}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              value={editedFields.name}
              onChange={(e) =>
                setEditedFields({ ...editedFields, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              className="border rounded w-full py-2 px-3"
              value={editedFields.price}
              onChange={(e) =>
                setEditedFields({ ...editedFields, price: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              className="border rounded w-full py-2 px-3"
              value={editedFields.stock}
              onChange={(e) =>
                setEditedFields({ ...editedFields, stock: e.target.value })
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ArticleList;