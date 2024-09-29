"use client";

import { FormEvent, useState } from "react";
import styles from "../styles/dashboard.module.css";
export default function Dashboard() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string | null>(null);
  const [nft, setNft] = useState<string | null>(null);
  const [hashNft, setHashNft] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const ipfsUrl = await uploadRequest.json();
      setUrl(ipfsUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const uploadJson = async (
    name: string,
    description: string,
    users: string[]
  ) => {
    try {
      setUploading(true);
      const jsonToSend = {
        description,
        image: url,
        name,
      };
      // Crear un archivo JSON a partir de los datos
      const jsonFile = new Blob([JSON.stringify(jsonToSend)], {
        type: "application/json",
      });

      // Crear un FormData para enviar el archivo al API
      const formData = new FormData();
      formData.append("file", jsonFile, `data_${name}.json`); // Adjuntar el archivo JSON con un nombre

      // Enviar el archivo JSON al API
      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Respuesta del servidor:", result);
      setNft(result);
      console.log(
        JSON.stringify({
          receivers: users,
          uri: result,
        })
      );
      const mint = await fetch("http://localhost:3001/mint", {
        method: "POST",
        body: JSON.stringify({
          receivers: users,
          uri: result,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataMint = await mint.json();
      setHashNft(dataMint.trx);
      setUploading(false);
    } catch (e) {
      console.log("Error al enviar el archivo:", e);
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUrl(null);
      // Crear una URL para previsualizar la imagen
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const users = String(formData.get("users"));
    const usersToUse = users.split(",").map((elemento) => elemento.trim());
    await uploadJson(name, description, usersToUse);
  };
  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <h1 style={{ fontSize: "2rem" }}>
        Bienvenido a Transparent Process Protocol
      </h1>
      <br />
      <div className={styles.load_files}>
        <input type="file" onChange={handleChange} />
        {previewUrl && !url && (
          <div style={{ marginTop: "20px" }}>
            <p>Tu imagen se verá así:</p>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "500px", marginTop: "10px" }}
            />
          </div>
        )}
        <button
          className={styles.load_files_button}
          disabled={!previewUrl}
          onClick={uploadFile}
        >
          Cargar imagen
        </button>
        {url && (
          <div className={styles.url}>
            <p>Imagen subida con éxito:</p>
            <img
              src={url}
              alt="Uploaded to IPFS"
              style={{ maxWidth: "500px" }}
            />
            <div className={styles.redirect_button}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Ver en IPFS
              </a>
            </div>
            <form className={styles.email_form} onSubmit={onSubmit}>
              <div className={styles.email_form_row}>
                <label>Digita el nombre de tu NFT: </label>
                <input type="text" name="name" />
              </div>
              <div className={styles.email_form_row}>
                <label>Digita los usuarios receptores: </label>
                <input type="text" name="users" />
              </div>
              <div className={styles.email_form_row}>
                <label>Digita una descripción para tu NFT: </label>
                <input type="text" name="description" />
              </div>
              <button className={styles.email_form_button} type="submit">
                Crear NFT
              </button>

              {nft && (
                <div className={styles.redirect_button}>
                  <a href={nft} target="_blank" rel="noopener noreferrer">
                    Ver NFTs en IPFS
                  </a>
                </div>
              )}
              {hashNft && <div>TrxHash: {hashNft}</div>}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
