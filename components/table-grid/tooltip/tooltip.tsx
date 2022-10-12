import { ReactNode, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { createPortal } from 'react-dom'
import {
  offset,
  flip,
  ReferenceType,
  shift,
  limitShift,
} from '@floating-ui/react-dom'
import {
  useFloating,
  useInteractions,
  useHover,
  safePolygon,
} from '@floating-ui/react-dom-interactions'
import styles from './tooltip.module.css'

const Tooltip = ({
  children,
  triggerElement,
  canShow,
}: {
  children: ReactNode
  triggerElement: ReferenceType
  canShow: boolean
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const { x, y, reference, floating, strategy, context } = useFloating({
    placement: 'top',
    open: showTooltip,
    onOpenChange: setShowTooltip,
    middleware: [offset(8), flip(), shift({ limiter: limitShift() })],
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    // TODO how to use difference reference for focus activation ?
    useHover(context, {
      enabled: canShow,
      handleClose: safePolygon(),
      delay: 500,
      restMs: 150,
    }),
  ])

  useIsomorphicLayoutEffect(() => {
    reference(triggerElement)
  }, [getReferenceProps, reference, triggerElement])

  return (
    <>
      {showTooltip &&
        // TODO try floating ui portal
        createPortal(
          <div
            className={styles.tooltip}
            data-tooltip={true}
            {...getFloatingProps({
              ref: floating,
              style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              },
            })}
          >
            {children}
          </div>,
          // TODO use one root div for all tooltips
          document?.body
        )}
    </>
  )
}

export default Tooltip
