"use client";

import { Button } from "@repo/ui/heroui";
import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-20 gap-16 font-synthesis-none sm:p-8 sm:pb-20">
      <main className="flex flex-col gap-8 grid-row-start-2 sm:items-center">
        <ThemeImage
          className="dark:invert"
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-geist-mono pl-0 m-0 text-sm leading-6 tracking-tight list-inside">
          <li className="mb-2 last:mb-0">
            Get started by editing{" "}
            <code className="font-inherit bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-semibold">
              apps/web/app/page.tsx
            </code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="rounded-full h-12 px-5 font-geist-sans border border-transparent transition-all duration-200 cursor-pointer flex items-center justify-center text-base leading-5 font-medium bg-black text-white dark:bg-white dark:text-black gap-2 hover:bg-gray-600 dark:hover:bg-gray-400"
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2F%2Fvercel%2F%2Fturborepo%2F%2Ftree%2F%2Fmain%2F%2Fexamples%2F%2Fbasic&root-directory=apps%2F%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turborepo.com/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full h-12 px-5 font-geist-sans border border-gray-200 dark:border-gray-700 transition-all duration-200 cursor-pointer flex items-center justify-center text-base leading-5 font-medium min-w-[180px] sm:min-w-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Read our docs
          </a>
        </div>
        <Button variant="ghost">Open alert</Button>
      </main>
      <footer className="font-geist-sans grid-row-start-3 flex gap-6 sm:flex-wrap sm:items-center sm:justify-center">
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
