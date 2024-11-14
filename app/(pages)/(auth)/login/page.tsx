import { SignIn } from "@clerk/nextjs";

export default function Login() {
    return (
        <div className="w-full flex items-center justify-center">
            <SignIn routing="hash" />
        </div>
    );
}