import { Box, Button } from "@mui/material"
import { SUPPORTED_NETWORKS } from "shared/utils/constants"
import { useChain } from 'react-moralis'


export const InvalidNetworkView = ({ }: {}) => {
    const { switchNetwork } = useChain()
    

    const handleSwitchNetwork = (chainId: number) => { 
        switchNetwork(`0x${chainId.toString(16)}`)
    }


    return (
        <Box height="70%" textAlign={"center"}>
            <h2>Network Not Supported</h2>
            <Box>
                <Button
                    onClick={() => handleSwitchNetwork(SUPPORTED_NETWORKS.avax_mainnet.chainId)}
                    variant="contained"
                    sx={{
                        margin: 1,
                        padding: 2,
                        mr: 3,
                        minWidth:"300px"
                    }}
                >
                    Switch To Avalanche
                </Button>

                <Button
                    onClick={() => handleSwitchNetwork(SUPPORTED_NETWORKS.fuji_testnet.chainId)}
                    variant="contained"
                    sx={{
                        margin: 1,
                        padding: 2,
                        ml: 3,
                        minWidth:"300px"
                    }}
                >
                    Switch To Fuji TESTNET
                </Button>
            </Box>
        </Box>
    )
}
