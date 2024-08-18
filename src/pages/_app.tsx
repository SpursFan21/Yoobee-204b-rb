import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/grid-bg.css";

import { ThemeProvider } from "~/components/theme-provider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
        <ToastContainer theme="dark" />
      </ThemeProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
