import { Box, Divider, Grid, Typography, useTheme } from "@mui/material"
import { ReactChild, ReactNode } from "react"


const ContentBox = ({ title, children, button, color }: { title: string, children: ReactChild, button?: ReactNode, color: string }) => {

  const theme = useTheme()

  return (
    <Box
      width={"100%"}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: {
          xs: theme.spacing(4)
        }
      }}
    >
      <Grid
        container
        justifyContent={"space-between"}
      >
        <Grid item>
          <Typography variant='h5' fontWeight={"500"} sx={{ margin: theme.spacing(0.5, 0) }} >{title}</Typography>
        </Grid>

        {button && <Grid item md="auto">{button}</Grid>}
      </Grid>
      <Box sx={{ position: "relative", marginBottom: theme.spacing(2), marginTop: theme.spacing(1) }} >
        <Divider sx={{ borderWidth: "1.5px" }} />
        <Divider
          sx={{
            backgroundColor: color,
            position: "absolute",
            overflow: "hidden",
            top: "0px",
            height: "2.5px",
            "& span": {
              paddingLeft: 0,
              paddingRight: 0,
            }
          }} >
          <Typography variant='h5' fontWeight={"bold"} >{title}</Typography>
        </Divider>
      </Box>
      {children}
    </Box>
  )
}


export default ContentBox