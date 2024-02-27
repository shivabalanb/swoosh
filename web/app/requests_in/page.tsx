import React from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import SwooshProgressBar from '../components/SwooshProgressBar'
import Swoosh from 'app/components/Swoosh'

const RequestInHeaderGroup = () => {
  return <div className='w-full flex justify-around  bg-gray rounded-lg'>
  <div className='p-6 px-8'>
    <p>Balance</p>
    <p className='font-semibold text-4xl py-2'>$2.12k</p>
    <Button  variant='Deposit' href='/requests_in/1'/>
  </div>
  <div className='p-6 px-8'>
    <p>Owed</p>
    <p className='font-semibold text-4xl py-2'>$6.12k</p>
    <Button variant='Withdraw' href='/requests_in/1'/>
  </div>
  </div>
}

const RequestInGroup = () => {
  const testData = ["uber to denver","studying","boba"]
  return <div className='grid grid-cols-2 gap-4 mt-8'>
    {testData.map(request=><Swoosh title={request} percent={50} href={'/requests_in/1'}/>)}
  </div>
}



const RequestsInPage = () => {
  return (
    <div className="px-4">
      <Header title="Awaiting Swooshes"/>
      <RequestInHeaderGroup/>
      <RequestInGroup/>
    </div>
  )
}

export default RequestsInPage