/* eslint-disable react/prop-types */

import { createContext, useContext, useReducer } from "react";

const PrioritizedSourcesContext = createContext();

const initialState = {
  prioritizedSources: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "sources/added":
      return {
        ...state,
        prioritizedSources: [...state.prioritizedSources, action.payload],
      };
    case "sources/deleted":
      return {
        ...state,
        prioritizedSources: state.prioritizedSources.filter(
          (source) => source !== action.payload
        ),
      };
  }
}

function PrioritizedSourcesProvider({ children }) {
  const [{ prioritizedSources }, dispatch] = useReducer(reducer, initialState);

  function addPrioritizedSource(source) {
    dispatch({ type: "sources/added", payload: source });
  }

  function deletePrioritizedSource(source) {
    dispatch({ type: "sources/deleted", payload: source });
  }

  return (
    <PrioritizedSourcesContext.Provider
      value={{
        prioritizedSources,
        addPrioritizedSource,
        deletePrioritizedSource,
      }}
    >
      {children}
    </PrioritizedSourcesContext.Provider>
  );
}

function usePrioritizedSources() {
  const context = useContext(PrioritizedSourcesContext);
  if (context === undefined)
    throw new Error(
      "PrioritizedSourcesContext was used outside the PrioritizedSourcesProvider"
    );

  return context;
}

export { PrioritizedSourcesProvider, usePrioritizedSources };
