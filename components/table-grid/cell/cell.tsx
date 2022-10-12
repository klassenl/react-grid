import { HTMLProps, useState, useRef, ReactNode } from 'react'
import { OurCellContext, CellContext } from './cell-context'
import styles from './cell.module.css'

type CellProps = {
  editable: boolean
  children: ReactNode
} & HTMLProps<HTMLTableCellElement>

export const CellData = ({
  children,
  editable,
  className,
  ...other
}: CellProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [validation, setValidation] =
    useState<OurCellContext['validation']>(true)
  const [handlers, setHandlers] = useState<OurCellContext['handlers']>({})
  const cellRef = useRef<HTMLTableCellElement>(null)
  const focusCell = () => cellRef?.current?.focus()

  return (
    <CellContext.Provider
      value={{
        isEditing,
        setIsEditing,
        focusCell,
        handlers,
        setHandlers,
        validation,
        setValidation,
      }}
    >
      <td
        ref={cellRef}
        aria-invalid={validation !== true}
        className={[className, isEditing ? styles.cellEditing : ''].join(' ')}
        {...other}
        {...handlers}
      >
        <div
          className={[
            styles.cellInner,
            editable ? styles.editableCellInner : '',
          ].join(' ')}
        >
          {children}
        </div>
      </td>
    </CellContext.Provider>
  )
}

export const CellHeader = (props: Omit<CellProps, 'editable'>) => {
  return (
    <th {...props}>
      <div className={styles.cellInner}>{props.children}</div>
    </th>
  )
}
