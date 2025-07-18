export interface SanityAsset {
  _type: 'reference';
  _ref: string;
}

export interface SanityImage {
  _type: 'image';
  asset: SanityAsset;
  [key: string]: unknown;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanitySEO {
  _type: 'seo';
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaRobots?: string;
  metaImage?: SanityImage;
}

export interface SanitySpan {
  _key: string;
  _type: 'span';
  marks: string[];
  text: string;
}

export interface SanityBlock {
  _key: string;
  _type: 'block';
  children: SanitySpan[];
  markDefs: unknown[];
  style: string;
}

export interface SanityPortableText {
  _key: string;
  _type: 'block';
  children: SanitySpan[];
  markDefs:  Array<{
    _type: 'link' | 'internalLink';
    _key: string;
    href?: string;
    blank?: boolean;
    title?: string;
    page?: {
      _ref: string;
      _type: 'reference';
    };
    slug?: string;
  }>;
  style: string;
}

export interface SanityCkEditorSection {
  _key: string;
  _type: 'ckEditor';
  content: SanityBlock[];
}
export interface SanityBox {
  _key: string;
  logo: {
    asset: {
      _ref: string;
    };
  };
  logoAlt: string;
  logoTitle: string;
  category: string;
  hoverContent: string;
  websiteUrl?: string;
  websiteLinkText?: string;
}

export interface SanityBoxContentSection {
  _key: string;
  _type: 'boxContent';
  boxes: SanityBox[];
}

export interface SanityBasicImageSection {
  _key: string;
  _type: 'basicImage';
  image: SanityImage;
  alt: string;
  width?: number;
  height?: number;
}


export interface SanityFocusAreaItem {
  _type: "focusAreaItem";
  _key: string;
  title: string;
  content: SanityPortableText[];
}

export interface SanityFocusAreasSection {
  _type: "focusAreasSection";
  _key: string;
  contentTitle: string;
  focusAreas: SanityFocusAreaItem[];
}

export interface SanityAboutSectionItem {
  _type: "aboutSectionItem";
  _key: string;
  title: string;
  description: SanityBlock[];
}

export interface SanityTeamSection {
  _key: string;
  _type: 'teamSection';
  title: string;
  additionalInfo: Array<SanityBlock>;
  teamMembers: Array<{
    _key: string;
    _type: 'teamMember';
    name: string;
    designation: string;
    introduction: string;
  }>;
}

export type SanitySection = 
  | SanityCkEditorSection
  | SanityBoxContentSection
  | SanityBasicImageSection
  | SanityFocusAreasSection
  | SanityAboutSectionItem
  | SanityTeamSection;

export interface SanitySystem {
  base: {
    id: string;
    rev: string;
  };
}

export interface SanityPage {
  _id: string;
  _type: 'page';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _system: SanitySystem;
  title: string;
  slug: SanitySlug;
  headerTitle?: string;
  headerDescription?: SanityPortableText[];
  sections?: SanitySection[];
  seo?: SanitySEO;
  displayLastUpdated?: boolean;
  publishedAt?: string;
}

export interface SanityPageReference {
  title: string;
  slug: SanitySlug;
}

export interface SanityMenuItem {
  menuTitle: string;
  linkTitle: string;
  pageRef?: SanityPageReference;
  isInternalURL: boolean;
  externalURL?: string | null;
  openInNewTab?: boolean | null;
  noFollow?: boolean | null;
}

export interface SanityFooterLink {
  linkText: string;
  isInternalURL?: boolean | null;
  linkTitle: string;
  openInNewTab?: boolean | null;
  noFollow?: boolean | null;
  linkURL?: {
    slug: SanitySlug;
  } | null;
  externalURL?: string | null;
}

export interface SanityDesignedByLink {
  linkText: string;
  url: string;
}

export interface SanitySiteSettings {
  siteName: string;
  logo?: SanityImage;
  backgroundImageDesktop?: SanityImage;
  backgroundImageMobile?: SanityImage;
  pagesBackgroundImageDesktop?: SanityImage;
  pagesBackgroundImageMobile?: SanityImage;
  menuItems: SanityMenuItem[];
  addressLineOne?: string;
  addressLineTwo?: string;
  emailAddress?: string;
  footerContent?: string | null;
  footerLinks: SanityFooterLink[];
  footerSiteName?: string;
  designedByLink?: SanityDesignedByLink;
  googleTagManagerEnabled: boolean;
  googleTagManagerId?: string;
}