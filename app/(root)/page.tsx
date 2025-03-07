"use client";
import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TrendingUp, Clock, Headphones, Heart, ArrowRight, Play } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const latestPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'latest' })?.slice(0, 5);
  const featuredPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'popular' })?.slice(0, 3);
  const trendingPodcasts = useQuery(api.podcasts.getFilteredPodcasts, { type: 'trending' })?.slice(0, 6);
  const router = useRouter();

  // Add auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });

    // Cleanup interval on unmount
    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  function formatAudioDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = hours < 10 ? `0${hours}:` : `${hours}:`;
    const formattedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return formattedHours + formattedMinutes + formattedSeconds;
  }

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="mt-5 flex flex-col gap-9 md:overflow-hidden p-5">
      {/* Featured Podcasts */}
      {featuredPodcasts && featuredPodcasts.length > 0 ? (
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
                        className="object-cover opacity-60 blur-[1px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-6 gap-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={podcast.authorImageUrl!}
                          alt={podcast.author}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-orange-1/50"
                        />
                        <span className="text-white-1 font-medium">{podcast.author}</span>
                      </div>
                      <h1 className="text-3xl font-bold text-white-1 drop-shadow-md">{podcast.podcastTitle}</h1>
                      <p className="text-white-2 line-clamp-2 backdrop-blur-sm bg-black/20 p-1.5 rounded-md">{podcast.podcastDescription}</p>
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

          <div className="flex justify-between mt-4">
            {/* Carousel Controls - Only dots for navigation */}
            <div className="flex justify-center w-full mt-4">
              {featuredPodcasts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all mx-1 ${index === selectedIndex
                    ? 'bg-orange-1 scale-125'
                    : 'bg-[white] hover:bg-white/50'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative w-full h-[300px]">
          <div className="rounded-2xl overflow-hidden bg-white-1/5 h-full">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
              <div className="relative h-full flex flex-col justify-end p-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white-1/10 animate-pulse" />
                  <div className="h-5 bg-white-1/10 rounded animate-pulse w-24" />
                </div>
                <div className="h-8 bg-white-1/10 rounded animate-pulse w-3/4" />
                <div className="h-16 bg-white-1/10 rounded animate-pulse w-full" />
                <div className="flex items-center gap-6">
                  <div className="h-10 bg-white-1/10 rounded-full animate-pulse w-32" />
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                    <div className="h-5 bg-white-1/10 rounded animate-pulse w-12" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                    <div className="h-5 bg-white-1/10 rounded animate-pulse w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-8">
            <div className="flex gap-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="w-3 h-3 rounded-full bg-white-1/10 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="flex flex-col gap-5 mt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-1/10 p-3 rounded-xl">
              <TrendingUp size={28} className="text-orange-1" />
            </div>
            <h1 className="text-2xl font-bold text-white-1">Trending Podcasts</h1>
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
            <>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white-1/5 rounded-xl overflow-hidden">
                  <div className="w-full aspect-square bg-white-1/10 animate-pulse " />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-white-1/10 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Latest */}
      <section className="flex flex-col gap-5 mt-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-1/10 p-3 rounded-xl">
              <Clock size={28} className="text-orange-1" />
            </div>
            <h1 className="text-2xl font-bold text-white-1">Latest Podcasts</h1>
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
                          className="aspect-square rounded-lg"
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
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center p-3 bg-white-1/5 rounded-lg">
                  <div className="w-8 text-center">
                    <div className="h-5 w-5 bg-white-1/10 rounded animate-pulse mx-auto" />
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white-1/10 rounded-lg animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-white-1/10 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-white-1/10 rounded animate-pulse w-1/2" />
                      </div>
                      <div className="flex gap-4">
                        <div className="h-4 w-16 bg-white-1/10 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-white-1/10 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-white-1/10 rounded animate-pulse max-sm:hidden" />
                      </div>
                    </div>
                    <div className="mt-3 h-px bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
