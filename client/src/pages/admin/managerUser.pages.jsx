import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { useState, useEffect } from "react";
import {
  createUserRequest,
  getUsersRequest,
  deleteUserRequest,
} from "../../api/api.client";
import UserForm from "../../components/UserForm";
import UserList from "../../components/UserList";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsersRequest();
        setUsers(response.data);
      } catch (error) {
        console.error("Hubo un error al cargar los usuarios:", error);
        toastr.error("Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (newUser) => {
    try {
      await createUserRequest({ ...newUser, role: "empleado" });
      toastr.success("Usuario creado exitosamente.");
      const response = await getUsersRequest();
      setUsers(response.data);
    } catch (error) {
      console.error("Hubo un error al crear el usuario:", error);
      toastr.error("Hubo un error al crear el usuario.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUserRequest(id);
      toastr.success("Usuario eliminado exitosamente.");
      const response = await getUsersRequest();
      setUsers(response.data);
    } catch (error) {
      console.error("Hubo un error al eliminar el usuario:", error);
      toastr.error("Hubo un error al eliminar el usuario.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        Administrar Usuarios
      </h1>

      <UserForm onCreateUser={handleCreateUser} />

      <h2 className="text-2xl font-semibold text-gray-600 mb-4">
        Usuarios Existentes
      </h2>
      {loading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : (
        <UserList users={users} onDeleteUser={handleDeleteUser} />
      )}
    </div>
  );
}
