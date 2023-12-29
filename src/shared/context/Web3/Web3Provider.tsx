import Web3Context from "./Web3Context";
import {
    ReactChild,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { ethers, providers } from "ethers";

import { useMoralis, useChain } from 'react-moralis'


// const defaultProvider = new providers.JsonRpcProvider(ACTIVE_NETWORK.chainRPC)

const Web3Provider = ({ children }: { children: ReactChild | ReactChild[] }) => {
    const {
        account,
        isWeb3Enabled,
        isWeb3EnableLoading,
        enableWeb3,
        Moralis,
        deactivateWeb3,
    } = useMoralis()

    const { chainId } = useChain()

    // TODO: set default provider
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
    const [signer, setSigner] = useState<ethers.Signer | null>(null)

    // refresh handler
    useEffect(() => {
        if (isWeb3Enabled) {
            return
        }
        if (typeof window !== 'undefined' && window.localStorage.getItem('connected')) {
            connectWeb3()
        }
    }, [isWeb3Enabled])

    // deactivate web3 handler
    useEffect(() => {
        let unsubscribeOnAccountChange: any;

        if (isWeb3Enabled) {
            unsubscribeOnAccountChange = Moralis.onAccountChanged((account: any) => {

                if (account == null) {
                    window.localStorage.removeItem('connected')
                    deactivateWeb3()
                }
            })
        }

        return () => {
            if (unsubscribeOnAccountChange) {
                unsubscribeOnAccountChange()
            }
        }
    }, [isWeb3Enabled])

    // activate web3 handler
    useEffect(() => {
        const setWeb3 = async () => {
            await changeSignerAndProvider()
            window.localStorage.setItem('connected', 'injected')
        }

        if (isWeb3Enabled) {
            setWeb3()
        }
    }, [isWeb3Enabled, account])

    // refresh on network change
    useEffect(() => {
        let currProvider: ethers.providers.Web3Provider;

        const networkCb = (newNetwork: any, oldNetwork: any) => {
            if (oldNetwork) {
                window.location.reload();
            }
        }

        if (window.ethereum) {
            currProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
            currProvider.on("network", networkCb);
        }

        return () => {
            if (currProvider) {
                console.log('UNSUB network');
                currProvider.off("network", networkCb)
            }
        }
    }, [])


    const connectWeb3 = async () => {
        await enableWeb3()
    }

    const changeChainTo = async (network: any) => {
        console.log('Trying to change the chain');
        // if (!(network.chainId in SUPPORTED_NETWORKS)) {
        //     console.log(`${network.chainId} Chain Not Supported!`)
        //     return null
        // }

        // try {
        //     await switchNetwork(network.chainIdHex)
        // } catch (error) {
        //     console.error(`${network.name} Chain Not Supported!`)
        // }
    }

    const changeSignerAndProvider = async () => {
        const moralisProvider: any = Moralis.provider
        const accountAddress: any = account
        const currChainId: any = chainId

        const newProvider = new ethers.providers.Web3Provider(moralisProvider)
        const newSigner = newProvider.getSigner(accountAddress)

        if (newProvider) {
            setProvider(newProvider)
        }

        if (newSigner) {
            setSigner(newSigner)
        }
    }

    return (
        <Web3Context.Provider
            value={{
                account,
                chainId: chainId ? parseInt(chainId) : null,
                chainIdHex: chainId,
                isWeb3Enabled,
                isWeb3EnableLoading,
                connectWeb3,
                signer,
                provider,
                changeChainTo,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};


const useWeb3 = (): any => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error(`Cannot use the Web3 Context`);
    }
    return context;
};


export { Web3Provider, useWeb3 }