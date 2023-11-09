import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

export const Styled = {
    Banner: styled(Box)`
        width: 100%;
        height: 124px;
        background-color: ${grey.A200};
        margin-bottom: 16px;
    `,
    Form: styled(Box)`
        width: 100%;
        height: auto;
        margin-bottom: 16px;
    `,
    LogoItem: styled(Box)`
        width: 100%;
        height: 48px;
        background-color: ${grey.A200};
    `,
};
