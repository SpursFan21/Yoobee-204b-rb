import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import Nav from "~/components/common/Nav";
import { api } from "~/utils/api";
import Image from "next/image";
import { requireAuth } from "~/utils/requireAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";
import { type Book } from "@prisma/client";
import AccountBookListItem from "~/components/account/AccountBookListItem";

const booksText: Book[] = [
  {
    id: "123",
    title: "Book 1",
    author: "Author 1",
    createdAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mattis orci eu finibus maximus. Morbi feugiat quam nibh, vel aliquet dolor porttitor nec. Proin accumsan turpis consectetur,",
    image: "https://via.placeholder.com/150",
    copys: 1,
    checkedOut: 0,
  },
  {
    id: "124",
    title: "Book 2",
    author: "Author 2",
    createdAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mattis orci eu finibus maximus. Morbi feugiat quam nibh, vel aliquet dolor porttitor nec. Proin accumsan turpis consectetur,",
    image: "https://via.placeholder.com/150",
    copys: 1,
    checkedOut: 0,
  },
];

export default function Account() {
  const myUser = api.user.getUser.useQuery();
  const myBooks = api.book.getUserBooks.useQuery();

  const userMutation = api.user.updateUser.useMutation();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogName, setDialogName] = useState("");

  useEffect(() => {
    if (myUser.data) {
      setDialogName(myUser.data?.user?.name ?? "");
    }
  }, [myUser.data]);

  const dialogSubmit = async () => {
    userMutation.mutate(
      {
        name: dialogName,
      },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          toast.success("Account edited successfully", toastOptions);
          myUser.refetch().then().catch(console.error);
        },
        onError: (error) => {
          toast.error(error.message, toastOptions);
          console.error(error);
        },
      },
    );
  };

  return (
    <>
      <Head>
        <title>Cool book library</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="mt-36 grid w-full grid-cols-1 gap-4 lg:mt-52 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center lg:justify-end">
            <div className="h-32 w-32 overflow-hidden rounded-full">
              {myUser.data?.user?.image && (
                <Image
                  src={myUser.data?.user?.image}
                  alt="user avatar"
                  width={1000}
                  height={1000}
                />
              )}
            </div>
          </div>
          <div className="m-4 flex flex-col items-center justify-center text-white lg:mt-4 lg:items-start">
            <p className="text-2xl lg:text-4xl">
              Name: {myUser.data?.user?.name}
            </p>
            <p className="text-base md:text-2xl">
              Email: {myUser.data?.user?.email}
            </p>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                {/* <button className="mt-4 flex w-fit rounded-xl bg-zinc-700 px-4 py-2 text-xl text-white transition-all hover:bg-zinc-600 active:scale-90">
                  Edit details
                </button> */}
                <Button className="mt-4 w-fit">Edit details</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={dialogName}
                      onChange={(e) => setDialogName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={dialogSubmit}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="px-8 lg:mt-24">
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-zinc-900 p-2 md:p-4">
            {/* {booksText.map((book) => (
              <AccountBookListItem key={book.id} book={book} />
              // <p key={book.id} className="w-full bg-blue-600 p-4">
              //   {book.title}
              // </p>
            ))} */}
            {myBooks.data?.map((userBook) => (
              <AccountBookListItem key={userBook.id} book={userBook.book} />
            ))}
          </div>
        </div>
      </main>
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
