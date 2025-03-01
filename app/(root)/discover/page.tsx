"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
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
        <div className="flex flex-col gap-9">
            <div className="bg-white-1/5 rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-white-1 mb-4">Discover Podcasts</h1>
                <Searchbar />
            </div>
            
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white-1">
                            {!search ? 'Browse Community Podcasts' : 'Search results for '}
                            {search && <span className="text-orange-1 ml-1">"{search}"</span>}
                        </h2>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                    showCategoryFilter || selectedCategories.length > 0
                                        ? 'bg-orange-1 text-black' 
                                        : 'bg-white-1/5 text-white-2 hover:bg-white-1/10'
                                }`}
                            >
                                Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                            </button>
                            
                            <div className="flex items-center gap-2 bg-white-1/5 p-2 rounded-lg">
                                <Filter size={18} className="text-white-2" />
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setFilterOption('trending')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                            filterOption === 'trending' 
                                                ? 'bg-orange-1 text-black' 
                                                : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                    >
                                        <TrendingUp size={14} />
                                        Trending
                                    </button>
                                    <button 
                                        onClick={() => setFilterOption('latest')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                            filterOption === 'latest' 
                                                ? 'bg-orange-1 text-black' 
                                                : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                    >
                                        <Clock size={14} />
                                        Latest
                                    </button>
                                    <button 
                                        onClick={() => setFilterOption('popular')}
                                        className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                            filterOption === 'popular' 
                                                ? 'bg-orange-1 text-black' 
                                                : 'text-white-2 hover:bg-white-1/10'
                                        }`}
                                    >
                                        <Heart size={14} />
                                        Popular
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Category Filter */}
                    {showCategoryFilter && (
                        <div className="bg-white-1/5 p-4 rounded-lg animate-slideDown">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-white-1 font-medium">Filter by Category</h3>
                                <div className="flex gap-2">
                                    {selectedCategories.length > 0 && (
                                        <button 
                                            onClick={clearCategories}
                                            className="text-sm text-white-2 hover:text-orange-1 flex items-center gap-1"
                                        >
                                            Clear all <X size={14} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setShowCategoryFilter(false)}
                                        className="text-sm text-white-2 hover:text-orange-1"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {podcastTypes.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => toggleCategory(category.value)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            selectedCategories.includes(category.value)
                                                ? 'bg-orange-1 text-black'
                                                : 'bg-white-1/10 text-white-2 hover:bg-white-1/20'
                                        }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Selected Categories Display */}
                    {selectedCategories.length > 0 && !showCategoryFilter && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-white-2 text-sm">Filtered by:</span>
                            {selectedCategories.map(category => {
                                const categoryLabel = podcastTypes.find(c => c.value === category)?.label || category;
                                return (
                                    <div key={category} className="bg-orange-1/20 text-orange-1 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                        {categoryLabel}
                                        <button onClick={() => toggleCategory(category)} className="hover:bg-orange-1/10 rounded-full">
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                            <button 
                                onClick={clearCategories}
                                className="text-sm text-white-2 hover:text-orange-1 underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="podcast_grid">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white-1/5 rounded-xl overflow-hidden">
                                <div className="w-full aspect-square bg-white-1/10 animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-white-1/10 rounded animate-pulse" style={{ width: `${70 + Math.random() * 25}%` }} />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-full" />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse" style={{ width: `${40 + Math.random() * 30}%` }} />
                                    <div className="flex justify-between pt-2">
                                        <div className="h-4 bg-white-1/10 rounded animate-pulse w-[40px]" />
                                        <div className="h-4 bg-white-1/10 rounded animate-pulse w-[40px]" />
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
                                <div className="text-center text-white-2 text-sm mt-4">
                                    Showing {filteredPodcasts.length} {filteredPodcasts.length === 1 ? 'podcast' : 'podcasts'}
                                    {selectedCategories.length > 0 && ' with selected filters'}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="bg-white-1/5 p-6 rounded-full mb-4">
                                    <RefreshCw size={32} className="text-orange-1" />
                                </div>
                                <h3 className="text-xl font-bold text-white-1 mb-2">No podcasts found</h3>
                                <p className="text-white-2 text-center max-w-md mb-6">
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
                                    className="bg-orange-1 text-black px-6 py-2 rounded-full font-semibold hover:bg-orange-2 transition"
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