import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Main from "@/components/Main/Main";

const plusJakartaSan = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
export const metadata = {
  title: "PayESv",
  description:
    "PayESv is a secure and reliable online payment gateway that enables businesses and individuals to accept payments via mobile banking, cards, and digital wallets like bKash, Nagad, and more. Simplify transactions, manage merchants, and grow your online presence with ease.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={plusJakartaSan.className}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col dark:bg-slate-900 ">
        <NextAuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <nav>
              <Navbar />
            </nav>
            <Main>{children}</Main>
            <footer>
              <Footer />
            </footer>
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
