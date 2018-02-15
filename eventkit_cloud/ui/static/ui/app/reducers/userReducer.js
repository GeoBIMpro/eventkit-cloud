import types from '../actions/actionTypes'

export const initialState = {
  data: null,
  isLoading: false,
  patching: false,
  patched: false,
  error: null,
  autoLogoutAt: null,
  autoLogoutWarningAt: null,
  viewedJobs: {
    fetching: false,
    fetched: false,
    jobs: [],
    error: null,
  },
}

export default (state = initialState, { type, payload, error, cancelSource }) => {
  switch (type) {
    case types.USER_LOGGING_IN:
      return { ...state, isLoading: true }
    case types.USER_LOGGED_IN:
      if(payload){
        return { ...state, data: payload, isLoading: false }
      } else {
        return {...state, data: null, isLoading: false}
      }
    case types.USER_LOGGED_OUT:
      return { ...state, data: null, isLoading: false}
    case types.PATCHING_USER:
      return { ...state, patching: true, patched: false}
    case types.PATCHED_USER:
      return { ...state, patching: false, patched: true, data: payload}
    case types.PATCHING_USER_ERROR:
      return { ...state, patching: false, error: error}
    case types.USER_ACTIVE:
      return { ...state, ...payload }
    case types.FETCHING_VIEWED_JOBS:
      return { ...state, viewedJobs: { ...state.viewedJobs, fetching: true, fetched: false, error: null, cancelSource: cancelSource } };
    case types.RECEIVED_VIEWED_JOBS:
      return { ...state, viewedJobs: { ...state.viewedJobs, fetching: false, fetched: true, jobs: payload.jobs, error: error, cancelSource: null } };
    case types.FETCH_VIEWED_JOBS_ERROR:
      return { ...state, viewedJobs: { ...state.viewedJobs, fetching: false, fetched: false, jobs: [], error: error, cancelSource: null } };
    default:
      return state
  }
}