import React, { Component } from 'react'
import Slider from 'react-slick'
// eslint-disable-next-line
import styles from '../../style/Slider.css'
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap';

const titleStyles = {
  'overflow': 'hidden',
  'textOverflow': 'ellipsis',
  'display': '-webkit-box',
  'WebkitBoxOrient': 'vertical',
  'WebkitLineClamp': 2, /* number of lines to show */
  'lineHeight': '1.2',        /* fallback */
  'maxHeight': '2.4'       /* fallback */
}

export class ArtistItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.navigateToInstance(this.props.artist.id);
  }

  render() {
    return (
      <Card className="sm-3" onClick={this.handleClick}>
        <CardImg top src={this.props.artist.image} alt="Card image cap"/>
        <CardBody>
          <CardTitle className="text-left" style={titleStyles}>{this.props.artist.name}</CardTitle>
        </CardBody>
      </Card>
    );
  }
}


export class RelatedArtists extends Component {
  componentWillReceiveProps(){
   this.refs.slick.innerSlider.onWindowResized()
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: Math.min(this.props.artists.length, 4),
      slidesToScroll: Math.min(this.props.artists.length, 4),
      adaptiveHeight: true,
      lazyload: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            adaptiveHeight: true,
            infinite: true,
            dots: true,
            lazyload: true,
            swipe: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            adaptiveHeight: true,
            lazyload: true,
            swipe: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            lazyload: true,
            dots: false,
            swipe: true
          }
        }
      ]
    };

    return (
      <div>
      <h2 className='related-header'> Artists </h2>
        <div className='slider-parent'>
          <Slider ref='slick' {...settings}>
          {
            this.props.artists.map((artist) => {
              return (
                <div className='slide-item' key={artist.id}>
                  <ArtistItem artist={artist} navigateToInstance={this.props.navigateToInstance}/>
                </div>
              )
            })
          }
          </Slider>
        </div>
      </div>
    );
  }
}