import { JsonRpcProvider, Network } from "@mysten/sui.js";

const provider = new JsonRpcProvider(Network.DEVNET);

export default provider;
