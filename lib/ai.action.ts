import puter from "@heyputer/puter.js";
import { ROOMIFY_RENDER_PROMPT } from "./constants";



// ✅ Convert image URL → base64
export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};



// ✅ MAIN FUNCTION (FIXED)
export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
    try {
        // 🔹 Ensure base64
        const dataUrl = sourceImage.startsWith("data:")
            ? sourceImage
            : await fetchAsDataUrl(sourceImage);

        // 🔹 Safe extraction using regex
        const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);

        if (!match) {
            throw new Error("Invalid source image payload");
        }

        const mimeType = match[1];
        const base64Data = match[2];

        // 🔹 Call AI
        const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
            provider: "gemini",
            model: "gemini-2.5-flash-image-preview",
            input_image: base64Data,
            input_image_mime_type: mimeType,
            ratio: { w: 1024, h: 1024 },
        });

        // 🔹 Handle ALL possible response formats
        let rawImageUrl: string | null = null;

        if (typeof response === "string") {
            rawImageUrl = response;
        } else if ((response as any)?.src) {
            rawImageUrl = (response as any).src;
        } else if ((response as any)?.url) {
            rawImageUrl = (response as any).url;
        }

        if (!rawImageUrl) {
            console.error("No image returned from AI");
            return { renderedImage: null, renderedPath: undefined };
        }

        // 🔹 Convert to base64 if needed
        const renderedImage = rawImageUrl.startsWith("data:")
            ? rawImageUrl
            : await fetchAsDataUrl(rawImageUrl);

        return {
            renderedImage,
            renderedPath: undefined,
        };

    } catch (error) {
        console.error("AI generation failed:", error);

        return {
            renderedImage: null,
            renderedPath: undefined,
        };
    }
};