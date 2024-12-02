import { useState, useEffect } from "react";
import { getArticlesRequest, createSaleRequest } from "../../api/api.client";

export default function SalePage() {
  const [articles, setArticles] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticlesRequest();
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const addToCart = (article, quantity) => {
    const existingItem = cart.find((item) => item.idArticle === article.idArticle);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.idArticle === article.idArticle
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...article, quantity }]);
    }
  };

  const removeFromCart = (idArticle) => {
    setCart(cart.filter((item) => item.idArticle !== idArticle));
  };

  const handleSale = async () => {
    try {
      const saleData = {
        details: cart.map(({ idArticle, quantity }) => ({
          idArticle,
          quantity,
        })),
      };
      await createSaleRequest(saleData);
      alert("Venta realizada con éxito");
      setCart([]);
    } catch (error) {
      console.error("Error creating sale:", error);
      alert("Error al realizar la venta");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Realizar Venta</h1>

      {/* Lista de Artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div key={article.idArticle} className="p-4 border rounded shadow">
            <h2 className="font-bold">{article.name}</h2>
            <p>Precio: ${article.price}</p>
            <p>Stock: {article.stock}</p>
            <button
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
              onClick={() => addToCart(article, 1)}
              disabled={article.stock === 0}
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      {/* Carrito */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Carrito</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.idArticle} className="p-2 border-b">
                <h3>{item.name}</h3>
                <p>Cantidad: {item.quantity}</p>
                <p>Subtotal: ${item.quantity * item.price}</p>
                <button
                  className="mt-2 text-red-500"
                  onClick={() => removeFromCart(item.idArticle)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className="mt-4">
              <h3 className="font-bold">
                Total: $
                {cart.reduce((acc, item) => acc + item.quantity * item.price, 0)}
              </h3>
              <button
                className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
                onClick={handleSale}
              >
                Completar Venta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
