import { createContext } from "react";
import IWeb3Context from "./types/IWeb3Context";


// const Web3Context = createContext<IWeb3Context>({
//     status: "NOT_CONNECTED",
//     connect: () => false,
//     signer: undefined,
//     account: undefined,
//     switchNetwork: () => false,
//     config: null
// });

const Web3Context = createContext<any>({});

export default Web3Context