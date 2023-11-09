import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { axiosInstance } from '../shared/axios/axiosInstance';
import { faker } from '../shared/faker/fakerInstance';

/* Создание плательщика */

interface CustomerAccountResourcesInterface {
    id: string;
    is_default: boolean;
    created_at: string;
    status: 'ACCEPTED';
}

interface CustomerAccountInterface {
    id: string;
    shop_id: string;
    status: 'ACCEPTED';
    amount: number;
    created_at: string;
    resources: CustomerAccountResourcesInterface[];
}

interface CustomerInterface {
    id: string;
    status: 'PENDING';
    created_at: string;
    external_id: string;
    accounts: CustomerAccountInterface[];
    email: string;
    phone: string;
    access_token: string;
    checkout_url: string;
}

export interface CreateCustomerPayload {
    customer: CustomerInterface;
    customer_access_token: string;
}

export interface CreateCustomerArgs {
    email: string;
    phone: string;
    external_id: string;
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return await axiosInstance.post<CreateCustomerArgs, AxiosResponse<CreateCustomerPayload>>('/v2/customers', {
                email: faker.internet.email(),
                phone: faker.phone.number().replace(/[^\d+]/g, ''),
                external_id: faker.string.uuid(),
            });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['create-customer'] }),
    });
}
