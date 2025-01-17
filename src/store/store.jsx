import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { thunk } from 'redux-thunk';
import { setTokenExists } from './actions/creators/productCreators';

// Слушаем storage
window.addEventListener('storage', () => {
  const tokenExists = localStorage.getItem('accessToken');
  if (!tokenExists) {
    store.dispatch(setTokenExists(false))
  }
});
// Функция для инициализации состояния
const loadState = () => {
  try {
    const tokenExists = localStorage.getItem('accessToken');
    if (tokenExists) {
      return {
        product: {
          tokenExists: true
        }
      };
    } else {
      return {
        product: {
          tokenExists: false
        }
      };
    }
  } catch (error) {
    return undefined;
  }
};

const store = createStore(
  rootReducer,
  loadState(),
  applyMiddleware(thunk)

);

export default store;
