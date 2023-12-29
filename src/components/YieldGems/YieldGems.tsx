import { Button, Grid, } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import ContentBox from "../ContentBox"
import { useWeb3 } from "shared/context/Web3/Web3Provider"
import ModalLayout from "shared/components/DialogLayout/ModalLayout"
import YieldGemModalBox from "./YieldGemModalBox/YieldGemModalBox"
import YieldGemInfoBox from "./YieldGemInfoBox/YieldGemInfoBox"
import { Gem } from "shared/types/DataTypes"
import { useDiamondContext } from "shared/context/DiamondContext/DiamondContextProvider"
import { useGemsContext } from "shared/context/GemContext/GemContextProvider"
import { ACTIVE_NETOWORKS_COLLECTION } from "shared/utils/constants"
import { useChain } from 'react-moralis'
import { BigNumber } from "ethers"


const YieldGems = () => {
    const gemsModalRef = useRef<any>();
    const { isWeb3Enabled, account } = useWeb3()
    const { chainId } = useChain()

    const [gemsCount, setGemsCount] = useState([0, 0, 0])
    const { diamondContract } = useDiamondContext()

    const { gemsConfig, gemsCollection } = useGemsContext()

    const [availableBoosts, setAvailableBoosts] = useState({
        delta: [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)],
        omega: [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)]
    })

    useEffect(() => {
        const load = async () => {
            const currentGemsCount = [0, 0, 0];
            const currAvailableBoosts: any = await getBoosts()
            
            gemsCollection.forEach((gem: Gem) => {
                currentGemsCount[gem.gemTypeId]++;
            })
            setGemsCount(currentGemsCount);
            setAvailableBoosts(currAvailableBoosts)
        }

        load()
    }, [gemsCollection])


    const handleOpenModal = () => {
        if (!gemsModalRef.current) { return; }
        gemsModalRef?.current?.handleOpen();
    }

    const handleCloseModal = () => {
        if (!gemsModalRef.current) { return; }
        gemsModalRef?.current?.handleClose();
    }

    const getMintWindow = async (gemType: number) => {
        const currentMintWindow = await diamondContract.getMintWindow(gemType)
        return {
            mintCount: currentMintWindow.mintCount,
            endOfMintLimitWindow: currentMintWindow.endOfMintLimitWindow
        }
    }

    const getBoosts = async () => {
        // available boosts

        // gemType, booster
        const boosterPromise = await Promise.all([
            diamondContract.getBooster(account, 0, 1),
            diamondContract.getBooster(account, 1, 1),
            diamondContract.getBooster(account, 2, 1),

            diamondContract.getBooster(account, 0, 2),
            diamondContract.getBooster(account, 1, 2),
            diamondContract.getBooster(account, 2, 2),
        ])

        const currentBoosts = {
            delta: [boosterPromise[0], boosterPromise[1], boosterPromise[2]],
            omega: [boosterPromise[3], boosterPromise[4], boosterPromise[5]],
        }
        return currentBoosts
    }


    return (
        <>
            <ContentBox
                title="Your Yield Gems"
                color="#C6E270"
                button={<Button
                    disabled={!(isWeb3Enabled || chainId && ACTIVE_NETOWORKS_COLLECTION.includes(parseInt(chainId, 16)))}
                    onClick={handleOpenModal}
                    variant="contained"
                    color="secondary"
                    sx={{
                        backgroundColor: "#C6E270",
                        "&:hover": {
                            backgroundColor: "#7a8c42",
                        }
                    }}
                >
                    CREATE YIELD GEM
                </Button>}
            >
                <Grid
                    container
                    justifyContent={"space-between"}
                    sx={{
                        height: "100%"
                    }}
                >
                    <YieldGemInfoBox
                        minted={gemsCount[0]}
                        gemType={0}
                        name="Sapphire"
                    />

                    <YieldGemInfoBox
                        minted={gemsCount[1]}
                        gemType={1}
                        name="Ruby"
                    />

                    <YieldGemInfoBox
                        minted={gemsCount[2]}
                        gemType={2}
                        name="Diamond"
                    />
                </Grid>
            </ContentBox>

            <ModalLayout
                ref={gemsModalRef}
            >

                <Grid
                    container
                    justifyContent={"space-between"}
                    sx={{
                        height: "100%"
                    }}
                >

                    <YieldGemModalBox
                        deltaBoosts={availableBoosts.delta[0]}
                        omegaBoosts={availableBoosts.omega[0]}
                        name={"Sapphire"}
                        gemType={0}
                        gemConfig={gemsConfig.gem0}
                        gemTypeMintWindow={() => getMintWindow(0)}
                        handleCloseModal={handleCloseModal}
                    />

                    <YieldGemModalBox
                        deltaBoosts={availableBoosts.delta[1]}
                        omegaBoosts={availableBoosts.omega[1]}
                        name={"Ruby"}
                        gemType={1}
                        gemTypeMintWindow={() => getMintWindow(1)}
                        handleCloseModal={handleCloseModal}
                        gemConfig={gemsConfig.gem1}
                    />

                    <YieldGemModalBox
                        deltaBoosts={availableBoosts.delta[2]}
                        omegaBoosts={availableBoosts.omega[2]}
                        name={"Diamond"}
                        gemType={2}
                        gemTypeMintWindow={() => getMintWindow(2)}
                        handleCloseModal={handleCloseModal}
                        gemConfig={gemsConfig.gem2}
                    />

                </Grid>

            </ModalLayout>
        </>
    )
}

export default YieldGems
