"use client";

import { useState, useEffect, FormEvent } from "react";
import styles from "../../styles/login.module.css";
import { useSignMessage } from "wagmi";
import useActor from "../../hooks/useActor";
import CryptoJS from "crypto-js";
import Modal, { ITypeMessage } from "../modal";
import { privateKeyToAccount } from "viem/accounts";
import { useRouter } from "next/navigation";

export default function Login() {
  const [server] = useActor();
  const secretWord = "mi_clave_secreta_123";
  const [isSelected, setIsSelected] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState<ITypeMessage>("info");
  const [messageModal, setMessageModal] = useState("");
  const whiteList = ["prueba@mail.com"];
  const router = useRouter();

  const createCypher = (value: string) => {
    const textoCifrado = CryptoJS.AES.encrypt(value, secretWord).toString();
    return textoCifrado;
  };

  const deCypher = (value: string) => {
    const bytes = CryptoJS.AES.decrypt(value, secretWord);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const dni = formData.get("dni");
    const newPassword = String(CryptoJS.SHA256(password));
    // const newPassword = createCypher(String(password));
    try {
      if (isNewAccount) {
        const request = await fetch("http://localhost:3001/new-wallet");
        const { cipherAddress, cipherPrivateKey } = await request.json();
        const validation = await server.setAccounts(
          email,
          newPassword,
          cipherAddress,
          cipherPrivateKey,
          dni
        );
        if (validation == "USER_CREATED") {
          setTypeModal("success");
          setMessageModal("Usuario creado con éxito");
          setIsModalOpen(true);
        } else {
          setTypeModal("error");
          setMessageModal("Error creando usuario");
          setIsModalOpen(true);
        }
      } else {
        console.log({ email, newPassword });
        const validation = await server.validateAccounts(email, newPassword);
        console.log({ validation, email, newPassword });
        if (validation.length == 128) {
          setTypeModal("success");
          const privateKey = deCypher(validation);
          const pubKey = privateKeyToAccount(privateKey).address;
          sessionStorage.setItem("pubKey", pubKey);
          sessionStorage.setItem("privKey", validation);
          console.log({ privateKey, pubKey });
          setMessageModal("Usuario continua con éxito");
          setIsModalOpen(true);
          if (whiteList.includes(String(email))) {
            router.push("/dashboard");
          } else {
            router.push("/verify");
          }
        } else {
          setTypeModal("error");
          setMessageModal("Error de correo o contraseña");
          setIsModalOpen(true);
        }
      }
    } catch (ex: any) {
      console.log({ error: ex.message });
    }
  };

  return (
    <div>
      {!isSelected && (
        <div>
          <form className={styles.email_form} onSubmit={onSubmit}>
            <div className={styles.email_form_row}>
              <label>Digita tu correo: </label>
              <input type="text" name="email" />
            </div>
            <div className={styles.email_form_row}>
              <label>Digita tu contraseña: </label>
              <input type="password" name="password" />
            </div>
            {isNewAccount && (
              <div className={styles.email_form_row}>
                <label>Digita tu DNI: </label>
                <input type="text" name="dni" />
              </div>
            )}
            <button className={styles.email_form_button} type="submit">
              {isNewAccount ? "Crear Cuenta" : "Iniciar Sesión"}
            </button>
            <div
              className={styles.checkbox}
              onClick={() => setIsNewAccount(!isNewAccount)}
            >
              <input
                className={styles.checkbox_checker}
                type="checkbox"
                checked={isNewAccount}
              />
              <label>Quiero crear mi cuenta</label>
            </div>
          </form>
        </div>
      )}
      <div
        className={styles.checkbox}
        onClick={() => setIsSelected(!isSelected)}
      >
        <input
          className={styles.checkbox_checker}
          type="checkbox"
          checked={isSelected}
        />
        <label>Soy usuario avanzado y quiero usar mi propia wallet</label>
      </div>
      <div className={styles.checkbox_wallet_connect}>
        {isSelected && <w3m-button />}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        text={messageModal}
        typeMessage={typeModal}
      />
    </div>
  );
}
