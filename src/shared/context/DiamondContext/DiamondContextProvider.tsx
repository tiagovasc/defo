import { Contract } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { NETWORK_MAPPER, SUPPORTED_NETWORKS, ConfigType } from "shared/utils/constants";
import { useWeb3 } from "../Web3/Web3Provider";
import DiamondContext from "./DiamondContext";

const initialConfig = {
    chainName: "",
    chainId: -1,
    chainRPC: "",
    chainExplorer: "",
    nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18
    }
}


const DiamondContextProvider = ({ children }: { children: any }) => {
    const [diamondContract, setDiamondContract] = useState<any>(null);

    const [config, setConfig] = useState<ConfigType>(initialConfig);

    const { signer, provider, isWeb3Enabled, chainId, account } = useWeb3()

    // INITIALIZE DIAMOND
    useEffect(() => {
        // const signerOrProvider = signer ? signer : provider;
        if (!chainId && !signer) { return; }

        if (signer) {
            connectDEFO()
        }

    }, [account, signer, provider, chainId])


    const connectDEFO = async () => {

        const networkName = NETWORK_MAPPER[chainId];
        const currentConfig = SUPPORTED_NETWORKS[networkName];
        if (!currentConfig?.deployments) {
            console.log('MISSING DEPLOYMENTS AT connectDEFO');
            return
        }

        const mainContract = new Contract(currentConfig.deployments.diamond.address, currentConfig.deployments.diamond.abi, signer);

        setDiamondContract(mainContract);
        setConfig(currentConfig);
    }

    return (
        <DiamondContext.Provider value={{ diamondContract, config }}>
            {children}
        </DiamondContext.Provider>
    );
}


const useDiamondContext = () => {
    const context = useContext(DiamondContext);

    if (context === undefined) {
        throw new Error('useDiamondContext must be used within a DiamondContextProvider!');
    }

    return context
}

export { DiamondContextProvider, useDiamondContext };
