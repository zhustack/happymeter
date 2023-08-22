sap.ui.define([], 
    
    function (JSONModel, Device) {
        "use strict";

        return {
            dateTimeToString: function(dateTime) {
                const regex = /\/Date\((\d+)\+\d+\)\//;
                const match = dateTime.match(regex);
              
                if (match && match[1]) {
                  return new Date(parseInt(match[1], 10)).toISOString();
                } else {
                  return null; // Retorna null se a string não corresponder ao padrão esperado.
                }
            }
        }
});