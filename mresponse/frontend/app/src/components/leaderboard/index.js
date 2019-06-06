import React from 'react'

import Leader from '@components/leader';

import './leaderboard.scss'

const Leaderboard = ({ children, className }) => {
  return (
    <div className={`leaderboard ${className}`}>
      <div className="leaderboard-podium">
        <Leader onPodium leader position="1" name="Terry" score="10000" />
        <Leader onPodium position="2" name="Colin Montgommery" score="15000" />
        <Leader onPodium position="3" name="Mr Bubz" score="9000" />
      </div>
      <div className="leaderboard-list">
        <Leader position="4" name="Nicola" score="8600" />
        <Leader position="22" name="Tony Malviya" score="8700" />
      </div>
    </div>
  )
}

export default Leaderboard
