import { GoogleGenerativeAI } from "@google/generative-ai";

type ContentPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export class GeminiAdapter {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
  }

  async send(
    prompt: string,
    options: { image?: string } = {},
  ): Promise<string> {
    const { image } = options;
    const parts: ContentPart[] = [{ text: prompt }];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image,
        },
      });
    }

    const contents = [{ parts }];

    const result = await this.model.generateContent({
      contents,
      response_modalities: ["IMAGE"],
    });

    const candidate = result.response.candidates?.[0];
    if (!candidate || candidate.finishReason !== "STOP") {
      throw new Error("Image generation failed");
    }

    return candidate.content.parts[0].image;
  }
}
