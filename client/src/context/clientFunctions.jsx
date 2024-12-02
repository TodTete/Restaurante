import ExcelJS from "exceljs";
import {
  getArticlesRequest,
  createArticleRequest,
  updateArticleRequest,
  deleteArticleRequest,
  getSalesRequest,
  getDetailSalesRequest,
} from "../api/api.client";
import toastr from "toastr";
import { toast } from "react-toastify";
import { format } from "date-fns";

export const fetchArticles = async (setArticles) => {
  try {
    const response = await getArticlesRequest();
    setArticles(response.data);
  } catch (error) {
    toastr.error("Error al obtener los artículos.");
    console.error("Error fetching articles:", error);
  }
};

export const validateFields = (article) => {
  if (!article.name || article.price === "" || article.stock === "") {
    toastr.error("Todos los campos son obligatorios.");
    return false;
  }
  if (article.price <= 0) {
    toastr.error("El precio debe ser mayor que cero.");
    return false;
  }
  if (article.stock < 0) {
    toastr.error("El stock no puede ser negativo.");
    return false;
  }
  return true;
};

export const handleDelete = async (idArticle, articles, setArticles) => {
  try {
    await deleteArticleRequest(idArticle);
    setArticles(articles.filter((article) => article.idArticle !== idArticle));
    toastr.success("Artículo eliminado con éxito.");
  } catch (error) {
    toastr.error("Error al eliminar el artículo.");
    console.error("Error deleting article:", error);
  }
};

export const handleUpdate = async (
  editingArticle,
  editedFields,
  articles,
  setArticles,
  setEditingArticle
) => {
  if (!validateFields(editedFields)) return;

  try {
    await updateArticleRequest(editingArticle.idArticle, editedFields);
    setArticles(
      articles.map((article) =>
        article.idArticle === editingArticle.idArticle
          ? { ...article, ...editedFields }
          : article
      )
    );
    setEditingArticle(null);
    toastr.success("Artículo actualizado con éxito.");
  } catch (error) {
    toastr.error("Error al actualizar el artículo.");
    console.error("Error updating article:", error);
  }
};

export const handleCreate = async (
  newArticle,
  setArticles,
  setNewArticle,
  setIsModalOpen
) => {
  if (!validateFields(newArticle)) return;

  try {
    const response = await createArticleRequest(newArticle);
    setArticles((prevArticles) => [...prevArticles, response.data]);
    setNewArticle({ name: "", price: "", stock: "" });
    setIsModalOpen(false);
    toastr.success("Artículo creado con éxito.");
  } catch (error) {
    toastr.error("Error al crear el artículo.");
    console.error("Error creating article:", error);
  }
};

export const fetchSales = async (setSales) => {
  try {
    const response = await getSalesRequest();
    setSales(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Error al cargar ventas");
  }
};

export const filterSalesByDate = (sales, selectedDate) => {
  if (selectedDate) {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return sales.filter(
      (sale) => format(new Date(sale.date), "yyyy-MM-dd") === formattedDate
    );
  }
  return sales;
};

export const fetchSaleDetails = async (idSale, setDetails, setSelectedSale) => {
  try {
    const response = await getDetailSalesRequest(idSale);
    setDetails(response.data);
    setSelectedSale(idSale);
  } catch (error) {
    console.log(error);
    toast.error("Error al cargar detalles de la venta");
  }
};

export const exportSalesToExcel = async (filteredSales, selectedDate) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas");

  worksheet.columns = [
    { header: "ID Venta", key: "idSale", width: 15 },
    { header: "ID Usuario", key: "user_id", width: 15 },
    { header: "Fecha", key: "date", width: 25 },
    { header: "Total", key: "total", width: 15 },
  ];

  filteredSales.forEach((sale) => {
    worksheet.addRow({
      idSale: sale.idSale,
      user_id: sale.user_id,
      date: new Date(sale.date).toLocaleString(),
      total: sale.total,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Historial_Ventas_${
    selectedDate ? format(selectedDate, "yyyy-MM-dd") : "completo"
  }.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
