import { HTMLProps, createContext, useContext } from 'react'

// tanstack table already has a CellContext...
export interface OurCellContext {
  focusCell: () => void
  isEditing: boolean
  setIsEditing: (isEditing: OurCellContext['isEditing']) => void
  handlers: Pick<
    HTMLProps<HTMLTableCellElement>,
    'onKeyDown' | 'onKeyUp' | 'onClick' | 'onFocus'
  >
  setHandlers: (handlers: OurCellContext['handlers']) => void
  validation: string | boolean
  setValidation: (result: OurCellContext['validation']) => void
}

const initialContext: OurCellContext = {
  focusCell: () => undefined,
  isEditing: false,
  setIsEditing: () => undefined,
  handlers: {},
  setHandlers: (handlers) => handlers,
  validation: true,
  setValidation: (result) => result,
}

export const CellContext = createContext<OurCellContext>(initialContext)
CellContext.displayName = 'OurCellContext'

export const useOurCellContext = () => {
  return useContext(CellContext)
}
