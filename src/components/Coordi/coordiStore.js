import React, { createContext, useContext, useReducer, useCallback } from "react";
import * as api from "./coordi.api.js"; 

const initialState = {
  wardrobe: [],
  selectedItemIds: [],
  activity: { stage1: "", stage2: "" },
  recommendations: [],
  loading: false,
  error: null,
};

const CoordiContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.flag };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_WARDROBE":
      return { ...state, wardrobe: action.items };
    case "TOGGLE_SELECT":
      return {
        ...state,
        selectedItemIds: state.selectedItemIds.includes(action.id)
          ? state.selectedItemIds.filter((x) => x !== action.id)
          : [...state.selectedItemIds, action.id],
      };
    case "CLEAR_SELECT":
      return { ...state, selectedItemIds: [] };
    case "SET_ACTIVITY":
      return { ...state, activity: { ...state.activity, ...action.payload } };
    case "SET_RECOMMENDATIONS":
      return { ...state, recommendations: action.items };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function CoordiProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadWardrobe = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", flag: true });
      const items = await api.getClosetItems();
      dispatch({ type: "SET_WARDROBE", items });
    } catch (e) {
      dispatch({ type: "SET_ERROR", error: "옷장 불러오기 실패" });
    } finally {
      dispatch({ type: "SET_LOADING", flag: false });
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", flag: true });
      const items = await api.getRecommendations(state.selectedItemIds, state.activity);
      dispatch({ type: "SET_RECOMMENDATIONS", items });
    } catch (e) {
      dispatch({ type: "SET_ERROR", error: "추천 실패" });
    } finally {
      dispatch({ type: "SET_LOADING", flag: false });
    }
  }, [state.selectedItemIds, state.activity]);

  const rateRecommendation = useCallback(async (rating) => {
    try {
      await api.sendRating({
        selectedItemIds: state.selectedItemIds,
        recommendedIds: state.recommendations.map((x) => x.id),
        rating,
      });
    } catch (e) {}
  }, [state.selectedItemIds, state.recommendations]);

  const value = {
    state,
    loadWardrobe,
    fetchRecommendations,
    rateRecommendation,
    toggleSelect: (id) => dispatch({ type: "TOGGLE_SELECT", id }),
    clearSelect: () => dispatch({ type: "CLEAR_SELECT" }),
    setActivity: (payload) => dispatch({ type: "SET_ACTIVITY", payload }),
    reset: () => dispatch({ type: "RESET" }),
  };

  // ✅ JSX 대신 createElement 사용 → .js로 사용 가능
  return React.createElement(CoordiContext.Provider, { value }, children);
}

export function useCoordi() {
  const ctx = useContext(CoordiContext);
  if (!ctx) throw new Error("useCoordi must be used within CoordiProvider");
  return ctx;
}
