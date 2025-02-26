'use client'
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { Headphones, Clock, Calendar, BookText, Mic2, Layers } from 'lucide-react'

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
        <div className="flex items-center gap-4">
          {/* Category */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Layers size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2 capitalize">{podcast?.podcastType || "storytelling"}</span>
          </div>
          {/* Duration */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Clock size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2">
              {Math.floor(podcast?.audioDuration / 60)}:{Math.floor(podcast?.audioDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Views */}
          <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
            <Headphones size={20} stroke="white" />
            <span className="text-14 font-medium text-white-2">{podcast?.views} views</span>
          </div>
        </div>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
              <h2 className="text-20 font-bold text-white-1">Transcription</h2>
            </div>
            <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
              <Mic2 size={20} stroke="white" />
              <span className="text-14 font-medium text-white-2">Voice: {podcast?.voiceType}</span>
            </div>
          </div>
          {podcast?.voicePrompt ? (
            <p className="text-16 text-white-2 leading-relaxed whitespace-pre-wrap">{podcast?.voicePrompt}</p>
          ) : (
            <p className="text-16 text-gray-1 leading-relaxed italic">No transcription provided</p>
          )}
        </div>

        {/* Thumbnail Prompt */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Thumbnail Details</h2>
          </div>
          {podcast?.imagePrompt ? (
            <p className="text-16 text-white-2 leading-relaxed">{podcast?.imagePrompt}</p>
          ) : (
            <p className="text-16 text-gray-1 leading-relaxed italic">Custom uploaded thumbnail</p>
          )}
        </div>

        {/* Creation Info */}
        <div className="bg-black-1/30 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
            <h2 className="text-20 font-bold text-white-1">Creation Info</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black-1/50 p-3 rounded-full">
              <Calendar size={20} stroke="white" />
            </div>
            <div>
              <p className="text-14 text-white-3">Created on</p>
              <p className="text-16 font-medium text-white-2">
                {new Date(podcast?._creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
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