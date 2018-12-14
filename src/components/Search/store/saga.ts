/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { push } from 'react-router-redux';
import { all, fork, put, select, takeEvery, } from 'redux-saga/effects';
import { httpGet } from '../../effects';
import { fetchError, fetchSuccess, SearchActionTypes, ISimpleSearchRequest, ISimpleSearchResult } from './actions'
import { IApplicationState } from 'src/components/types';

function* handleFetch() {
    const state = (yield select<IApplicationState>((s) => s.searchSimple.request)) as ISimpleSearchRequest
    const path = `/search?term=${state.term}`
    yield httpGet<ISimpleSearchResult>(path, fetchSuccess, fetchError)
}

function* handleSubmit() {
    const form = (yield select<any>((s) => s.form.search.values)) as ISimpleSearchRequest
    if (form.term) {
        yield put(push(`/search?term=${form.term}`))
    }
}

function* watchSimpleSearchFetch() {
    yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, handleFetch)
}

function* watchSimpleSearchSubmit() {
    yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_SUBMIT, handleSubmit)
}

export function* saga() {
    yield all([
        fork(watchSimpleSearchFetch),
        fork(watchSimpleSearchSubmit)
    ])
}