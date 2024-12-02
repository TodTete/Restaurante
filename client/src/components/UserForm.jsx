import { useState } from "react";
import toastr from "toastr";
import PropTypes from "prop-types";

export default function UserForm({ onCreateUser }) {
  const [newUser, setNewUser] = useState({ name: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUser.name === "" || newUser.password === "") {
      toastr.warning("Por favor, llena todos los campos.");
      return;
    }
    onCreateUser(newUser);
    setNewUser({ name: "", password: "" });
  };

  return (
    <div className="mb-10 bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-600">
        Crear Nuevo Usuario
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}

UserForm.propTypes = {
  onCreateUser: PropTypes.func.isRequired,
};
