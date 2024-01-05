import React from 'react'
import { Typography } from '@mui/material'

function CustomTypography({ variant, text, color }) {
    return (
        <Typography sx={{ marginTop: 5, marginBottom: 3, color:{color}, fontWeight:'bold' }} variant={variant} color={color}>
            {text}
        </Typography>
    )
}

export default CustomTypography