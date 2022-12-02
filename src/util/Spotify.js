
const clientId = process.env.REACT_APP_CLIENTID;
const redirectUri = process.env.REACT_APP_REDIRECTURI;
let accessToken ;
let userId;

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch ) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // this clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); 
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    getCurrentUserId() {
        if (userId) {
          return userId;
        }
    
        const accessToken = Spotify.getAccessToken();
    
        return fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            userId = jsonResponse.id;
            return userId;
          })
          .catch(function (err) {
            console.log("Fetch problem line 49: " + err.message);
          });
      },
    
      getUserPlaylists() {
        const accessToken = Spotify.getAccessToken();
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
    
        return Spotify.getCurrentUserId().then((response) => {
          userId = response;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: "GET",
          })
            .then((response) => response.json())
            .then((jsonResponse) => {
              if (!jsonResponse.items) {
                return [];
              }
              return jsonResponse.items.map((playlist) => ({
                playlistName: playlist.name,
                playlistId: playlist.id,
              }));
            });
        });
      },
      
    search(term) {
        // receive a promise that will resolve the list of tracks
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
            {headers: {
                Authorization: `Bearer ${accessToken}`
            }
         }).then(response => {
             return response.json();
         }).then(jsonResponse => {
             if(!jsonResponse.tracks) {
                 return [];
             }
             return jsonResponse.tracks.items.map(track => ({
                 id: track.id,
                 name: track.name,
                 artist: track.artists[0].name,
                 album: track.album.name,
                 uri: track.uri
             }));
         });

    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {  Authorization: `Bearer ${accessToken}` };
        let userId;
        
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ uris: trackUris})
                });
            });

        });
    },

    removePlaylist(playlistId) {
      const accessToken = Spotify.getAccessToken();
      const headers = {  Authorization: `Bearer ${accessToken}` };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, 
          {
            headers: headers,
            method: "DELETE",
          });
    },
};

 export default Spotify;
