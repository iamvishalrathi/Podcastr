const MusicBars = () => {
  return (
    <div className="flex items-end gap-[3px] h-6 justify-center w-6">
      <span className="w-[3px] bg-orange-1 animate-music-bar-1" />
      <span className="w-[3px] bg-orange-1 animate-music-bar-2" />
      <span className="w-[3px] bg-orange-1 animate-music-bar-3" />
    </div>
  );
};

export default MusicBars;
