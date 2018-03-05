import React, { Component, Fragment } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import PropTypes from 'prop-types'


export class MediaItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.navigateToInstance(this.props.media.id);
  }

  getSubtitleText() {
    if (this.props.media.type === 0) {
      // TV Show
      return `TV Series • ${this.props.media.years} • ${this.props.media.seasons} Seasons`
    } else {
      return `Movie • ${this.props.media.years}`      
    }
  }

  render() {
    return (
      <Card className="mb-3" onClick={this.handleClick}>
        <CardImg top width="100%" src={this.props.media.img} alt="Card image cap" />
        <CardBody>
          <CardTitle className="text-left">{this.props.media.name ? this.props.media.name : this.props.media.title}</CardTitle>
          <CardSubtitle className="text-muted text-left">{this.getSubtitleText()}</CardSubtitle>
        </CardBody>
      </Card>
    );
  }
}

export class MediaHome extends Component {
  constructor(props) {
    super(props)
    this.navigateToInstance = this.navigateToInstance.bind(this);
  }

  navigateToInstance(id) {
    const { stateService } = this.props.transition.router;
    stateService.go('mediaInstance', { mediaID: id });
  }

  render() {
    return (
      <Fragment>
        <h2>Movies/TV Series</h2>
        <div className="row">
          {
            this.props.media.map((mediaItem) => {
              return (
                <div className="col-12 col-md-4 col-lg-3" style={{ cursor: 'pointer' }} key={mediaItem.id}>
                  <MediaItem media={mediaItem} navigateToInstance={this.navigateToInstance}/>
                </div>
              );
            })
          }
        </div>
      </Fragment>
    );
  }
}

MediaHome.propTypes = {
  resolves: PropTypes.shape({
    media: PropTypes.arrayOf(PropTypes.object)
  })
}