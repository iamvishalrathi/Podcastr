"use client";
import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
  const router = useRouter();

  function formatAudioDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = hours < 10 ? `0${hours}:` : `${hours}:`;
    const formattedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return formattedHours + formattedMinutes + formattedSeconds;
  }

  return (
    <div className="mt-5 flex flex-col gap-9 md:overflow-hidden">
      {/* Trending */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
          <Link href="/discover" className="text-16 font-semibold text-orange-1">
            See all
          </Link>
        </header>
        <div className="podcast_grid">
          {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl as string}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
            />
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <h1 className="text-20 font-bold text-white-1">Latest Podcasts</h1>
          <Link href="/discover" className="text-16 font-semibold text-orange-1">
            See all
          </Link>
        </header>
        <div className="flex flex-col gap-6">
          {latestPodcasts?.map(({ _id, podcastTitle, imageUrl, views, audioDuration }, index) => (
            <div
              key={_id}
              onClick={() => router.push(`/podcasts/${_id}`)}
              className="flex cursor-pointer items-center"
            >
              <span className="inline-block text-center w-6 text-sm text-white-1 mr-2">
                {index + 1}
              </span>
              <div className="flex flex-col size-full gap-3">
                <div className="flex justify-between">
                  <figure className="flex items-center gap-2">
                    <Image
                      src={imageUrl!}
                      alt={podcastTitle}
                      width={64}
                      height={64}
                      className="aspect-square rounded-lg"
                    />
                    <h2 className="text-14 font-semibold text-white-1 text-wrap w-[200px] max-sm:w-[100px] max-sm:truncate">{podcastTitle}</h2>
                  </figure>
                  <figure className="flex gap-3 items-center">
                    <Image
                      src="/icons/headphone.svg"
                      width={24}
                      height={24}
                      alt="headphone"
                    />
                    <h2 className="text-16 font-bold text-white-1">{views}</h2>
                  </figure>
                  <figure className="flex gap-3 items-center">
                    <Image
                      src="/icons/watch.svg"
                      width={24}
                      height={24}
                      alt="watch"
                      className="max-sm:hidden"
                    />
                    <h2 className="text-16 font-bold text-white-1 max-sm:hidden">{formatAudioDuration(audioDuration)}</h2>
                  </figure>
                </div>
                <hr className="border-gray-800" />
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
