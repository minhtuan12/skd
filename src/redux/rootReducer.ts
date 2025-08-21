import {combineReducers} from "redux";
import configReducer from './slices/config';
import adminReducer from './slices/admin';
import policyReducer from './slices/policy';

const rootReducer = combineReducers({
    config: configReducer,
    admin: adminReducer,
    policy: policyReducer
});

export default rootReducer;
