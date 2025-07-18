'use client'
import React, { useEffect, useState } from 'react'
import { PortableText} from '@portabletext/react'
import Link from 'next/link'
import { SanitySiteSettings  } from '@/types/sanity'
import { portableTextComponents } from '@/components/portableText';
import { VisualEditing } from 'next-sanity';

type FooterProps = {
  siteSettings: SanitySiteSettings | null;
  isEnabled: boolean
};


export default function Footer({ siteSettings, isEnabled }: FooterProps) {
  const [siteData, setSiteData] = useState<Partial<SanitySiteSettings>>({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
      setSiteData(siteSettings || {});
    }, [siteSettings]);

  const {
    addressLineOne,
    addressLineTwo,
    emailAddress,
    footerSiteName,
    footerLinks = [],
    designedByLink,
    footerContent
  } = siteData;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content line">
          <div className="footer-desc">
            <div className="footer-add">
              {(addressLineOne || addressLineTwo) && (
                <p>
                  {addressLineOne && <span>{addressLineOne}</span>}
                  {addressLineTwo}
                </p>
              )}
            </div>

            {emailAddress && (
              <div className="footer-link">
                <p>
                  <a className='footer-email' href={`mailto:${emailAddress}`} title={emailAddress}>
                    {emailAddress}
                  </a>
                </p>
              </div>
            )}

            {footerContent && Array.isArray(footerContent) && (
              <div className="footer-rich-content">
                <PortableText
                  value={footerContent}
                  components={portableTextComponents}
                />
              </div>
            )}

            
            {footerLinks.length > 0 && (
              <div className="footer-policy">
                <ul>
                  {footerLinks.map((link, index) => {
                    const key = `${link.linkText}-${index}`;
                    const text = link.linkText;
                    const title = link.linkTitle || link.linkText;
                    const isInternal = link.isInternalURL;
                    
                    // Handle internal vs external URL logic
                    let href;
                    if (isInternal && link.linkURL?.slug?.current) {
                      // Internal link - construct path from slug
                      href = `/${link.linkURL.slug.current}`;
                    } else if (!isInternal && link.externalURL) {
                      // External link - use externalURL
                      href = link.externalURL;
                    } else {
                      // Fallback - no valid URL found
                      href = null;
                    }
                    
                    const openInNewTab = link.openInNewTab;
                    const rel = [
                      openInNewTab ? "noopener noreferrer" : null,
                      link.noFollow ? "nofollow" : null,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined;

                    // Skip rendering if no valid href
                    if (!href) {
                      return null;
                    }

                    if (isInternal) {
                      return (
                        <li key={key}>
                          <Link href={href} title={title}>
                            {text}
                          </Link>
                        </li>
                      );
                    } else {
                      return (
                        <li key={key}>
                          <a
                            href={href}
                            title={title}
                            target={openInNewTab ? "_blank" : undefined}
                            rel={rel}
                          >
                            {text}
                          </a>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="footer-subdesc">
            <ul>
              <li>{footerSiteName + " " + currentYear }</li>
              {designedByLink?.url && (
                <li>
                  Designed by{" "}
                  <a
                    title={designedByLink.linkText}
                    href={designedByLink.url}
                    target="_blank"
                  >
                    {designedByLink.linkText}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {isEnabled && <VisualEditing />}
    </footer>
  );
}