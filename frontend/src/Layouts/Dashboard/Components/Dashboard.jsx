import React from 'react'
import DashboardStats from "./DashboardStats"
import GraphSection from './GraphSection'
import Rates from "./Rates"
import Footer from "../../../Components/ui/Footer"

const Dashboard = () => {
  return (
    <div className='overflow-y-auto  overflow-x-hidden'>
      <DashboardStats/>
      <GraphSection/>
      <Rates/>
      <Footer/>

    </div>
  )
}

export default Dashboard
