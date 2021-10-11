import { configureStore } from '@reduxjs/toolkit'

const initialState = { loading: false }

function loadingReducer(state = initialState, action: any) {
    if (action.type === 'loading/started') {
        return {
            ...state,
            loading: true,
        }
    }
    if (action.type === 'loading/ended') {
        return {
            ...state,
            loading: false,
        }
    }
    return state
}



const store = configureStore({ reducer: loadingReducer });
export default store;