import Navbar from "@/components/modified/navbar";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex flex-col gap-4">
                <nav>
                    <Navbar />
                </nav>
                <main className="pt-20">{children}</main>
            </div>
        </>
    );
}