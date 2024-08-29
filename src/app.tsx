async function main() {
  const { CosmosAsync, ContextMenu, URI } = Spicetify;
  if (!(CosmosAsync && URI)) {
    setTimeout(main, 300);
    return;
  }


  // Ensure all necessary APIs are ready
  while (!Spicetify?.showNotification || !Spicetify.ContextMenu || !Spicetify.URI) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }


  // Checks if it's the uri of an artist, returns true if so
  function shouldDisplayContextMenu(uris) {
    if (uris.length > 1) return false;
    const uri = uris[0];
    const uriObj = Spicetify.URI.fromString(uri);
    if (uriObj.type === Spicetify.URI.Type.ARTIST) return true;
    return false;
  }



  // TODO: replace with user's own market
  // maybe replace cycle condition with the 'next' property in response
  async function getArtistDiscography(artistUri) {
    const artistId = artistUri[0].split(":")[2];  // Extract the artist ID from the URI
    const limit = 50;  // Maximum limit of items per request
    let offset = 0;
    let totalAlbums = 0;
    const artistDiscography = [];

    do {
      const albumsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}/albums?market=PT&limit=${limit}&offset=${offset}&include_groups=album,single`);
      totalAlbums = albumsResponse.total;  // The total number of albums for the artist
      const albums = albumsResponse.items;

      for (const album of albums) {
        // Add the album data to the discography list
        artistDiscography.push(album);
      }

      // Move to the next set of albums
      offset += limit;

    } while (totalAlbums > offset);

    console.log(artistDiscography);

    return artistDiscography;
  }



  // TODO: Add icon
  // Adds a button to the context menu of artist links
  const cntxMenuItem = new ContextMenu.Item("List all songs by plays",
    getArtistDiscography,
    shouldDisplayContextMenu
  ).register();


}


export default main;
