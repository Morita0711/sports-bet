import * as type from "../types";
const main = (
  state = {
    sportName: "",
  },
  action
) => {
  switch (action.type) {
    case type.SET_SPORT_NAME:
      return {
        ...state,
        sportName: action.payload,
      };
    default:
      return { ...state };
  }
};

export default main;
