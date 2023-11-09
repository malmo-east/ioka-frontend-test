import React, { FC } from 'react';

import { Box, Stack, Typography, Container, Skeleton } from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export const FailurePage: FC = () => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Stack spacing={2} direction="column" useFlexGap alignItems="center">
                    <CancelRoundedIcon fontSize="large" color="error" />
                    <Typography variant="h3" component="h3" gutterBottom={false} align="center">
                        Оплата не прошла!
                    </Typography>
                </Stack>
            </Box>
        </Container>
    );
};
