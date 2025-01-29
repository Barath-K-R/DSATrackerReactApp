import React, { createContext, useContext, useReducer } from "react";
import { modalReducer, initialState } from "./modalReducer";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const toggleCreateProblemModal = () => dispatch({ type: "TOGGLE_CREATE_PROBLEM_MODAL" });
  const toggleCreateProblemTypeModal = () => dispatch({ type: "TOGGLE_CREATE_PROBLEM_TYPE_MODAL" });
  const toggleCreateSolutionModal = () => dispatch({ type: "TOGGLE_CREATE_SOLUTION_MODAL" });
  const toggleTypeSelectionModal = () => dispatch({ type: "TOGGLE_TYPE_SELECTION_MODAL" }); 
  const toggleProfileModal=()=>dispatch({type:"TOGGLE_PROFILE_MODAL"});
  const closeAllModals = () => dispatch({ type: "CLOSE_ALL_MODALS" });

  return (
    <ModalContext.Provider
      value={{
        ...state,
        toggleCreateProblemModal,
        toggleCreateProblemTypeModal,
        toggleCreateSolutionModal,
        toggleTypeSelectionModal,
        toggleProfileModal,
        closeAllModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};
