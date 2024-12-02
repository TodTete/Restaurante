import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UserList({ users, onDeleteUser }) {
  return (
    <table className="table-auto w-full bg-white shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
              No hay usuarios disponibles.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};