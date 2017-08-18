var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var fs = require('fs');

async function download() {
    var options = {
        method: 'GET',
        url: 'https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/buses',
        headers: {
            'Authorization': 'apikey w89Fjil2oy3RzCXU4DGiDjEEMNXSAbyaEhGW'
        },
        encoding: null
    };
    console.log(+ new Date());
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
            outputs = [];
            feed.entity.forEach(function(entity) {
                if (entity.vehicle) {
                    let output = Object.assign(
                        {id: entity.vehicle.vehicle.id},
                        entity.vehicle.position 
                    )
                    outputs.push(output);
                }
            });
            fs.writeFile(`./locations/${+ new Date()}.json`, JSON.stringify(outputs), () => {});
        }
    });
}

setInterval(download, 30000);