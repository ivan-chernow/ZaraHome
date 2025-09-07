'use client'

import { Provider } from 'react-redux'
import { store } from '../config/store/store'
 
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}