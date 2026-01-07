import React from 'react'
import SearchCommand from './SearchCommand'
import { searchStocks } from '@/lib/actions/finnhub.actions';
import Link from 'next/link';
import UserDropdown from './UserDropdown';

const Header = async ({ user }: { user: User }) => {

    const initialStocks = await searchStocks();
    return (
        <div className='w-full flex items-center justify-between p-6 '
        >
            <Link className=" text-3xl md:text-5xl leading-none and text-white" href="/">
                moco
            </Link>
<div className="flex gap-2">
            <div className="">
                <SearchCommand
                    renderAs="text"
                    label="Search"
                    initialStocks={initialStocks} />
            </div>

            <UserDropdown user = {user} initialStocks={initialStocks}/>
            </div>
        </div>
    )
}

export default Header