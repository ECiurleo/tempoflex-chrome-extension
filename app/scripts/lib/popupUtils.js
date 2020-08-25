'use strict';

import * as chromeUtils from './chromeUtils'
import * as stringUtils from './stringUtils'
import Tempo from './tempo'
import "regenerator-runtime/runtime.js";

const flexCalculator = (settings) => {

  const tempo = new Tempo(settings)

  return Promise.all([
      tempo.fetchPeriodFlexTotal(),
      tempo.fetchFutureWorklogTotal()
  ])
  .then(flexValues => {
    let [periodData, futureAdjustment] = flexValues
    return periodData - futureAdjustment
  })
  .catch(err => {
    return Promise.reject(err)
  })
}

const getFlex = async () => {
  let settings = await chromeUtils.getSettings()
  return flexCalculator(settings)
    .then(flex => {
      return stringUtils.convertFlexToString(flex, settings.hoursPerDay)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

const setPopupText = (_document, text, colour = 'black') => {
  let flexInfo = _document.getElementById('flextime')
  flexInfo.innerText = text
  flexInfo.style = `color: ${colour}`
}

export {
  getFlex,
  setPopupText
}