const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    
    // Seleção das entidades que serão manipuladas
    const { cust_felizometro, cust_entrada_felizometro, User, Photo } = this.entities;

    // Conectando com a destination do Success baseado no serviço importado
    const SuccessFactorsMetadata = await cds.connect.to('SuccessFactorsMetadata');

    this.on('READ', [User], async req => {
        return SuccessFactorsMetadata.tx(req).get(`/User?$filter=userId eq '${req.user.id}'&$expand=manager&$select=manager/defaultFullName,firstName,defaultFullName,jobTitle,department`);
    });

    this.on('READ', [Photo], async (req) => {       
        const aPhotos  = await SuccessFactorsMetadata.tx(req).get(`/Photo?$filter=userId eq '${req.user.id}' and photoType eq 1`);
        return aPhotos.map(oPhoto => {
            // delete oPhoto.lastModifiedDateTime;

            oPhoto.photo = Buffer.from(oPhoto.photo || '').toString('base64url');
            return oPhoto;
        })
    });

    this.on('READ', [cust_felizometro, cust_entrada_felizometro], async req => {
        return SuccessFactorsMetadata.tx(req).run(req.query);
    });

    this.on('CREATE', [cust_entrada_felizometro], async req => {
        
        // Função que irá fazer a tratativa de criação do MDF pai
        const getFelizometroExternalCode = async function() {
            const userId = req.user.id;
            const aFelizometros = await SuccessFactorsMetadata.tx(req).get(`/cust_felizometro?$filter=externalCode eq '${userId}'`);
            if(aFelizometros.length) {
                return aFelizometros[0].externalCode;
            } 

            const oCriacaoResultado = await SuccessFactorsMetadata.tx(req).post(`/cust_felizometro`, {
                externalCode: userId
            });

            return oCriacaoResultado.externalCode;
        }  

        const sFelizometroExternalCode = await getFelizometroExternalCode();

        return SuccessFactorsMetadata.tx(req).post(`/cust_entrada_felizometro`, {
            cust_felizometro_externalCode: sFelizometroExternalCode,
            cust_data: new Date().toISOString(),
            ...req.data
        });

    });

});
