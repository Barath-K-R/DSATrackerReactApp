const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return {
        ...state,
        authUser: action.payload,
      };
    case 'SET_TOKEN':
      console.log(action.payload);
      return {
        ...state,
        token: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authUser: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        authUser: { ...state.authUser, ...action.payload },
      };
    default:
      return state;
  }
};

export { authReducer };
