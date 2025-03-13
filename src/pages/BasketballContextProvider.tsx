/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useCallback, ReactNode, useContext } from "react";
import { State, Player, Team, League, Country } from '../components/types';
import axios from 'axios';
import { ActionTypes, basketballReducer, initialState } from "./BasketballReducer";
import { API_URL } from "../api/apiUrl";

// Define a type for valid entities
type Entity = Player | Team | League | Country;

// Define your context props interface
interface BasketballContextProps {
    state: State;
    fetchData: (type: keyof State, endpoint: string) => Promise<void>;
    addItem: <T extends Entity>(type: keyof State, item: T) => Promise<void>;
    updateItem: <T extends Entity>(type: keyof State, id: number, updates: Partial<T>) => Promise<void>;
    deleteItem: (type: keyof State, id: number) => Promise<void>;
}

export const BasketballContext = createContext<BasketballContextProps | undefined>(undefined);

export const BasketballContextProvider = ({children}: {children: ReactNode}) => {
    const [state, dispatch] = useReducer(basketballReducer, initialState);

    const fetchData = useCallback(async (type: keyof State, endpoint: string) => {
        if (Array.isArray(state[type]) && state[type].length > 0) return;

        dispatch({type: ActionTypes.FETCH_START});
        try {
            const { data } = await axios.get(`${API_URL}/${endpoint}`);
            dispatch({type: ActionTypes.FETCH_SUCCESS, payload: {type, data}});
        } catch (error) {
            dispatch({type: ActionTypes.FETCH_ERROR, payload: 
                error instanceof Error ? error.message : 'An error occurred'
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addItem = useCallback(async <T extends Entity>(
        type: keyof State,
        item: T
    ) => {
        dispatch({type: ActionTypes.FETCH_START});
        try {
            const { data } = await axios.post(`${API_URL}/${type}`, item);
            dispatch({
                type: ActionTypes.ADD_ITEM,
                payload: { type, item: data }
            });
        } catch (error) {
            dispatch({type: ActionTypes.FETCH_ERROR, payload: 
                error instanceof Error ? error.message : 'An error occurred'
            });
        }
    }, []);

    const updateItem = useCallback(async <T extends Entity>(
        type: keyof State,
        id: number,
        updates: Partial<T>
    ) => {
        dispatch({type: ActionTypes.FETCH_START});
        try {
            const { data } = await axios.patch(`${API_URL}/${type}/${id}`, updates);
            dispatch({
                type: ActionTypes.UPDATE_ITEM,
                payload: { type, item: data }
            });
        } catch (error) {
            dispatch({type: ActionTypes.FETCH_ERROR, payload: 
                error instanceof Error ? error.message : 'An error occurred'
            });
        }
    }, []);

    const deleteItem = useCallback(async (type: keyof State, id: number) => {
        dispatch({type: ActionTypes.FETCH_START});
        try {
            await axios.delete(`${API_URL}/${type}/${id}`);
            dispatch({
                type: ActionTypes.DELETE_ITEM,
                payload: { type, id }
            });
        } catch (error) {
            dispatch({type: ActionTypes.FETCH_ERROR, payload: 
                error instanceof Error ? error.message : 'An error occurred'
            });
        }
    }, []);

    const value = {
        state,
        fetchData,
        addItem,
        updateItem,
        deleteItem
    };

    return (
        <BasketballContext.Provider value={value}>
            {children}
        </BasketballContext.Provider>
    );
};

export const useBasketballContext = () => {
    const context = useContext(BasketballContext);
    if (!context) {
        throw new Error('useBasketballContext must be used within a BasketballContextProvider');
    }
    return context;
};

export default BasketballContextProvider