import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    styled,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import Navbar from 'components/Navbar';
import {BigNumber, Contract, ethers} from 'ethers';
import {NextPage} from 'next/types';
import {BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {useDiamondContext} from 'shared/context/DiamondContext/DiamondContextProvider';
import {useSnackbar} from 'shared/context/Snackbar/SnackbarProvider';
import {useWeb3} from '../../shared/context/Web3/Web3Provider';
import {formatDecimalNumber} from '../../shared/utils/format';
import {BigNumberish} from '@ethersproject/bignumber';
import {ContractFunction} from '@ethersproject/contracts/src.ts';

const overrideStyles = {
    '& label.Mui-focused': {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.7)'
        }
    },
    width: 250
}


const P2Modal: NextPage = () => {
    /// P2 is over, this is a hardcoded stop disabling the buttons
    const P2IsOver = true;

    const snackbar = useSnackbar()
    const {diamondContract} = useDiamondContext();
    const {account, signer} = useWeb3();
    const [inputError, setInputError] = useState({hasError: false, message: ''});

    const [startedTransitionToP2, setStartedTransitionToP2] = useState(false);
    const [rot, setRot] = useState(null);
    const [share, setShare] = useState(null);
    const [daiClaimed, setDaiClaimed] = useState(null);
    const [defoDeposited, setDefoDeposited] = useState(null);
    const [p2Finance, setP2Finance] = useState<{ lpDai: string, totalRot: string } | null>(null);
    const [enabledTransitionToP2, setEnabledTransitionToP2] = useState(false);

    const [transactionHash, setTransactionHash] = useState(null);

    useEffect(() => setEnabledTransitionToP2(!!account && startedTransitionToP2 && Number(defoDeposited) == 0 && Number(daiClaimed) == 0),
        [account, startedTransitionToP2, defoDeposited, daiClaimed]);

    const logError = (error: any) => {
        console.error('Error on get p2 data  ', error);
        snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'Error. Please contact DEFO support', 'error')
    }
    const formatAmount = (value: BigNumberish) => formatDecimalNumber(+ethers.utils.formatEther(value), 2);

    useEffect(() => {
        console.log(diamondContract);
        if (diamondContract) {
            try {

                diamondContract.getP2CutOverTime().then((value: BigNumber) => setStartedTransitionToP2(!value.eq(0)));
                diamondContract.getMyP2RotValue().then((value: BigNumber) => setRot(formatAmount(value)));
                diamondContract.getMyP2DaiValue().then((value: BigNumber) => setShare(formatAmount(value)));
                diamondContract.getMyP2DaiReceived().then((value: BigNumber) => setDaiClaimed(formatAmount(value)));
                diamondContract.getMyP2DepositedToVault().then((value: BigNumber) => setDefoDeposited(formatAmount(value)));
                diamondContract.getP2Finance().then((value: [BigNumber, BigNumber]) => setP2Finance({
                    lpDai: formatAmount(value[0]),
                    totalRot: formatAmount(value[1])
                }));
            } catch (error: any) {
                logError(error);
            }
        }
    }, [diamondContract, account, transactionHash]);

    const handlePutToVault = async () => {
        try {
            const tx = await diamondContract.p2PutIntoVault();
            snackbar.execute('Transferring ROT to the vault, please wait.', 'info')
            setTransactionHash(await tx.wait());
            snackbar.execute('Successfully deposited', 'success')
        } catch (error: any) {
            console.log('error on ROT transfer: ', error);
            snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'Please contact DEFO support', 'error')
        }
    }

    const handleClaimDai = async () => {
        try {
            const tx = await diamondContract.p2ClaimDai();
            snackbar.execute('Claiming dai, please wait.', 'info')
            setTransactionHash(await tx.wait());
            snackbar.execute('Successfully claimed', 'success')
        } catch (error: any) {
            console.log('error on ROT transfer: ', error);
            snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'Please contact DEFO support', 'error')
        }
    }

    return (
        <>
            <Navbar/>
            <Container maxWidth={'xs'}>
                <Box textAlign={'center'}>
                    {P2IsOver ?
                        <Typography variant="h4" sx={{color: 'white', mt: 5, mb: 5}}>
                            DEFO ROT<br/>Claim Period<br/> Is Over
                        </Typography>
                        :
                        <Typography variant="h4" sx={{color: 'white', mt: 5, mb: 5}}>
                            DEFO ROT for Phase 2
                        </Typography>}
                    <Typography variant="h5" sx={{color: 'white', mt: 5, mb: 5}}>
                        <span style={{fontWeight: 700}}>ROT:</span>
                        {' '}
                        {rot != null ? `${rot} DEFO` :
                            <CircularProgress size={30}/>}
                    </Typography>
                    <Grid container spacing={0} sx={{color: 'white', mt: 5, mb: 5}}>
                        <Grid item xs={6}>
                            <Typography sx={{fontWeight: 600, textAlign: 'right', marginRight: '30px'}}>Total
                                liquidity:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{textAlign: 'left'}}>{p2Finance != null ? `${p2Finance.lpDai} DAI` :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{fontWeight: 600, textAlign: 'right', marginRight: '30px'}}>Total
                                ROT:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{textAlign: 'left'}}>{p2Finance != null ? `${p2Finance.totalRot} DEFO` :
                                <CircularProgress size={10}/>}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{fontWeight: 600, textAlign: 'right', marginRight: '30px'}}>Your
                                share:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{textAlign: 'left'}}>
                                {share != null ? `${share} DAI` :
                                    <CircularProgress size={10}/>}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box textAlign="center" mt={3} sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Tooltip title="Deposit ROT to the vault">
                            <Box>
                                <Button
                                    onClick={handlePutToVault}
                                    variant="contained"
                                    disabled={!enabledTransitionToP2}
                                    size="large"
                                    sx={{
                                        marginBottom: '20px',
                                        minWidth: '150px',
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            color: 'gray',
                                            borderColor: 'gray',
                                        }
                                    }}>Vault</Button>
                                {Number(defoDeposited) != 0 &&
                                    <Typography>already deposited<br/>{defoDeposited} DEFO</Typography>}
                            </Box>
                        </Tooltip>
                        <Tooltip
                            title="Claim the liquidity share proportionally to ROT">
                            <Box>
                                <Button
                                    onClick={handleClaimDai}
                                    variant="contained"
                                    disabled={!enabledTransitionToP2}
                                    size="large"
                                    sx={{
                                        marginBottom: '20px',
                                        minWidth: '150px',
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            color: 'gray',
                                            borderColor: 'gray',
                                        }
                                    }}>DAI</Button>
                                {Number(daiClaimed) != 0 &&
                                    <Typography>already claimed<br/> {daiClaimed} DAI</Typography>}

                            </Box>
                        </Tooltip>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default P2Modal
