/* eslint-disable no-undef */
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const serviceWorker = navigator.serviceWorker
      serviceWorker
        .register('./sw.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          )
          return serviceWorker
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed: ', error)
        })
    })
  }
}

// db constants
const DB = 'emissionsDB'
const STORE = 'emissions'

const CO2_PER_KWH_IN_DC_GREY = 519
const CO2_PER_KWH_NETWORK_GREY = 475
const CO2_PER_KWH_IN_DC_GREEN = 0
const KWH_PER_BYTE_IN_DC = 72e-12
const FIXED_NETWORK_WIRED = 429e-12
const FIXED_NETWORK_WIFI = 152e-12
const FOUR_G_MOBILE = 884e-12
const KWH_PER_BYTE_FOR_NETWORK =
  (FIXED_NETWORK_WIRED + FIXED_NETWORK_WIFI + FOUR_G_MOBILE) / 3
class OneByte {
  constructor(options) {
    this.options = options
    this.KWH_PER_BYTE_FOR_NETWORK = KWH_PER_BYTE_FOR_NETWORK
  }
  perByte(bytes, green) {
    if (bytes < 1) {
      return 0
    }
    if (green) {
      const Co2ForDC = bytes * KWH_PER_BYTE_IN_DC * CO2_PER_KWH_IN_DC_GREEN
      const Co2forNetwork =
        bytes * KWH_PER_BYTE_FOR_NETWORK * CO2_PER_KWH_NETWORK_GREY
      return Co2ForDC + Co2forNetwork
    }
    const KwHPerByte = KWH_PER_BYTE_IN_DC + KWH_PER_BYTE_FOR_NETWORK
    return bytes * KwHPerByte * CO2_PER_KWH_IN_DC_GREY
  }
}
var byte_default = OneByte

const GIGABYTE = 1e3 * 1e3 * 1e3
var file_size_default = {
  GIGABYTE,
}

const data = {
  AFG: 132.53,
  AFRICA: 559.42,
  ALB: 24.29,
  DZA: 634.61,
  ASM: 611.11,
  AGO: 174.73,
  ATG: 611.11,
  ARG: 394.62,
  ARM: 264.54,
  ABW: 561.22,
  ASEAN: 554.5,
  ASIA: 591.19,
  AUS: 570.35,
  AUT: 110.81,
  AZE: 671.39,
  BHS: 660.1,
  BHR: 904.62,
  BGD: 678.11,
  BRB: 605.51,
  BLR: 441.74,
  BEL: 138.11,
  BLZ: 225.81,
  BEN: 584.07,
  BTN: 23.33,
  BOL: 489.14,
  BIH: 600,
  BWA: 847.91,
  BRA: 105.51,
  BRN: 893.91,
  BGR: 335.33,
  BFA: 467.53,
  BDI: 250,
  CPV: 558.14,
  KHM: 417.71,
  CMR: 305.42,
  CAN: 161.43,
  CYM: 642.86,
  CAF: 0,
  TCD: 628.57,
  CHL: 353.52,
  CHN: 585.82,
  COL: 214.88,
  COM: 642.86,
  COG: 700,
  COD: 24.46,
  COK: 250,
  CRI: 26.46,
  CIV: 393.89,
  HRV: 204.96,
  CUB: 637.61,
  CYP: 534.32,
  CZE: 449.72,
  DNK: 151.65,
  DJI: 692.31,
  DMA: 529.41,
  DOM: 580.78,
  ECU: 150.69,
  EGY: 570.13,
  SLV: 116.54,
  GNQ: 591.84,
  ERI: 631.58,
  EST: 416.67,
  SWZ: 172.41,
  ETH: 24.64,
  EU: 243.83,
  EUROPE: 327.69,
  FLK: 500,
  FRO: 404.76,
  FJI: 288.46,
  FIN: 79.16,
  FRA: 56.04,
  GUF: 217.82,
  PYF: 442.86,
  G20: 482.92,
  G7: 361.52,
  GAB: 491.6,
  GMB: 666.67,
  GEO: 167.02,
  DEU: 380.95,
  GHA: 484,
  GRC: 336.57,
  GRL: 178.57,
  GRD: 640,
  GLP: 500,
  GUM: 622.86,
  GTM: 328.27,
  GIN: 236.84,
  GNB: 625,
  GUY: 640.35,
  HTI: 567.31,
  HND: 282.27,
  HKG: 699.5,
  HUN: 204.19,
  ISL: 27.68,
  IND: 705.13,
  IDN: 675.93,
  IRN: 665.15,
  IRQ: 688.81,
  IRL: 290.81,
  ISR: 582.93,
  ITA: 330.72,
  JAM: 555.56,
  JPN: 512.81,
  JOR: 540.92,
  KAZ: 830.41,
  KEN: 83.33,
  KIR: 666.67,
  XKX: 894.65,
  KWT: 649.2,
  KGZ: 147.29,
  LAO: 265.51,
  'LATIN AMERICA AND CARIBBEAN': 260.28,
  LVA: 123.2,
  LBN: 599.01,
  LSO: 20,
  LBR: 227.85,
  LBY: 818.69,
  LTU: 160.07,
  LUX: 105.26,
  MAC: 448.98,
  MDG: 436.44,
  MWI: 66.67,
  MYS: 605.83,
  MDV: 611.77,
  MLI: 408,
  MLT: 459.14,
  MTQ: 523.18,
  MRT: 464.71,
  MUS: 632.48,
  MEX: 475.36,
  'MIDDLE EAST': 660.46,
  MDA: 648.5,
  MNG: 771.8,
  MNE: 417.07,
  MSR: 1e3,
  MAR: 662.64,
  MOZ: 135.65,
  MMR: 483.57,
  NAM: 59.26,
  NRU: 750,
  NPL: 24.44,
  NLD: 267.62,
  NCL: 660.58,
  NZL: 110.89,
  NIC: 265.12,
  NER: 670.89,
  NGA: 516.23,
  'NORTH AMERICA': 356.01,
  PRK: 389.59,
  MKD: 565.35,
  NOR: 30.08,
  OCEANIA: 507.63,
  OECD: 360.53,
  OMN: 564.69,
  PAK: 463.66,
  PSE: 516.13,
  PAN: 161.68,
  PNG: 507.25,
  PRY: 24.31,
  PER: 251.74,
  POL: 661.93,
  PRT: 165.55,
  PRI: 678.74,
  QAT: 602.59,
  REU: 572.82,
  ROU: 240.58,
  RUS: 436.28,
  RWA: 316.33,
  KNA: 636.36,
  LCA: 666.67,
  SPM: 600,
  VCT: 529.41,
  WSM: 473.68,
  STP: 642.86,
  SAU: 706.79,
  SEN: 511.6,
  SRB: 636.06,
  SYC: 564.52,
  SLE: 50,
  SGP: 474,
  SVK: 116.77,
  SVN: 231.28,
  SLB: 700,
  SOM: 578.95,
  ZAF: 729.67,
  KOR: 441.65,
  SSD: 629.03,
  ESP: 174.05,
  LKA: 509.78,
  SDN: 263.16,
  SUR: 349.28,
  SWE: 40.7,
  CHE: 34.84,
  SYR: 701.66,
  TWN: 639.53,
  TJK: 116.86,
  TZA: 339.25,
  THA: 560.74,
  PHL: 601.1,
  TGO: 443.18,
  TON: 625,
  TTO: 681.53,
  TUN: 564.62,
  TUR: 464.59,
  TKM: 1306.03,
  TCA: 653.85,
  UGA: 44.53,
  UKR: 259.69,
  ARE: 561.14,
  GBR: 237.59,
  USA: 385.98,
  URY: 112.65,
  UZB: 1167.6,
  VUT: 571.43,
  VEN: 185.8,
  VNM: 409.8,
  VGB: 647.06,
  VIR: 632.35,
  WORLD: 485.99,
  YEM: 566.1,
  ZMB: 111.97,
  ZWE: 297.87,
}
const type = 'average'
var average_intensities_min_default = { data, type }

const KWH_PER_GB = 0.81
const END_USER_DEVICE_ENERGY = 0.52
const NETWORK_ENERGY = 0.14
const DATACENTER_ENERGY = 0.15
const PRODUCTION_ENERGY = 0.19
const GLOBAL_GRID_INTENSITY = average_intensities_min_default.data['WORLD']
const RENEWABLES_GRID_INTENSITY = 50
const FIRST_TIME_VIEWING_PERCENTAGE = 0.75
const RETURNING_VISITOR_PERCENTAGE = 0.25
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02

const formatNumber = (num) => parseFloat(num.toFixed(2))
function parseOptions(options) {
  var _a, _b, _c, _d, _e, _f
  if (typeof options !== 'object') {
    throw new Error('Options must be an object')
  }
  const adjustments = {}
  if (options == null ? void 0 : options.gridIntensity) {
    adjustments.gridIntensity = {}
    const { device, dataCenter, network } = options.gridIntensity
    if (device || device === 0) {
      if (typeof device === 'object') {
        if (
          !average_intensities_min_default.data[
            (_a = device.country) == null ? void 0 : _a.toUpperCase()
          ]
        ) {
          console.warn(`"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information. 
Falling back to global average grid intensity.`)
          adjustments.gridIntensity['device'] = {
            value: GLOBAL_GRID_INTENSITY,
          }
        }
        adjustments.gridIntensity['device'] = {
          country: device.country,
          value: parseFloat(
            average_intensities_min_default.data[
              (_b = device.country) == null ? void 0 : _b.toUpperCase()
            ]
          ),
        }
      } else if (typeof device === 'number') {
        adjustments.gridIntensity['device'] = {
          value: device,
        }
      } else {
        adjustments.gridIntensity['device'] = {
          value: GLOBAL_GRID_INTENSITY,
        }
        console.warn(`The device grid intensity must be a number or an object. You passed in a ${typeof device}. 
Falling back to global average grid intensity.`)
      }
    }
    if (dataCenter || dataCenter === 0) {
      if (typeof dataCenter === 'object') {
        if (
          !average_intensities_min_default.data[
            (_c = dataCenter.country) == null ? void 0 : _c.toUpperCase()
          ]
        ) {
          console.warn(`"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  
Falling back to global average grid intensity.`)
          adjustments.gridIntensity['dataCenter'] = {
            value: GLOBAL_GRID_INTENSITY,
          }
        }
        adjustments.gridIntensity['dataCenter'] = {
          country: dataCenter.country,
          value: parseFloat(
            average_intensities_min_default.data[
              (_d = dataCenter.country) == null ? void 0 : _d.toUpperCase()
            ]
          ),
        }
      } else if (typeof dataCenter === 'number') {
        adjustments.gridIntensity['dataCenter'] = {
          value: dataCenter,
        }
      } else {
        adjustments.gridIntensity['dataCenter'] = {
          value: GLOBAL_GRID_INTENSITY,
        }
        console.warn(`The data center grid intensity must be a number or an object. You passed in a ${typeof dataCenter}. 
Falling back to global average grid intensity.`)
      }
    }
    if (network || network === 0) {
      if (typeof network === 'object') {
        if (
          !average_intensities_min_default.data[
            (_e = network.country) == null ? void 0 : _e.toUpperCase()
          ]
        ) {
          console.warn(`"${network.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  Falling back to global average grid intensity. 
Falling back to global average grid intensity.`)
          adjustments.gridIntensity['network'] = {
            value: GLOBAL_GRID_INTENSITY,
          }
        }
        adjustments.gridIntensity['network'] = {
          country: network.country,
          value: parseFloat(
            average_intensities_min_default.data[
              (_f = network.country) == null ? void 0 : _f.toUpperCase()
            ]
          ),
        }
      } else if (typeof network === 'number') {
        adjustments.gridIntensity['network'] = {
          value: network,
        }
      } else {
        adjustments.gridIntensity['network'] = {
          value: GLOBAL_GRID_INTENSITY,
        }
        console.warn(`The network grid intensity must be a number or an object. You passed in a ${typeof network}. 
Falling back to global average grid intensity.`)
      }
    }
  }
  if (
    (options == null ? void 0 : options.dataReloadRatio) ||
    options.dataReloadRatio === 0
  ) {
    if (typeof options.dataReloadRatio === 'number') {
      if (options.dataReloadRatio >= 0 && options.dataReloadRatio <= 1) {
        adjustments.dataReloadRatio = options.dataReloadRatio
      } else {
        adjustments.dataReloadRatio =
          PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
        console.warn(`The dataReloadRatio option must be a number between 0 and 1. You passed in ${options.dataReloadRatio}. 
Falling back to default value.`)
      }
    } else {
      adjustments.dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
      console.warn(`The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. 
Falling back to default value.`)
    }
  }
  if (
    (options == null ? void 0 : options.firstVisitPercentage) ||
    options.firstVisitPercentage === 0
  ) {
    if (typeof options.firstVisitPercentage === 'number') {
      if (
        options.firstVisitPercentage >= 0 &&
        options.firstVisitPercentage <= 1
      ) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage
      } else {
        adjustments.firstVisitPercentage = FIRST_TIME_VIEWING_PERCENTAGE
        console.warn(`The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}. 
Falling back to default value.`)
      }
    } else {
      adjustments.firstVisitPercentage = FIRST_TIME_VIEWING_PERCENTAGE
      console.warn(`The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. 
Falling back to default value.`)
    }
  }
  if (
    (options == null ? void 0 : options.returnVisitPercentage) ||
    options.returnVisitPercentage === 0
  ) {
    if (typeof options.returnVisitPercentage === 'number') {
      if (
        options.returnVisitPercentage >= 0 &&
        options.returnVisitPercentage <= 1
      ) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage
      } else {
        adjustments.returnVisitPercentage = RETURNING_VISITOR_PERCENTAGE
        console.warn(`The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. 
Falling back to default value.`)
      }
    } else {
      adjustments.returnVisitPercentage = RETURNING_VISITOR_PERCENTAGE
      console.warn(`The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. 
Falling back to default value.`)
    }
  }
  return adjustments
}
function getApiRequestHeaders(comment = '') {
  return { 'User-Agent': `co2js/${'0.15.0'} ${comment}` }
}

var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value)
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
    }
  return a
}
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
class SustainableWebDesign {
  constructor(options) {
    this.options = options
  }
  energyPerByteByComponent(bytes) {
    const transferedBytesToGb = bytes / file_size_default.GIGABYTE
    const energyUsage = transferedBytesToGb * KWH_PER_GB
    return {
      consumerDeviceEnergy: energyUsage * END_USER_DEVICE_ENERGY,
      networkEnergy: energyUsage * NETWORK_ENERGY,
      productionEnergy: energyUsage * PRODUCTION_ENERGY,
      dataCenterEnergy: energyUsage * DATACENTER_ENERGY,
    }
  }
  co2byComponent(
    energyByComponent,
    carbonIntensity = GLOBAL_GRID_INTENSITY,
    options = {}
  ) {
    let deviceCarbonIntensity = GLOBAL_GRID_INTENSITY
    let networkCarbonIntensity = GLOBAL_GRID_INTENSITY
    let dataCenterCarbonIntensity = GLOBAL_GRID_INTENSITY
    let globalEmissions = GLOBAL_GRID_INTENSITY
    if (options == null ? void 0 : options.gridIntensity) {
      const { device, network, dataCenter } = options.gridIntensity
      if (
        (device == null ? void 0 : device.value) ||
        (device == null ? void 0 : device.value) === 0
      ) {
        deviceCarbonIntensity = device.value
      }
      if (
        (network == null ? void 0 : network.value) ||
        (network == null ? void 0 : network.value) === 0
      ) {
        networkCarbonIntensity = network.value
      }
      if (
        (dataCenter == null ? void 0 : dataCenter.value) ||
        (dataCenter == null ? void 0 : dataCenter.value) === 0
      ) {
        dataCenterCarbonIntensity = dataCenter.value
      }
    }
    if (carbonIntensity === true) {
      dataCenterCarbonIntensity = RENEWABLES_GRID_INTENSITY
    }
    const returnCO2ByComponent = {}
    for (const [key, value] of Object.entries(energyByComponent)) {
      if (key.startsWith('dataCenterEnergy')) {
        returnCO2ByComponent[key.replace('Energy', 'CO2')] =
          value * dataCenterCarbonIntensity
      } else if (key.startsWith('consumerDeviceEnergy')) {
        returnCO2ByComponent[key.replace('Energy', 'CO2')] =
          value * deviceCarbonIntensity
      } else if (key.startsWith('networkEnergy')) {
        returnCO2ByComponent[key.replace('Energy', 'CO2')] =
          value * networkCarbonIntensity
      } else {
        returnCO2ByComponent[key.replace('Energy', 'CO2')] =
          value * globalEmissions
      }
    }
    return returnCO2ByComponent
  }
  perByte(
    bytes,
    carbonIntensity = false,
    segmentResults = false,
    options = {}
  ) {
    if (bytes < 1) {
      bytes = 0
    }
    const energyBycomponent = this.energyPerByteByComponent(bytes, options)
    if (typeof carbonIntensity !== 'boolean') {
      throw new Error(
        `perByte expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`
      )
    }
    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity,
      options
    )
    const co2Values = Object.values(co2ValuesbyComponent)
    const co2ValuesSum = co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    )
    if (segmentResults) {
      return __spreadProps(__spreadValues({}, co2ValuesbyComponent), {
        total: co2ValuesSum,
      })
    }
    return co2ValuesSum
  }
  perVisit(
    bytes,
    carbonIntensity = false,
    segmentResults = false,
    options = {}
  ) {
    const energyBycomponent = this.energyPerVisitByComponent(bytes, options)
    if (typeof carbonIntensity !== 'boolean') {
      throw new Error(
        `perVisit expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`
      )
    }
    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity,
      options
    )
    const co2Values = Object.values(co2ValuesbyComponent)
    const co2ValuesSum = co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    )
    if (segmentResults) {
      return __spreadProps(__spreadValues({}, co2ValuesbyComponent), {
        total: co2ValuesSum,
      })
    }
    return co2ValuesSum
  }
  energyPerByte(bytes) {
    const energyByComponent = this.energyPerByteByComponent(bytes)
    const energyValues = Object.values(energyByComponent)
    return energyValues.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    )
  }
  energyPerVisitByComponent(
    bytes,
    options = {},
    firstView = FIRST_TIME_VIEWING_PERCENTAGE,
    returnView = RETURNING_VISITOR_PERCENTAGE,
    dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
  ) {
    if (options.dataReloadRatio || options.dataReloadRatio === 0) {
      dataReloadRatio = options.dataReloadRatio
    }
    if (options.firstVisitPercentage || options.firstVisitPercentage === 0) {
      firstView = options.firstVisitPercentage
    }
    if (options.returnVisitPercentage || options.returnVisitPercentage === 0) {
      returnView = options.returnVisitPercentage
    }
    const energyBycomponent = this.energyPerByteByComponent(bytes)
    const cacheAdjustedSegmentEnergy = {}
    Object.values(energyBycomponent)
    for (const [key, value] of Object.entries(energyBycomponent)) {
      cacheAdjustedSegmentEnergy[`${key} - first`] = value * firstView
      cacheAdjustedSegmentEnergy[`${key} - subsequent`] =
        value * returnView * dataReloadRatio
    }
    return cacheAdjustedSegmentEnergy
  }
  energyPerVisit(bytes) {
    let firstVisits = 0
    let subsequentVisits = 0
    const energyBycomponent = Object.entries(
      this.energyPerVisitByComponent(bytes)
    )
    for (const [key, val] of energyBycomponent) {
      if (key.indexOf('first') > 0) {
        firstVisits += val
      }
    }
    for (const [key, val] of energyBycomponent) {
      if (key.indexOf('subsequent') > 0) {
        subsequentVisits += val
      }
    }
    return firstVisits + subsequentVisits
  }
  emissionsPerVisitInGrams(
    energyPerVisit,
    carbonintensity = GLOBAL_GRID_INTENSITY
  ) {
    return formatNumber(energyPerVisit * carbonintensity)
  }
  annualEnergyInKwh(energyPerVisit, monthlyVisitors = 1e3) {
    return energyPerVisit * monthlyVisitors * 12
  }
  annualEmissionsInGrams(co2grams, monthlyVisitors = 1e3) {
    return co2grams * monthlyVisitors * 12
  }
  annualSegmentEnergy(annualEnergy) {
    return {
      consumerDeviceEnergy: formatNumber(annualEnergy * END_USER_DEVICE_ENERGY),
      networkEnergy: formatNumber(annualEnergy * NETWORK_ENERGY),
      dataCenterEnergy: formatNumber(annualEnergy * DATACENTER_ENERGY),
      productionEnergy: formatNumber(annualEnergy * PRODUCTION_ENERGY),
    }
  }
}
var sustainable_web_design_default = SustainableWebDesign

class CO2 {
  constructor(options) {
    this.model = new sustainable_web_design_default()
    if ((options == null ? void 0 : options.model) === '1byte') {
      this.model = new byte_default()
    } else if ((options == null ? void 0 : options.model) === 'swd') {
      this.model = new sustainable_web_design_default()
    } else if (options == null ? void 0 : options.model) {
      throw new Error(`"${options.model}" is not a valid model. Please use "1byte" for the OneByte model, and "swd" for the Sustainable Web Design model.
See https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`)
    }
    this._segment = (options == null ? void 0 : options.results) === 'segment'
  }
  perByte(bytes, green = false) {
    return this.model.perByte(bytes, green, this._segment)
  }
  perVisit(bytes, green = false) {
    var _a
    if ((_a = this.model) == null ? void 0 : _a.perVisit) {
      return this.model.perVisit(bytes, green, this._segment)
    } else {
      throw new Error(`The perVisit() method is not supported in the model you are using. Try using perByte() instead.
See https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`)
    }
  }
  perByteTrace(bytes, green = false, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i
    let adjustments = {}
    if (options) {
      adjustments = parseOptions(options)
    }
    return {
      co2: this.model.perByte(bytes, green, this._segment, adjustments),
      green,
      variables: {
        description:
          'Below are the variables used to calculate this CO2 estimate.',
        bytes,
        gridIntensity: {
          description:
            'The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate.',
          network:
            (_c =
              (_b =
                (_a =
                  adjustments == null ? void 0 : adjustments.gridIntensity) ==
                null
                  ? void 0
                  : _a.network) == null
                ? void 0
                : _b.value) != null
              ? _c
              : GLOBAL_GRID_INTENSITY,
          dataCenter: green
            ? RENEWABLES_GRID_INTENSITY
            : (_f =
                  (_e =
                    (_d =
                      adjustments == null
                        ? void 0
                        : adjustments.gridIntensity) == null
                      ? void 0
                      : _d.dataCenter) == null
                    ? void 0
                    : _e.value) != null
              ? _f
              : GLOBAL_GRID_INTENSITY,
          production: GLOBAL_GRID_INTENSITY,
          device:
            (_i =
              (_h =
                (_g =
                  adjustments == null ? void 0 : adjustments.gridIntensity) ==
                null
                  ? void 0
                  : _g.device) == null
                ? void 0
                : _h.value) != null
              ? _i
              : GLOBAL_GRID_INTENSITY,
        },
      },
    }
  }
  perVisitTrace(bytes, green = false, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m
    if ((_a = this.model) == null ? void 0 : _a.perVisit) {
      let adjustments = {}
      if (options) {
        adjustments = parseOptions(options)
      }
      return {
        co2: this.model.perVisit(bytes, green, this._segment, adjustments),
        green,
        variables: {
          description:
            'Below are the variables used to calculate this CO2 estimate.',
          bytes,
          gridIntensity: {
            description:
              'The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate.',
            network:
              (_d =
                (_c =
                  (_b =
                    adjustments == null ? void 0 : adjustments.gridIntensity) ==
                  null
                    ? void 0
                    : _b.network) == null
                  ? void 0
                  : _c.value) != null
                ? _d
                : GLOBAL_GRID_INTENSITY,
            dataCenter: green
              ? RENEWABLES_GRID_INTENSITY
              : (_g =
                    (_f =
                      (_e =
                        adjustments == null
                          ? void 0
                          : adjustments.gridIntensity) == null
                        ? void 0
                        : _e.dataCenter) == null
                      ? void 0
                      : _f.value) != null
                ? _g
                : GLOBAL_GRID_INTENSITY,
            production: GLOBAL_GRID_INTENSITY,
            device:
              (_j =
                (_i =
                  (_h =
                    adjustments == null ? void 0 : adjustments.gridIntensity) ==
                  null
                    ? void 0
                    : _h.device) == null
                  ? void 0
                  : _i.value) != null
                ? _j
                : GLOBAL_GRID_INTENSITY,
          },
          dataReloadRatio:
            (_k = adjustments == null ? void 0 : adjustments.dataReloadRatio) !=
            null
              ? _k
              : 0.02,
          firstVisitPercentage:
            (_l =
              adjustments == null
                ? void 0
                : adjustments.firstVisitPercentage) != null
              ? _l
              : 0.75,
          returnVisitPercentage:
            (_m =
              adjustments == null
                ? void 0
                : adjustments.returnVisitPercentage) != null
              ? _m
              : 0.25,
        },
      }
    } else {
      throw new Error(`The perVisitDetailed() method is not supported in the model you are using. Try using perByte() instead.
See https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`)
    }
  }
}
var co2_default = CO2

var __getOwnPropNames = Object.getOwnPropertyNames
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    )
  }
var require_hosting_json = __commonJS({
  'src/hosting-json.js'(exports, module) {
    async function check(domain, db) {
      if (typeof domain === 'string') {
        return checkInJSON(domain, db)
      } else {
        return checkDomainsInJSON(domain, db)
      }
    }
    function checkInJSON(domain, db) {
      if (db.indexOf(domain) > -1) {
        return true
      }
      return false
    }
    function greenDomainsFromResults(greenResults) {
      const entries = Object.entries(greenResults)
      const greenEntries = entries.filter(([key, val]) => val.green)
      return greenEntries.map(([key, val]) => val.url)
    }
    function checkDomainsInJSON(domains, db) {
      let greenDomains = []
      for (let domain of domains) {
        if (db.indexOf(domain) > -1) {
          greenDomains.push(domain)
        }
      }
      return greenDomains
    }
    function find(domain, db) {
      if (typeof domain === 'string') {
        return findInJSON(domain, db)
      } else {
        return findDomainsInJSON(domain, db)
      }
    }
    function findInJSON(domain, db) {
      if (db.indexOf(domain) > -1) {
        return domain
      }
      return {
        url: domain,
        green: false,
      }
    }
    function findDomainsInJSON(domains, db) {
      const result = {}
      for (let domain of domains) {
        result[domain] = findInJSON(domain, db)
      }
      return result
    }
    module.exports = {
      check,
      greenDomainsFromResults,
      find,
    }
  },
})
var hostingJSON = require_hosting_json()

function check$1(domain, optionsOrAgentId) {
  const options =
    typeof optionsOrAgentId === 'string'
      ? { userAgentIdentifier: optionsOrAgentId }
      : optionsOrAgentId
  if ((options == null ? void 0 : options.db) && options.verbose) {
    throw new Error('verbose mode cannot be used with a local lookup database')
  }
  if (typeof domain === 'string') {
    return checkAgainstAPI(domain, options)
  } else {
    return checkDomainsAgainstAPI(domain, options)
  }
}
async function checkAgainstAPI(domain, options = {}) {
  const req = await fetch(
    `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
    {
      headers: getApiRequestHeaders(options.userAgentIdentifier),
    }
  )
  if (options == null ? void 0 : options.db) {
    return hostingJSON.check(domain, options.db)
  }
  const res = await req.json()
  return options.verbose ? res : res.green
}
async function checkDomainsAgainstAPI(domains, options = {}) {
  try {
    const apiPath = 'https://api.thegreenwebfoundation.org/v2/greencheckmulti'
    const domainsString = JSON.stringify(domains)
    const req = await fetch(`${apiPath}/${domainsString}`, {
      headers: getApiRequestHeaders(options.userAgentIdentifier),
    })
    const allGreenCheckResults = await req.json()
    return options.verbose
      ? allGreenCheckResults
      : greenDomainsFromResults(allGreenCheckResults)
  } catch (e) {
    return options.verbose ? {} : []
  }
}
function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults)
  const greenEntries = entries.filter(([key, val]) => val.green)
  return greenEntries.map(([key, val]) => val.url)
}
var hosting_api_default = {
  check: check$1,
}

function check(domain, optionsOrAgentId) {
  return hosting_api_default.check(domain, optionsOrAgentId)
}
var hosting_default = {
  check,
}

const getEmissions = async ({ bytes, model = '1byte', hostingOptions }) => {
  const emissions = new co2_default(model)

  try {
    const forceGreen = hostingOptions?.options?.forceGreen === true
    const webHosting = forceGreen || (await hasGreenWebHost(hostingOptions))
    const greenHosting = webHosting.url ? webHosting.green : webHosting

    return {
      emissions: emissions.perByte(bytes, greenHosting),
      greenHosting,
    }
  } catch (e) {
    console.error('Error calculating emissions:', e)
    throw e
  }
}

const hasGreenWebHost = async (hostingOptions) => {
  try {
    const { domain } = hostingOptions
    const { options } = hostingOptions
    return (await options)
      ? hosting_default.check(domain, options)
      : hosting_default.check(domain)
  } catch (e) {
    console.error('Error checking green status:', e)
    throw e
  }
}

const sortBy = ({ arr, prop, dir = 'asc' }) => {
  return dir === 'asc'
    ? arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return x - y
      })
    : arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return y - x
      })
}

const getDomainByPatternMatching = ({ url }) => {
  let result
  let match
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im
    ))
  ) {
    result = match[1]
    if ((match = result.match(/^[^.]+\.(.+\..+)$/))) {
      result = match[1]
    }
  }
  return result
}

const getDomainFromURL = (url) => {
  try {
    const parsedURL = new URL(url)
    let hostname = parsedURL.hostname

    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4)
    }

    return hostname
  } catch (e) {
    // If the built in parser fails, as it will for e.g. bbcorp.fr, use pattern matching
    if (e.code === 'ERR_INVALID_URL') {
      return getDomainByPatternMatching({ url })
    }
  }
}

const format = ({
  number,
  locale = 'en-GB',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}) => {
  // return number
  return (
    number?.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }) || 'n/a'
  )
}

const parseDomain = (name) => {
  const pretty = name.indexOf('/')
  return pretty > -1
    ? name.slice(0, pretty) // remove pretty parameters
    : name
}

const logOut = ({ title, data }) => {
  console.log('\n')
  console.warn(title)
  console.table(data)
}

const getHostingOptions = (options, domain) => {
  if (options?.hostingOptions) {
    return {
      domain,
      options: {
        ...options.hostingOptions,
      },
    }
  }
  return { domain }
}

// Helper function to use async/await with timers
const pause = async ({ func, delay = 2000 }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func())
    }, delay)
  })
}

const output = ({
  url,
  bytes,
  greenHosting,
  responses,
  emissions,
  groupedByType,
  groupedByTypeBytes,
  totalUncachedBytes,
}) => {
  return {
    url,
    bytes,
    count: responses.length,
    greenHosting,
    emissions,
    mgCO2: format({ number: emissions * 1000, maximumFractionDigits: 0 }),
    data: {
      groupedByType,
      groupedByTypeBytes,
      totalUncachedBytes,
    },
  }
}

const groupByType = (responses) => {
  return responses.reduce((acc, item) => {
    const { resourceType, ...rest } = item
    if (!acc[resourceType]) {
      acc[resourceType] = []
    }
    acc[resourceType].push(rest)
    return acc
  }, {})
}

const groupByTypeBytes = (groupedByType) => {
  const groupedByTypeBytes = []
  for (let [key] of Object.entries(groupedByType)) {
    if (key !== 'undefined') {
      groupedByType[key] = sortBy({
        arr: groupedByType[key],
        prop: 'bytes',
        dir: 'desc',
      })

      const groupBytes = {
        type: key,
        bytes: groupedByType[key].reduce((acc, curr) => acc + curr.bytes, 0),
        uncachedBytes: groupedByType[key].reduce((acc, curr) => {
          const uncached = curr.fromCache ? 0 : curr.uncompressedBytes
          return acc + uncached
        }, 0),
        count: groupedByType[key].length,
      }
      groupedByTypeBytes.push(groupBytes)
    }
  }
  return groupedByTypeBytes
}

const processResponses = (responses) => {
  const validResponses = responses.filter((res) => res)

  const groupedByType = groupByType(validResponses)
  const groupedByTypeBytes = groupByTypeBytes(groupedByType)

  const bytes =
    groupedByTypeBytes.reduce((acc, curr) => acc + (curr?.bytes || 0), 0) || 0

  const totalUncachedBytes = groupedByTypeBytes.reduce(
    (acc, curr) => acc + curr.uncachedBytes,
    0
  )

  return {
    bytes,
    groupedByType,
    groupedByTypeBytes,
    totalUncachedBytes,
  }
}

const getNetworkTraffic = async (url, options) => {
  try {
    const domain = getDomainFromURL(url)

    const db = await openDatabase()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    const records = await getRecords(store)
    const bytes = records.reduce((acc, curr) => acc + curr.bytes, 0)
    const { emissions, greenHosting } = await getEmissions({
      bytes,
      hostingOptions: getHostingOptions(options, domain),
    })

    const { groupedByType, groupedByTypeBytes, totalUncachedBytes } =
      processResponses(records)

    const report = output({
      url,
      bytes,
      greenHosting,
      responses: records,
      emissions,
      groupedByType,
      groupedByTypeBytes,
      totalUncachedBytes,
    })

    return report
  } catch (error) {
    throw new Error(`Failed to get network traffic: ${error.message}`)
  }
}

const getRecords = (store) => {
  return new Promise((resolve, reject) => {
    const responses = []
    const request = store.openCursor()

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        responses.push(cursor.value)
        cursor.continue()
      } else {
        resolve(responses)
      }
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

const clearNetworkTraffic = async () => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)

  store.clear().onsuccess = function () {
    console.log(`Object store ${STORE} cleared.`)
  }

  tx.oncomplete = function () {
    db.close()
  }

  tx.onerror = function (event) {
    console.error('Transaction error:', event.target.error)
  }
}

const processResponse = async (response, compressionOptions) => {
  try {
    return await getResponseDetails(response, 'node', compressionOptions)
  } catch (e) {
    console.log(e)
  }
}

const getPageEmissions = async (page, url, options) => {
  const ignorable = [
    'Could not load body for this request. This might happen if the request is a preflight request.',
  ]

  let responses = []

  page.on('response', async (response) => {
    try {
      const responseDetails = await processResponse(
        response,
        options.compressionOptions
      )
      responses.push(responseDetails)
    } catch (e) {
      if (!ignorable.includes(e.message)) {
        console.error(e.message)
      }
    }
  })

  await page.goto(url)

  let bytes, groupedByType, groupedByTypeBytes, totalUncachedBytes

  await pause({
    func: async () => {
      ;({ bytes, groupedByType, groupedByTypeBytes, totalUncachedBytes } =
        processResponses(responses))
    },
    delay: 5000,
  })

  const domain = getDomainFromURL(url)

  const { emissions, greenHosting } = await getEmissions({
    bytes,
    hostingOptions: getHostingOptions(options, domain),
  })

  return output({
    url,
    bytes,
    greenHosting,
    responses,
    emissions,
    groupedByType,
    groupedByTypeBytes,
    totalUncachedBytes,
  })
}

const browser = {
  registerServiceWorker,
  getPageEmissions: getNetworkTraffic,
  clearPageEmissions: clearNetworkTraffic,
}

const node = {
  getPageEmissions,
}

const getLighthouseReport = async (
  url,
  lighthouse,
  chromeLauncher,
  flags = {}
) => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless'],
  })
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  }
  const runnerResult = await lighthouse(url, { ...options, ...flags })
  const lh = runnerResult.lhr

  const report = {
    audits: {
      'first-contentful-paint': {
        id: lh.audits['first-contentful-paint'].id,
        title: lh.audits['first-contentful-paint'].title,
        score: lh.audits['first-contentful-paint'].score,
      },
      'largest-contentful-pain': {
        id: lh.audits['largest-contentful-paint'].id,
        title: lh.audits['largest-contentful-paint'].title,
        score: lh.audits['largest-contentful-paint'].score,
      },
      'first-meaningful-paint': {
        id: lh.audits['first-meaningful-paint'].id,
        title: lh.audits['first-meaningful-paint'].title,
        score: lh.audits['first-meaningful-paint'].score,
      },
      'speed-index': {
        id: lh.audits['speed-index'].id,
        title: lh.audits['speed-index'].title,
        score: lh.audits['speed-index'].score,
      },
      interactive: {
        id: lh.audits['interactive'].id,
        title: lh.audits['interactive'].title,
        score: lh.audits['interactive'].score,
      },
      'user-timings': {
        id: lh.audits['user-timings'].details.items,
      },
      metrics: lh.audits['metrics'].details.items,
      'resource-summary': lh.audits['resource-summary'].details.items,
      'third-party-summary':
        lh.audits['third-party-summary']?.details?.items || [],
      'script-treemap-data': lh.audits['script-treemap-data'].details.items,
      'total-byte-weight': lh.audits['total-byte-weight'].details.items,
      'dom-size': lh.audits['dom-size'].numericValue,
    },
    entities: lh.entities,
  }

  const summary = {
    totalResourceTransferSize: report.audits['resource-summary'].find(
      (r) => r.resourceType === 'total'
    ).transferSize,
    requestCount: report.audits['resource-summary'].find(
      (r) => r.resourceType === 'total'
    ).requestCount,
    resources: report.audits['resource-summary'].filter(
      (r) => r.resourceType !== 'total'
    ),
    observedDomContentLoaded:
      report.audits.metrics[0]?.observedDomContentLoaded || 0,
    observedLoad: report.audits.metrics[0].observedLoad || 0,
    thirdPartySummary: {
      totalTransferSize: report.audits['third-party-summary'].reduce(
        (total, tp) => total + tp.transferSize,
        0
      ),
      entities: report.audits['third-party-summary'].map((tp) => {
        return { entity: tp.entity, transferSize: tp.transferSize }
      }),
    },
    totalByteWeight: report.audits['total-byte-weight'].reduce(
      (total, current) => total + current.totalBytes,
      0
    ),
    DOMSize: report.audits['dom-size'],
  }

  chrome.kill()

  return { report, summary }
}

const reports = {
  lighthouse: getLighthouseReport,
}

class EmissionsTracker {
  // Private fields
  #page = null
  #options = {}
  #byteOptions = null
  #visitOptions = null
  #entries = []
  #cumulativeBytes = 0
  #emissionsPerByte = null
  #emissionsPerVisit = null
  #byteTrace = null
  #visitTrace = null
  #hosting = {}
  #summary = []
  #details = []

  constructor(page, options, byteOptions = null, visitOptions = null) {
    if (!page) {
      throw new Error('page is required')
    }

    this.#page = page
    this.#options = options
    this.#byteOptions = byteOptions
    this.#visitOptions = visitOptions

    this.#logResources()
  }

  // Private methods
  #logPerByte({ bytes, green = false, bySegment = false }) {
    const co2Emission = bySegment
      ? new co2_default({ results: 'segment' })
      : new co2_default()
    this.#emissionsPerByte = co2Emission.perByte(bytes, green)
  }

  #logPerVisit({ bytes, green = false, bySegment = false }) {
    const co2Emission = bySegment
      ? new co2_default({ results: 'segment' })
      : new co2_default()
    this.#emissionsPerVisit = co2Emission.perVisit(bytes, green)
  }

  #logPerByteTrace({ bytes, green = false, options }) {
    if (bytes) {
      const co2Emission = new co2_default()
      this.#byteTrace = co2Emission.perByteTrace(bytes, green, options)
    }
  }

  #logPerVisitTrace({ bytes, green = false, options }) {
    if (bytes) {
      const co2Emission = new co2_default()
      this.#visitTrace = co2Emission.perVisitTrace(bytes, green, options)
    }
  }

  async #checkHosting({ domain = '', verbose = true, identifier = '' }) {
    try {
      if (domain.length) {
        const options = {
          verbose,
          userAgentIdentifier: identifier,
        }

        this.#hosting = await hosting_default.check(domain, options)
      } else {
        this.#hosting = { hosted_by: 'unknown', green: false }
      }
    } catch (e) {
      this.#hosting = { hosted_by: 'unknown', green: false }
      console.log(e)
    }
  }

  async #logResources() {
    const co2Emission = new co2_default()

    this.#page.on('response', async (response) => {
      const responseDetails = await processResponse(
        response,
        this.#options.compressionOptions
      )

      // Ignore responses we've chosen to ignore
      if (!responseDetails) return

      // Ignore duplicates
      if (this.#entries.find((t) => t.url === response.url())) return

      this.#entries.push(responseDetails)

      // Calculate cumulative bytes and emissions
      this.#cumulativeBytes = this.#entries.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.compressedBytes,
        0
      )
    })

    let recordedBytes = 0

    const logAggregate = ({ bytes = 0 }) => {
      if (recordedBytes === bytes) return
      const emissions = co2Emission.perByte(bytes, true)
      logOut({
        title:
          'Cumulative bytes in kBs and emissions in mg/CO2. Runs every 5 seconds.',
        data: [
          {
            kBs: format({ number: bytes }),
            emissions: format({ number: emissions, maximumFractionDigits: 3 }),
          },
        ],
      })
      recordedBytes = bytes
    }

    setInterval(() => logAggregate({ bytes: this.#cumulativeBytes }), 5000)
  }

  async #printSummary() {
    // Check for green hosting
    try {
      if (this.#options.domain) {
        await this.#checkHosting({
          domain: parseDomain(this.#options.domain),
          identifier: this.#options.domain,
        })

        // Save green hosting
        this.#summary.push({
          metric: 'Green hosting',
          value: this.#hosting.green,
        })

        if (this.#options?.reportGreenHosting) {
          delete this.#hosting.supporting_documents

          const data = {
            title: 'Green reporting',
            data: this.#hosting,
          }

          if (this.#options.verbose) {
            // Log green hosting
            logOut(data)
          }

          // Save green hosting details
          this.#details.push(data)
        }
      }
    } catch (e) {
      console.log(e)
    }

    // Calculate total bytes transferred
    const bytes = this.#entries.reduce(
      (accumulator, currentValue) => accumulator + currentValue.compressedBytes,
      0
    )
    const kBs = format({ number: bytes, maximumFractionDigits: 1 })

    // Get country specific grid intensities
    const { data, type, year } = average_intensities_min_default

    // Calculate grid intensity
    const gridData = {
      title: 'Grid intensity in gCO2e per kWh',
      data: [
        {
          countryCode: this.#options.countryCode,
          gridIntensity: data[this.#options.countryCode],
        },
      ],
    }

    if (this.#options.verbose) {
      // Log grid intensity
      logOut(gridData)
    }

    // Save grid intensity for country code
    this.#details.push(gridData)

    // Save grid intensity
    this.#summary.push({
      metric: 'Grid intensity in gCO2e per kWh',
      value: gridData.data[0].gridIntensity,
    })

    // Calculate total emissions per byte
    this.#logPerByte({
      bytes,
      green: this.#hosting?.green,
      bySegment: false,
    })

    if (this.#options.verbose) {
      // Log per emissions per byte
      logOut({
        title: `Page emissions per byte for ${kBs} kilobytes (Kbs)`,
        data: [
          {
            unit: 'mg/CO2',
            emissions: format({
              number: this.#emissionsPerByte,
              maximumFractionDigits: 3,
            }),
          },
        ],
      })
    }

    // Save emissions per byte in mg
    this.#summary.push({
      metric: 'Page emissions per byte in mg/CO2',
      value: format({
        number: this.#emissionsPerByte,
        maximumFractionDigits: 3,
      }),
    })

    // Save emissions per byte in g
    this.#summary.push({
      metric: 'Page emissions per byte in g/CO2',
      value: format({
        number: this.#emissionsPerByte,
        maximumFractionDigits: 3,
      }),
    })

    // Calculate per emissions per byte per sector
    this.#logPerByte({
      bytes,
      green: this.#hosting?.green,
      bySegment: true,
    })

    const perByteData = Object.keys(this.#emissionsPerByte).map((sector) => {
      return {
        sector,
        emissions: format({
          number: this.#emissionsPerByte[sector],
          maximumFractionDigits: 3,
        }), // convert to milligrams
      }
    })

    const byteData = {
      title: `Page emissions per byte per segment for ${kBs} kilobytes (kBs)`,
      data: perByteData,
    }

    if (this.#options.verbose) {
      // Log emissions per byte per sector
      logOut(byteData)
    }

    // Save emissions per byte per sector
    this.#details.push(byteData)

    // Calculate emissions per visit
    this.#logPerVisit({
      bytes,
      green: this.#hosting?.green,
      bySegment: false,
    })

    if (this.#options.verbose) {
      // Log emissions per visit
      logOut({
        title: `Page emissions per visit in mg/CO2 for ${kBs} kilobytes (kBs)`,
        data: [
          {
            unit: 'mg/CO2',
            emissions: format({
              number: this.#emissionsPerVisit,
              maximumFractionDigits: 3,
            }),
          },
        ],
      })
    }

    // Save emissions per visit
    this.#summary.push({
      metric: 'Page emissions per visit in mg/CO2',
      value: format({
        number: this.#emissionsPerVisit,
        maximumFractionDigits: 3,
      }),
    })

    this.#summary.push({
      metric: 'Page emissions per visit in g/CO2',
      value: format({
        number: this.#emissionsPerVisit,
        maximumFractionDigits: 3,
      }),
    })

    // Calculate emissions per visit per sector
    this.#logPerVisit({
      bytes,
      green: this.#hosting?.green,
      bySegment: true,
    })

    // Log emissions per visit per sector
    const perVisitData = Object.keys(this.#emissionsPerVisit).map((sector) => {
      return {
        sector,
        emissions: format({
          number: this.#emissionsPerVisit[sector],
          maximumFractionDigits: 3,
        }), // convert to milligrams
      }
    })

    const visitData = {
      title: `Page emissions per visit per segment for ${kBs} kilobytes (kBs)`,
      data: perVisitData,
    }

    if (this.#options.verbose) {
      //Log emissions per visit per sector
      logOut(visitData)
    }

    // Save emissions per visit per sector
    this.#details.push(visitData)

    // Calculate emissions per byte trace
    this.#byteOptions = this.#byteOptions || {
      gridIntensity: {
        device: { country: this.#options.countryCode },
        dataCenter: { country: this.#options.countryCode },
        networks: { country: this.#options.countryCode },
      },
    }

    this.#logPerByteTrace({
      bytes,
      green: this.#hosting?.green,
      options: this.#byteOptions,
    })

    // Log emissions per byte trace
    // logOut({
    //     title: 'Byte trace: grid intensity in g/kWh'
    //   , data: this.#byteTrace.variables.gridIntensity
    // })

    // Calculate emissions per visit trace
    this.#visitOptions = this.#visitOptions || {
      gridIntensity: {
        device: { country: this.#options.countryCode },
        dataCenter: { country: this.#options.countryCode },
        networks: { country: this.#options.countryCode },
      },
    }

    this.#logPerVisitTrace({
      bytes,
      green: this.#hosting?.green,
      options: this.#visitOptions,
    })

    // Log emissions per visit trace
    // logOut({
    //     title: 'Visit trace: grid intensity in g/kWh'
    //   , data: this.#visitTrace.variables.gridIntensity
    // })

    // Save total bytes transferred
    this.#summary.push({
      metric: 'Resources transferred in kBs',
      value: kBs,
    })

    this.#summary.push({
      metric: 'Number of requests',
      value: this.#entries.length,
    })

    // Print summary
    logOut({
      title: 'Page summary',
      data: this.#summary,
    })
  }

  // Public methods
  async getReport() {
    await this.#printSummary()

    let bytes, groupedByType, groupedByTypeBytes, totalUncachedBytes

    await pause({
      func: async () => {
        ;({ bytes, groupedByType, groupedByTypeBytes, totalUncachedBytes } =
          processResponses(this.#entries))
      },
      delay: 5000,
    })

    const report = output({
      url: this.#options.url,
      bytes,
      responses: this.#entries,
      groupedByType,
      groupedByTypeBytes,
      totalUncachedBytes,
    })

    this.#summary = []
    this.#details = []

    return report
  }
}

const getBytes = ({
  compressedBytes,
  uncompressedBytes,
  encoding,
  compressionOptions,
}) => {
  if (compressedBytes !== 0) return compressedBytes

  return (
    compressUncompressedBytes({
      encoding,
      bytes: uncompressedBytes,
      compressionOptions,
    }) || 0
  )
}

const compressUncompressedBytes = ({ encoding, bytes, compressionOptions }) => {
  // default compression rates
  let BR = compressionRates.brotli.find((b) => b.level === 3).rate
  let GZIP = compressionRates.gzip.find((g) => g.level === 5).rate
  let DEFLATE = 1 // tbd
  let ZSTD = 1 // tbd

  if (compressionOptions) {
    BR =
      compressionRates.brotli.find((b) => b.level === compressionOptions.br)
        ?.rate || BR
    GZIP =
      compressionRates.gzip.find((g) => g.level === compressionOptions.gzip)
        ?.rate || GZIP
  }

  let ratio
  switch (encoding) {
    case 'br':
      ratio = BR
      break
    case 'gzip':
      ratio = GZIP
      break
    case 'deflate':
      ratio = DEFLATE
      break
    case 'zstd':
      ratio = ZSTD
      break
    default:
      ratio = 1
  }

  return Math.round(bytes / ratio)
}

const getResponseDetails = async (response, env, compressionOptions) => {
  const acceptedStatuses = [200, 304]
  const status = response.status

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const isBrowser = env === 'browser'

  const getHeader = (header) => response.headers.get(header)
  const getBuffer = async () => response.arrayBuffer()

  const url = isBrowser ? response.url : response.url()
  const contentLength = getHeader('Content-Length')
  const contentType = getHeader('Content-Type')
  const contentEncoding = getHeader('Content-Encoding') || 'n/a'
  const buffer = await getBuffer()

  const uncompressedBytes = buffer.byteLength
  const compressedBytes = contentLength ? parseInt(contentLength, 10) : 0
  const bytes = getBytes({
    compressedBytes,
    uncompressedBytes,
    encoding: contentEncoding,
    compressionOptions,
  })

  let resourceType

  {
    if (contentType.includes('text/html')) {
      resourceType = 'document'
    } else if (contentType.includes('application/javascript')) {
      resourceType = 'script'
    } else if (contentType.includes('image/')) {
      resourceType = 'image'
    } else {
      resourceType = 'other'
    }
  }

  return {
    url,
    contentType,
    compressedBytes,
    uncompressedBytes,
    bytes,
    encoding: contentEncoding,
    resourceType,
  }
}

const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        // Use auto generated id` as the record key
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

const saveNetworkTraffic = async (responseDetails) => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const emissions = tx.objectStore(STORE)

  const record = {
    url: responseDetails.url,
    bytes: responseDetails.bytes,
    uncompressedBytes: responseDetails.uncompressedBytes,
    contentType: responseDetails.contentType,
    resourceType: responseDetails.resourceType,
  }

  await emissions.add(record)

  db.close()
}
