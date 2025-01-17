import { combineReducers } from 'redux'
import productReducers from './ProductReducers';

const rootReducer = combineReducers({
  product: productReducers
});

export default rootReducer;
