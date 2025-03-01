"use client"

import PodcastCard from '@/components/PodcastCard'
import Searchbar from '@/components/Searchbar'
import { api } from '@/convex/_generated/api'
import { podcastTypes } from '@/constants/PodcastFields'
import { useQuery } from 'convex/react'
import { Filter, Clock, TrendingUp, Heart, RefreshCw, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
    const [filterOption, setFilterOption] = useState<'latest' | 'trending' | 'popular'>('trending')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCategoryFilter, setShowCategoryFilter] = useState(false)

    const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })

    useEffect(() => {
        if (podcastsData) {
            setIsLoading(false)
        }
    }, [podcastsData])

    // Filter podcasts based on selected option and categories
    const filteredPodcasts = podcastsData ? [...podcastsData]
        .filter(podcast => selectedCategories.length === 0 ||
            (podcast.podcastType && selectedCategories.includes(podcast.podcastType)))
        .sort((a, b) => {
            if (filterOption === 'latest') {
                return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
            } else if (filterOption === 'trending') {
                return (b.views || 0) - (a.views || 0)
            } else {
                return (b.likeCount || 0) - (a.likeCount || 0)
            }
        }) : []

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    const clearCategories = () => {
        setSelectedCategories([])
    }

    return (
        <div className="flex flex-col gap-9 pb-10 pt-10">
            {/* Enhanced header section */}
            <div className="bg-gradient-to-r from-white-1/5 to-white-1/10 rounded-xl p-8 shadow-lg border border-white-1/5">
                <h1 className="text-3xl font-bold text-white-1 mb-5">Discover Podcasts</h1>
                <Searchbar />
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    {/* Improved header and filter controls */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <h2 className="text-2xl font-bold text-white-1">
                            {!search ? 'Browse Community Podcasts' : 'Search results for '}
                            {search && <span className="text-orange-1 ml-1">"{search}"</span>}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showCategoryFilter || selectedCategories.length > 0
                                        ? 'bg-orange-1 text-black'
                                        : 'bg-white-1/5 text-white-2 hover:bg-white-1/10'
                                    }`}
                            >
                                <Filter size={16} />
                                Categories {selectedCategories.length > 0 && (
                                    <span className="bg-black/30 text-white px-2 py-0.5 rounded-full text-xs">
                                        {selectedCategories.length}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-2 bg-white-1/5 p-1.5 rounded-lg">
                                <button
                                    onClick={() => setFilterOption('trending')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${filterOption === 'trending'
                                            ? 'bg-orange-1 text-black'
                                            : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                >
                                    <TrendingUp size={15} />
                                    Trending
                                </button>
                                <button
                                    onClick={() => setFilterOption('latest')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${filterOption === 'latest'
                                            ? 'bg-orange-1 text-black'
                                            : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                >
                                    <Clock size={15} />
                                    Latest
                                </button>
                                <button
                                    onClick={() => setFilterOption('popular')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${filterOption === 'popular'
                                            ? 'bg-orange-1 text-black'
                                            : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                >
                                    <Heart size={15} />
                                    Popular
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced category filter */}
                    {showCategoryFilter && (
                        <div className="bg-white-1/5 p-5 rounded-xl border border-white-1/10 shadow-lg animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white-1 font-semibold flex items-center gap-2">
                                    <Filter size={18} className="text-orange-1" />
                                    Filter by Category
                                </h3>
                                <div className="flex gap-3">
                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={clearCategories}
                                            className="text-sm text-white-2 hover:text-orange-1 flex items-center gap-1.5 transition-colors"
                                        >
                                            Clear all <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowCategoryFilter(false)}
                                        className="text-sm bg-white-1/10 hover:bg-white-1/20 px-3 py-1 rounded-lg text-white-2 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5 max-h-[200px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                {podcastTypes.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => toggleCategory(category.value)}
                                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategories.includes(category.value)
                                                ? 'bg-orange-1 text-black shadow-md shadow-orange-1/20 scale-105'
                                                : 'bg-white-1/10 text-white-2 hover:bg-white-1/20'
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced selected categories display */}
                    {selectedCategories.length > 0 && !showCategoryFilter && (
                        <div className="flex flex-wrap gap-2.5 items-center bg-white-1/5 p-3 rounded-lg border border-white-1/10">
                            <span className="text-white-1 text-sm font-medium">Filtered by:</span>
                            {selectedCategories.map(category => {
                                const categoryLabel = podcastTypes.find(c => c.value === category)?.label || category;
                                return (
                                    <div key={category} className="bg-orange-1/20 text-orange-1 px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-sm">
                                        {categoryLabel}
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="hover:bg-orange-1/30 rounded-full p-0.5 transition-colors"
                                            aria-label={`Remove ${categoryLabel} filter`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={clearCategories}
                                className="text-sm text-orange-1 hover:text-orange-2 font-medium transition-colors ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading state with improved skeleton UI */}
                {isLoading ? (
                    <div className="podcast_grid">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white-1/5 rounded-xl overflow-hidden border border-white-1/10 shadow-md">
                                <div className="w-full aspect-square bg-white-1/10 animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-white-1/10 rounded-md animate-pulse" style={{ width: `${70 + Math.random() * 25}%` }} />
                                    <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-full" />
                                    <div className="h-4 bg-white-1/10 rounded-md animate-pulse" style={{ width: `${40 + Math.random() * 30}%` }} />
                                    <div className="flex justify-between pt-2">
                                        <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
                                        <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredPodcasts.length > 0 ? (
                            <>
                                <div className="podcast_grid">
                                    {filteredPodcasts.map(({ _id, podcastTitle, podcastDescription, imageUrl, views, likeCount, podcastType }) => (
                                        <PodcastCard
                                            key={_id}
                                            imgUrl={imageUrl!}
                                            title={podcastTitle}
                                            description={podcastDescription}
                                            podcastId={_id}
                                            views={views}
                                            likes={likeCount || 0}
                                            category={podcastType ? podcastTypes.find(c => c.value === podcastType)?.label : undefined}
                                        />
                                    ))}
                                </div>
                                <div className="text-center text-white-2 text-sm mt-6 bg-white-1/5 py-3 px-4 rounded-lg inline-block mx-auto">
                                    Showing {filteredPodcasts.length} {filteredPodcasts.length === 1 ? 'podcast' : 'podcasts'}
                                    {selectedCategories.length > 0 && ' with selected filters'}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white-1/5 rounded-xl border border-white-1/10">
                                <div className="bg-white-1/10 p-6 rounded-full mb-5 shadow-inner">
                                    <RefreshCw size={32} className="text-orange-1" />
                                </div>
                                <h3 className="text-2xl font-bold text-white-1 mb-3">No podcasts found</h3>
                                <p className="text-white-2 text-center max-w-md mb-8 px-4">
                                    {selectedCategories.length > 0
                                        ? "No podcasts match your selected categories. Try different categories or clear filters."
                                        : search
                                            ? `We couldn't find any podcasts matching "${search}". Try a different search term.`
                                            : "We couldn't find any podcasts. Try a different filter or check back later."}
                                </p>
                                <button
                                    onClick={() => {
                                        clearCategories();
                                        if (search) window.location.href = '/discover';
                                    }}
                                    className="bg-orange-1 text-black px-8 py-3 rounded-full font-semibold hover:bg-orange-2 transition-colors shadow-lg"
                                >
                                    {selectedCategories.length > 0 ? "Clear Filters" : "Clear Search"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Discover