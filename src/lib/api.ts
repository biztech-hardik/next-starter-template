import { createClient } from '@sanity/client'
import { SanityPage } from '../types/sanity'
import { draftMode } from 'next/headers';
import { SanitySiteSettings } from '@/types/sanity';
import { defineLive } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN, // Ensure you have this token set in your environment variables
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});
const client = sanityClient;
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});

const getPageBySlugQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  headerTitle,
  headerDescription[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        ...,
        page-> {
          "slug": slug.current
        }
      }
    }
  },
  sections[]{
    ...,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          page-> {
            "slug": slug.current
          }
        },
        _type == "pdfLink" => {
          ...,
          file {
            asset-> {
              _id,
              url,
              originalFilename,
              size,
              mimeType
            }
          }
        }
      }
    },
     description[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          page-> {
            "slug": slug.current
          }
        },
        _type == "pdfLink" => {
          ...,
          file {
            asset-> {
              _id,
              url,
              originalFilename,
              size,
              mimeType
            }
          }
        }
      }
    }
  },
  seo,
  displayLastUpdated,
  publishedAt,
  _createdAt,
  _updatedAt
}`;

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    const { isEnabled } = await draftMode();

    const page = await sanityClient.fetch(getPageBySlugQuery, { slug }, 
      isEnabled ? { perspective: 'previewDrafts', useCdn: false, stega: true } : undefined
    );
    return page || null;
  } catch (error) {
    console.warn("Error fetching page:", error);
    return null;
  }
}


export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  try {
    const { isEnabled } = await draftMode();
    if (!process.env.SANITY_API_READ_TOKEN) {
      console.error('SANITY_API_READ_TOKEN is not set in environment variables.')
      return null
    }
    
    const query = `
      *[_type == "siteSettings"][0]{
        siteName,
        logo,
        backgroundImageDesktop,
        backgroundImageMobile,
        pagesBackgroundImageDesktop,
        pagesBackgroundImageMobile,
        menuItems[]{
          menuTitle,
          linkTitle,
          pageRef->{
            title,
            slug
          },
          isInternalURL,
          externalURL,
          openInNewTab,
          noFollow
        },
        addressLineOne,
        addressLineTwo,
        emailAddress,
        footerContent,
        footerLinks[]{
          linkText,
          isInternalURL,
          linkTitle,
          openInNewTab,
          noFollow,
          linkURL->{
            slug
          },
          externalURL
        },
        footerSiteName,
        designedByLink,
        googleTagManagerEnabled,
        googleTagManagerId
      }
    `
    const siteSettings = await sanityClient.fetch<SanitySiteSettings>(query,
      {}, isEnabled ? { perspective: 'previewDrafts', useCdn: false, stega: true } : undefined
    );
    
    if (!siteSettings) {
      console.warn('No site settings found in Sanity');
      return null;
    }
    return siteSettings
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error)
    return null
  }
}