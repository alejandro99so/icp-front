"use client";

import { useEffect, useState } from "react";
import { Web3 } from "web3";
import constants from "../../../constants.json";
import styles from "../styles/verify.module.css";
// import { useState } from "react";
import useActor from "../hooks/useActor";

export default function Verify() {
  const [server] = useActor();
  const [totalTrx, setTotalTrx] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);
  const [nftDescription, setNftDescription] = useState<string | null>(null);
  const [pubKeyUser, setPubKeyUser] = useState<string | null>(null);
  const [idDocUser, setIdDocUser] = useState<string | null>(null);
  useEffect(() => {
    const getMyNfts = async () => {
      const pubKey = sessionStorage.getItem("pubKey");
      const TTPChainRpc =
        "https://subnets.avacloud.io/d7725473-29c7-4fb3-918d-993d889f5fdc";
      const web3 = new Web3(TTPChainRpc);
      const nft = new web3.eth.Contract(
        constants.abiErc721,
        constants.addressErc721
      );
      const trx = await nft.methods.balanceOf(pubKey).call();
      setTotalTrx(Number(trx));
      setPubKeyUser(pubKey);

      const tokenUri = await nft.methods.tokenURI(2).call();
      console.log({ pubKey, trx, tokenUri });
      if (tokenUri) {
        const dataUri = await fetch(String(tokenUri));
        const _dataUri = await dataUri.json();

        setImageUri(_dataUri.image);
        setNftName(_dataUri.name);
        setNftDescription(_dataUri.description);
        console.log({ _dataUri });
      }
      const privKey = sessionStorage.getItem("privKey");
      const idDoc = await server.validateDocId(privKey);
      setIdDocUser(idDoc);
      console.log({ idDoc });
    };
    getMyNfts();
  }, []);
  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <div className={styles.main_verify}>
        <h1>
          Panel administrativo de
          <br />
          Address: {pubKeyUser} <br />
          DNI: {idDocUser}
        </h1>
        {totalTrx > 0 && (
          <div>
            <div>
              El usuario tiene {totalTrx}{" "}
              {totalTrx == 1 ? "transacción" : "transacciones"} NFT
            </div>
            <div>
              Más herramientas para administrar tus NFT, próximamente...
            </div>
          </div>
        )}
        {imageUri && (
          <img
            src={imageUri}
            alt="imageNFT"
            style={{ maxWidth: "500px", marginTop: "10px" }}
          />
        )}
        <div className={styles.text_end}>
          {nftName && <div>Nombre: {nftName}</div>}
          {nftDescription && <div>Descripción: {nftDescription}</div>}
        </div>
      </div>
    </main>
  );
}
