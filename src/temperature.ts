import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  HAP,
  Logging,
  Service,
} from 'homebridge'
// @ts-ignore
import { sensor } from 'node-dht-sensor'

let hap: HAP

export = (api: API) => {
  hap = api.hap
  api.registerAccessory('Temperature', Temperature)
}

class Temperature implements AccessoryPlugin {
  private readonly log: Logging
  private readonly name: string
  private readonly temperatureUnits: string

  private readonly temperatureService: Service
  private readonly informationService: Service

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log
    this.name = config.name
    this.temperatureUnits = config.temperatureUnits || 'c'

    this.temperatureService = new hap.Service.Switch(this.name)

    this.temperatureService
      .getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        sensor.read(11, 4, (err: Error, temperature: number, humidity: number) => {
          if (!err) {
            const temperature_f = (9 / 5) * temperature + 32
            log.info(`temp: ${temperature}°C (${temperature_f}°F), humidity: ${humidity}%`)
            callback(undefined, this.temperatureUnits === 'f' ? temperature_f : temperature)
          }
        })
      })

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Custom Manufacturer')
      .setCharacteristic(hap.Characteristic.Model, 'DHT11')

    log.info('Temperature sensor finished initializing!')
  }

  identify(): void {
    this.log('Temperature')
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [this.informationService, this.temperatureService]
  }
}
