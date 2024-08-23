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

  Spicetify.showNotification("Hello!");

  const { Type } = Spicetify.URI;

  // Checks if it's the uri of an artist, returns true if so
  function shouldDisplayContextMenu(uris) {
    if (uris.length > 1) return false;
    const uri = uris[0];
    const uriObj = Spicetify.URI.fromString(uri);
    if (uriObj.type === Spicetify.URI.Type.ARTIST) return true;
    return false;
  }

  //
  async function getArtistDiscography(uris) {
    const artistId = uris[0].split(":")[2];  // Extract the artist ID from the URI

    // Make a request to get the artist's albums
    const albumsResponse = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation`);
    const albums = albumsResponse.items;
    return albums;
  }

  // TODO: Add icon
  // Adds a button to the context menu of artist links
  const cntxMenuItem = new ContextMenu.Item("List all songs by plays",
    getArtistDiscography,
    shouldDisplayContextMenu
  ).register();








}

export default main;
