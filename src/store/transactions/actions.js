/* eslint no-console: 0 */
/* eslint-disable no-unused-vars */
import _ from 'lodash'
import uuid from 'uuid/v4'
import types from './types'
import { saveState, dataIsLoading } from '../user/actions'
import { updatePortfolioFilters } from '../settings/actions'
import { updateMarketValues } from '../marketValues/actions'
import RbcCsvParser from './CsvParsers/RbcCsvParser'
import BmoCsvParser from './CsvParsers/BmoCsvParser'
import TdCsvParser from './CsvParsers/TdCsvParser'
import TangerineCsvParser from './CsvParsers/TangerineCsvParser'

const afterTransactionsChanged = async (dispatch) => {
  await dispatch(updateMarketValues())
  await dispatch(updatePortfolioFilters())
  await saveState()
}

export const createTransaction = (transaction) => {
  return (dispatch) => {
    dispatch({ type: types.CREATE_TRANSACTION, payload: { ...transaction, id: uuid() } })
    afterTransactionsChanged(dispatch)
  }
}

export const updateTransaction = (transaction) => {
  return async (dispatch) => {
    dispatch({ type: types.UPDATE_TRANSACTION, payload: transaction })
    afterTransactionsChanged(dispatch)
  }
}

export const deleteTransaction = (index) => {
  return (dispatch) => {
    dispatch({ type: types.DELETE_TRANSACTION, payload: index })
    afterTransactionsChanged(dispatch)
  }
}

export const deleteAllTransactions = () => {
  return (dispatch) => {
    dispatch({ type: types.DELETE_ALL_TRANSACTIONS })
    afterTransactionsChanged(dispatch)
  }
}

// Load all the transactions from storage
// Replaces existing transactions
export const loadTransactions = (transactions) => {
  return { type: types.LOAD_TRANSACTIONS, payload: transactions }
}

export const importTransactionsFromFiles = (file, institution) => {
  return (dispatch) => {
    const parsers = {
      RBC: RbcCsvParser,
      BMO: BmoCsvParser,
      TD: TdCsvParser,
      Tangerine: TangerineCsvParser
    }

    dispatch(dataIsLoading(true))
    const parser = new parsers[institution](file)
    return parser.parse()
      .then((transactions) => {
        dispatch({ type: types.ADD_TRANSACTIONS, payload: transactions })
        afterTransactionsChanged(dispatch)
      }).catch((errors) => {
        console.log('ERROR:', errors)
      }).finally(() => dispatch(dataIsLoading(false)))
  }
}

