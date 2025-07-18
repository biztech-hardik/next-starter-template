import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/asset-utils'

const sanityClient = createClient({
  projectId: '11j8q4ao',
  dataset: 'production',
  apiVersion: 'v1',
  useCdn: false, // Set to true for production
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}