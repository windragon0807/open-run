import clsx from 'clsx'
import styles from './RunStartedText.module.css'

const RUN_STARTED_TEXT = 'Run Started!'

export default function RunStartedText({ className }: { className?: string }) {
  return (
    <span
      data-text={RUN_STARTED_TEXT}
      className={clsx(styles.glitch, 'inline-flex font-jost font-black italic text-secondary', className)}>
      {RUN_STARTED_TEXT}
    </span>
  )
}
