 
import { Action,  State} from "../components/types"

export const initialState: State = {
    players: [],
    teams: [],
    leagues: [],
    countries: [],
    loading: false,
    error: null
}


export enum ActionTypes {
    FETCH_START = 'fetchStart',
    FETCH_SUCCESS = 'fetchSuccess',
    FETCH_ERROR = 'fetchError',
    ADD_ITEM = 'addItem',
    UPDATE_ITEM = 'updateItem',
    DELETE_ITEM ='deleteItem'
}




export const basketballReducer = (state: State, action: Action): State => {
    switch(action.type) {
        case ActionTypes.FETCH_START:
            return {...state, loading: true, error: null}
            
        case ActionTypes.FETCH_SUCCESS:
            return {...state, loading: false, [action.payload.type]: action.payload.data}    
            
        case ActionTypes.FETCH_ERROR: 
            return {...state, loading: false , error: action.payload}
            
            case ActionTypes.ADD_ITEM: {
                const key = action.payload.type;
                const currentArray = state[key] as Array<typeof action.payload.item>;
                
                // Check if item already exists
                const itemExists = currentArray.some(item => item.id === action.payload.item.id);
                if (itemExists) {
                    return state;
                }
                
                return {
                    ...state,
                    [key]: [...currentArray, action.payload.item]
                };
            }
    
            case ActionTypes.UPDATE_ITEM: {
                const currentArray = state[action.payload.type];
                
                if (!Array.isArray(currentArray)) {
                    return state;
                }
            
                // Only update if item exists and has changes
                const existingItem = currentArray.find(item => item.id === action.payload.item.id);
                if (!existingItem || JSON.stringify(existingItem) === JSON.stringify(action.payload.item)) {
                    return state;
                }
                
                return {
                    ...state,
                    [action.payload.type]: currentArray.map((item) =>
                        item.id === action.payload.item.id ? action.payload.item : item
                    )
                };
            }
    
            case ActionTypes.DELETE_ITEM: {
                const currentArray = state[action.payload.type];
                 
                if (!Array.isArray(currentArray)) {
                    return state;
                }
    
                // Only filter if item exists
                if (!currentArray.some(item => item.id === action.payload.id)) {
                    return state;
                }
    
                return {
                    ...state,
                    [action.payload.type]: currentArray.filter(
                        (item) => item.id !== action.payload.id
                    ),
                };
            }
        
        default:
            return state
    }
}




