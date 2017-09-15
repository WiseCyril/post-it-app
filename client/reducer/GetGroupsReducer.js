import { GET_ALL_GROUPS } from '../constants/ActionTypes';


export default (state = [], action = {}) => {
  switch (action.type) {
  case GET_ALL_GROUPS: {
    return [
      ...state,
      ...action.groupData
    ];
  }
  default:
    return state;
  }
};
