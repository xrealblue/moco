"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2, TrendingUp, Search} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useDebounce} from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
        const results = await searchStocks(searchTerm.trim());
        setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <button 
            onClick={() => setOpen(true)} 
            className="search-text inline-flex items-center gap-2 p-2 cursor-pointer rounded-md transition-colors hover:bg-gray-800"
          >
            <Search color="white"
            style={{
              width: 'clamp(2.15rem, 2vw, 200rem)',
            }}
            className="aspect-square"
            />
          </button>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className=" bg-black ">
        <div className=" bg-black">
          <CommandInput 
            value={searchTerm} 
            onValueChange={setSearchTerm} 
            placeholder="Search stocks..." 
            className="search-input bg-black text-white placeholder:text-white/50 " 
          />
          {loading && <Loader2 className="search-loader animate-spin text-white absolute right-4 top-4 h-5 w-5" />}
        </div>
        <CommandList className="search-list bg-black max-h-[400px] overflow-y-auto">
          {loading ? (
              <CommandEmpty className="search-list-empty text-white/50 py-6 text-center">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator text-white/50 py-6 text-center">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <ul className="py-2">
              <div className="search-count px-4 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                  <li key={stock.symbol} className="search-item">
                    <Link
                        href={`/stocks/${stock.symbol}`}
                        onClick={handleSelectStock}
                        className="search-item-link flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors "
                    >
                      <TrendingUp className="h-5 w-5 text-white shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="search-item-name text-white font-medium truncate">
                          {stock.name}
                        </div>
                        <div className="text-sm text-white/50 truncate mt-0.5">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                    </Link>
                  </li>
              ))}
            </ul>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}