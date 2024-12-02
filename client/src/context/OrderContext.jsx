import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "react-toastify";
import {
  createOrderRequest,
  getTablesRequest,
  getArticlesRequest,
} from "../api/api.client";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const OrderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [articleComment, setArticleComment] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tablesResponse = await getTablesRequest();
        setTables(tablesResponse.data);

        const articlesResponse = await getArticlesRequest();
        setArticles(articlesResponse.data);
      } catch (error) {
        console.error(
          "Error al cargar las mesas o artículos:",
          error.response?.data || error.message
        );
        toast.error("Error al cargar los datos de mesas o artículos.");
      }
    };
    fetchData();
  }, []);

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    setQuantities({ ...quantities, [id]: quantity > 0 ? quantity : 1 });
  };

  const handleAddArticle = () => {
    const article = articles.find(
      (a) => a.idArticle === parseInt(selectedArticle, 10)
    );
    if (!article) {
      toast.warning("Selecciona un artículo válido.");
      return;
    }

    const quantity = quantities[article.idArticle] || 1;
    if (quantity <= 0) {
      toast.warning("La cantidad debe ser al menos 1.");
      return;
    }

    const newArticle = {
      idArticle: article.idArticle,
      name: article.name,
      quantity, // Asegúrate de usar 'quantity' aquí
      comments: articleComment || "Sin comentarios",
    };

    setSelectedArticles([...selectedArticles, newArticle]);
    setSelectedArticle("");
    setQuantities({ ...quantities, [article.idArticle]: 1 });
    setArticleComment("");
    toast.success(`${article.name} añadido a la orden`);
  };

  const handleRemoveArticle = (id) => {
    setSelectedArticles(
      selectedArticles.filter((item) => item.idArticle !== id)
    );
    toast.info("Artículo eliminado de la orden");
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
  
    if (!selectedTable || selectedArticles.length === 0) {
      toast.warning("Selecciona una mesa y al menos un artículo.");
      return;
    }
  
    try {
      // Verifica si la mesa ya está ocupada
      const tableStatus = tables.find((table) => table.idTable === parseInt(selectedTable));
      if (tableStatus && tableStatus.status === "occupied") {
        const result = await Swal.fire({
          title: "Mesa ocupada",
          text: "¿Desea agregar esta orden a la mesa que ya está ocupada?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, agregar",
          cancelButtonText: "No, cancelar",
        });
  
        if (!result.isConfirmed) {
          return; // Cancela la operación si el usuario elige "No, cancelar"
        }
      }
  
      const order = {
        table_id: selectedTable,
        date: new Date().toISOString(),
        state: false,
        description: comments || "Sin comentarios adicionales",
        items: selectedArticles.map((item) => ({
          idArticle: item.idArticle,
          quantity: item.quantity,
          comments: item.comments,
        })),
      };
  
      // Crea la orden
      await createOrderRequest(order);
      toast.success("Orden creada exitosamente");
  
      // Reinicia los valores de la orden después de crearla
      setSelectedTable("");
      setSelectedArticles([]);
      setQuantities({});
      setComments("");
    } catch (error) {
      console.error("Error al crear la orden:", error.response?.data || error.message);
      toast.error("No se pudo crear la orden. Verifica los datos.");
    }
  };

  return (
    <OrderContext.Provider
      value={{
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
        setQuantities,
        articleComment,
        setArticleComment,
        comments,
        setComments,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
