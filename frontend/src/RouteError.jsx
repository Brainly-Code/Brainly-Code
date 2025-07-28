import React from 'react'
import { useParams } from 'react-router-dom'

const RouteError = () => {

  const url = useParams();
  console.log(url);

  return (
    <div>
      Route Error
    </div>
  )
}

export default RouteError
