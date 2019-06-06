import React from 'react'

import Leader from '@components/leader'

import './leaderboard.scss'

const Leaderboard = ({ className, leaderboard }) => {
  // Get the first, second and third to place on the podium
  // Add a position prop
  const [first, second, third, ...rest] = leaderboard.map((user, index) =>
    ({ ...user, position: index + 1 })).slice(0, 5)

  // Strip out any undefined entries
  const podiumUsers = [first, second, third].filter(Boolean)

  return (
    <div className={`leaderboard ${className}`}>
      <h2 className="leaderboard-title">This week’s high flyers</h2>
      {podiumUsers &&
        <div className="leaderboard-podium">
          {podiumUsers.map(({ id, ...rest }) =>
            <Leader key={id} {...rest} onPodium />
          )}
        </div>
      }
      {rest &&
        <div className="leaderboard-list">
          {rest.map(({ id, ...rest }) =>
            <Leader key={id} {...rest} />
          )}
        </div>
      }
    </div>
  )
}

export default Leaderboard
