import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React, { Fragment } from 'react'

const Navbar = () => {
    return (
        <Fragment>
            <div className="bg-[#1E293B] backdrop-blur-[13px]">
                <div className="flex items-center justify-between px-6 md:px-14 py-4 max-w-[1440px] mx-auto">
                    <Link href='/' className="text-xl font-semibold sm:text-2xl md:text-3xl text-[#fff]">
                        Vestry
                    </Link>

                    {/* <div className="">
                    <Link href={'/admin'} className="font-semibold md:text-lg text-blue_deep">
                        Privacy Policy</Link>
                    <Link href={'/privacy-policy'} className="font-semibold md:text-lg text-blue_deep">
                        Privacy Policy</Link>
                    <Link href={'/privacy-policy'} className="font-semibold md:text-lg text-blue_deep">
                        Privacy Policy</Link>

                    </div> */}


                    <ConnectButton />



                </div>
            </div>
        </Fragment>
    )
}

export default Navbar