import * as type from "../types";

export const setSportName = (name) => (dispatch) => {
  dispatch({
    type: type.SET_SPORT_NAME,
    payload: name,
  });
};
