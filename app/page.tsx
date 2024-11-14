"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/modified/navbar";

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover overflow-hidden">
      {/* Custom glow effect that follows mouse */}
      <div
        className="absolute pointer-events-none w-[400px] h-[400px] rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          top: mousePosition.y,
          left: mousePosition.x,
          background: "radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(255,0,0,0) 70%)",
        }}
      ></div>
      <Navbar />
      <div className="bg-black w-full h-full bg-opacity-70 cursor-none flex flex-col justify-center items-center">
        <div className="text-white text-center relative m-auto">
          <p className="md:text-5xl text-3xl font-bold">
            Get Recommendation for your movie taste.
          </p>
          <p className="md:text-3xl text-xl font-medium">
            Share your watch list with your friends.
          </p>
          <Button
            className="btn-danger w-[250px] cursor-auto"
            onClick={() => router.push("/home")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
