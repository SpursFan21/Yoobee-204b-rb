import Head from "next/head";
import SiteTitle from "~/components/common/SiteTitle";
import Nav from "~/components/common/Nav";

import { api } from "~/utils/api";
import Footer from "~/components/common/Footer";

export default function About() {
  const myUser = api.user.getUser.useQuery();

  return (
    <>
      <Head>
        <title>Book Thing | About</title>
        <meta name="description" content="Learn more about Book Thing, your personal bookshelf in the digital world." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="h-24"></div>

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-[5rem]">
            <SiteTitle />
          </h1>

          <h1 className="text-5xl font-extrabold text-white">About</h1>

          <section className="prose max-w-3xl px-4 py-8 text-white">
            <h2 className="h2-large text-center">Welcome to Book Thing, your personal bookshelf!</h2>

            <div className="my-6"></div>

            <p className="text-left">At Book Thing, we understand that every book tells a story, not just on its pages, but also in your reading journey. Our platform is designed to help you track and celebrate your reading adventures with ease and enthusiasm. Whether you’re a passionate book lover, an occasional reader, or somewhere in between, Book Thing is here to enhance your reading experience.</p>

            <div className="my-12"></div>

            <h2 className="h2-large text-center">What We Offer</h2>

            <div className="my-6"></div>

            <ul className="list-none">
              <li><strong>Comprehensive Book Collection:</strong> With Book Thing, you can create a detailed record of all the books you’ve read, are currently reading, or plan to read. Our intuitive interface allows you to add books to your collection with ease, so you can keep track of your reading history and future goals.</li>

              <div className="my-6"></div>

              <li><strong>Progress Tracking:</strong> Stay on top of your reading journey by updating the progress of each book in your list. Whether you’re halfway through or have just started, you can easily reflect your current reading status, helping you stay motivated and organized.</li>

              <div className="my-6"></div>

              <li><strong>Reviews and Ratings:</strong> Share your thoughts and opinions on the books you’ve read! Write reviews, rate the books, and organize your personal reflections on each title. Our review and rating system lets you express your experiences and keep track of what you’ve enjoyed or learned from your reading.</li>
            </ul>

            <div className="my-12"></div>

            <h2 className="h2-large text-center">Our Mission</h2>

            <div className="my-6"></div>

            <p className="text-left">Our mission is to create a space where readers can manage their book collections, track their reading progress, and document their personal reading experiences. At Book Thing, we believe that every book is a unique journey, and we’re here to help you document and enjoy every step of it.</p>
            <p className="text-left">Thank you for choosing Book Thing as your reading companion. We hope you enjoy using our platform and that it enhances your love of books!</p>

            <div className="my-12"></div>

            <p className="text-left">Happy reading!</p>
            <p className="text-left">The Book Thing Team</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
