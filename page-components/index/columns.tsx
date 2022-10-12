import { useMemo } from 'react'
import { Cat } from './data'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Cat>()

const columns = [
  columnHelper.display({
    id: 'checkbox',
  }),
  columnHelper.accessor('name', {
    meta: {
      editable: {
        format: 'text',
        validate: (v) => v !== '' || `Every cat needs a name.`,
      },
    },
  }),
  columnHelper.accessor('breed', {
    cell: (info) => info.getValue(),
    footer: (info) => {
      const rows = info.table.getRowModel().rows
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const breedCount = useMemo<number>(() => {
        const breeds = rows.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.original.breed]: true,
          }
        }, {})
        return Object.values(breeds).length
      }, [rows])
      return `${breedCount} breeds`
    },
  }),
  columnHelper.accessor('age', {
    meta: {
      editable: {
        format: 'number',
        validate: (v) => {
          const validation =
            (typeof v !== 'string' && Number(v) > 0) ||
            `${v} is not a legitimate age.`
          return validation
        },
      },
    },
    header: () => 'Age',
  }),
  columnHelper.accessor('price', {
    meta: {
      editable: {
        format: 'currency',
        validate: (v) =>  {
          const number = Number(v)
          if (typeof number !== 'number') {
            return 'Enter a number'
          }
          if (number < 100) {
            return `$${number} is too cheap for a cat.`
          }
          if (number > 1000) {
            return `$${number} is too expensive for a cat.`
          }
          return true
        }
      },
    },
  }),
  columnHelper.accessor('fav_food', {
    meta: {
      editable: {
        format: 'text',
        validate: (v) => v !== '' || 'Enter a food.',
      },
    },
    header: 'Fav food',
  }),
]

export default columns
