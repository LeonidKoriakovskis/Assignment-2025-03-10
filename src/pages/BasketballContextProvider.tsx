import { createContext, ReactNode, useEffect, useReducer } from "react"
import { Country, League, Player, State, Team } from "../components/types"
import { ActionTypes, basketballReducer, initialState } from "./BasketballReducer"
import axios from "axios"
import { API_URL } from "../api/apiUrl"



interface BasketballContextProps{
    state: State,
    fetchData: (type: keyof State, endpoint: string) => Promise<void>
    addItem: <T extends Player | Team | State | League | Country>(type: keyof State, item: T, endpoint:string) => Promise<void>
    updateItem: <T extends Player | Team | State | League | Country>(type: keyof State, item: T, endpoint:string) => Promise<void>
    deleteItem: (type: keyof State, id: number, endpoint: string) => Promise<void>

}

const BasketballContext = createContext<BasketballContextProps | undefined>(undefined)


export const ProjectContextProvider = ({children} : {children: ReactNode}) => {
    const [state, dispatch] = useReducer(basketballReducer, initialState)

     const fetchData = async(type: keyof State, endpoint: string) => {
        dispatch({type: ActionTypes.FETCH_START})
        try{
            const { data } = await axios.get(`${API_URL}/${endpoint}`, {
                params: {
                    _expand: 'country',
                    _embed: 'players'
                }
            })

            dispatch({type: ActionTypes.FETCH_SUCCESS,payload: {type, data  }})
        } catch (error) {
            dispatch({type: ActionTypes.FETCH_ERROR, payload: (error as Error).message})
        }
    }

    const addItem = async <T extends Player | Team | League | Country>(type:  keyof State, item: T, endpoint:string) => {
        try{
            const { data } = await axios.post(`${API_URL}/${endpoint}`, item)
            dispatch({ type: ActionTypes.ADD_ITEM, payload: {type, item:data} })
        } catch (error){
            dispatch({ type: ActionTypes.FETCH_ERROR, payload: (error as Error).message})
        }
    }

    const ctxValue: BasketballContextProps = {
        state, 
        fetchData,
        addItem,
        updateItem,
        deleteItem
    }

    useEffect(() => {
        fetchData('players', 'players')
        fetchData('teams', 'teams')
        fetchData('leagues', 'leagues')
        fetchData('countries', 'countries')
    })
    return(
        <BasketballContext.Provider value={{ctxValue}}>
            {children}
        </BasketballContext.Provider>
        
    )
}

export default ProjectContextProvider