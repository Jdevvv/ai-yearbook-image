"use client";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [gender, setGender] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("gender", gender);

      const result = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const json = await result.json();
      router.push(`/result/${json.eventId}`);
    } catch (err) {
      console.error({ err });
    }
  };

  return (
    <main className="flex items-center md:p-8 px-4 w-full justify-center min-h-screen flex-col">
      <Head>
        <title>Test Replicate</title>
      </Head>
      <form
        method="POST"
        className="flex flex-col md:w-[60%] w-full"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor="gender">Gender</label>
        <select
          className="border-[1px] py-3 px-4 mb-4 rounded"
          name="gender"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="man">Male</option>
          <option value="woman">Female</option>
        </select>

        <label htmlFor="image">Picture</label>
        <input
          name="image"
          type="file"
          className="border-[1px] py-2 px-4 rounded-md mb-3"
          accept=".png, .jpg, .jpeg .webp"
          required
          onChange={({ target }) => {
            if (target.files) {
              const file = target.files[0];
              setSelectedFile(file);
            }
          }}
        />
        <button
          type="submit"
          className="px-6 py-4 mt-5 bg-blue-500 text-lg hover:bg-blue-700 rounded text-white"
        >
          Generate
        </button>
      </form>
    </main>
  );
}
