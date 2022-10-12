import { useRef, useState, Fragment } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import handleKeyboard from './util/handle-keyboard'
import defaultColumn from './column-default'
import { CellData, CellHeader } from './cell/cell'
import styles from './table-grid.module.css'

const TableGrid = ({
  tableColumns,
  tableData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableColumns: any[]
  tableData: object[]
}) => {
  const tableRef = useRef<HTMLTableElement>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(() => [...tableData])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...prev[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
  })
  return (
    <div className={styles.tableWrap}>
      <table
        role="grid"
        tabIndex={0}
        ref={tableRef}
        className={styles.table}
        onKeyDown={handleKeyboard}
        aria-rowcount={table.getRowModel().rows.length}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <tr aria-rowindex={index + 1} key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <CellHeader
                  tabIndex={-1}
                  aria-colindex={index + 1}
                  key={header.id}
                >
                  <div className={styles.cellInner}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                </CellHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} aria-rowindex={index + 1}>
              {row.getVisibleCells().map((cell, index) => {
                return (
                  <CellData
                    key={cell.id}
                    tabIndex={-1}
                    aria-colindex={index + 1}
                    editable={Boolean(cell.column.columnDef.meta?.editable)}
                  >
                    <Fragment>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Fragment>
                  </CellData>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup, index) => (
            <tr aria-rowindex={index + 1} key={footerGroup.id}>
              {footerGroup.headers.map((header, index) => (
                <CellHeader
                  tabIndex={-1}
                  aria-colindex={index + 1}
                  key={header.id}
                >
                  <div className={styles.cellInner}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </div>
                </CellHeader>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}

export default TableGrid
