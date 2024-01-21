import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import SignInButton from './SignInButton'



const Appbar = () => {
  return (
    <Navbar isBordered>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
       
      </NavbarContent>
      <NavbarContent justify="end">
        
        <NavbarItem>
          <SignInButton/>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Appbar