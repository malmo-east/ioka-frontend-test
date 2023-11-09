import { QueryClient } from '@tanstack/react-query';

function queryErrorHandler(error: unknown): void {
    const title = error instanceof Error ? error.message : 'error connecting to server';
    console.error(title);
}

export const defaultQueryClientOptions = {
    queries: {
        onError: queryErrorHandler,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    },
    mutations: {
        onError: queryErrorHandler,
    },
};

export const queryClient = new QueryClient({
    defaultOptions: defaultQueryClientOptions,
});
