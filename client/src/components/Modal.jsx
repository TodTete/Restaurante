import PropTypes from "prop-types"; 

const Modal = ({ isOpen, title, children, onSave, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">{title}</h2>
        <div>{children}</div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={onSave}
          >
            Guardar
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Modal;
