export const initialState = {
  isCreateProblemModalOpen: false,
  isCreateProblemTypeModalOpen: false,
  isCreateSolutionModalOpen: false,
  isTypeSelectionModalOpen: false,
  isProfileModalOpen:false
};

// Reducer function to manage state updates
export const modalReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_CREATE_PROBLEM_MODAL":
      return { ...state, isCreateProblemModalOpen: !state.isCreateProblemModalOpen };
    case "TOGGLE_CREATE_PROBLEM_TYPE_MODAL":
      return { ...state, isCreateProblemTypeModalOpen: !state.isCreateProblemTypeModalOpen };
    case "TOGGLE_CREATE_SOLUTION_MODAL":
      return { ...state, isCreateSolutionModalOpen: !state.isCreateSolutionModalOpen };
    case "TOGGLE_TYPE_SELECTION_MODAL": 
      return { ...state, isTypeSelectionModalOpen: !state.isTypeSelectionModalOpen };
      case "TOGGLE_PROFILE_MODAL":
        return {...state, isProfileModalOpen: !state.isProfileModalOpen};
    case "CLOSE_ALL_MODALS":
      return { ...initialState };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
