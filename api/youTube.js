module.exports = (app) => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;
  const axios = require("axios");

  const getPlayLists = async (req, res) => {
    console.log("getPlayLists");
    const parans = { ...req.body };
    if (req.params.token) parans.tokem = req.params.token;

    try {
      existsOrError(parans.token, "Token não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlists?access_token=${parans.token}&part=snippet&mine=true`
      )
      .then((response) => {
        const data = response.data;
        const playlists = data.items.map((item) => {
          return {
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
          };
        });
        return res.json(playlists);
      })
      .catch((err) => {
        return res.status(400).send("Erro ao buscar playlists");
      });
  };

  const getPlayListItems = async (req, res) => {
    console.log("getPlayListItems");
    const parans = { ...req.body };
    if (req.params.token) parans.tokem = req.params.token;
    if (req.params.playlistId) parans.playlistId = req.params.playlistId;

    console.log(parans);

    try {
      existsOrError(parans.token, "Token não informado");
      existsOrError(parans.playlistId, "PlaylistID não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlistItems?access_token=${parans.token}&part=snippet&playlistId=${parans.playlistId}&maxResults=50`
      )
      .then((response) => {
        const data = response.data;
        const playlistItems = data.items.map((item) => {
          return {
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default,
            // description: item.snippet.description,
          };
        });
        console.log(playlistItems);
        return res.json(playlistItems);
      })
      .catch((err) => {
        return res.status(400).send("Erro ao buscar playlists");
      });
  };

  const addPlayList = async (req, res) => {
    console.log("addPlayList");
    const parans = { ...req.body };
    if (req.params.token) parans.tokem = req.params.token;
    // if (req.params.playlistId) parans.playlistId = req.params.playlistId;
    if (req.params.title) parans.title = req.params.title;
    if (req.params.privacyStatus)
      parans.privacyStatus = req.params.privacyStatus;

    console.log(parans);

    try {
      existsOrError(parans.token, "Token não informado");
      // existsOrError(parans.playlistId, "PlaylistID não informado");
      existsOrError(parans.title, "Playlist não informado");
      existsOrError(parans.privacyStatus, "privacyStatus não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    axios
      .post(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus`,
        {
          snippet: {
            title: parans.title,
            description: "Adicionado pelo Flutube",
          },
          status: {
            privacyStatus: parans.privacyStatus,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parans.token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;

        console.log(data);
        return res.json(data);
      })
      .catch((err) => {
        return res.status(400).send("Erro ao buscar playlists");
      });
  };

  const SearchVideos = async (req, res) => {
    console.log("SearchVideos");
    const parans = { ...req.body };
    if (req.params.token) parans.tokem = req.params.token;
    if (req.params.search) parans.search = req.params.search;

    try {
      existsOrError(parans.token, "Token não informado");
      // existsOrError(parans.playlistId, "PlaylistID não informado");
      existsOrError(parans.search, "Campo Busca não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?access_token=${parans.token}&part=snippet&q=${parans.search}&type=video&maxResults=1`
      )
      .then((response_video) => {
        const videoID = response_video.data.items[0].id.videoId;
        console.log("X:------------------------------------ ");
        console.log("VideoID: ", videoID);
        console.log("X:------------------------------------ ");
        // ------------------------------------
        axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?access_token=${parans.token}&part=snippet&id=${videoID}`
          )
          .then((response_categoryId) => {
            const categoryId =
              response_categoryId.data.items[0].snippet.categoryId;
            console.log("CategoriaID: ", categoryId);
            console.log("categoryId:------------------------------------ ");
            console.log(response_categoryId.data.items[0].snippet.categoryId);
            // ------------------------------------
            axios
              .get(
                `https://www.googleapis.com/youtube/v3/search?access_token=${parans.token}&part=snippet&videoCategoryId=${categoryId}&q=${parans.search}&type=video&maxResults=10`
              )
              .then(async (response_list) => {
                const data = response_list.data;
                const playlistItems = await data.items.map((item) => {
                  console.log(item.snippet);
                  return {
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default,
                    // description: item.snippet.description,
                  };
                });
                return res.json(playlistItems);
              })
              .catch((err) => {
                console.log(err);
                console.log("Erro ao buscar Lista de Videos");
                return res.status(400).send("Erro ao buscar Lista de Videos");
              });
          })
          .catch((err) => {
            console.log("Erro ao buscar videoCategoria");
            return res.status(400).send("Erro ao buscar videoCategoria");
          });
      })
      .catch((err) => {
        console.log("Erro ao buscar video");
        return res.status(400).send("Erro ao buscar video");
      });
  };

  const addItemsPlaylist = async (req, res) => {
    console.log("addItemsPlaylist");
    const parans = { ...req.body };
    if (req.params.token) parans.tokem = req.params.token;
    if (req.params.playlistsID) parans.playlistsID = req.params.playlistsID;
    if (req.params.videoID) parans.videoID = req.params.videoID;

    console.log(parans);

    try {
      existsOrError(parans.token, "Token não informado");
      existsOrError(parans.playlistsID, "PlaylistID não informado");
      existsOrError(parans.videoID, "videoID não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    axios
      .post(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
        {
          snippet: {
            playlistId: parans.playlistsID,
            resourceId: {
              kind: "youtube#video",
              videoId: parans.videoID,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parans.token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;

        console.log(data);
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(400).send("Erro ao buscar playlists");
      });
  };

  return {
    getPlayLists,
    getPlayListItems,
    addPlayList,
    SearchVideos,
    addItemsPlaylist,
  };
};
