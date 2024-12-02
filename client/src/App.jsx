import { Route, Routes } from "react-router-dom";
import { ClientProvider } from "./context/ClientContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { RequestProvider } from "./context/RequestContext";
import LoginPage from "./pages/login.pages";
import ArticleList from "./pages/admin/article.pages";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import HistoryPage from "./pages/admin/history.pages";
import SalePage from "./pages/admin/sale.page";
import UserManagement from "./pages/admin/managerUser.pages";
import OrderPage from "./pages/users/order.pages";
import RequestPage from "./pages/users/request.page";
import { ToastContainer } from "react-toastify"; // Mantener aquí
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ClientProvider>
        <div className="bg-gray-300">
          <NavBar />
          <div className="container mx-auto py-4 px-5 bg-gray-300">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/articles"
                element={
                  <ProtectedRoute>
                    <ArticleList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <SalePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request"
                element={
                  <RequestProvider>
                    <RequestPage />
                  </RequestProvider>
                }
              />
              <Route
                path="/orders"
                element={
                  <OrderProvider>
                    <OrderPage />
                  </OrderProvider>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <ToastContainer position="top-center" autoClose={3000} /> {/* Solo aquí */}
        </div>
      </ClientProvider>
    </AuthProvider>
  );
}

export default App;
