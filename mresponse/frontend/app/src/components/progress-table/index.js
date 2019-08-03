import React from 'react'
import './progress-table.scss'

function ProgressBar ({ width = 0, title, value, maxValue }) {
  if (value != null && maxValue != null) width = (value / maxValue) * 100
  return (
    <tr className='progress-bar'>
      <td className='progress-bar-title'>{title}</td>
      <td className='progress-bar-wrap'>
        <div className='progress-bar-wrap-level'>
          <div className='progress-bar-wrap-level-indicator' style={{ width: `${width}%` }} />
        </div>
      </td>
      <td className='progress-bar-label'>{value} / {maxValue}</td>
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
