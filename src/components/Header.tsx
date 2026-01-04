import React from 'react'
import SearchCommand from './SearchCommand'
import { searchStocks } from '@/lib/actions/finnhub.actions';
import Link from 'next/link';

const Header = async () => {

    const initialStocks = await searchStocks();
    return (
        <div className='w-full flex items-center justify-between p-6 '
        >
            <Link className=" text-3xl md:text-5xl leading-none and text-white" href="/">
                moco
            </Link>

            <div className="">
                <SearchCommand 
                renderAs="text"
                    label="Search"
                    initialStocks={initialStocks} />
            </div>
        </div>
    )
}

export default Header