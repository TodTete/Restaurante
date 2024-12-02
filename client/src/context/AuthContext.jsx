import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserRequest } from "../api/api.client";
import PropTypes from "prop-types";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLockedOut && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prevTime) => prevTime - 1);
      }, 1000);

      if (lockoutTime === 0) {
        setIsLockedOut(false);
        setFailedAttempts(0);
      }

      return () => clearInterval(timer);
    }
  }, [isLockedOut, lockoutTime]);

  const login = async (values, setSubmitting) => {
    if (isLockedOut) {
      toast.error(`Cuenta bloqueada. Inténtalo en ${lockoutTime} segundos`);
      setSubmitting(false);
      return;
    }

    try {
      const response = await loginUserRequest({
        name: values.user,
        password: values.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setFailedAttempts(0);
        toast.success("Inicio de sesión exitoso");
        navigate("/sales");
      } else {
        handleFailedAttempt();
      }
    } catch (error) {
      handleFailedAttempt();
      error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFailedAttempt = () => {
    const nextFailedAttempts = failedAttempts + 1;
    setFailedAttempts(nextFailedAttempts);
    toast.error("Credenciales inválidas");

    if (nextFailedAttempts >= 3) {
      const nextLockoutTime = Math.min(
        60 * Math.pow(10, nextFailedAttempts - 3),
        6000
      );
      setLockoutTime(nextLockoutTime);
      setIsLockedOut(true);
      toast.error(`Cuenta bloqueada por ${nextLockoutTime / 60} minutos`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
