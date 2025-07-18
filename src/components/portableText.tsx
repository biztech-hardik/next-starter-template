import { PortableTextComponents, PortableTextMarkComponentProps } from '@portabletext/react';
import Link from 'next/link';
import Image from "next/image";
import { urlFor } from "@/lib/sanityImage";

export const portableTextComponents: PortableTextComponents = {
  block: {
    // Normal paragraphs
    normal: ({ children }) => (
      <p className="text-gray-600 mb-4">{children}</p>
    ),
    
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mb-5 mt-7">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold text-gray-900 mb-2 mt-3">{children}</h6>
    ),
    
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-6 py-2 my-6 text-gray-700 italic bg-gray-50">
        {children}
      </blockquote>
    ),
  },

  // Add the types property to handle custom block types
  types: {
    htmlBlock: ({ value }) => {
      return (
        <div 
          className="html-block-content"
          dangerouslySetInnerHTML={{ __html: value.html }}
        />
      );
    },
     image: ({ value }) => {
        const imageUrl = urlFor(value).width(800).url();
        return (
          <div className="my-6">
            <Image
              src={imageUrl}
              alt={value.alt || 'Image'}
              width={800}
              height={450}
              className="rounded-lg shadow-md"
            />
          </div>
        );
      },
  },
  
  list: {
    // Bullet lists
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600">
        {children}
      </ul>
    ),
    
    // Numbered lists
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600">
        {children}
      </ol>
    ),
  },
  
  listItem: {
    // Bullet list items
    bullet: ({ children, value }) => {
      const level = value?.level || 1;
      const indent = level > 1 ? `ml-${(level - 1) * 6}` : '';
      
      return (
        <li className={`text-gray-600 ${indent}`}>
          {children}
        </li>
      );
    },
    
    // Numbered list items
    number: ({ children, value }) => {
      const level = value?.level || 1;
      const indent = level > 1 ? `ml-${(level - 1) * 6}` : '';
      
      return (
        <li className={`text-gray-600 ${indent}`}>
          {children}
        </li>
      );
    },
  },
  
  marks: {
    // Bold text
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    
    // Italic text
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    
    // Underlined text
    underline: ({ children }) => (
      <u className="underline">{children}</u>
    ),
    
    // Strike-through text
    'strike-through': ({ children }) => (
      <s className="line-through">{children}</s>
    ),
    
    // Code (inline)
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    
    // Subscript
    sub: ({ children }) => (
      <sub className="text-xs align-sub">{children}</sub>
    ),
    
    // Superscript
    sup: ({ children }) => (
      <sup className="text-xs align-super">{children}</sup>
    ),
    
    // External links
    link: ({
      children,
      value,
    }: PortableTextMarkComponentProps<{
      _type: 'link';
      href?: string;
      blank?: boolean;
      title?: string;
    }>) => (
      <a
        href={value?.href}
        title={value?.title}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
      >
        {children}
      </a>
    ),
    
    // Internal links
    internalLink: ({
      children,
      value,
    }: PortableTextMarkComponentProps<{
      _type: 'internalLink';
      page?: {
        slug: string;
      };
      title?: string;
    }>) => {
      // Access the slug from the page object
      const href = value?.page?.slug || '#';
      
      return (
        <Link
          href={`/${href}`}
          title={value?.title}
          className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
        >
          {children}
        </Link>
      );
    },
    pdfLink: ({ children, value }) => {
      // Generate the PDF URL from Sanity CDN
      const pdfUrl = value.file?.asset?.url;
      
      if (!pdfUrl) {
        return <span className="text-red-500">{children}</span>;
      }
      
      const target = value.blank ? '_blank' : '_self';
      const rel = value.blank ? 'noopener noreferrer' : undefined;
      
      return (
        <a 
          href={pdfUrl} 
          target={target} 
          rel={rel}
          title={value.title}
          className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
        >
          {children}
        </a>
      );
    },
  },
  
  // Handle unknown marks gracefully
  unknownMark: ({ children, markType }) => {
    console.warn(`Unknown mark type: ${markType}`);
    return <span>{children}</span>;
  },
  
  // Handle unknown block types gracefully
  unknownBlockStyle: ({ children }) => {
    return <div className="unknown-block">{children}</div>;
  },
  
  // Handle unknown list types gracefully
  unknownList: ({ children }) => {
    return <div className="unknown-list">{children}</div>;
  },
  
  // Handle unknown list item types gracefully
  unknownListItem: ({ children }) => {
    return <div className="unknown-list-item">{children}</div>;
  },
};