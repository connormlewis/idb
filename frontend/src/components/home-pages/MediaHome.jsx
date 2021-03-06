import React, { Component, Fragment } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import PropTypes from 'prop-types'
import SDBPagination from "./../Pagination";
import SearchBar from './../SearchBar'
import { MediaForm } from './forms/MediaForm'; 
import "../../style/Home.css";


export class MediaItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.navigateToInstance(this.props.media.id);
  }

  getTVYears() {
    let first = this.props.media.release_date.substring(0,4);
    let last = '';
    if (this.props.media.running === true) {
      last = 'Present';
    }
    else {
      last = this.props.media.last_aired;
    }

    let years = '';
    if (first === last) {
      years = first;
    }
    else {
      years = first + ' - ' + last;
    }

    return years;
  }

  getSubtitleText() {
    if (this.props.media.type === 0) {
      // TV Show
      return `TV Series • ${this.getTVYears()} • ${this.props.media.seasons} Seasons`
    } else {
      return `Movie • ${this.props.media.release_date.substring(0,4)}`
    }
  }

  render() {
    return (
      <Card className="mb-3" onClick={this.handleClick}>
        <CardImg top width="100%" src={this.props.media.image} alt="Card image cap" />
        <CardBody>
          <CardTitle className="text-left">{this.props.media.name}</CardTitle>
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
    this.stateService = this.props.transition.router.stateService;
    this.state = {
      field: 'name',
      direction: 'asc'
    }
  }

  navigateToInstance(id) {
    this.stateService.go('^.instance', { mediaID: id });
  }

  search(searchTerm) {
    this.stateService.go('^.home', { limit: 12, offset: 0, searchTerm: searchTerm });
  }

  clearSearch() {
    this.stateService.go('^.home', { limit: 12, offset: 0, searchTerm: null });
  }

  orderChange() {
    this.stateService.go('^.home', { limit: 12, offset: 0, orderBy: { field: this.state.field, direction: this.state.direction}})
  }

  orderFieldChange(e) {
    this.setState({
      field: e.target.value
    }, () => {
      this.orderChange();
    });
    console.debug(this.state)
  }

  orderDirectionChange(dir) {
    this.setState({
      direction: dir
    }, () => {
      this.orderChange();
    });
  }

  render() {
    this.params = this.props.transition.params()
    this.totalPages = Math.ceil(this.props.media.count / this.params.limit);
    this.currentPage = this.params.offset / this.params.limit;

    return (
      <Fragment>
        <div className="clearfix">
          <h2 className="float-left">Media{this.params.searchTerm === null || this.params.searchTerm === "" ? "" : <span> – searching for "{this.params.searchTerm}"</span>}</h2>
          {
            this.params.searchTerm === null || this.params.searchTerm === "" ? null :
              <div className="float-right">
                <button className="btn btn-link" type="button" onClick={() => this.clearSearch()}><i className="fas fa-times-circle"></i> Clear</button>
              </div>
          }
          <div className="float-right">
            <SearchBar placeholder="Search Media" value={this.params.searchTerm} onSubmit={(searchTerm) => this.search(searchTerm)} />
          </div>
          <div className="float-right form-inline mr-2">
            <Button style={{backgroundColor: "#1d2951"}} className="mr-2" onClick={() => {this.form.toggle() }}>Filter</Button>
          
            <label className="mr-2">Order by:</label>
            <select name="" className="form-control mr-2" onChange={(e) => this.orderFieldChange(e)}>
              <option value="name">Name</option>
              <option value="release_date">Year</option>
              <option value="popularity">Popularity</option>
              <option value="runtime">Runtime</option>
              <option value="seasons">Seasons</option>
              <option value="average_rating">Average Rating</option>
            </select>

            <div className="btn-group">
              <button className={"btn " + (this.state.direction === 'asc' ? 'btn-primary' : 'btn-outline-primary')} onClick={() => { this.orderDirectionChange('asc') }}>Asc</button>
              <button className={"btn " + (this.state.direction === 'desc' ? 'btn-primary' : 'btn-outline-primary')} onClick={() => { this.orderDirectionChange('desc') }}>Desc</button>
            </div>
          </div>
        </div>
        <div className="row">
          <MediaForm transition={this.props.transition} genres={this.props.genres} ref={(instance) => {this.form = instance}}/>
        </div>

        {
          this.props.media.count === 0 ?
            <div className="text-center my-4">No matching media were found</div>
            :
            <div className="row">
              {
                this.props.media.items.map((mediaItem) => {
                  return (
                    <div className="col-12 col-md-4 col-lg-3" style={{ cursor: 'pointer' }} key={mediaItem.id}>
                      <MediaItem media={mediaItem} navigateToInstance={this.navigateToInstance} />
                    </div>
                  );
                })
              }
            </div>
        }
        <SDBPagination offset={this.params.offset} limit={this.params.limit} total={this.props.media.count} state="^.home" />
      </Fragment>
    );
  }
}

MediaHome.propTypes = {
  resolves: PropTypes.shape({
    media: PropTypes.arrayOf(PropTypes.object),
    genres: PropTypes.objectOf(PropTypes.object)
  })
}