"use client";
import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoaderSpinner from "@/components/LoaderSpinner";
import { TrendingUp, Clock, Headphones, Heart, ArrowRight, Play } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
  const allPodcasts = useQuery(api.podcasts.getAllPodcasts);
  const router = useRouter();

  // Get the most liked podcast as featured
  const featuredPodcast = allPodcasts?.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))[0];

  function formatAudioDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = hours < 10 ? `0${hours}:` : `${hours}:`;
    const formattedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return formattedHours + formattedMinutes + formattedSeconds;
  }

  // Get top 3 featured podcasts
  const featuredPodcasts = allPodcasts
    ?.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, 3);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="mt-5 flex flex-col gap-9 md:overflow-hidden">
      {/* Featured Podcasts */}
      {featuredPodcasts && featuredPodcasts.length > 0 && (
        <section className="relative w-full h-[300px]">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {featuredPodcasts.map((podcast, index) => (
                <div key={podcast._id} className="relative w-full flex-[0_0_100%]">
                  <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0">
                      <Image
                        src={podcast.imageUrl!}
                        alt={podcast.podcastTitle}
                        fill
                        className="object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-6 gap-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={podcast.authorImageUrl!}
                          alt={podcast.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="text-white-1 font-medium">{podcast.author}</span>
                      </div>
                      <h1 className="text-3xl font-bold text-white-1">{podcast.podcastTitle}</h1>
                      <p className="text-white-2 line-clamp-2">{podcast.podcastDescription}</p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => router.push(`/podcasts/${podcast._id}`)}
                          className="bg-orange-1 text-black px-6 py-2 rounded-full font-semibold hover:bg-orange-2 transition flex items-center gap-2"
                        >
                          <Play size={18} className="fill-black" />
                          Listen Now
                        </button>
                        <div className="flex items-center gap-2">
                          <Headphones size={20} className="text-white-1" />
                          <span className="text-white-1">{podcast.views}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart size={20} className="text-white-1" />
                          <span className="text-white-1">{podcast.likeCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls - Positioned outside the image */}
          <div className="flex justify-between mt-4">
            <button
              onClick={scrollPrev}
              className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={20} className="text-white" />
              <span className="text-white text-sm font-medium hidden sm:inline">Previous</span>
            </button>
            
            {/* Dots Indicator - Moved to center between arrows */}
            <div className="flex gap-2 items-center">
              {featuredPodcasts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? 'bg-orange-1' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={scrollNext}
              className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors flex items-center gap-2"
            >
              <span className="text-white text-sm font-medium hidden sm:inline">Next</span>
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-orange-1" />
            <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-2 text-16 font-semibold text-orange-1 hover:text-orange-2 transition"
          >
            See all
            <ArrowRight size={20} className="text-orange-1" />
          </Link>
        </header>
        <div className="podcast_grid">
          {trendingPodcasts ? (
            trendingPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl, views, likeCount }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl as string}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
                views={views}
                likes={likeCount || 0}
              />
            ))
          ) : (
            <LoaderSpinner />
          )}
        </div>
      </section>

      {/* Latest */}
      <section className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-orange-1" />
            <h1 className="text-20 font-bold text-white-1">Latest Podcasts</h1>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-2 text-16 font-semibold text-orange-1 hover:text-orange-2 transition"
          >
            See all
            <ArrowRight size={20} className="text-orange-1" />
          </Link>
        </header>
        <div className="flex flex-col gap-6">
          {latestPodcasts ? (
            latestPodcasts.map(({ _id, podcastTitle, imageUrl, views, audioDuration, author, likeCount }, index) => (
              <div
                key={_id}
                onClick={() => router.push(`/podcasts/${_id}`)}
                className="flex cursor-pointer items-center hover:bg-white-1/5 rounded-lg p-3 transition group"
              >
                <span className="inline-block text-center w-8 text-sm font-medium text-orange-1">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col size-full gap-3">
                  <div className="flex justify-between items-center">
                    <figure className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={imageUrl!}
                          alt={podcastTitle}
                          width={64}
                          height={64}
                          className="aspect-square rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-orange-1/80 rounded-full p-2">
                            <Play size={16} className="fill-black text-black" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-16 font-semibold text-white-1 text-wrap w-[200px] max-sm:w-[100px] max-sm:truncate group-hover:text-orange-1 transition-colors">
                          {podcastTitle}
                        </h2>
                        <p className="text-14 text-white-2">{author}</p>
                      </div>
                    </figure>
                    <div className="flex items-center gap-6">
                      <figure className="flex gap-2 items-center">
                        <Headphones size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                        <span className="text-14 font-medium text-white-1">{views}</span>
                      </figure>
                      <figure className="flex gap-2 items-center">
                        <Heart size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                        <span className="text-14 font-medium text-white-1">{likeCount || 0}</span>
                      </figure>
                      <figure className="flex gap-2 items-center max-sm:hidden">
                        <Clock size={20} className="text-white-2 group-hover:text-orange-1 transition-colors" />
                        <span className="text-14 font-medium text-white-1">{formatAudioDuration(audioDuration)}</span>
                      </figure>
                    </div>
                  </div>
                  <hr className="border-gray-800" />
                </div>
              </div>
            ))
          ) : (
            <LoaderSpinner />
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
