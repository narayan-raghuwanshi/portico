import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex justify-center gap-16 flex-wrap mx-6 pt-24">
      <div className="max-w-lg flex flex-col items-center md:items-start">
        <h1 className=" text-4xl md:text-6xl text-center md:text-start font-bold font-sans mb-10">Everything you are. In one, <span className="text-sky-500">simple link</span>  in bio.</h1>
        <Link href="/dashboard" className="bg-zinc-800 py-3 px-10 rounded-lg w-fit border hover:bg-black">Get Started</Link>
      </div>
      <div className="rounded-xl shadow-xl shadow-gray-400">
        <Image src="/demo.png" alt="Hero" width={380} height={380} className="rounded-xl" />
      </div>
    </main>
  );
}
