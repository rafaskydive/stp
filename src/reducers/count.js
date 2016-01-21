const constants = require('../constants');

const initialState = {
  number: 1
}

// function update(state = initialState, action) {
//   if(action.type === constants.INCREASE) {
//     return { number: state.number + action.amount };
//   }
//   else if(action.type === constants.DECREASE) {
//     return { number: state.number - action.amount };
//   }
//   return state;
// }
export default function update(state = initialState, action) {
  switch(action.type) {
    case constants.INCREASE:
      return { number: state.number + action.amount }
    case constants.DECREASE:
      return { number: state.number - action.amount }
    default:
      return state
  }
}
