import React, { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'

export type CartItem = {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  size?: string
  color?: string
}

type State = { items: CartItem[] }

type Action =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; id: string }
  | { type: 'update'; id: string; quantity: number }
  | { type: 'clear' }

const CartContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | undefined>(undefined)

const initialState: State = { items: [] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const exist = state.items.find((i) => i.productId === action.item.productId && i.size === action.item.size && i.color === action.item.color)
      if (exist) {
        return {
          ...state,
          items: state.items.map((i) =>
            (i.productId === action.item.productId && i.size === action.item.size && i.color === action.item.color) ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case 'update':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'clear':
      return { ...state, items: [] }
    default:
      return state
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
