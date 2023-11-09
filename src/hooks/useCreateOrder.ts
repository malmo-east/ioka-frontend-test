import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { axiosInstance } from '../shared/axios/axiosInstance';
import { faker } from '../shared/faker/fakerInstance';

/* Создание заказа */

interface OrderInterface {
    id: string;
    shop_id: string;
    status: 'UNPAID';
    created_at: string;
    amount: number;
    display_amount: number;
    currency: 'KZT';
    mcc: any;
    acquirer: any;
    capture_method: 'MANUAL';
    external_id: string;
    description: any;
    extra_info: any;
    attempts: number;
    due_date: any;
    split: any;
    customer_id: string;
    card_id: any;
    back_url: any;
    success_url: any;
    failure_url: any;
    template: any;
    access_token: string;
    checkout_url: string;
    payment_link_url: string;
    payments: any[];
}

export interface CreateOrderPayload {
    order: OrderInterface;
    order_access_token: string;
}

export interface CreateOrderArgs {
    external_id: string;
    customer_id: string;
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ external_id, customer_id }: CreateOrderArgs) => {
            return await axiosInstance.post<CreateOrderArgs, AxiosResponse<CreateOrderPayload>>('/v2/orders', {
                amount: faker.finance.amount({ min: 1000, max: 1000000, dec: 0 }),
                external_id,
                customer_id,
                capture_method: 'MANUAL',
                // TODO: Добавить ссылки на успешный и неуспешный сценарии
                // success_url: 'http://localhost:3000/success',
                // failure_url: 'http://localhost:3000/failure',
            });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['create-order'] }),
    });
}
