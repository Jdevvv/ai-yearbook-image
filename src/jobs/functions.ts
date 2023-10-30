import { client } from "@/trigger";
import { Replicate } from "@trigger.dev/replicate";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";

const replicate = new Replicate({
  id: "replicate",
  apiKey: process.env.REPLICATE_API_TOKEN!,
});

const urlToBase64 = async (image: string) => {
  const response = await fetch(image);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const mimeType = "image/png";
  const dataURI = `data:${mimeType};base64,${base64String}`;
  return dataURI;
};

client.defineJob({
  id: "generate-avatar",
  name: "Generate Avatar",
  //👇🏻 integrates Replicate
  integrations: { replicate },
  version: "0.0.1",
  trigger: eventTrigger({
    name: "generate.avatar",
    schema: z.object({
      image: z.string(),
      gender: z.string(),
    }),
  }),
  run: async (payload, io, _ctx) => {
    const { image, gender } = payload;

    const generatingYearbookStatus = await io.createStatus("generating", {
      label: "Generating",
      state: "loading",
    });

    const imageGenerated = await io.replicate.run("create-model", {
      identifier: process.env
        .YEARBOOK_AI_URI as `${string}/${string}:${string}`,
      input: {
        image: `data:image/png;base64,${image}`,
        gender,
      },
    });

    if (imageGenerated.output === undefined || imageGenerated.error !== null) {
      await generatingYearbookStatus.update("generating-error", {
        label: "Generation failed",
        state: "failure",
      });

      if (imageGenerated.error !== null) {
        throw new Error(JSON.stringify(imageGenerated.error));
      }

      throw new Error("Character generation failed");
    }

    await generatingYearbookStatus.update("generating-success", {
      label: "Image generated",
      state: "success",
      data: {
        url: Array.isArray(imageGenerated.output)
          ? imageGenerated.output[0]
          : imageGenerated.output,
      },
    });

    await io.logger.info(
      "✨ Congratulations, the image has been delivered! ✨"
    );
  },
});
