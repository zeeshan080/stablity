"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

type Props = {
  images: string[];
};

export default function Gallery({ images }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/stability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: prompt }),
    });
    const data = await response.json();
    setImage(data.imagePath[0]);
    setLoading(false);
    setPrompt("");
  };
  return (
    <Card className="m-8 py-12 px-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center py-3">
          Text to Image Generator{" "}
        </CardTitle>
        <form onSubmit={handleSubmit}>
          {loading ? (
            <div>
              <Input
                disabled
                placeholder="Enter Prompt Enter to Create Image..."
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
              />
            </div>
          ) : (
            <div>
              <Input
                placeholder="Enter Prompt Enter to Create Image..."
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
              />
            </div>
          )}
        </form>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : image.length > 0 ? (
          <div className="flex justify-center items-center">
            <Image src={image} width={400} height={400} alt="generated image" className="rounded-sm"/>
          </div>
        ) : (
          ""
        )}
      </CardContent>
      <h1 className="text-md p-4">Already Created Images</h1>
      <CardFooter className="flex justify-center gap-4 flex-wrap">
        {images.map((image) => (
          <div className="" key={image}>
            <Image
              src={`/images/${image}`}
              className="rounded-sm"
              width={100}
              height={100}
              alt="generated image"
            />
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
