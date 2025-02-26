"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play, MoreVertical, Trash2, Heart } from 'lucide-react';

import { api } from "@/convex/_generated/api";
import { useAudio } from '@/providers/AudioProvider';
import { PodcastDetailPlayerProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useUser } from "@clerk/nextjs";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
  likes = [],
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(likes?.includes(user?.id || "") || false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  const likePodcast = useMutation(api.podcasts.likePodcast);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className="w-full bg-black-1/30 p-6 rounded-xl border border-gray-800">
      <div className="flex w-full justify-between max-md:flex-col max-md:items-center gap-8">
        <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
          {/* Thumbnail */}
          <div className="relative group">
            <Image
              src={imageUrl}
              width={250}
              height={250}
              alt="Podcast image"
              className="aspect-square rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Content */}
          <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-6">
            <article className="flex flex-col gap-3 max-md:items-center">
              <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1 transition-colors duration-200 hover:text-orange-1">
                {podcastTitle}
              </h1>
              <figure
                className="flex cursor-pointer items-center gap-3 bg-black-1/50 px-4 py-2 rounded-full transition-all duration-200 hover:bg-black-1/70"
                onClick={() => {
                  router.push(`/profile/${authorId}`);
                }}
              >
                <Image
                  src={authorImageUrl}
                  width={30}
                  height={30}
                  alt="Caster icon"
                  className="size-[30px] rounded-full object-cover ring-2 ring-orange-1/30"
                />
                <h2 className="text-16 font-medium text-white-3">{author}</h2>
              </figure>
            </article>

            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-orange-1 hover:bg-orange-1/90 text-white-1"
              >
                <Play size={20} />
                Play Now
              </Button>

              <Button
                onClick={async () => {
                  if (!user) {
                    toast({
                      title: "Please sign in to like podcasts",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  try {
                    const liked = await likePodcast({ podcastId, userId: user.id });
                    setIsLiked(liked);
                    toast({
                      title: liked ? "Added to liked podcasts" : "Removed from liked podcasts",
                    });
                  } catch (error) {
                    toast({
                      title: "Error updating like status",
                      variant: "destructive",
                    });
                  }
                }}
                className={`flex items-center gap-2 ${
                  isLiked 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-black-1/50 hover:bg-black-1/70"
                } text-white-1`}
              >
                <Heart 
                  size={20} 
                  className={isLiked ? "fill-current" : ""}
                />
                {likes.length || 0}
              </Button>

              {isOwner && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-black-1/50"
                    onClick={() => setIsDeleting((prev) => !prev)}
                  >
                    <MoreVertical size={20} stroke="white" />
                  </Button>
                  {isDeleting && (
                    <div
                      className="absolute -left-32 top-12 z-10 flex w-32 cursor-pointer items-center justify-center gap-2 
                      rounded-xl bg-black-6 py-2.5 transition-colors duration-200 hover:bg-red-500/20"
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} stroke="white" />
                      <span className="text-16 font-medium text-white-1">Delete</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailPlayer;
