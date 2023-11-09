import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './shared/react-query/queryClient';
import { PaymentPage } from './pages/PaymentPage/Component';
import { SuccessPage } from './pages/SuccessPage';
import { FailurePage } from './pages/FailurePage';
import { ErrorPage } from './widgets/ErrorPage';

export default function App() {
    const [client] = React.useState(() => queryClient);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <PaymentPage />,
            errorElement: <ErrorPage />,
        },
        {
            path: 'success',
            element: <SuccessPage />,
            errorElement: <ErrorPage />,
        },
        {
            path: 'failure',
            element: <FailurePage />,
            errorElement: <ErrorPage />,
        },
    ]);

    return (
        <QueryClientProvider client={client}>
            <RouterProvider router={router} fallbackElement={<div>Загрузка</div>} />
        </QueryClientProvider>
    );
}
