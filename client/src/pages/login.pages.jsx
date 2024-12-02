import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    user: Yup.string().required("El nombre de usuario es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    login(values, setSubmitting);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r">
      <div className="bg-black p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Iniciar Sesión
        </h2>

        <Formik
          initialValues={{ user: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-white"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    className="text-white pl-1"
                  />
                  Usuario
                </label>
                <Field
                  type="text"
                  name="user"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 transition"
                  placeholder="Ingresa tu nombre de usuario"
                />
                <ErrorMessage
                  name="user"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  <FontAwesomeIcon
                    icon={faLock}
                    size="lg"
                    className="text-white pl-2"
                  />
                  Contraseña
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 transition"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;