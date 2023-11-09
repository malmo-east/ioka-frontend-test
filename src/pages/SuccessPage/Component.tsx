import React, { FC } from 'react';

import { Box, Stack, Typography, Container } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export const SuccessPage: FC = () => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Stack spacing={2} direction="column" useFlexGap alignItems="center">
                    <CheckCircleRoundedIcon fontSize="large" color="success" />
                    <Typography variant="h3" component="h3" gutterBottom={false} align="center">
                        Успешная оплата!
                    </Typography>
                </Stack>
            </Box>
        </Container>
    );
};
