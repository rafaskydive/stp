const constants = require('../constants');

export function increase(n) {
  return {
    type: constants.INCREASE,
    amount: n
  };
}

export function decrease(n) {
  return {
    type: constants.DECREASE,
    amount: n
  };
}
