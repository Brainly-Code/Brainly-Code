import React from 'react'
import DashboardStats from "./DashboardStats"
import Rates from "./Rates"
import Footer from "../../../Components/ui/Footer"
import GraphSection from './GraphSection'

const Dashboard = () => {
  return (
    <div className='overflow-y-auto  overflow-x-hidden'>
      <DashboardStats/>
      <GraphSection/>
      <Rates/>
    </div>
  )
}

export default Dashboard
