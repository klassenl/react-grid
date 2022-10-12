import { HTMLProps, useRef, useEffect } from 'react'
import { BsCheck, BsDash } from 'react-icons/bs'
import styles from './checkbox.module.css'

function Checkbox({
  indeterminate,
  className = '',
  ...other
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref?.current) {
      ref.current.indeterminate = !other.checked && indeterminate
    }
  }, [ref, indeterminate, other.checked])

  return (
    <div className={styles.contain}>
      <input
        ref={ref}
        type="checkbox"
        className={[styles.checkbox, className].join(' ')}
        {...other}
      />
      <div className={styles.icons}>
        <BsDash className={styles.dash} />
        <BsCheck className={styles.check} />
      </div>
    </div>
  )
}

export default Checkbox
