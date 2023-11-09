import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export const ErrorPage = () => {
    const navigate = useNavigate();
    const handleReloadPage = () => {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    };

    const handleMainPage = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Stack spacing={2} alignItems="center" useFlexGap>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Произошла ошибка 🥲
                    </Typography>
                    <Stack spacing={2} direction="row" useFlexGap>
                        <Button variant="contained" onClick={handleMainPage}>
                            На главную
                        </Button>
                        <Button variant="outlined" onClick={handleReloadPage}>
                            Обновить страницу
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
};
