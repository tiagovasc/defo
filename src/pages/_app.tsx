// @ts-nocheck
import '../globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider from "shared/styles/ThemeProvider/ThemeProvider";
import { Web3Provider } from 'shared/context/Web3/Web3Provider'
import { SnackbarProvider } from 'shared/context/Snackbar/SnackbarProvider'
import { DiamondContextProvider } from 'shared/context/DiamondContext/DiamondContextProvider';
import { GemContextProvider } from 'shared/context/GemContext/GemContextProvider';
import { StatsContextProvider } from 'shared/context/StatsContext/StatsContextProvider';
import { MoralisProvider } from 'react-moralis'


function MyApp({ Component, pageProps }: AppProps) {
    return (
        // <MoralisProvider initializeOnMount={false}>
        //     <Web3Provider>
        //         <DiamondContextProvider>
                    <ThemeProvider>
                        <SnackbarProvider>
                            <GemContextProvider>
                                <StatsContextProvider>
                                    <Component {...pageProps} />
                                </StatsContextProvider>
                            </GemContextProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
        //         </DiamondContextProvider>
        //     </Web3Provider>
        // </MoralisProvider>
    )
}

export default MyApp
