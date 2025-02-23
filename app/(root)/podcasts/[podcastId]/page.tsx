'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();
  
  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId }) //To fetch podcast details
  const [hasUpdatedView, setHasUpdatedView] = useState(false);
  const updateViewCount = useMutation(api.podcasts.updatePodcastViews);

    useEffect(() => {
      // Update the view count only once when the component mounts
      if (!hasUpdatedView && podcast) {
        updateViewCount({ podcastId }).then(() => setHasUpdatedView(true));
      }
    }, [podcast]); // Only rerun if dependencies change



  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId })
  if (!similarPodcasts || !podcast) return <LoaderSpinner />
  
  const isOwner = user?.id === podcast?.authorId;

  return (
    <section className="flex w-full flex-col">
      {/* Header Section */}
      <header className="mt-9 flex items-center justify-between bg-black-1/30 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
          <h1 className="text-24 font-bold text-white-1">
            Currently Playing
          </h1>
        </div>
        <figure className="flex items-center gap-3 bg-black-1/50 px-4 py-2 rounded-full">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
            className="opacity-80"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views} views</h2>
        </figure>
      </header>

      {/* Player Section */}
      <div className="mt-6">
        <PodcastDetailPlayer
          isOwner={isOwner}
          podcastId={podcast._id}
          {...podcast}
        />
      </div>

      {/* Details Section */}
      <div className="mt-12 space-y-8">
        {/* Description */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Description</h2>
          </div>
          <p className="text-16 text-white-2 leading-relaxed">{podcast?.podcastDescription}</p>
        </div>

        {/* Transcription */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Transcription</h2>
          </div>
          <p className="text-16 text-white-2 leading-relaxed whitespace-pre-wrap">{podcast?.voicePrompt}</p>
        </div>

        {/* Thumbnail Prompt */}
        {podcast?.imagePrompt && (
          <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
              <h2 className="text-20 font-bold text-white-1">Thumbnail Prompt</h2>
            </div>
            <p className="text-16 text-white-2 leading-relaxed">{podcast?.imagePrompt}</p>
          </div>
        )}
      </div>

      {/* Similar Podcasts Section */}
      <section className="mt-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
          <h2 className="text-24 font-bold text-white-1">Similar Podcasts</h2>
        </div>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl as string}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-black-1/30 p-8 rounded-xl border border-gray-800">
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </div>
        )}
      </section>
    </section>
  )
}

export default PodcastDetails