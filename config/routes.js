module.exports = (app) => {
  app.route("/playlist").post(app.api.youTube.getPlayLists);
  app.route("/playlistItems").post(app.api.youTube.getPlayListItems);
  app.route("/addPlayList").post(app.api.youTube.addPlayList);
  app.route("/SearchVideos").post(app.api.youTube.SearchVideos);
  app.route("/addItemsPlaylist").post(app.api.youTube.addItemsPlaylist);
};
