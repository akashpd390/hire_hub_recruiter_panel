import { Button } from "@/components/ui/button";
import Link from "next/link";



// app/page.js
export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <p className="mt-4 text-xl">This is the default landing page for your app.</p>
      <Link href={"/recuiter/dashboard"}>
      <Button>
        Recuiter Panel
      </Button>
      </Link>
    </div>
  );
}
