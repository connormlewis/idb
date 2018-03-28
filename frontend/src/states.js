import React from 'react'
import { UIView } from '@uirouter/react'
import Splash from './components/Splash';
import About from './components/About';
import ErrorPage from './components/Error';

import { MediaHome } from './components/home-pages/MediaHome'
import { AlbumHome } from './components/home-pages/AlbumsHome';
import { ArtistHome } from './components/home-pages/ArtistsHome';
import ApiService from './ApiService'
import { AlbumInstance } from './components/instance-pages/AlbumInstance'; 
import { MediaInstance } from './components/instance-pages/MediaInstance'; 
import { ArtistInstance } from './components/instance-pages/ArtistInstance';

const HOME = {
  name: 'home',
  url: '/',
  component: (Splash)
};

const ERROR = {
  name: 'error',
  component: ErrorPage,
  params: {
    code: null
  }
}

const ABOUT = {
  name: 'about',
  url: '/about',
  component: (About),
  resolve: [{
    token: 'about',
    resolveFn: () => ApiService.getAbout()
  }]
};

const ALBUM_ABSTRACT = {
  name: 'album',
  component: () => <UIView/>,
  redirectTo: 'album.home',
  url: '/album'
}

const ARTIST_ABSTRACT = {
  name: 'artist',
  component: () => <UIView/>,
  redirectTo: 'artist.home',
  url: '/artist'
}

const MEDIA_ABSTRACT = {
  name: 'media',
  component: () => <UIView/>,
  redirectTo: 'media.home',
  url: '/media'
}

const ALBUM_HOME = {
  name: 'album.home',
  url: '',
  component: AlbumHome,
  params: {
    offset: 0,
    limit: 12
  },
  resolve: [{
    token: 'albums',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getAlbums(trans.params().offset, trans.params().limit)
  }]
};

const ARTIST_HOME = {
  name: 'artist.home',
  url: '',
  component: ArtistHome,
  params: {
    offset: 0,
    limit: 12
  },
  resolve: [{
    token: 'artists',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getArtists(trans.params().offset, trans.params().limit)
  }]
};

const MEDIA_HOME = {
  name: 'media.home',
  url: '',
  component: MediaHome,
  params: {
    offset: 0,
    limit: 12
  },
  resolve: [{
    token: 'media',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getAllMedia(trans.params().offset, trans.params().limit)
  }]
};

const ALBUM_INSTANCE = {
  name: 'album.instance',
  url: '/:albumID',
  component: AlbumInstance,
  resolve: [{
    token: 'album',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getAlbum(trans.params().albumID)
  }]
};

const ARTIST_INSTANCE = {
  name: 'artist.instance',
  url: '/:artistID',
  component: ArtistInstance,
  resolve: [{
    token: 'artist',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getArtist(trans.params().artistID)
  }]
};

const MEDIA_INSTANCE = {
  name: 'media.instance',
  url: '/:mediaID',
  component: MediaInstance,
  resolve: [{
    token: 'media',
    deps: ['$transition$'],
    resolveFn: (trans) => ApiService.getMedia(trans.params().mediaID)
  }]
};

export default [HOME, ABOUT, ALBUM_ABSTRACT, ARTIST_ABSTRACT, MEDIA_ABSTRACT, ALBUM_HOME, ARTIST_HOME, MEDIA_HOME, ALBUM_INSTANCE, ARTIST_INSTANCE, MEDIA_INSTANCE, ERROR]; 
