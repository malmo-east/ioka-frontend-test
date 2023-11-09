import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

import { grey } from '@mui/material/colors';
import {
    Alert,
    AlertTitle,
    Box,
    Stack,
    Skeleton,
    Typography,
    Container,
    TextField,
    Checkbox,
    FormGroup,
    FormControlLabel,
    InputAdornment,
    Snackbar,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { CreateCustomerPayload, useCreateCustomer } from '../../hooks/useCreateCustomer';
import { CreateOrderPayload, useCreateOrder } from '../../hooks/useCreateOrder';
import { faker } from '../../shared/faker/fakerInstance';

import { Styled } from './styled';
import { PaymentFormType } from './types';
import { schema, detectCardType } from './validations';
import { CreateCardPaymentArgs, useCreateCardPayment } from '../../hooks/useCreateCardPayment';

export const PaymentPage = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = React.useState(false);
    const [localCustomer, setLocalCustomer] = React.useState<CreateCustomerPayload>();
    const [localOrder, setLocalOrder] = React.useState<CreateOrderPayload>();
    const [localOrderNumber] = React.useState<string>(() =>
        faker.finance.amount({
            min: 1000000,
            max: 10000000,
            dec: 0,
        }),
    );

    const {
        mutateAsync: createCustomer,
        isLoading: isCreateCustomerLoading,
        error: createCustomerError,
    } = useCreateCustomer();
    const { mutateAsync: createOrder, isLoading: isCreateOrderLoading, error: createOrderError } = useCreateOrder();
    const { mutateAsync: createCardPayment, isLoading: isCreateCardPaymentLoading } = useCreateCardPayment();

    const isLoading = isCreateCustomerLoading || isCreateOrderLoading;
    const fetchError = createCustomerError || createOrderError;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<PaymentFormType>({
        resolver: yupResolver(schema),
        defaultValues: {
            pan: '',
            exp: '',
            cvc: '',
            save: true,
        },
    });
    const panValue = watch('pan').replace(/\s/g, '');

    React.useEffect(() => {
        (async (): Promise<void> => {
            createCustomer()
                .then(async customer => {
                    const order = await createOrder({
                        external_id: customer?.data?.customer?.external_id as string,
                        customer_id: customer?.data?.customer?.id as string,
                    });
                    setLocalCustomer(customer.data);
                    setLocalOrder(order.data);
                })
                .catch((err: AxiosError) => {
                    setShowAlert(true);
                    console.error(err);
                });
        })();
    }, []);

    const onSubmit = React.useCallback(
        async ({ cvc, exp, save }: PaymentFormType) => {
            if (isValid) {
                try {
                    const body: CreateCardPaymentArgs = {
                        order_id: localOrder?.order.id as string,
                        pan: panValue,
                        exp,
                        cvc,
                        save,
                        email: localCustomer?.customer.email as string,
                        phone: localCustomer?.customer.phone as string,
                    };
                    await createCardPayment(body);
                    return navigate('/success');
                } catch (e) {
                    console.error(e);
                    return navigate('/failure');
                }
            }
        },
        [isValid],
    );

    const handleCloseAlert = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        return setShowAlert(false);
    };

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Stack useFlexGap direction="column">
                        <Skeleton height={96} />
                        <Skeleton height={140} />
                        <Skeleton height={128} />
                        <Skeleton height={42} />
                        <Skeleton height={56} />
                        <Skeleton height={66} />
                    </Stack>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert} message="Ошибка">
                {/*
                    TODO: Нужно добавить ловитель ошибок и правильно показывать сообщения с сервера.
                          Сейчас для примера показывается ошибка 400 с сообщением
                */}
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {/* @ts-ignore */}
                    {(fetchError as AxiosError)?.response?.data?.message as unknown as string}
                </Alert>
            </Snackbar>
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Typography variant="body1" component="p" gutterBottom align="center" color={grey['500']}>
                        {/*
                            TODO: Убрать фиксированное название товара.
                        */}
                        Chocofood
                    </Typography>
                    <Typography variant="h5" component="h5" gutterBottom align="center" fontWeight="500">
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <NumericFormat
                                value={localOrder?.order.amount as number}
                                allowLeadingZeros
                                displayType={'text'}
                                thousandSeparator=" "
                            />
                            <span>₸</span>
                        </Stack>
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom align="center">
                        {/*
                            TODO: Добавить динамический номер заказа.
                                  Сейчас используется генератор случайных чисел,
                                  так как не нашел нужное значение с эндпойнта.
                        */}
                        {`Номер заказа: ${localOrderNumber}`}
                    </Typography>
                    {/*
                        TODO: Нужно добавить баннер.
                    */}
                    <Styled.Banner />
                    {Object.keys(errors).length > 0 && (
                        <Stack direction="column" spacing={1} sx={{ mb: 4 }}>
                            {Object.entries(errors).map(([_, value]) => {
                                return (
                                    <Alert severity="error">
                                        <AlertTitle>Ошибка</AlertTitle>
                                        {value.message}
                                    </Alert>
                                );
                            })}
                        </Stack>
                    )}
                    <Styled.Form>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2} direction="column" useFlexGap>
                                <Controller
                                    name="pan"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <PatternFormat
                                            required
                                            fullWidth
                                            format="#### #### #### ####"
                                            label="Номер карты"
                                            value={value}
                                            onChange={onChange}
                                            customInput={TextField}
                                            InputProps={{
                                                endAdornment: (
                                                    <>
                                                        <InputAdornment position="end">
                                                            {detectCardType(panValue)}
                                                        </InputAdornment>
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <Stack spacing={2} direction="row" useFlexGap>
                                    <Controller
                                        name="exp"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <PatternFormat
                                                required
                                                fullWidth
                                                format="##/##"
                                                value={value}
                                                label="Скрок карты"
                                                onChange={onChange}
                                                customInput={TextField}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="cvc"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <PatternFormat
                                                required
                                                format="###"
                                                fullWidth
                                                value={value}
                                                label="CVC / CVV"
                                                onChange={onChange}
                                                customInput={TextField}
                                            />
                                        )}
                                    />
                                </Stack>
                                <FormGroup>
                                    <Controller
                                        name="save"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={value} onChange={onChange} defaultChecked />
                                                }
                                                label="Сохранить карту"
                                            />
                                        )}
                                    />
                                </FormGroup>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isCreateCardPaymentLoading}
                                    size="large"
                                >
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <span>Оплатить</span>
                                        <NumericFormat
                                            value={localOrder?.order.amount as number}
                                            allowLeadingZeros
                                            displayType={'text'}
                                            thousandSeparator=" "
                                        />
                                        <span>₸</span>
                                    </Stack>
                                </LoadingButton>
                            </Stack>
                        </form>
                    </Styled.Form>
                    {/*
                        TODO: Нужно добавить список логотипов.
                    */}
                    <Stack spacing={1} direction="row" useFlexGap sx={{ mb: 4 }}>
                        <Styled.LogoItem />
                        <Styled.LogoItem />
                        <Styled.LogoItem />
                        <Styled.LogoItem />
                    </Stack>
                    <Stack spacing={1} direction="row" useFlexGap justifyContent="center" alignItems="center">
                        <Typography
                            variant="body1"
                            component="p"
                            gutterBottom={false}
                            align="center"
                            color={grey['500']}
                        >
                            Платежи надежно защищены
                        </Typography>
                        {/*
                            TODO: Нужно добавить логотип платежки.
                        */}
                        <Styled.LogoItem style={{ width: '50px', height: '50px' }} />
                    </Stack>
                </Box>
            </Container>
        </>
    );
};
