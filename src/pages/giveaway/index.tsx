import {Box, Button, Container, styled, TextField, Tooltip} from '@mui/material';
import Navbar from 'components/Navbar';
import {BigNumber, Contract, ethers} from 'ethers';
import {NextPage} from 'next/types';
import {BaseSyntheticEvent, useState} from 'react';
import {useDiamondContext} from 'shared/context/DiamondContext/DiamondContextProvider';
import {useSnackbar} from 'shared/context/Snackbar/SnackbarProvider';
import {useWeb3} from '../../shared/context/Web3/Web3Provider';

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

const Giveaway: NextPage = () => {
    const snackbar = useSnackbar()
    const {diamondContract, config} = useDiamondContext();
    const {account, signer} = useWeb3();
    const [inputValue, setInputValue] = useState(1);
    const [inputError, setInputError] = useState({hasError: false, message: ''});

    const handleChangeGiveaway = (input: BaseSyntheticEvent) => {
        const value = input.target.value;
        if (value > 20) {
            setInputError({hasError: true, message: '20 DEFO is the maximum amount'})
        } else if (value <= 0) {
            setInputError({hasError: true, message: '1 DEFO is the minimum amount'})
        } else {
            setInputError({hasError: false, message: ''})
        }
        setInputValue(value);
    }

    const handleGiveawayTransfer = async () => {
        const defoAmount: BigNumber = ethers.utils.parseEther(inputValue.toString());
        try {
            const defo = new Contract(config.deployments.defo.address, config.deployments.defo.abi, signer)
            const defoAllowance = await defo.allowance(account, config.deployments.diamond.address)

            if (defoAllowance.isZero()) {
                const tx = await defo.approve(config.deployments.diamond.address, ethers.constants.MaxUint256)
                await tx.wait()
            }

            const tx = await diamondContract.giveaway(defoAmount)
            snackbar.execute('Listing you in the lottery, please wait.', 'info')
            await tx.wait()
            snackbar.execute('Successfully listed', 'success')
        } catch (error: any) {
            console.log('error on giveaway transfer: ', error);
            snackbar.execute(error?.error?.message || error?.data?.message || error?.reason || 'Unable to list you for the lottery, please contact DEFO support', 'error')
        }
    }

    return (
        <>
            <Navbar/>
            <Container>
                <Box textAlign={'center'}>
                    <TextField
                        InputProps={{inputProps: {min: 1, max: 20}}}
                        value={inputValue}
                        onChange={handleChangeGiveaway}
                        type="number"
                        error={inputError.hasError}
                        color="primary"
                        size="small"
                        label="DEFO Amount"
                        sx={overrideStyles}
                        helperText={inputError.hasError ? inputError.message : ''}
                    />
                    <Box textAlign="center" mt={3}>
                        <Tooltip
                            title="Do not use this feature unless you have talked with the DEFO team. This is only meant to be used for the weekly lottery.">
                            <Button
                                onClick={handleGiveawayTransfer}
                                variant="contained"
                                disabled={inputError.hasError}
                                size="large"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        color: 'gray',
                                        borderColor: 'gray',
                                    }
                                }}>Giveaway Vault Transfer</Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default Giveaway
