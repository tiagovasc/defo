// @ts-nocheck
import '../globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider from "shared/styles/ThemeProvider/ThemeProvider";


function MyApp({ Component, pageProps }: AppProps) {
    return (
                    <ThemeProvider>
                                    <Component {...pageProps} />
                    </ThemeProvider>
    )
}

export default MyApp
