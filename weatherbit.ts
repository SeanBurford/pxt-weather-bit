/**
 * Functions to operate the weather:bit
 */
let num_rain_dumps = 0
let item = 0
let bme_addr = 0x76
let ctrl_hum = 0xf2

//% color=#f44242 icon="\u26C8"
namespace weatherbit {
	/**
	 * Reads the Moisture Level from the Soil Moisture Sensor, displays the value and recommends watering as needed. Must be placed in an event block (e.g. button A)
	 */
    //% blockId="ReadSoilMoisture" block="Read Soil Moisture"
    export function SoilMoisture(): void {
        let Soil_Moisture = 0
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(10)
        Soil_Moisture = pins.analogReadPin(AnalogPin.P0)
        basic.pause(100)
        basic.showNumber(Soil_Moisture)
        basic.pause(1000)
        pins.digitalWritePin(DigitalPin.P16, 0)
        basic.clearScreen()
        if (Soil_Moisture <= 50) {
            basic.showLeds(`
			. # . # .
			. . . . .
			. # # # .
			# . . . #
			. . . . .
			`)
            basic.pause(5000)
            basic.showString("WATER ME!!")
            basic.pause(5000)
        }
        basic.clearScreen()
        if (Soil_Moisture > 50) {
            basic.showLeds(`
			. # . # .
			. . . . .
			. . . . .
			# . . . #
			. # # # .
			`)
            basic.pause(5000)
        }
        basic.clearScreen()
    }
    /**
    * Reads the Moisture Level from the Soil Moisture Sensor, displays the value and recommends watering as needed. Must be placed in an event block (e.g. button A)
    */
    //% blockId="ReadRain" block="Read Rain Gauge"
    export function ReadRain(): void {
        basic.showNumber(num_rain_dumps)
        basic.clearScreen()
    }
    /**
    * Reads the Moisture Level from the Soil Moisture Sensor, displays the value and recommends watering as needed. Must be placed in an event block (e.g. button A)
    */
    //% blockId="StartRainPolling" block="Starts the Rain Gauge Monitoring"
    export function StartRainPolling(): void {
        // There doesn't seem to be interrupts for pxt so polling and debounce is being used
        let rain_gauge = 0
        control.inBackground(() => {
            while (true) {
                basic.pause(10)
                rain_gauge = pins.digitalReadPin(DigitalPin.P2)
                if (!rain_gauge) {
                    num_rain_dumps++
                    basic.pause(100)
                }
            }
        })
    }

    //% blockId="ReadWindDir" block="Read Wind Vane"
    export function Read_wind_dir(): void {
        let wind_dir = 0
        wind_dir = pins.analogReadPin(AnalogPin.P1)
        basic.showNumber(wind_dir)
        if (wind_dir < 906 && wind_dir > 886)
            basic.showString("N")
        else if (wind_dir < 712 && wind_dir > 692)
            basic.showString("NE")
        else if (wind_dir < 415 && wind_dir > 395)
            basic.showString("E")
        else if (wind_dir < 498 && wind_dir > 478)
            basic.showString("SE")
        else if (wind_dir < 584 && wind_dir > 564)
            basic.showString("S")
        else if (wind_dir < 819 && wind_dir > 799)
            basic.showString("SW")
        else if (wind_dir < 988 && wind_dir > 968)
            basic.showString("W")
        else if (wind_dir < 959 && wind_dir > 939)
            basic.showString("NW")
        else
            basic.showString("??????")
        basic.pause(10)
    }

    // Do a write on the requested BME register
    function Write_bme_reg(reg: number, val: number): void {
        pins.i2cWriteNumber(bme_addr, reg << 8 | val, NumberFormat.Int16BE)
    }

    // Do a read on the reqeusted BME register
    function Read_bme_reg(reg: number) {
        let val = 0
        pins.i2cWriteNumber(bme_addr, ctrl_hum, NumberFormat.UInt8LE, false)
        val = pins.i2cReadNumber(bme_addr, NumberFormat.UInt8LE, false)
        basic.showNumber(val)
        return val
    }

    // Test a read write on the hum register on the BME
    //% blockId="TestBmeFunctions" block="Test the BME i2c read write functionality"
    export function TestBmeFunctions(): void {
        Write_bme_reg(ctrl_hum, 10)
        let data = Read_bme_reg(ctrl_hum)
        basic.showNumber(data)
    }
}


