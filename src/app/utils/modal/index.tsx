import React, { FC } from "react";

const valueTypeMessage = {
  error: "Error",
  info: "Información",
  success: "Super!",
};

export type ITypeMessage = "error" | "info" | "success";

// Definimos las propiedades que la Modal aceptará
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  typeMessage: ITypeMessage;
}

// Estilos mejorados para la modal
const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "40px",
  width: "500px",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
  color: "black",
  textAlign: "center",
};

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
};

// Definimos el componente Modal con sus props
const Modal: FC<ModalProps> = ({ isOpen, onClose, text, typeMessage }) => {
  if (!isOpen) return null; // Si la modal no está abierta, no se renderiza

  return (
    <>
      {/* Fondo oscuro */}
      <div style={overlayStyles} onClick={onClose}></div>

      {/* Contenido de la modal */}
      <div style={modalStyles}>
        <h1>{valueTypeMessage[typeMessage]}</h1>
        <p>{text}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default Modal;
