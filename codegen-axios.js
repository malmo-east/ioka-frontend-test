const { codegen } = require('swagger-axios-codegen');

codegen({
    methodNameMode: 'operationId',
    remoteUrl: 'https://ioka.kz/docs_v2.html',
});
