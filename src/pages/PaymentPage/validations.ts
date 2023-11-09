import { object, string, boolean } from 'yup';

const cardNumberRegex =
    /^(?:4[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}|5[1-5][0-9]{2}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}|3[47][0-9]{2}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{3}|3(?:0[0-5]|[68][0-9])\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}|6(?:011|5[0-9]{2})\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}|(?:2131|1800|35\d{3})\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4})$/;

export const detectCardType = (cardNumber: string) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^5[1-5][0-9]{14}$/;
    const amexRegex = /^3[47][0-9]{13}$/;

    // Check the card number against each regex
    if (visaRegex.test(cardNumber)) {
        return 'Visa';
    } else if (mastercardRegex.test(cardNumber)) {
        return 'MasterCard';
    } else if (amexRegex.test(cardNumber)) {
        return 'American Express';
    } else {
        return '';
    }
};

export const schema = object()
    .shape({
        pan: string()
            .label('Номер карты')
            .matches(cardNumberRegex, 'Введен неверный номер карты')
            .required('Номер карты обязательно для заполнения!'),
        exp: string()
            .label('Срок карты')
            .typeError('Введена некоректная дата. Пример: MM/YY')
            .max(5, 'Введена некоректная дата. Пример: MM/YY')
            .matches(/([0-9]{2})\/([0-9]{2})/, 'Введена некоректная дата. Пример: MM/YY')
            .required('Срок карты обязательно для заполнения!'),
        cvc: string().label('CVC').min(3).max(4).required(),
        save: boolean().label('Сохранение карты').required(),
    })
    .required();
