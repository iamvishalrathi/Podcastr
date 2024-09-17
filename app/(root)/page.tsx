"use client";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
  const router = useRouter();
  return (
    <div className="mt-5 flex flex-col gap-9 md:overflow-hidden">
      {/* Trending */}
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
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
          {latestPodcasts?.map(({ _id, podcastTitle, imageUrl}, index) => (
            <div
              key={_id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/podcasts/${_id}`)}
            >
              <figure className="flex items-center gap-2">
                <span className="inline-block text-center w-6 text-sm text-white-1 mr-2">
                  {index + 1}
                </span>
                <Image
                  src={imageUrl!}
                  alt={podcastTitle}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1"></h2>
              </figure>
              <div className="flex items-center">
                {/* <p className="text-12 font-normal text-white-1">
                  {podcaster.totalPodcasts} {podcaster.totalPodcasts > 1 ? "podcasts" : "podcast"}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
