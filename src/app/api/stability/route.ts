import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";
// Set the runtime to edge for best performance
export const runtime = "edge";

const engineId = "stable-diffusion-xl-1024-v1-0";
const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey = process.env.STABILITY_API_KEY;

if (!apiKey) throw new Error("Missing Stability API key.");

export async function POST(request: NextRequest) {
  const req = await request.json();
  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `create an realistic image form the text ${req.text}`,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON = (await response.json()) as GenerationResponse;
  const promises = responseJSON.artifacts.map(async (image) => {
    const path = `./public/images/`;
    const randomId = Math.random();
    fs.writeFileSync(`${path}/${randomId}.png`, Buffer.from(image.base64, "base64"));
    return `/images/${randomId}.png`;
  });

  const imagePathResponses = await Promise.all(promises);

  return NextResponse.json({ imagePath: imagePathResponses }, { status: 200 });
}
