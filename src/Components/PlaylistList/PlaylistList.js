import React from 'react';
import './PlaylistList.css';
import PlaylistsItem from '../PlaylistsItem/PlaylistsItem';
import Spotify from '../../util/Spotify';

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists : [],
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.removePlaylist = this.removePlaylist.bind(this);
    }

    componentDidMount() {
        Spotify.getUserPlaylists().then((playlists) => {
          this.setState({ playlists: playlists });
          //console.log(this.state.playlists);
        });
    }

    removePlaylist(playlistId) {
      Spotify.removePlaylist(playlistId);
      // targeting componentDidMount re-run
      let playlists = this.state.playlists;
      const playlistsUpdate = playlists.filter(playlist => playlist.playlistId !== playlistId);
      this.setState({playlists: playlistsUpdate});
    }
    
    render() {
      return (
        <div className="PlaylistList">
          <h2>Your Playlists</h2>
          {
            this.state.playlists.map((playlist, index) => {
            return (
              <PlaylistsItem
                key={index}
                playlistname={playlist.playlistName}
                playlistid={playlist.playlistId}
                deleteplaylist = {this.removePlaylist}
              />
            )})
          }
        </div>
      );
    } 
}

export default PlaylistList;