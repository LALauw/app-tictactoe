import { JsonRpcProvider, Network } from "@mysten/sui.js";
// connect to Devnet
const Provider = new JsonRpcProvider(Network.DEVNET);

export default Provider;
