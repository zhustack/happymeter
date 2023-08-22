using { SuccessFactorsMetadata } from './external/SuccessFactorsMetadata';

@path: '/backend/felizometro'
service FelizometroService @(requires: 'authenticated-user') {
    
    entity User as projection on SuccessFactorsMetadata.User excluding {
        lastModifiedDateTime,lastModifiedWithTZ,lastModified,sciLastModified
    }; 
    entity Photo as projection on SuccessFactorsMetadata.Photo excluding {
        lastModifiedDateTime,lastModifiedWithTZ,lastModified 
    }; 
    entity cust_felizometro as projection on SuccessFactorsMetadata.cust_felizometro; 
    entity cust_entrada_felizometro as projection on SuccessFactorsMetadata.cust_entrada_felizometro; 
    
}