import React from 'react'
import { useLocation } from 'react-router-dom'

export default function RepoDisplay() {

    const location = useLocation();

    console.log(location.state);

  return (
    <div>RepoDisplay</div>
  )
}
