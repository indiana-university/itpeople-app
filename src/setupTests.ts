//this must be first, before all other imports
// React needs requestAnimationFrame even in test environments
import 'raf/polyfill'

// provide jest-fetch-mock as a global drop-in replacement for fetch
import { GlobalWithFetchMock } from "jest-fetch-mock"

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch
