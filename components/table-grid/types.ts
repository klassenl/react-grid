import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // TODO clean this up
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: {
      format: 'percent' | 'currency' | 'number' | 'text'
      validate?: (v: unknown) => boolean | string
    }
    checkbox?: {
      header?: boolean
      row?: boolean
    }
  }
}
