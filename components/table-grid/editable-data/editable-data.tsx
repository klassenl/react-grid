import { useEffect, useReducer, useRef, useId } from 'react'
import { ReferenceType } from '@floating-ui/react-dom-interactions'
import { CellContext } from '@tanstack/react-table'
import { useOurCellContext } from '../cell/cell-context'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import Tooltip from '../tooltip/tooltip'
import styles from './editable-data.module.css'

type State = {
  value: string | number
  isEditing: boolean
}

type Action =
  | { type: 'save' }
  | { type: 'edit' }
  | { type: 'change'; value: string }
  | { type: 'cancel'; value: string }

const EditableData = (props: CellContext<unknown, unknown>) => {
  const {
    isEditing,
    setIsEditing,
    focusCell,
    setHandlers,
    validation,
    setValidation,
  } = useOurCellContext()
  const triggerId = useId()
  const triggerRef = useRef<HTMLDivElement>(null)
  const errorMessage = typeof validation === 'string' ? validation : undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const editable = props.column.columnDef.meta?.editable
  const updateData = props.table.options.meta?.updateData
  const initialValue = props.getValue() as string
  const [inputState, dispatch] = useReducer(
    (state: State, action: Action) => {
      const isNumber = editable?.format === 'number'
      switch (action.type) {
        case 'edit':
          return { ...state, isEditing: true }
        case 'change':
          return {
            ...state,
            value: isNumber ? Number(action.value) : action.value,
          }
        case 'save':
          if (updateData) {
            updateData(props.cell.row.index, props.cell.column.id, state.value)
          }
          return { ...state, isEditing: false }
        case 'cancel':
          return {
            ...state,
            isEditing: false,
            value: action.value,
          }
        default:
          return state
      }
    },
    {
      value: initialValue,
      isEditing,
    }
  )

  useEffect(() => {
    setIsEditing(inputState.isEditing)
  }, [setIsEditing, inputState.isEditing])

  useEffect(() => {
    const validateFn = props.cell.column.columnDef.meta?.editable?.validate
    if (validateFn) {
      setValidation(validateFn(inputState.value))
    }
  }, [
    inputState.value,
    setValidation,
    props.cell.column.columnDef.meta?.editable?.validate,
  ])

  useEffect(() => {
    setHandlers({
      onClick: (e) => {
        // make tooltip forwardRef ?
        const isTooltip = (e.target as HTMLElement).getAttribute('data-tooltip')
        if (!inputState.isEditing && !isTooltip) {
          dispatch({ type: 'edit' })
        }
      },
      onKeyDown: (e) => {
        if (e.key === 'Enter') {
          dispatch({ type: inputState.isEditing ? 'save' : 'edit' })
        }
      },
    })
  }, [setHandlers, inputState.isEditing, inputState.value])

  useEffect(() => {
    const isActiveElement = inputRef?.current === document?.activeElement
    if (inputState.isEditing) {
      if (!isActiveElement) {
        inputRef?.current?.focus()
      }
    } else if (isActiveElement) {
      focusCell()
    }
  }, [focusCell, inputState.isEditing])

  return (
    <div className={styles.contain}>
      <input
        ref={inputRef}
        value={inputState.value}
        className={styles.input}
        type={editable?.format === 'text' ? 'text' : 'number'}
        aria-invalid={validation !== true}
        aria-describedby={errorMessage ? triggerId : undefined}
        onBlur={() => dispatch({ type: 'save' })}
        onFocus={() => dispatch({ type: 'edit' })}
        onChange={(e) => dispatch({ type: 'change', value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            dispatch({ type: 'cancel', value: initialValue })
          }
        }}
        // for now, table handleKeydDown stops left & right arrow navigation
        //  when a cell has data-edit attribute
        data-edit={true}
      />
      {errorMessage && (
        <span
          id={triggerId}
          ref={triggerRef}
          className={styles.tooltipTrigger}
          aria-label={errorMessage}
        >
          <AiOutlineExclamationCircle aria-hidden={true} />
        </span>
      )}
      <Tooltip
        canShow={validation !== '' && validation !== true}
        triggerElement={triggerRef?.current as ReferenceType}
      >
        {errorMessage}
      </Tooltip>
    </div>
  )
}

export default EditableData
