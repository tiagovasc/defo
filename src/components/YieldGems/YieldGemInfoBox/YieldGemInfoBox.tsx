import { FiberManualRecord } from "@mui/icons-material"
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material"
import { primaryColorMapper } from "../utils/colorMapper"


const YieldGemInfoBox = ({ gemType, name, minted }: {
    gemType: 0 | 1 | 2,
    name: "Sapphire" | "Ruby" | "Diamond",
    minted: number,
}) => {
    const theme = useTheme()

    return (
        <Grid item xs={3.5}>
            <Paper
                sx={{
                    padding: {
                        xs: theme.spacing(0.5),
                        md: theme.spacing(2),
                    },
                    height: "100%",
                    border: `solid 1px ${primaryColorMapper[gemType]}`
                }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FiberManualRecord sx={{
                        marginRight: {
                            xs: theme.spacing(0),
                            md: theme.spacing(1),
                        },
                        fontSize: "16px",
                        color: primaryColorMapper[gemType]
                    }} />
                    <Typography variant="body2" fontWeight={"bold"} color={primaryColorMapper[gemType]}>{name}</Typography>
                </Box>
                <Typography sx={{ margin: theme.spacing(1, 0) }} variant="h4" fontWeight={"600"}>
                    {minted}
                </Typography>
            </Paper>
        </Grid>
    )
}

export default YieldGemInfoBox