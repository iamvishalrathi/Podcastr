import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

const Header = ({ headerTitle, titleClassName }: { headerTitle?: string; titleClassName?: string }) => {
  return (
    <header className="flex items-center justify-between mb-1">
      {headerTitle ? (
        <h1 className={cn('text-18 font-bold text-white-1', titleClassName)}>{headerTitle}</h1>
      ) : <div />}
      {/* Empty div is passed as we want to occupy space if header title doesn't exist */}
      <Link href="/discover" className="text-16 font-semibold text-orange-1">
        See all
      </Link>
    </header>
  )
}

export default Header