import React from 'react'
import './progress-table.scss'

function ProgressBar ({ width = 0, title, value, maxValue }) {
  if (value != null && maxValue != null) width = (value / maxValue) * 100
  return (
    <tr className='progress-bar-row'>
      <td className='progress-bar-row-title'>{title}</td>
      <td className='progress-bar-row-wrap'>
        <div className='progress-bar-row-wrap-level'>
          <div className='progress-bar-row-wrap-level-indicator' style={{ width: `${width}%` }} />
        </div>
      </td>
      <td className='progress-bar-row-label'>{value} / {maxValue}</td>
    </tr>
  )
}

export default ({ data = [] }) => {
  return (
    <table className='progress-table'>
      <tbody>
        {data.map(({ title, value, maxValue }, i) => (
          <ProgressBar title={title} value={value} maxValue={maxValue} key={i}></ProgressBar>
        ))}
      </tbody>
    </table>
  )
}
