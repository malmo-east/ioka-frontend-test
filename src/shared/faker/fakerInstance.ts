import { ru, en, Faker } from '@faker-js/faker';

export const faker = new Faker({
    locale: [ru, en],
});
