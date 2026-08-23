import Link from "next/link";
import { SiteHeader } from "@/app/SiteHeader";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page" id="main-content">
        <section className="hero">
          <h1>Not found</h1>
          <p className="hero__lead">
            That page does not exist — it may have been renamed or never published.
          </p>
          <p className="hero__lead">
            <Link className="contact__link" href="/">
              Back to the homepage
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
