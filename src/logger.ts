/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Dispatch, Middleware, MiddlewareAPI} from 'redux'
/**
 * Logger middleware doesn't add any extra types to dispatch, just logs actions
 * and state.
 */
export const loggerMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
      next: Dispatch
    ) => action => {
    //   console.log('will dispatch', action)
  
      // Call the next dispatch method in the middleware chain.
      const returnValue = next(action)
  
    //   console.log('state after dispatch', getState())
  
      // This will likely be the action itself, unless
      // a middleware further in chain changed it.
      return returnValue
    }
  