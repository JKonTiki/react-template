import { put } from 'redux-saga/effects';
import { get } from 'lodash';

import makeRequest from 'rdx/utils/makeRequest';
import getErrorActions from 'rdx/utils/getErrorActions';
import actions from 'rdx/actions';

import { LOGIN_FORM } from 'rdx/modules/messages/constants';

const { REACT_APP_BYPASS_AUTH: BYPASS_AUTH } = process.env;

function* login({ payload }) {
  if (BYPASS_AUTH) {
    yield put(actions.setAuthToken('TEST_TOKEN'));
    yield put(actions.navigate('/'));
    return null;
  }

  const { email, password } = payload;
  const { success, data, error } = yield* makeRequest.post('/login', { email, password });
  const token = get(data, 'token');
  if ((success && token) || BYPASS_AUTH) {
    yield put(actions.setAuthToken(token));
    yield put(actions.navigate('/'));
  } else {
    return getErrorActions({ error, target: LOGIN_FORM });
  }
  return null;
}

export default login;
