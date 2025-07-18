import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/api";
import NoContent from "@/components/noContent";
import { portableTextComponents } from "@/components/portableText";
import TeamSectionComponent from "@/components/teamSection";
import BoxContentComponent from "@/components/boxContent";
import { urlFor } from "@/lib/sanityImage";
import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api";
import {
  SanityCkEditorSection,
  SanityBasicImageSection,
  SanityFocusAreasSection,
  SanityAboutSectionItem,
  SanitySection,
} from "@/types/sanity";
import HeaderInteractions from "@/components/scriptCode";
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';

export const runtime = "edge"

const CKEditorComponent: React.FC<{ data: SanityCkEditorSection }> = ({
  data,
}) => (
  <div className="ck-editor-section">
    <div className="container">
      <PortableText value={data.content} components={portableTextComponents} />
    </div>
  </div>
);

const BasicImageComponent: React.FC<{ data: SanityBasicImageSection }> = ({
  data,
}) => (
  <div className="border rounded-lg p-6 shadow-sm text-center">
    <Image
      src={`https://cdn.sanity.io/images/${
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      }/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${data.image.asset._ref
        .replace("image-", "")
        .replace("-svg", ".svg")
        .replace("-jpg", ".jpg")
        .replace("-png", ".png")}`}
      alt={data.alt}
      width={data.width || 500}
      height={data.height || 300}
      className="mx-auto rounded-lg"
    />
  </div>
);

const FocusAreasSectionComponent: React.FC<{
  data: SanityFocusAreasSection;
}> = ({ data }) => (
  <section className="focus-areas focus-page">
    <div className="container">
      <div className="focus-areas-wrapper">
        <div className="focus-areas-content line">
          <div className="focus-areas-desc">
            <div className="focus-areas-desc-wrapper">
              <p>{data.contentTitle}</p>
              {data.focusAreas.map((area) => (
                <div key={area._key}>
                  <h2>{area.title}</h2>
                  {area.content && (
                    <div className="focus-area-content">
                      <PortableText
                        value={area.content}
                        components={portableTextComponents}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSectionItemComponent: React.FC<{ data: SanityAboutSectionItem }> = ({
  data,
}) => (
  <div className="focus-areas-content grant-page-content line">
    <div className="focus-areas-text grant-page-image">
      <h4 className="line">{data.title}</h4>
    </div>
    <div className="focus-areas-desc grant-page-desc">
      <div className="grant-page-desc-wrapper">
        <PortableText
          value={data.description}
          components={portableTextComponents}
        />
      </div>
    </div>
  </div>
);

// Helper function to check if component has _type property
const hasComponentType = (
  component: unknown
): component is { _type: string } => {
  return (
    typeof component === "object" && component !== null && "_type" in component
  );
};
type Props = {
  component: SanitySection;
};

// Dynamic component renderer
const DynamicComponentRenderer: React.FC<Props> = ({ component }) => {
  switch (component._type) {
    case "boxContent":
      return <BoxContentComponent data={component} />;
    case "ckEditor":
      return <CKEditorComponent data={component} />;
    case "basicImage":
      return <BasicImageComponent data={component} />;
    case "focusAreasSection":
      return <FocusAreasSectionComponent data={component} />;
    case "teamSection":
      return <TeamSectionComponent data={component} />;
    default: {
      // TypeScript exhaustiveness check - this should never happen with proper typing
      const unknownComponent = component as unknown;
      const componentType = hasComponentType(unknownComponent)
        ? (unknownComponent as { _type: string })._type
        : "unknown";

      console.warn(`Unknown component type: ${componentType}`);
      return null;
    }
  }
};

// Type for the page props
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPageBySlug(resolvedParams.slug);
  
  if (!page || !page.seo) return {};

  const { canonicalUrl, metaTitle, metaDescription, metaRobots, metaImage } = page.seo;

  // Handle metaImage with reference type
  const imageUrl = metaImage?.asset?._ref 
    ? urlFor({ asset: { _ref: metaImage.asset._ref } }).url()
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: metaRobots,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: metaTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const KNOWN_COMPONENT_TYPES = new Set([
  "boxContent",
  "ckEditor",
  "basicImage",
  "focusAreasSection",
  "aboutSectionItem",
  "teamSection",
]);

export default async function Page({ params }: PageProps) {
  // Await the params Promise to get the actual parameters
  const resolvedParams = await params;
  const actualSlug = resolvedParams.slug;
  const [siteSettings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug(actualSlug),
  ]);
  const desktopBackgroundImage = siteSettings?.pagesBackgroundImageDesktop;
  const desktopBackgroundImageUrl = desktopBackgroundImage
    ? urlFor(desktopBackgroundImage).url()
    : null;
  const mobileBackgroundImage = siteSettings?.pagesBackgroundImageMobile;
  const mobileBackgroundImageUrl = mobileBackgroundImage
    ? urlFor(mobileBackgroundImage).url()
    : null;

  if (!page) {
    return notFound();
  }
  const { isEnabled } = await draftMode();
  const pageClass = "wrapper hide";
  const sections = page.sections || [];
  const knownComponents = sections.filter((section) =>
    KNOWN_COMPONENT_TYPES.has(section._type)
  );

  return (
    <>
      <Header siteSettings={siteSettings} currentSlug={actualSlug} />
      <HeaderInteractions />
      <main className="main">
        <div className={pageClass}>
          <section className="banner-section">
            <div className="container">
              {desktopBackgroundImageUrl ? (
                <Image
                  src={desktopBackgroundImageUrl}
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={1920}
                  height={300}
                  className="polaris-banner desktop"
                  priority
                />
              ) : (
                <Image
                  src="/inner_page_bg_desktop.webp"
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={1920}
                  height={300}
                  className="polaris-banner desktop"
                  priority
                />
              )}
              {mobileBackgroundImageUrl ? (
                <Image
                  src={mobileBackgroundImageUrl}
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={400}
                  height={250}
                  className="polaris-banner mobile"
                  priority
                />
              ) : (
                <Image
                  src="/inner_page_bg_mobile.webp"
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={400}
                  height={250}
                  className="polaris-banner mobile"
                  priority
                />
              )}
              <div className="banner-wrapper">
                <div className="page-title">
                  <h1>{page.headerTitle}</h1>
                  {page.displayLastUpdated && (
                    <div className="page-last-updated">
                      Last updated:{" "}
                      {format(new Date(page._updatedAt), "dd MMMM yyyy")}
                    </div>
                  )}
                </div>
                {page.headerDescription && (
                  <div className="page-content">
                    <PortableText
                      value={page.headerDescription}
                      components={portableTextComponents}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Body Section - Dynamic Component Rendering */}
          {page.sections && page.sections.length > 0 && (
            <section className={actualSlug + " " + actualSlug + "-page"}>
              {knownComponents.filter(
                (comp) => comp._type === "aboutSectionItem"
              ).length > 0 && (
                <section className="focus-areas grant-page">
                  <div className="container">
                    <div className="focus-areas-wrapper grant-page-wrapper">
                      {knownComponents
                        .filter((comp) => comp._type === "aboutSectionItem")
                        .map((component) => (
                          <AboutSectionItemComponent
                            key={component._key}
                            data={component}
                          />
                        ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Render other components (non-aboutSectionItem) */}
              {knownComponents
                .filter((comp) => comp._type !== "aboutSectionItem")
                .map((component) => (
                  <DynamicComponentRenderer
                    key={component._key}
                    component={component}
                  />
                ))}

              {/* Only render NoContent if there are no known components */}
              {knownComponents.length === 0 && <NoContent />}
            </section>
          )}

          {/* Fallback if no content */}
          {!page.headerTitle &&
            !page.headerDescription &&
            (!page.sections || page.sections.length === 0) && (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
                <p className="text-gray-600">Content coming soon...</p>
              </div>
            )}
        </div>
      </main>
      <Footer siteSettings={siteSettings} isEnabled={isEnabled}/>
      {isEnabled && <VisualEditing />}
    </>
  );
}