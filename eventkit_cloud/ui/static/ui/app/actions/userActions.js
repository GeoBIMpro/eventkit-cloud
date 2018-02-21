import { push } from 'react-router-redux';
import axios from 'axios';
import cookie from 'react-cookie';
import actions from './actionTypes';


export function logout() {
    return dispatch => (
        axios('/logout', { method: 'GET' }).then((response) => {
            dispatch({
                type: actions.USER_LOGGED_OUT,
            });
            if (response.data.OAUTH_LOGOUT_URL) {
                window.location.href = response.data.OAUTH_LOGOUT_URL;
            } else {
                dispatch(push({ pathname: '/login' }));
            }
        }).catch((error) => {
            console.log(error);
        })
    );
}

export function login(data, query) {
    return (dispatch) => {
        const csrftoken = cookie.load('csrftoken');

        dispatch({
            type: actions.USER_LOGGING_IN,
        });

        const form_data = new FormData();
        let method = 'get';
        if (data && (data.username && data.password)) {
            form_data.append('username', data.username);
            form_data.append('password', data.password);
            method = 'post';
        }

        return axios({
            url: '/auth',
            method,
            data: form_data,
            headers: { 'X-CSRFToken': csrftoken },
        }).then((response) => {
            if (response.data) {
                dispatch({
                    type: actions.USER_LOGGED_IN,
                    payload: response.data,
                });
            } else {
                dispatch({
                    type: actions.USER_LOGGED_OUT,
                });
            }
        }).catch(() => {
            dispatch({
                type: actions.USER_LOGGED_OUT,
            });
        });
    };
}

export function patchUser(acceptedLicenses, username) {
    return (dispatch) => {
        const csrftoken = cookie.load('csrftoken');
        dispatch({
            type: actions.PATCHING_USER,
        });

        return axios({
            url: `/api/user/${username}`,
            method: 'PATCH',
            data: { accepted_licenses: acceptedLicenses },
            headers: { 'X-CSRFToken': csrftoken },
        }).then((response) => {
            dispatch({
                type: actions.PATCHED_USER,
                payload: response.data || { ERROR: 'No user response data' },
            });
        }).catch((error) => {
            dispatch({
                type: actions.PATCHING_USER_ERROR,
                error: error.response.data,
            });
        });
    };
}

export function userActive() {
    return dispatch => (
        axios('/user_active', { method: 'GET' }).then((response) => {
            const autoLogoutAt = response.data.auto_logout_at;
            const autoLogoutWarningat = response.data.auto_logout_warning_at;

            dispatch({
                type: actions.USER_ACTIVE,
                payload: {
                    autoLogoutAt: (autoLogoutAt) ? new Date(autoLogoutAt) : null,
                    autoLogoutWarningAt: (autoLogoutWarningat) ?
                        new Date(autoLogoutWarningat) : null,
                },
            });
        }).catch((error) => {
            console.error(error.message);
        })
    );
}

export const viewedJob = (jobUid) => (dispatch) => {
    dispatch({
        type: actions.VIEWED_JOB,
        payload: {
            jobUid: jobUid
        }
    });

    return axios({
        url: '/api/user/activity/jobs?activity=viewed',
        method: 'POST',
        data: {job_uid: jobUid},
        headers: {'X-CSRFToken': cookie.load('csrftoken')}
    }).catch((error) => {
        console.error(error.message);
    });
};

export const getViewedJobs = (args = {}) => (dispatch) => {
    const cancelSource = axios.CancelToken.source();

    dispatch({
        type: actions.FETCHING_VIEWED_JOBS,
        cancelSource: cancelSource,
    });

    const pageSize = args.pageSize || 10;

    return axios({
        url: `/api/user/activity/jobs?activity=viewed&page_size=${pageSize}`,
        method: 'GET',
        cancelToken: cancelSource.token,
    }).then((response) => {
        let nextPage = false;
        let links = [];

        if (response.headers.link) {
            links = response.headers.link.split(',');
        }
        for (const i in links) {
            if (links[i].includes('rel="next"')) {
                nextPage = true;
            }
        }
        let range = '';
        if (response.headers['content-range']) {
            range = response.headers['content-range'].split('-')[1];
        }

        dispatch({
            type: actions.RECEIVED_VIEWED_JOBS,
            payload: response.data,
            nextPage,
            range,
        });
    }).catch((error) => {
        if (axios.isCancel(error)) {
            console.log(error.message);
        } else {
            dispatch({
                type: actions.FETCH_VIEWED_JOBS_ERROR,
                error: error.response.data,
            });
        }
    });
};
