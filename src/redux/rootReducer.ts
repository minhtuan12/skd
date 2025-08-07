import {combineReducers} from "redux";
import configReducer from './slices/config';
import adminReducer from './slices/admin';

const rootReducer = combineReducers({
    config: configReducer,
    admin: adminReducer
});

export default rootReducer;
