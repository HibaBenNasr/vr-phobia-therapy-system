import React from "react";

const DeletePopUp = ({ open, onClose, children, id }) => {
  return (
    //backdrop
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 tranition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">
          {/* <X /> */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default DeletePopUp;
