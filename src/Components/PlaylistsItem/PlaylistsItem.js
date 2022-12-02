import React from 'react';
import './PlaylistsItem.css';

class PlaylistsItem extends React.Component {
  constructor(props) {
    super(props);
    this.removeList = this.removeList.bind(this);
  }

  removeList() {
    this.props.deleteplaylist(this.props.playlistid);
  }
  render() {
    //console.log(this.props);
      return (
        <div className="PlaylistsItem">
          <div className="PlaylistItemName">
            <h3>{this.props.playlistname}</h3>  
          </div>
          <button className="Playlist-action" onClick={this.removeList}>-</button>
        </div>
      );
  }
  }

  export default PlaylistsItem;