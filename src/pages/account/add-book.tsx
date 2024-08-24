import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import Nav from "~/components/common/Nav";
import { api } from "~/utils/api";
import Image from "next/image";
import { requireAuth } from "~/utils/requireAuth";
import Footer from "~/components/common/Footer";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function AddBook() {
  const myUser = api.user.getUser.useQuery();
  const addBookMutation = api.book.addBook.useMutation();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    const coverInput = document.getElementById("cover");

    coverInput?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const addBook = async () => {
    if (!title || !author || !description) {
      toast.error("Please fill out all fields", toastOptions);
      return;
    }

    addBookMutation.mutate(
      {
        title,
        author,
        description,
      },
      {
        onSuccess: () => {
          toast.success("Book added successfully", toastOptions);
          setTitle("");
          setAuthor("");
          setCover("");
          setDescription("");
          setCoverPreview("");
        },
        onError: (error) => {
          toast.error(error.message, toastOptions);
        },
      }
    );
  }

  return (
    <>
      <Head>
        <title>Cool book library</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="mt-36 mb-12 flex w-full flex-col items-center">
          <h1 className="mt-8 text-4xl font-bold text-white">Add a book</h1>
          <div className="mt-8 flex w-full flex-col items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Harry Potter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="J.K. Rowling"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="cover">Cover</Label>
              <Input
                id="cover"
                type="file"
                accept="image/*"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              />
            </div>

            {coverPreview && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Preview</Label>
                <div className="relative flex h-full w-full justify-center">
                  <Image
                    src={coverPreview}
                    alt="Book cover placeholder"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            )}

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="bg-zinc-850 w-full rounded-md p-2 text-white"
                placeholder="Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button onClick={addBook}>Add Book</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const needsSetup = await checkRequireSetup(context);
  const loggedIn = await requireAuth(context);

  if (!loggedIn) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
