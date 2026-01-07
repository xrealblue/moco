'use client'

//https://ui.shadcn.com/docs/components/dropdown-menu

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/actions/auth.actions"
import Image from "next/image"

const UserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  }

  // https://ui.shadcn.com/docs/components/avatar
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex border-black ring-black focus:ring-0  cursor-pointer items-center gap-3 text-white bg-black">

          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-md capitalize font-medium text-white">
              {user.name}
            </span>
          </div>

        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className=" bg-black border-0 text-white">
        <DropdownMenuLabel>
          <div className="flex  relative items-center gap-3 py-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex  flex-col">
              <span className="text-sm capitalize font-medium text-white">
                {user.name}
              </span>
              <span className="text-sm text-white/60">
                {user.email}
              </span>
            </div>
          </div>

        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
          <LogOut className="mr-2 h-4 w-4 hidden sm:block" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
