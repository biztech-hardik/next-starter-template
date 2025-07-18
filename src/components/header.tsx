'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityImage'
import { SanitySiteSettings, SanityMenuItem } from '@/types/sanity'

type HeaderProps = {
  siteSettings: SanitySiteSettings | null
  currentSlug: string;
};

export default function Header({ siteSettings, currentSlug }: HeaderProps) {
  const [menu, setMenu] = useState<SanityMenuItem[]>([])
  const [siteName, setSiteName] = useState('Macroscopic Ventures')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    setMenu(siteSettings?.menuItems ?? [])
    setSiteName(siteSettings?.siteName ?? 'Macroscopic Ventures')
    if (siteSettings?.logo?.asset?._ref) {
      setLogoUrl(urlFor(siteSettings.logo).url())
    } else {
      setLogoUrl(null)
    }
  }, [siteSettings])

  return (
    <header className="header">
      <div className="container">
        <div className="navbar line">
          <div className="header-logo">
            <Link href="/" title={siteName}>
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  title={siteName}
                  width={215}
                  height={38}
                  priority
                />
              ) : (
                <span>{siteName}</span>
              )}
            </Link>
          </div>
          <nav className="header-links">
            <ul id="menu-header-menu" className="menu-list">
              {menu.map((item, idx) => {
                const isActive = item?.isInternalURL && item?.pageRef?.slug?.current === currentSlug;
                // Determine the href path
                let href = '/'; // default fallback
                if (item?.isInternalURL !== false && item?.pageRef?.slug?.current) {
                  href = `/${item.pageRef.slug.current}`;
                } else if (item?.externalURL) {
                  href = item.externalURL;
                }
                if (href === '/home') {
                  href = '/';
                }
                // Determine if the link should open in a new tab
                const target = item?.openInNewTab ? '_blank' : undefined;
                const rel = item?.noFollow ? 'nofollow' : undefined;
                // Display text fallback logic
                const title = item?.linkTitle || item?.menuTitle || 'Untitled';
                  
                return (
                  <li key={idx}>
                    <Link className={isActive ? 'active' : ''} href={href} title={title} target={target} rel={rel}>
                      {item.menuTitle}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="menu-toggle">
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}