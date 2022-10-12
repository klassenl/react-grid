import { KeyboardEventHandler } from 'react'
type TagName = 'THEAD' | 'TBODY' | 'TFOOT'

const handleKeyboard: KeyboardEventHandler = (e) => {
  const target = e.target as HTMLElement
  // TODO make work for role=cell or role="gridcell" etc
  const cell = target.closest('td') || target.closest('th')
  const nextCell = cell?.nextElementSibling as HTMLElement
  const prevCell = cell?.previousElementSibling as HTMLElement
  const isInput = target.tagName === 'INPUT'
  const isEditInput = target.getAttribute('data-edit')

  if (e.key === 'ArrowRight' && nextCell && !isEditInput) {
    e.preventDefault()
    nextCell.focus()
    return
  }

  if (e.key === 'ArrowLeft' && prevCell && !isEditInput) {
    e.preventDefault()
    prevCell.focus()
    return
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (isInput && !isEditInput) {
      target.click()
      return
    }

    const row = target.closest('tr')
    // 1 based index, row.cells is 0 based html collection
    const rowIndex = Number(row?.getAttribute('aria-rowindex')) - 1
    const colIndex = Number(cell?.getAttribute('aria-colindex')) - 1
    const container = findUpTag(target, ['TBODY', 'TFOOT', 'THEAD'])

    if (e.key === 'ArrowDown') {
      const nextRow = container?.rows[rowIndex + 1]
      const cellAfter = nextRow?.cells?.[colIndex]
      if (cellAfter) {
        cellAfter.focus()
      } else {
        const nextSection = findDownTag(
          (container?.nextElementSibling as HTMLElement) || null,
          ['TBODY', 'TFOOT', 'THEAD']
        )
        nextSection?.rows?.[0]?.cells[colIndex]?.focus()
      }
      return
    }

    if (e.key === 'ArrowUp') {
      const prevRow = container?.rows[rowIndex - 1]
      const cellBefore = prevRow?.cells?.[colIndex]

      if (cellBefore) {
        cellBefore.focus()
      } else {
        const prevSection = findDownTag(
          (container?.previousElementSibling as HTMLElement) || null,
          ['TBODY', 'TFOOT', 'THEAD']
        )
        prevSection?.rows?.[prevSection?.rows?.length - 1]?.cells[
          colIndex
        ]?.focus()
      }
      return
    }
  }
}

// TODO make find functions better
function findUpTag(
  el: HTMLElement | Element,
  tags: TagName[]
): HTMLTableSectionElement | null {
  const isTargetTag = () => {
    return tags.some((item) => item === el?.tagName)
  }
  while (el?.parentNode) {
    el = el.parentNode as HTMLElement
    if (isTargetTag()) return el as HTMLTableSectionElement
  }
  return null
}
function findDownTag(
  el: HTMLElement | Element,
  tags: TagName[]
): HTMLTableSectionElement | null {
  if (tags.some((item) => item === el?.tagName)) {
    return el as HTMLTableSectionElement
  }
  const isTargetTag = () => {
    return tags.some((item) => item === el?.tagName)
  }
  while (el?.firstElementChild) {
    el = el.firstElementChild
    if (isTargetTag()) return el as HTMLTableSectionElement
  }
  return null
}

export default handleKeyboard
