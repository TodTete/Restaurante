import { useState, useEffect } from "react";
import {
  fetchSales,
  fetchSaleDetails,
  exportSalesToExcel,
} from "../../context/clientFunctions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function HistoryPage() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [details, setDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadSales = async () => {
      await fetchSales(setSales);
    };
    loadSales();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const filtered = sales.filter(
        (sale) => format(new Date(sale.date), "yyyy-MM-dd") === formattedDate
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [selectedDate, sales]);

  const handleViewDetails = async (idSale) => {
    await fetchSaleDetails(idSale, setDetails, setSelectedSale);
    setIsModalOpen(true);
  };

  const handleExportToExcel = () => {
    exportSalesToExcel(filteredSales, selectedDate);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-center mb-4">
        Historial de Ventas
      </h1>

      <div className="flex justify-center mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Selecciona una fecha"
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex justify-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleExportToExcel}
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID Venta</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.idSale}>
                <td className="border px-4 py-2">{sale.idSale}</td>
                <td className="border px-4 py-2">
                  {new Date(sale.date).toLocaleString()}
                </td>
                <td className="border px-4 py-2">${sale.total}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    onClick={() => handleViewDetails(sale.idSale)}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" /> Ver
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={`Detalles de la Venta #${selectedSale}`}
        onSave={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">ID Detalle</th>
              <th className="px-4 py-2">ID Artículo</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Precio Unitario</th>
              <th className="px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail) => (
              <tr key={detail.idDetail}>
                <td className="border px-4 py-2">{detail.idDetail}</td>
                <td className="border px-4 py-2">{detail.idArticle}</td>
                <td className="border px-4 py-2">{detail.quantity}</td>
                <td className="border px-4 py-2">${detail.unitPrice}</td>
                <td className="border px-4 py-2">${detail.subTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
