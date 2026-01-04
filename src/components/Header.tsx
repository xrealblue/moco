import React from 'react'
import SearchCommand from './SearchCommand'
import { searchStocks } from '@/lib/actions/finnhub.actions';

const Header = async () => {

    const initialStocks = await searchStocks();
    return (
        <div className='w-full flex justify-between p-6 '
        >
            <div className="text-5xl and text-white">moco</div>

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