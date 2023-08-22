/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "br/com/epiuse/felizometro/felizometroapp/model/models",
        "br/com/epiuse/felizometro/felizometroapp/lib/APIHandlers/FelizometroAPIHandler"
    ],
    function (UIComponent, Device, models, FelizometroAPIHandler) {
        "use strict";

        return UIComponent.extend("br.com.epiuse.felizometro.felizometroapp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                this.FelizometroAPIHandler = new FelizometroAPIHandler({ _component: this, modelName: "FelizometroModel" });

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                
            }
        });
    }
);