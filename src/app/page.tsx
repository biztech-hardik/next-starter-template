import { sanityClient } from "@/lib/api";
import { PortableText } from "@portabletext/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/api";
import Image from "next/image";
import { urlFor } from "@/lib/sanityImage";
import HeaderInteractions from "@/components/scriptCode";
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';

export default async function Home() {
  const { isEnabled } = await draftMode();
  const data = await sanityClient.fetch(
    `*[_type == "page" && slug.current == "home"][0]`,
    {},
    isEnabled ? { perspective: 'previewDrafts', useCdn: false, stega: true } : undefined
  );

  const sectionContent = data?.sections?.[0]?.content || [];
  const siteSettings = await getSiteSettings();
  const desktopBackgroundImage = siteSettings?.backgroundImageDesktop;
  const desktopBackgroundImageUrl = desktopBackgroundImage
    ? urlFor(desktopBackgroundImage).url()
    : null;
  const mobileBackgroundImage = siteSettings?.backgroundImageMobile;
  const mobileBackgroundImageUrl = mobileBackgroundImage
    ? urlFor(mobileBackgroundImage).url()
    : null;
  return (
    <>
      <div className="wrapper hide home_page home">
        <Header siteSettings={siteSettings} currentSlug={"home"} />
        <HeaderInteractions />
        <main className="main">
          <section className="banner-section">
            <div className="container">
              {desktopBackgroundImageUrl ? (
                <div
                  className="polaris-home-bg-img"
                  style={{
                    backgroundImage: `url(${desktopBackgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <Image
                  src="/background_desktop.webp"
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={1920}
                  height={300}
                  className="polaris-home-bg-img"
                  priority
                />
              )}
              {mobileBackgroundImageUrl ? (
                <Image
                  src={mobileBackgroundImageUrl}
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  width={580}
                  height={830}
                  className="polaris-banner mobile"
                  priority
                />
              ) : (
                <Image
                  src="/background_mobile.webp"
                  alt="Macroscopic Ventures"
                  title="Macroscopic Ventures"
                  className="polaris-banner mobile"
                  width={580}
                  height={830}
                  priority
                />
              )}

              <div className="banner-wrapper">
                <div className="page-content">
                  <PortableText value={sectionContent} />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer siteSettings={siteSettings} isEnabled={isEnabled}/>
      </div>
      {isEnabled && <VisualEditing />}
    </>
  );
}