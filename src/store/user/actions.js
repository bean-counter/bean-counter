/* eslint-disable import/no-cycle */
import * as blockstack from 'blockstack'
import types from './types'
import store from '../index'
import * as storage from '../blockstackStorage'
import { showOverlay, hideOverlay, loadSettings } from '../settings/actions'
import { initialState as settingsInitialState } from '../settings/reducer'
import { loadAccounts } from '../accounts/actions'
import { initialState as accountsInitialState } from '../accounts/reducer'
import { loadTransactions } from '../transactions/actions'
import { initialState as transactionsInitialState } from '../transactions/reducer'
import { loadExchangeRates } from '../exchangeRates/actions'
import { initialState as exchangeRatesInitialState } from '../exchangeRates/reducer'

export const saveLoginData = loginData => ({
  type: types.SAVE_LOGIN_DATA,
  payload: loginData
})

export const loadUserData = () => {
  return (dispatch, getState) => {
    if (!getState().user.isLoading && blockstack.isUserSignedIn()) {
      dispatch(showOverlay('Loading data from Blockstack...'))

      const { username, profile } = blockstack.loadUserData()
      const person = new blockstack.Person(profile)

      dispatch(saveLoginData({
        isLoginPending: false,
        isAuthenticatedWith: 'blockstack',
        username,
        name: person.name(),
        pictureUrl: person.avatarUrl()
      }))
      storage.loadState().then((state) => {
        dispatch(loadSettings((state || {}).settings))
        dispatch(loadAccounts((state || {}).accounts))
        dispatch(loadTransactions((state || {}).transactions))
        dispatch(loadExchangeRates((state || {}).exchangeRates))
        dispatch(hideOverlay())
      }).catch((error) => {
        throw error
      })
    }
    return Promise.resolve()
  }
}

export const loginAs = (loginType) => {
  if (loginType === 'blockstack') {
    // Open the blockstack browser for sign in
    return blockstack.redirectToSignIn(`${window.location.origin}/handle-login`)
  }

  return (dispatch) => {
    return dispatch(saveLoginData({
      isLoginPending: false,
      isAuthenticatedWith: 'guest',
      username: 'guest',
      name: 'Guest user',
      pictureUrl: null
    }))
  }
}

export const userLoginError = error => ({
  type: types.USER_LOGIN_ERROR,
  payload: error
})

export const handleBlockstackLogin = () => {
  return (dispatch) => {
    // Handle sign in from Blockstack after redirect from Blockstack browser
    return blockstack.handlePendingSignIn()
      .then(() => dispatch(loadUserData()))
      .catch(error => dispatch(userLoginError(error)))
  }
}

export const resetState = (dispatch) => {
  dispatch(loadSettings(settingsInitialState))
  dispatch(loadAccounts(accountsInitialState))
  dispatch(loadTransactions(transactionsInitialState))
  dispatch(loadExchangeRates(exchangeRatesInitialState))
}

export const userLogout = () => {
  return async (dispatch) => {
    await blockstack.signUserOut()
    await resetState(dispatch)
    await dispatch({ type: types.USER_LOGOUT })
  }
}

export const saveState = () => storage.saveState(store.getState())
