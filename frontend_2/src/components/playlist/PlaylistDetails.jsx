import React from "react";

const PlaylistDetails = ({ playlist, onRemoveVideo }) => {
  console.log(playlist);
  return (
    <div style={{ marginTop: 20 }}>
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>

      <div>
        <h4>Videos</h4>
        {playlist.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video) => (
            <div
              key={video._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                gap: 12,
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: 120, height: 70, objectFit: "cover", borderRadius: 4 }}
              />
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: 0 }}>{video.title}</h5>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  Duration: {video.duration.toFixed(1)}s • Views: {video.views}
                </p>
              </div>
              <button onClick={() => onRemoveVideo(video._id)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No videos in this playlist.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;
