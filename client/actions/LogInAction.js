import axios from 'axios';
import Alert from 'react-s-alert';
import { LOGIN_USER, LOGOUT_USER } from '../constants/ActionTypes';
/**
 * sign in action 
 * @param {string} userData
 * 
 * @return {string} token 
 */
export function LoggedInUser(user) {
  return {
    type: LOGIN_USER,
    user,
  };
}
export function LogOutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function SignIn(userData) {
  return dispatch =>
    axios
      .post('/v1/user/signin', userData)
      .then((res) => {
        dispatch(LoggedInUser(res.data.user));
        Alert.success(res.data.message, {
          position: 'top-right',
          offset: 100,
        });
        const token = res.data.user;
        localStorage.setItem('user', JSON.stringify(token));
        return true;
      })
      .catch((err) => {
        if (err.res) {
          Alert.error(err.res.data.errorCode, {
            position: 'top-right',
            offset: 100,
          });
        }
        return false;
      });
}

export function SignOut() {
  return dispatch =>
    axios
      .get('/v1/user/signout')
      .then((res) => {
        dispatch(LogOutUser());
        Alert.success(res.data.message, {
          position: 'top-right',
          offset: 100,
        });
        localStorage.removeItem('user');
      })
      .catch((err) => {
        if (err.res) {
          Alert.error(err.res.data.errorCode, {
            position: 'top-right',
            offset: 100,
          });
        }
      });
}
