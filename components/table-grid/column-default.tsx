import { ColumnDef } from '@tanstack/react-table'
import Checkbox from '../checkbox/checkbox'
import EditableData from './editable-data/editable-data'

const columnDefault: Partial<ColumnDef<unknown>> = {
  header: (props) => {
    if (props.header.column.columnDef.id === 'checkbox') {
      return (
        <Checkbox
          {...{
            checked: props.table.getIsAllRowsSelected(),
            indeterminate: props.table.getIsSomeRowsSelected(),
            onChange: props.table.getToggleAllRowsSelectedHandler(),
          }}
        />
      )
    }
    return props.header.id
  },
  cell: (props) => {
    const editable = props.column.columnDef.meta?.editable
    if (props.cell.column.columnDef.id === 'checkbox') {
      return (
        <Checkbox
          {...{
            checked: props.row.getIsSelected(),
            indeterminate: props.row.getIsSomeSelected(),
            onChange: props.row.getToggleSelectedHandler(),
          }}
        />
      )
    }
    if (editable) {
      return <EditableData {...props} />
    }
    return props.getValue()
  },
}

export default columnDefault
