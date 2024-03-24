import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center pt-16 md:pt-24">
            <SignUp/>
        </div>
    );
}