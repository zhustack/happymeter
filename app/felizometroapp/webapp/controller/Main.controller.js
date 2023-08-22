sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "br/com/epiuse/felizometro/felizometroapp/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	JSONModel,
	MessageBox,
    formatter) {
        "use strict";

        const A_SENTIMENTOS = [
            {
                descricao: "Muito triste",
                icone: "muito_triste.png",
                peso: 1,
                tamanho: "L"
            },
            {
                descricao: "Triste",
                icone: "triste.png",
                peso: 2,
                tamanho: "L"
            },
            {
                descricao: "Neutro",
                icone: "neutro.png",
                peso: 3,
                tamanho: "L"
            },
            {
                descricao: "Feliz",
                icone: "feliz.png",
                peso: 4,
                tamanho: "L"
            },
            {
                descricao: "Muito feliz",
                icone: "muito_feliz.png",
                peso: 5,
                tamanho: "L"
            },
        ];

        return Controller.extend("br.com.epiuse.felizometro.felizometroapp.controller.Main", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteMain").attachPatternMatched(this._matched, this);
            }, 
            formatter: formatter,
            _matched: async function(oEvent) {
                this.getView().setBusy(true);
                
                const [aDadosUsuario, sFotoUsuario, oUltimoMood] = await Promise.all([this.getOwnerComponent().FelizometroAPIHandler.getDadosDoUsuario(), 
                                                                                      this.getOwnerComponent().FelizometroAPIHandler.getFotoDoUsuario(),
                                                                                      this._configuraUltimoMood()]);
                
                aDadosUsuario[0].foto = sFotoUsuario;
                                                            
                const oViewModel = new JSONModel({
                    usuario: aDadosUsuario[0],
                    sentimentos: A_SENTIMENTOS,
                    ultimoMood: oUltimoMood,
                    felizometro: null
                });

                this.getView().setModel(oViewModel, "ViewModel");
                this._oViewModel = oViewModel;

                this.getView().setBusy(false);

            },

            _configuraUltimoMood: async function() {
                const aUltimoMood = await this.getOwnerComponent().FelizometroAPIHandler.getUltimoMood()

                const oUltimoMood = aUltimoMood.length ? A_SENTIMENTOS.find(o => o.descricao === aUltimoMood[0].cust_sentimento) : null;
                if(oUltimoMood !== null) {
                    oUltimoMood.data = aUltimoMood[0].createdDateTime;
                }

                return oUltimoMood;
            },  

            _resetaModel: function() {
                this._oViewModel.getProperty("/sentimentos").forEach(oSentimento => oSentimento.tamanho = "L");
                this._oViewModel.setProperty(`/felizometro`, null);
            },
            handleSelecionaSentimento: function(oEvent) {
                const oBindingContext = oEvent.getSource().getBindingContext("ViewModel");

                this._oViewModel.getProperty("/sentimentos").forEach(oSentimento => oSentimento.tamanho = "L");
                this._oViewModel.setProperty(`${oBindingContext.getPath()}/tamanho`, "XL");
                this._oViewModel.setProperty(`/felizometro`, oBindingContext.getObject());

                this._oViewModel.refresh();
            }, 

            handleAbreDialogoDeConfirmacao: function() {
                MessageBox.confirm("Deseja realmente enviar o mood selecionado?", {
                    onClose: function(sAction) {
                        if(sAction === "OK") {
                            this.handleEnviaFelizometro();
                        } else {
                            this._resetaModel();
                        }
                    }.bind(this)
                });
            },

            handleEnviaFelizometro: async function() {
                this.getView().setBusy(true);

                const {peso: cust_peso_sentimento, descricao: cust_sentimento} = this._oViewModel.getProperty("/felizometro");
                await this.getOwnerComponent().FelizometroAPIHandler.criarFelizometro({cust_peso_sentimento, cust_sentimento});
                
                this.getView().setBusy(false);
                MessageBox.success("Parabéns! Você acaba de adicionar mais um mood ao seu histórico de sentimentos.");
                
                this._resetaModel();
                this._matched();
            }

        });
    });
