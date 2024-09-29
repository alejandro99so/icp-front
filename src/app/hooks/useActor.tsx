import { Actor, AnonymousIdentity, HttpAgent } from "@dfinity/agent";
import { canisters } from "../utils/canisters";

const useActor = (canisterName = "server") => {
  //   if (!canisterName) return new Error("The 'canisterName' argument is undefined");
  const canister = canisters[canisterName];

  if (!canister)
    return new Error("The 'canisterName' argument isn't a valid canister");

  const agent = new HttpAgent({
    // http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    host: "http://127.0.0.1:4943/",
    // host: "https://identity.ic0.app/",
    identity: new AnonymousIdentity(),
  });
  const isLocal = true;
  //process.env.ENVIRONMENT === "development";

  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running",
        err
      );
    });
  }

  // actor creation
  const actor = Actor.createActor(canister.idlFactory, {
    agent,
    canisterId: canister.canisterId,
  });

  return [actor];
};

export default useActor;
