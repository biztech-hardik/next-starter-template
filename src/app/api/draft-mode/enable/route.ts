import { sanityClient } from '@/lib/api';
import { defineEnableDraftMode } from 'next-sanity/draft-mode';


export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: process.env.SANITY_VIEWER_TOKEN }),
});