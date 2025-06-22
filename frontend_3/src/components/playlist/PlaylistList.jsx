import React from "react";
import PlaylistCard from "./PlaylistCard";

const PlaylistList = ({ playlists, onSelect }) => {
  return (
    <div style={{ marginTop: 20 }}>
      {playlists.length === 0 && <p>No playlists found.</p>}
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist._id}
          playlist={playlist}
          onClick={() => onSelect(playlist)}
        />
      ))}
    </div>
  );
};

export default PlaylistList;
