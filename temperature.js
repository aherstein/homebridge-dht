const sensor = require("node-dht-sensor");

sensor.read(11, 4, function(err, temperature, humidity) {
  if (!err) {
    const temperature_f = 9/5 * temperature + 32
    console.log(`temp: ${temperature}°C (${temperature_f}°F), humidity: ${humidity}%`);
  }
});
