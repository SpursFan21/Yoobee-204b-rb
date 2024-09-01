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
import AccountBookListItem from "~/components/account/AccountBookListItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Footer from "~/components/common/Footer";
import Link from "next/link";

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

        <div className="mt-36 grid w-full grid-cols-1 gap-4">
          <div className="flex justify-center">
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
          <div className="m-4 flex flex-col items-center justify-center text-white">
            <p className="text-2xl lg:text-4xl">
              Name: {myUser.data?.user?.name}
            </p>
            <p className="text-base md:text-2xl">
              Email: {myUser.data?.user?.email}
            </p>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
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

        <div className="my-12 max-w-full px-8 md:max-w-[40rem] w-full">
          <div className="full flex flex-col md:flex-row gap-4 items-center justify-between py-8">
            <h1 className="text-3xl md:text-4xl">Your Books:</h1>
            <div className="flex gap-4">
              <Button asChild>
                <Link href={"/review"}>Review Book</Link>
              </Button>
              <Button asChild>
                <Link href={"/account/add-book"}>Add Book</Link>
              </Button>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Img</TableHead>
                <TableHead scope="col">Title</TableHead>
                <TableHead scope="col">Author</TableHead>
                <TableHead scope="col">Progress</TableHead>
                <TableHead scope="col">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBooks.data?.map((userBook) => (
                <AccountBookListItem key={userBook.id} userBook={userBook} />
              ))}
            </TableBody>
          </Table>
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
