import React from 'react'

export const Landing = () => {
  return (
    <div className="lg:flex lg:flex-row-reverse max-w-[95rem] m-auto pt-24 space-y-[3rem] items-center p-10">
      <img
        src="https://kangarooo.s3.amazonaws.com/kangaroo/Browser.png"
        className="w-full md:max-w-[40rem] m-auto"
      />
      <div className="lg:w-[50%] space-y-5">
        <h1 className="lg:text-left text-center text-5xl lg:text-7xl lg:mr-2.5">Bring your desktop to the browser</h1>
        <p className="lg:text-left text-center text-xl md:text-2xl">Cloud storage that you actually want to use.</p>
      </div>
    </div>
  )
}

export default Landing
