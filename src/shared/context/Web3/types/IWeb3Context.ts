import { providers, Signer } from "ethers";
import { ConfigType } from "shared/utils/constants";
import CHAIN_STATUS from "./ChainStatusTypes";

export interface IWeb3Context {
    status: CHAIN_STATUS;
    connect: any;
    signer: Signer | providers.Provider | undefined;
    account: string | undefined;
    switchNetwork: any,
    config: ConfigType | null
}


export default IWeb3Context