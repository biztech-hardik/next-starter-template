import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/api";
import Image from "next/image";
import { draftMode } from 'next/headers';
import HeaderInteractions from "@/components/scriptCode";

export default async function NotFound() {
const siteSettings = await getSiteSettings();
const { isEnabled } = await draftMode();
  return (
    <div className="wrapper hide">
      <Header siteSettings={siteSettings} currentSlug={"not-found"} />
      <HeaderInteractions />
      <main className="main home home_page">
        <section className="banner-section">
          <div className="container">
            <div
              className="polaris-home-bg-img"
              style={{ backgroundImage: "url('/background_desktop.webp')" }}
            ></div>
            <Image
              src="/background_mobile.webp"
              alt="Macroscopic Ventures"
              title="Macroscopic Ventures"
              className="polaris-banner mobile"
              width={580}
              height={830}
              priority
            />
            <div className="banner-wrapper">
              <div className="page-content">
                <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-8">
                  <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Oops! The page you&#39;re looking for doesn&#39;t exist.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer siteSettings={siteSettings} isEnabled={isEnabled}/>
    </div>
  );
}
