sap.ui.define([
	"sap/ui/base/Object"
], function(
	BaseObject
) {
	"use strict";

	return BaseObject.extend("br.com.epiuse.felizometro.felizometroapp.lib.APIHandlers.FelizometroAPIHandler", {
        constructor: function ({_component, modelName}) {
            this._component = _component;
            this._felizometroModel = this._component.getModel(`${modelName}`);
          },

        getDadosDoUsuario() {
            return new Promise(resolve => {
                this._felizometroModel.read("/User", {
                    success: (res) => resolve(res.results),
                    error: (err) => {
                      debugger;
                    }
                })
            });
        },

        getFotoDoUsuario() {
            return new Promise(resolve => {
                this._felizometroModel.read("/Photo", {
                    success: (res) => resolve(res.results),
                    error: (err) => {
                      debugger;
                    }
                })
            }).then(oData => oData[0] ? `data:image/png;base64, ${atob(oData[0].photo)}` : "");;
        },

        getFelizometroByFilters({filters}) {
            return new Promise(resolve => {
                this._felizometroModel.read("/cust_felizometro", {
                    filters: filters,
                    success: (res) => resolve(res.results)
                })
            });
        },

        criarFelizometro: async function(dadosFelizometro) {
            return new Promise(resolve => {
              this._felizometroModel.create("/cust_entrada_felizometro", dadosFelizometro, {
                success: (res) => resolve(res)
              });
            })
        }
	});
});