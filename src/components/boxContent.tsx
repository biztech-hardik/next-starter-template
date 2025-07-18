
import React from 'react';
import Image from 'next/image';
import { urlFor } from "@/lib/sanityImage";
import { SanityBoxContentSection } from '@/types/sanity';

interface Props {
  data: SanityBoxContentSection;
}

const boxContentComponent: React.FC<Props> = ({ data }) => {
  return (
    <section className="focus-areas grant-page">
      <div className="container">
        <div className="research-foundation-boxes">
          {data.boxes.map((box) => {
            const logoUrl = box.logo ? urlFor(box.logo).url() : null;
            
            return (
              <div key={box._key} className="box">
                <div className="logo_image">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={box.logoAlt}
                      title={box.logoTitle}
                      width={260}
                      height={148}
                    />
                  ) : (
                    <div 
                      style={{ 
                        width: 260, 
                        height: 148, 
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>
                <span className="para_desc">{box.category}</span>
                <div className="hover_content">
                  <div className="content">
                    {box.hoverContent}
                  </div>
                  {box.websiteUrl && (
                    <a
                      href={box.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Visit website"
                    >
                      {box.websiteLinkText || 'Visit website →'}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default boxContentComponent;