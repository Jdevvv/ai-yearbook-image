import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEventRunStatuses } from "@trigger.dev/react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export default function Result() {
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const { fetchStatus, error, statuses, run } = useEventRunStatuses(eventId);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Head>
        <title>Test Replicate</title>
      </Head>
      <h2 className="font-bold text-3xl mb-2">Result 🌟</h2>

      <div className="flex flex-col gap-1">
        {fetchStatus === "loading" ? (
          <p>Loading...</p>
        ) : fetchStatus === "error" ? (
          <p>{error.message}</p>
        ) : (
          statuses.map((status) => (
            <div
              key={status.key}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex gap-2 items-center">
                {status.state === "failure" ? (
                  <ExclamationCircleIcon className="text-red-500 h-4 w-4" />
                ) : status.state === "success" ? (
                  <CheckCircleIcon className="text-green-500 h-4 w-4" />
                ) : status.state === "loading" ? (
                  <ArrowPathIcon className="text-blue-500 h-4 w-4" />
                ) : (
                  <ClockIcon className="text-slate-500 h-4 w-4" />
                )}
                <div className="flex gap-1.5 items-center">
                  <h4 className="text-base">{status.label}</h4>
                </div>
              </div>
              {status.data && typeof status.data.url === "string" && (
                <img alt="result" className="w-80" src={status.data.url} />
              )}
            </div>
          ))
        )}
        {run?.status === "FAILURE" &&
          run.output &&
          typeof run.output.message === "string" && (
            <p className="bg-red-200 text-red-600 border-red-300 border my-4 rounded p-2">
              Generation failed: {run.output.message}
            </p>
          )}
      </div>

      <Link
        href="/"
        className="bg-blue-500 text-white my-4 px-4 py-3 rounded hover:bg-blue-600"
      >
        Generate another
      </Link>
    </div>
  );
}
