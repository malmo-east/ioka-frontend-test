import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { axiosInstance } from '../shared/axios/axiosInstance';

/* Создание платежа */

interface CreateCardPaymentAcquirerInterface {
    name: string;
    reference: string;
    order_id: string;
    invoice_id: any;
}

interface CreateCardPaymentPayerInterface {
    type: 'CARD';
    pan_masked: string;
    expiry_date: string;
    holder: string;
    payment_system: any;
    emitter: any;
    email: any;
    phone: any;
    customer_id: any;
    card_id: any;
    iin: any;
}

export interface CreateCardPaymentPayload {
    id: string;
    order_id: string;
    status: 'APPROVED';
    created_at: string;
    approved_amount: number;
    captured_amount: number;
    refunded_amount: number;
    processing_fee: number;
    tds: boolean;
    payer: CreateCardPaymentPayerInterface;
    acquirer: CreateCardPaymentAcquirerInterface;
    error: any;
    action: any;
}

export interface CreateCardPaymentArgs {
    order_id: string;
    pan: string;
    exp: string;
    cvc: string;
    save: boolean;
    holder?: string;
    email?: string;
    phone?: string;
    card_id?: string;
}

export function useCreateCardPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ order_id, pan, exp, cvc, holder, save, email, phone, card_id }: CreateCardPaymentArgs) => {
            return await axiosInstance.post<CreateCardPaymentArgs, AxiosResponse<CreateCardPaymentPayload>>(
                `/v2/orders/${order_id}/payments/card`,
                {
                    cvc,
                    pan,
                    exp,
                    holder,
                    save,
                    email,
                    phone,
                    card_id,
                },
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['create-card-payment'] }),
    });
}
