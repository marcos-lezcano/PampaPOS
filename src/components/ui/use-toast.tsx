import * as React from "react"

import { ToastActionElement, type ToastProps } from "./toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

interface Toast extends ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface State {
  toasts: Toast[]
}

const toastReducer = (state: State, action: any): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      }
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      }
    case actionTypes.DISMISS_TOAST:
      const { toastId } = action
      if (toastId) {
        toastTimeouts.set(
          toastId,
          setTimeout(() => {
            dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
          }, TOAST_REMOVE_DELAY)
        )
      }
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        )
      }
    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
    default:
      return state
  }
}

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: ToastProps) => string
  updateToast: (toast: Partial<Toast>) => void
  dismissToast: (toastId?: string) => void
} | undefined>(undefined)

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

  const addToast = React.useCallback((toast: ToastProps) => {
    const id = genId()
    dispatch({ type: actionTypes.ADD_TOAST, toast: { ...toast, id, open: true } })
    return id
  }, [])

  const updateToast = React.useCallback((toast: Partial<Toast>) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast })
  }, [])

  const dismissToast = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, updateToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { ToastProvider, useToast }
