import Link from "next/link";
import SiteTitle from "./SiteTitle";

export default function Footer() {
  return (
    <>
      <div className="flex w-full flex-col items-center gap-10 bg-zinc-900/10 py-12">
        <div className="flex items-center gap-12 md:gap-24">
          <div className="text-4xl lg:text-6xl">
            <SiteTitle />
          </div>

          <div className="underline md:text-xl">
            <ul>
              <li className="text-white">
                <Link href="/">Home</Link>
              </li>
              <li className="text-white">
                <Link href="/about">About</Link>
              </li>
              <li className="text-white">
                <Link href="/account">Account</Link>
              </li>
              <li className="text-white">
                <Link href="/terms">Terms</Link>
              </li>
              <li className="text-white">
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center md:text-2xl">
          <p>
            A Yoobee project by{" "}
            <Link className="underline" href={"https://w-g.co"}>
              William
            </Link>{" "}
            and Duncan
            <br />
            &copy; {new Date().getFullYear()} Cool book library. All rights
            reserved.
          </p>
        </div>
      </div>
    </>
  );
}
