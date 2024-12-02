/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchArticles,
  handleDelete,
  handleUpdate,
  handleCreate,
} from "./clientFunctions";

const ClientContext = createContext();

export const useClient = () => {
  return useContext(ClientContext);
};

export const ClientProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editedFields, setEditedFields] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [newArticle, setNewArticle] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        await fetchArticles(setArticles);
      } catch (error) {
        console.error("Error loading articles:", error);
        alert("Error al cargar artículos.");
      }
    };
    loadArticles();
  }, []);

  const value = {
    articles,
    editingArticle,
    newArticle,
    isModalOpen,
    setNewArticle,
    setIsModalOpen,
    handleCreate: () =>
      handleCreate(newArticle, setArticles, setNewArticle, setIsModalOpen),
    handleEdit: (article) => {
      setEditingArticle(article);
      setEditedFields({
        name: article.name,
        price: article.price,
        stock: article.stock,
      });
    },
    handleDelete: (idArticle) => handleDelete(idArticle, articles, setArticles),
    handleUpdate: () =>
      handleUpdate(
        editingArticle,
        editedFields,
        articles,
        setArticles,
        setEditingArticle
      ),
    editedFields,
    setEditedFields,
    setEditingArticle,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

ClientProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
