'use client'

import React from 'react'
import Header from "@/section/Header"
import Footer from "@/section/Footer"
import NavMenu from '@/section/NavMenu'
import { Providers } from '@/store/provider'

interface MainLayoutProps {
	children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Providers>
				<Header />
				<main className="flex-1">
					<NavMenu />
					{children}
				</main>
				<Footer />
			</Providers>
		</div>
	)
}

export default MainLayout