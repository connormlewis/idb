import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import App from './src/components/App';
import Navigation from './src/components/Navigation';
import { AlbumHome, AlbumItem } from './src/components/home-pages/AlbumsHome'
import { ArtistHome, ArtistItem } from './src/components/home-pages/ArtistsHome'
import { MediaHome, MediaItem } from './src/components/home-pages/MediaHome'
import { UIRouter } from '@uirouter/react';
import Splash from './src/components/Splash';
import { MediaInstance } from './src/components/instance-pages/MediaInstance';
import { ArtistInstance } from './src/components/instance-pages/ArtistInstance';
import { AlbumInstance } from './src/components/instance-pages/AlbumInstance';
import * as sinon from 'sinon';

const ALBUMS_JSON = {
    items: [{
            "genres": [],
            "id": 91,
            "image": "https://i.scdn.co/image/8384d7572ca98a5158aa8132187b83d5cda8e01c",
            "label": "Studiocanal",
            "name": "African Safari 3D (Ben Stassen's Original Motion Picture Soundtrack)",
            "release_date": "2014-04-14",
            "spotify_uri": "spotify:album:76VCN1e85g0d7p18Nyt60C",
            "track_count": 15
        },
        {
            "genres": [],
            "id": 367,
            "image": "https://i.scdn.co/image/bab5fb09923ec397845c97e2d2f118a46bf6943a",
            "label": "Sony Classical",
            "name": "After Earth",
            "release_date": "2013-05-24",
            "spotify_uri": "spotify:album:4HZ3KQvXte5re72F65ssv3",
            "track_count": 28
        },
        {
            "genres": [],
            "id": 163,
            "image": "https://i.scdn.co/image/0136f508e01f4d877a465034c507e8219ea113e4",
            "label": "Warner Bros.",
            "name": "A.I. (Music from the Motion Picture)",
            "release_date": "2001-07-03",
            "spotify_uri": "spotify:album:5yKkKXvX1X0finFqR3JAKL",
            "track_count": 13
        }
    ],
    count: 3
}

const ARTISTS_JSON = {
    items: [{
            "bio": null,
            "followers": 5078,
            "id": 3,
            "image": "https://i.scdn.co/image/9423845d6e0c2ae2e4ff4d6aebea661add9854a7",
            "name": "BBC National Orchestra Of Wales",
            "spotify_uri": "spotify:artist:1fhEh9FpKs42GFeqerlBUf"
        },
        {
            "bio": null,
            "followers": 2945,
            "id": 4,
            "image": "https://i.scdn.co/image/783b2dc30678e4e96152df9a5ac2102d4bc0449c",
            "name": "Ben Foster",
            "spotify_uri": "spotify:artist:6Gp8BbKAqPO3R0UAYkm8J0"
        },
        {
            "bio": null,
            "followers": 11041,
            "id": 1,
            "image": "https://i.scdn.co/image/86193f7ba3136d145915a9afb477626ed1c9f40a",
            "name": "Blake Neely",
            "spotify_uri": "spotify:artist:4UOzqO0jZUrTiTunfBw4tp"
        }
    ],
    count: 3
}

const MEDIAS_JSON = {
    "items": [{
            "albums": [
                "Riverdale: Original Television Score (Season 1)"
            ],
            "artists": [
                "Blake Neely"
            ],
            "cast": [
                "Marisol Nichols",
                "M\u00e4dchen Amick",
                "K.J. Apa",
                "Cole Sprouse",
                "Camila Mendes",
                "Lili Reinhart",
                "Madelaine Petsch",
                "Ashleigh Murray",
                "Luke Perry",
                "Casey Cott",
                "Charles Melton"
            ],
            "description": "Set in the present, the series offers a bold, subversive take on Archie, Betty, Veronica and their friends, exploring the surreality of small-town life, the darkness and weirdness bubbling beneath Riverdale\u2019s wholesome facade.",
            "genres": [
                "Drama",
                "Mystery"
            ],
            "id": "riverdale",
            "img": "http://image.tmdb.org/t/p/w500//1TsbOTztAJtzTRXAhoLsX9a83XX.jpg",
            "name": "Riverdale",
            "seasons": 2,
            "type": 0,
            "years": "2017"
        },
        {
            "albums": [
                "Interstellar: Original Motion Picture Soundtrack (Deluxe Digital Version)"
            ],
            "artists": [
                "Hans Zimmer"
            ],
            "cast": [
                "Matthew McConaughey",
                "Jessica Chastain",
                "Anne Hathaway",
                "Michael Caine",
                "Casey Affleck",
                "Mackenzie Foy",
                "Timoth\u00e9e Chalamet",
                "Bill Irwin",
                "Matt Damon",
                "Ellen Burstyn",
                "John Lithgow",
                "Wes Bentley",
                "Topher Grace",
                "David Oyelowo",
                "David Gyasi",
                "William Devane",
                "Josh Stewart",
                "Collette Wolfe",
                "Leah Cairns",
                "Russ Fega",
                "Lena Georgas",
                "Jeff Hephner",
                "Elyes Gabel",
                "Brooke Smith",
                "Liam Dickinson",
                "Francis X. McCarthy",
                "Andrew Borba",
                "Flora Nolan",
                "William Patrick Brown",
                "Cici Leah Campbell",
                "Kristian Van der Heyden",
                "Mark Casimir Dyniewicz",
                "Joseph Oliveira",
                "Ryan Irving",
                "Alexander Michael Helisek",
                "Benjamin Hardy"
            ],
            "description": "Interstellar chronicles the adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            "genres": [
                "Adventure",
                "Drama",
                "Science Fiction"
            ],
            "id": "interstellar",
            "img": "http://image.tmdb.org/t/p/w500//nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg",
            "name": "Interstellar",
            "seasons": 0,
            "type": 1,
            "years": "2014"
        },
        {
            "albums": [
                "E.T. The Extra-Terrestrial (Music From The Original Motion Picture Soundtrack)"
            ],
            "artists": [
                "John Williams"
            ],
            "cast": [
                "Henry Thomas",
                "Drew Barrymore",
                "Robert MacNaughton",
                "Dee Wallace",
                "Peter Coyote",
                "Erika Eleniak",
                "Sean Frye",
                "C. Thomas Howell",
                "K. C. Martel",
                "David M. O'Dell",
                "Richard Swingler",
                "Frank Toth",
                "Pat Welsh"
            ],
            "description": "After a gentle alien becomes stranded on Earth, the being is discovered and befriended by a young boy named Elliott. Bringing the extraterrestrial into his suburban California house, Elliott introduces E.T., as the alien is dubbed, to his brother and his little sister, Gertie, and the children decide to keep its existence a secret. Soon, however, E.T. falls ill, resulting in government intervention and a dire situation for both Elliott and the alien.",
            "genres": [
                "Science Fiction",
                "Adventure",
                "Family",
                "Fantasy"
            ],
            "id": "e_t",
            "img": "http://image.tmdb.org/t/p/w500//8htLKK03TJjKZOXJgihZCu8v0P.jpg",
            "name": "E.T. the Extra-Terrestrial",
            "seasons": 0,
            "type": 1,
            "years": "1982"
        }
    ],
    "count": 3
}

const RIVERDALE_JSON = {
    "albums": [
        "riverdale",
        "Riverdale: Original Television Score (Season 1)"
    ],
    "artists": [
        "blake_neely",
        "Blake Neely"
    ],
    "backdrops": [
        "http://image.tmdb.org/t/p/w500//2IUpoKSP64r6rp2vBo0Fdk8a1UU.jpg",
        "http://image.tmdb.org/t/p/w500//a3G7FsQNfo9mrnZtXN3yaDQhAgz.jpg",
        "http://image.tmdb.org/t/p/w500//2BdeV1gjkWMTFEldekbqFI5qU5n.jpg",
        "http://image.tmdb.org/t/p/w500//h26n2RPVeoTIEdv96jbxCQKSqaW.jpg",
        "http://image.tmdb.org/t/p/w500//gS91Amt1arLnP21Pi3nm4ObFF4Y.jpg",
        "http://image.tmdb.org/t/p/w500//4IeZIgxxeRJdgAYMd0Frc7alKcJ.jpg",
        "http://image.tmdb.org/t/p/w500//aNKIbzLftZ14NnZJVZTQHL332Ho.jpg",
        "http://image.tmdb.org/t/p/w500//sEqHXTDUr3W6oNFFIgR5re8UQxZ.jpg",
        "http://image.tmdb.org/t/p/w500//biY4RGFlVQXnHlfrX7DfC6ekJvE.jpg",
        "http://image.tmdb.org/t/p/w500//tOOjl0thkVYfcwVLz2up602NQo8.jpg",
        "http://image.tmdb.org/t/p/w500//dmwqioFelVSmLrZ894ONBX9iaxz.jpg"
    ],
    "cast": [
        "Marisol Nichols",
        "Mädchen Amick",
        "K.J. Apa",
        "Cole Sprouse",
        "Camila Mendes",
        "Lili Reinhart",
        "Madelaine Petsch",
        "Ashleigh Murray",
        "Luke Perry",
        "Casey Cott",
        "Charles Melton"
    ],
    "genres": [
        "Drama",
        "Mystery"
    ],
    "id": "riverdale",
    "name": "Riverdale",
    "overview": "Set in the present, the series offers a bold, subversive take on Archie, Betty, Veronica and their friends, exploring the surreality of small-town life, the darkness and weirdness bubbling beneath Riverdale’s wholesome facade.",
    "poster": "http://image.tmdb.org/t/p/w500//1TsbOTztAJtzTRXAhoLsX9a83XX.jpg",
    "running": true,
    "seasons": 2,
    "type": "show",
    "video": {
        "id": "5892ead89251416ee300269d",
        "iso_3166_1": "US",
        "iso_639_1": "en",
        "key": "9XmFTADupMc",
        "name": "Riverdale (The CW) Trailer HD",
        "site": "YouTube",
        "size": 720,
        "type": "Trailer"
    },
    "years": [
        2017,
        2018
    ]
}
const INTERSTELLAR_JSON = {
    "albums": [
        "interstellar",
        "Interstellar: Original Motion Picture Soundtrack (Deluxe Digital Version)"
    ],
    "artists": [
        "hans_zimmer",
        "Hans Zimmer"
    ],
    "backdrops": [
        "http://image.tmdb.org/t/p/w500//xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
        "http://image.tmdb.org/t/p/w500//gq4Z1pfOWHn3FKFNutlDCySps9C.jpg",
        "http://image.tmdb.org/t/p/w500//y4ODodoKWWm7KODB6WgPDHv6Bzd.jpg",
        "http://image.tmdb.org/t/p/w500//o4BjoraqJLfuRZBhiFXSgRZDUyu.jpg",
        "http://image.tmdb.org/t/p/w500//xW3MLq7t8gynEiFj3E4YP7KQoqw.jpg",
        "http://image.tmdb.org/t/p/w500//vFJ31Mp68hwtlB4opsAP29gFqhr.jpg",
        "http://image.tmdb.org/t/p/w500//sn8LEtCXquQJYEVygbW8YUfumwW.jpg",
        "http://image.tmdb.org/t/p/w500//walWq52PP2IGRc98VkPG7Wp77lK.jpg",
        "http://image.tmdb.org/t/p/w500//6MDzVm9h6wEGAbvjihdFU83Q5Wo.jpg",
        "http://image.tmdb.org/t/p/w500//3mPXGfKcsYIEhl4et2WTSX0llVh.jpg",
        "http://image.tmdb.org/t/p/w500//tAkBC4X2Rp3QtV7rzqTv8DU3fTA.jpg",
        "http://image.tmdb.org/t/p/w500//tn9JffYteR9LSGWx2FC8T1uO403.jpg",
        "http://image.tmdb.org/t/p/w500//5cgKuGbnGPzh5YRZcqK8kZGnjl7.jpg",
        "http://image.tmdb.org/t/p/w500//nYtBxRwoQTfzSDmAB3l7TIdPLpY.jpg",
        "http://image.tmdb.org/t/p/w500//bbyI73zXfC8cxkT8xCimyttZrRA.jpg",
        "http://image.tmdb.org/t/p/w500//rN9Vjna7lnS9jcrSMNvYQEWCRlK.jpg",
        "http://image.tmdb.org/t/p/w500//s4fd4EfqBFYMbZmIdhNdCLwFrhO.jpg",
        "http://image.tmdb.org/t/p/w500//aivK6Z2naJsHz5EJFweLP2G7hS.jpg",
        "http://image.tmdb.org/t/p/w500//oAmkQmTUZ8bkyVbch56TrKHzmuu.jpg",
        "http://image.tmdb.org/t/p/w500//8CQeAuMbR7pFlvZlgV7Oac3ZbDH.jpg",
        "http://image.tmdb.org/t/p/w500//cwcibDD8VeZ34SNWTJazEeBho1s.jpg",
        "http://image.tmdb.org/t/p/w500//9Bnh8RkPpPoo3ftLyDrDPDTMK8p.jpg",
        "http://image.tmdb.org/t/p/w500//gvldej73NLKaC4j7sCldj1sTjjD.jpg",
        "http://image.tmdb.org/t/p/w500//5EV88Qt5oDRbnj9F9osFrg3Yd55.jpg",
        "http://image.tmdb.org/t/p/w500//bUSsMnf8K9wug5aJ8P6jpZT25MV.jpg",
        "http://image.tmdb.org/t/p/w500//fAAwITtgyzwEy6YstNPxnQ00d6z.jpg",
        "http://image.tmdb.org/t/p/w500//zX1SB9uuQaJJw2kjZszNHx5PqwI.jpg",
        "http://image.tmdb.org/t/p/w500//zWyDer0uZdwFnOfthdJvy4qykZm.jpg",
        "http://image.tmdb.org/t/p/w500//pwRzDssAENT121YkSvfR2uSEfh7.jpg",
        "http://image.tmdb.org/t/p/w500//b3htE2IM0XvupfVg8IKfb2KcKzw.jpg"
    ],
    "cast": [
        "Matthew McConaughey",
        "Jessica Chastain",
        "Anne Hathaway",
        "Michael Caine",
        "Casey Affleck",
        "Mackenzie Foy",
        "Timothée Chalamet",
        "Bill Irwin",
        "Matt Damon",
        "Ellen Burstyn",
        "John Lithgow",
        "Wes Bentley",
        "Topher Grace",
        "David Oyelowo",
        "David Gyasi",
        "William Devane",
        "Josh Stewart",
        "Collette Wolfe",
        "Leah Cairns",
        "Russ Fega",
        "Lena Georgas",
        "Jeff Hephner",
        "Elyes Gabel",
        "Brooke Smith",
        "Liam Dickinson",
        "Francis X. McCarthy",
        "Andrew Borba",
        "Flora Nolan",
        "William Patrick Brown",
        "Cici Leah Campbell",
        "Kristian Van der Heyden",
        "Mark Casimir Dyniewicz",
        "Joseph Oliveira",
        "Ryan Irving",
        "Alexander Michael Helisek",
        "Benjamin Hardy"
    ],
    "genres": [
        "Adventure",
        "Drama",
        "Science Fiction"
    ],
    "id": "interstellar",
    "name": "Interstellar",
    "overview": "Interstellar chronicles the adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "poster": "http://image.tmdb.org/t/p/w500//nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg",
    "running": "None",
    "season": "None",
    "type": "movie",
    "video": {
        "id": "57817b1a9251417b8e000a8c",
        "iso_3166_1": "US",
        "iso_639_1": "en",
        "key": "ePbKGoIGAXY",
        "name": "Official UK Trailer #3",
        "site": "YouTube",
        "size": 1080,
        "type": "Trailer"
    },
    "years": "2014"
}

const ARTIST_JSON = {
    "albums": [{
            "genres": [],
            "id": 3,
            "image": "https://i.scdn.co/image/b451ccbd089ebf6b4313542bc1a7ff93fc798282",
            "label": "WaterTower Music",
            "name": "Supergirl: Season 2 (Original Television Soundtrack)",
            "release_date": "2017-10-10",
            "spotify_uri": "spotify:album:3oNGhMbhGbmfZKM82Mr2IB",
            "track_count": 31
        },
        {
            "genres": [],
            "id": 4,
            "image": "https://i.scdn.co/image/2bccf0a34bcf3ec963e0dd976a1476112ba73d96",
            "label": "WaterTower Music",
            "name": "The Flash: Season 3 (Original Television Soundtrack)",
            "release_date": "2017-10-10",
            "spotify_uri": "spotify:album:1XyIezVpRDp3bcoC3yY0vV",
            "track_count": 27
        },
        {
            "genres": [],
            "id": 5,
            "image": "https://i.scdn.co/image/6d6058dda979cc24276aaab650befd5dd963e390",
            "label": "WaterTower Music",
            "name": "Riverdale: Original Television Score (Season 1)",
            "release_date": "2017-07-18",
            "spotify_uri": "spotify:album:4BYS4x13edZ1f3H1j1nyv0",
            "track_count": 25
        },
        {
            "genres": [],
            "id": 6,
            "image": "https://i.scdn.co/image/61f3cfbf8f120e5a5f863befcf620ec7cedb2adc",
            "label": "WaterTower Music",
            "name": "Arrow: Season 4 (Original Television Soundtrack)",
            "release_date": "2016-09-30",
            "spotify_uri": "spotify:album:02yYoKLRT12CDac75iQfnK",
            "track_count": 23
        },
        {
            "genres": [],
            "id": 7,
            "image": "https://i.scdn.co/image/e7bec170fd52f3833322006f033820a54be105e0",
            "label": "WaterTower Music",
            "name": "DC's Legends of Tomorrow: Original Television Soundtrack Season 1",
            "release_date": "2016-09-02",
            "spotify_uri": "spotify:album:4zBkqrte6rhmV7taw4toJ7",
            "track_count": 27
        },
        {
            "genres": [],
            "id": 8,
            "image": "https://i.scdn.co/image/c6a3688dbc772cc4500bfafba062c0fda83009a4",
            "label": "WaterTower Music",
            "name": "Blindspot: Original Television Soundtrack - Season 1",
            "release_date": "2016-09-01",
            "spotify_uri": "spotify:album:2VWBaqlZALGDy0DvE3F573",
            "track_count": 24
        },
        {
            "genres": [],
            "id": 9,
            "image": "https://i.scdn.co/image/58c0a1ad09c9ad5b398e74c0b555e5176c80ff1f",
            "label": "Cow on the Wall Records",
            "name": "Serena (Original Motion Picture Score)",
            "release_date": "2016-09-01",
            "spotify_uri": "spotify:album:0MVA7lhCc2XmeK6N5wB4C0",
            "track_count": 18
        },
        {
            "genres": [],
            "id": 10,
            "image": "https://i.scdn.co/image/c870d7f037da7b62be93c2d28835f1d7f017d6c0",
            "label": "WaterTower Music",
            "name": "Supergirl: Season 1 (Original Television Soundtrack)",
            "release_date": "2016-07-22",
            "spotify_uri": "spotify:album:0USwmo4Xa53TCzyFLfRk0r",
            "track_count": 29
        },
        {
            "genres": [],
            "id": 11,
            "image": "https://i.scdn.co/image/01c13c9de3a26f06cd7b550940f732577c87d52f",
            "label": "WaterTower Music",
            "name": "The Flash: Season 2 (Original Television Soundtrack)",
            "release_date": "2016-07-22",
            "spotify_uri": "spotify:album:7meQzMRPSm9YdrCfAsAUn2",
            "track_count": 26
        },
        {
            "genres": [],
            "id": 12,
            "image": "https://i.scdn.co/image/b58f4f8cdd641a14f1fe76264048706fdf06aca5",
            "label": "WaterTower Music",
            "name": "Arrow: Original Television Soundtrack: Season 3",
            "release_date": "2015-11-13",
            "spotify_uri": "spotify:album:7a4lPbz7dR64XUSmTym3Uf",
            "track_count": 27
        },
        {
            "genres": [],
            "id": 13,
            "image": "https://i.scdn.co/image/c7348c68144a4875c1a2b05894ffd6310be2a31e",
            "label": "WaterTower Music",
            "name": "The Flash: Original Television Soundtrack: Season 1",
            "release_date": "2015-11-13",
            "spotify_uri": "spotify:album:3NPOkq0nIMjz3tzYwL7Ypz",
            "track_count": 29
        },
        {
            "genres": [],
            "id": 14,
            "image": "https://i.scdn.co/image/3e8d508c1defe3aaf1613a6e142c633738e4e0f7",
            "label": "BSX Records, Inc.",
            "name": "The Wedding Date: The Reception Edition",
            "release_date": "2015-03-10",
            "spotify_uri": "spotify:album:7tkVltPRh6Pb98VlJMTXV6",
            "track_count": 26
        },
        {
            "genres": [],
            "id": 15,
            "image": "https://i.scdn.co/image/73630badbcda5cbb678063a1e5f04277aa4ec099",
            "label": "WaterTower Music",
            "name": "The Flash Vs. Arrow: Music Selections from the Epic 2-Night Event",
            "release_date": "2014-12-18",
            "spotify_uri": "spotify:album:4AtHQFEn8Qrp9aSSt0ehob",
            "track_count": 21
        },
        {
            "genres": [],
            "id": 16,
            "image": "https://i.scdn.co/image/8003fe0bf609eccb0fef3da9bb49e1bf554144a1",
            "label": "WaterTower Music",
            "name": "Arrow: Season 2 (Original Television Soundtrack)",
            "release_date": "2014-09-16",
            "spotify_uri": "spotify:album:4IEIdtYbkMZfpEHtrpPtDl",
            "track_count": 27
        },
        {
            "genres": [],
            "id": 17,
            "image": "https://i.scdn.co/image/afa75606a8fff48b42c0d97a2b6927779624f199",
            "label": "Cow On the Wall Records",
            "name": "The Case Against 8 (Original Motion Picture Soundtrack)",
            "release_date": "2014-06-10",
            "spotify_uri": "spotify:album:74lKVYehXprgb7Ad6nns4H",
            "track_count": 27
        },
        {
            "genres": [],
            "id": 18,
            "image": "https://i.scdn.co/image/e2ccda31fd80edd494398583d43725a1ee21453a",
            "label": "WaterTower Music",
            "name": "Arrow - Original Television Soundtrack: Season 1",
            "release_date": "2013-09-17",
            "spotify_uri": "spotify:album:5xBs2ZzaUDFos06TZDBaFj",
            "track_count": 29
        },
        {
            "genres": [],
            "id": 19,
            "image": "https://i.scdn.co/image/6a1a2df3012d73441f9dfeb026b86c817c202d2e",
            "label": "Cow On the Wall",
            "name": "Space Shuttle Columbia: Mission of Hope",
            "release_date": "2011-05-04",
            "spotify_uri": "spotify:album:448UwJvXAZdmRs9rUKwaS7",
            "track_count": 20
        },
        {
            "genres": [],
            "id": 20,
            "image": "https://i.scdn.co/image/0b24a0b74fbb032be057b5c1a7c6562df10113b5",
            "label": "Rhino",
            "name": "The Pacific (Music From the HBO Miniseries)",
            "release_date": "2010-03-09",
            "spotify_uri": "spotify:album:0NH1WrtzRBlZS1VJX2XnXr",
            "track_count": 25
        },
        {
            "genres": [],
            "id": 1,
            "image": "https://i.scdn.co/image/1d79588665ab0de13bc9c63824dfab224887edcb",
            "label": "WaterTower Music",
            "name": "Arrow: Season 5 (Original Television Soundtrack)",
            "release_date": "2017-10-10",
            "spotify_uri": "spotify:album:7HGVNH3GB3hiLicK1XGzrm",
            "track_count": 29
        },
        {
            "genres": [],
            "id": 2,
            "image": "https://i.scdn.co/image/9a36bad6172d9f8fbafdf89fed9b47d754ecdaa2",
            "label": "WaterTower Music",
            "name": "DC's Legends of Tomorrow: Season 2 (Original Television Soundtrack)",
            "release_date": "2017-10-10",
            "spotify_uri": "spotify:album:42Y4a94NyZJB3v9Va3rNtv",
            "track_count": 30
        }
    ],
    "bio": null,
    "followers": 11041,
    "id": 1,
    "image": "https://i.scdn.co/image/86193f7ba3136d145915a9afb477626ed1c9f40a",
    "media": [],
    "name": "Blake Neely",
    "spotify_uri": "spotify:artist:4UOzqO0jZUrTiTunfBw4tp"
}

const ALBUM_JSON = {
    "artists": [{
        "bio": null,
        "followers": 570227,
        "id": 11,
        "image": "https://i.scdn.co/image/bde64350466df4aa41efb9b8b766deef6c46fd08",
        "name": "John Williams",
        "spotify_uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
    }],
    "genres": [],
    "id": 163,
    "image": "https://i.scdn.co/image/0136f508e01f4d877a465034c507e8219ea113e4",
    "label": "Warner Bros.",
    "media": [],
    "name": "A.I. (Music from the Motion Picture)",
    "release_date": "2001-07-03",
    "spotify_uri": "spotify:album:5yKkKXvX1X0finFqR3JAKL",
    "track_count": 13,
    "tracks": [{
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 383853,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/4yYuLtrhx5UN5Rhmh8VQNS"
            },
            "href": "https://api.spotify.com/v1/tracks/4yYuLtrhx5UN5Rhmh8VQNS",
            "id": "4yYuLtrhx5UN5Rhmh8VQNS",
            "name": "The Mecha World",
            "preview_url": "https://p.scdn.co/mp3-preview/5627d61ea86d5624e44b0bd28e98d6b61f6078dd?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 1,
            "type": "track",
            "uri": "spotify:track:4yYuLtrhx5UN5Rhmh8VQNS"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 187586,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/6EwYraRH73K446A0ee2NQq"
            },
            "href": "https://api.spotify.com/v1/tracks/6EwYraRH73K446A0ee2NQq",
            "id": "6EwYraRH73K446A0ee2NQq",
            "name": "Abandoned In the Woods",
            "preview_url": "https://p.scdn.co/mp3-preview/f252f594ddc9fd3c01e910cff5e3bea68debf242?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 2,
            "type": "track",
            "uri": "spotify:track:6EwYraRH73K446A0ee2NQq"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 357720,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/2PH9MDBaKLOdq0dExSPsWE"
            },
            "href": "https://api.spotify.com/v1/tracks/2PH9MDBaKLOdq0dExSPsWE",
            "id": "2PH9MDBaKLOdq0dExSPsWE",
            "name": "Replicas",
            "preview_url": "https://p.scdn.co/mp3-preview/b30329cf0f12b6b888f8251796ea8a10ddb1f2b8?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 3,
            "type": "track",
            "uri": "spotify:track:2PH9MDBaKLOdq0dExSPsWE"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 188426,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/1vOPIyKWxzHc3H5c6EfaDT"
            },
            "href": "https://api.spotify.com/v1/tracks/1vOPIyKWxzHc3H5c6EfaDT",
            "id": "1vOPIyKWxzHc3H5c6EfaDT",
            "name": "Hide and Seek",
            "preview_url": "https://p.scdn.co/mp3-preview/a1a14b7f92e973de1959bdbc23fa57d2ebf62280?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 4,
            "type": "track",
            "uri": "spotify:track:1vOPIyKWxzHc3H5c6EfaDT"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7ocwZINHqO9DZJgFtc1B20"
                },
                "href": "https://api.spotify.com/v1/artists/7ocwZINHqO9DZJgFtc1B20",
                "id": "7ocwZINHqO9DZJgFtc1B20",
                "name": "Lara Fabian",
                "type": "artist",
                "uri": "spotify:artist:7ocwZINHqO9DZJgFtc1B20"
            }],
            "disc_number": 1,
            "duration_ms": 281760,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/46hSG9mXwNQii0odOuh3fb"
            },
            "href": "https://api.spotify.com/v1/tracks/46hSG9mXwNQii0odOuh3fb",
            "id": "46hSG9mXwNQii0odOuh3fb",
            "name": "For Always",
            "preview_url": "https://p.scdn.co/mp3-preview/909dc878988328f801c8300af7cbb81bf20dfbde?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 5,
            "type": "track",
            "uri": "spotify:track:46hSG9mXwNQii0odOuh3fb"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 211146,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/4cvhPL8douzL0EOxiXWADn"
            },
            "href": "https://api.spotify.com/v1/tracks/4cvhPL8douzL0EOxiXWADn",
            "id": "4cvhPL8douzL0EOxiXWADn",
            "name": "Cybertronics",
            "preview_url": "https://p.scdn.co/mp3-preview/2eb2ee9bd9264b63850319cd1538dc39980eb9d8?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 6,
            "type": "track",
            "uri": "spotify:track:4cvhPL8douzL0EOxiXWADn"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 266546,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/6upoFTocgjzW8nib25Ig2B"
            },
            "href": "https://api.spotify.com/v1/tracks/6upoFTocgjzW8nib25Ig2B",
            "id": "6upoFTocgjzW8nib25Ig2B",
            "name": "The Moon Rising",
            "preview_url": "https://p.scdn.co/mp3-preview/cd904a63992999e39fbf4c0f030ab8a08b8729a1?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 7,
            "type": "track",
            "uri": "spotify:track:6upoFTocgjzW8nib25Ig2B"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 656186,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/3FwF2YhmuwbV4XEGKQQYUk"
            },
            "href": "https://api.spotify.com/v1/tracks/3FwF2YhmuwbV4XEGKQQYUk",
            "id": "3FwF2YhmuwbV4XEGKQQYUk",
            "name": "Stored Memories and Monica's Theme",
            "preview_url": "https://p.scdn.co/mp3-preview/24bf8dc47800fec70d13dc16df7b011fa4b98207?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 8,
            "type": "track",
            "uri": "spotify:track:3FwF2YhmuwbV4XEGKQQYUk"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 263253,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/3DgNtJln8HlqtxG2xHi81U"
            },
            "href": "https://api.spotify.com/v1/tracks/3DgNtJln8HlqtxG2xHi81U",
            "id": "3DgNtJln8HlqtxG2xHi81U",
            "name": "Where Dreams Are Born",
            "preview_url": "https://p.scdn.co/mp3-preview/6efebdf1b8403fa669c1c9b2267c29f1590efe2c?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 9,
            "type": "track",
            "uri": "spotify:track:3DgNtJln8HlqtxG2xHi81U"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 297213,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/0P0aP77AOFj4Q9hD9qZmpm"
            },
            "href": "https://api.spotify.com/v1/tracks/0P0aP77AOFj4Q9hD9qZmpm",
            "id": "0P0aP77AOFj4Q9hD9qZmpm",
            "name": "Rouge City",
            "preview_url": "https://p.scdn.co/mp3-preview/8c7eaace20d50464e2b75e7943043e080b325302?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 10,
            "type": "track",
            "uri": "spotify:track:0P0aP77AOFj4Q9hD9qZmpm"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 371626,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/4GTLL35HpkuHUSouJR4K7h"
            },
            "href": "https://api.spotify.com/v1/tracks/4GTLL35HpkuHUSouJR4K7h",
            "id": "4GTLL35HpkuHUSouJR4K7h",
            "name": "The Search for the Blue Fairy",
            "preview_url": "https://p.scdn.co/mp3-preview/222e1a85bfb84764495c98d69f47120086f49233?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 11,
            "type": "track",
            "uri": "spotify:track:4GTLL35HpkuHUSouJR4K7h"
        },
        {
            "artists": [{
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/3dRfiJ2650SZu6GbydcHNb"
                },
                "href": "https://api.spotify.com/v1/artists/3dRfiJ2650SZu6GbydcHNb",
                "id": "3dRfiJ2650SZu6GbydcHNb",
                "name": "John Williams",
                "type": "artist",
                "uri": "spotify:artist:3dRfiJ2650SZu6GbydcHNb"
            }],
            "disc_number": 1,
            "duration_ms": 465800,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/35pDxj3qvRWsjzRKckrjyF"
            },
            "href": "https://api.spotify.com/v1/tracks/35pDxj3qvRWsjzRKckrjyF",
            "id": "35pDxj3qvRWsjzRKckrjyF",
            "name": "The Reunion",
            "preview_url": "https://p.scdn.co/mp3-preview/77e2bbcbe8a1c5af127207415b7e98603c8edeb9?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 12,
            "type": "track",
            "uri": "spotify:track:35pDxj3qvRWsjzRKckrjyF"
        },
        {
            "artists": [{
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/7ocwZINHqO9DZJgFtc1B20"
                    },
                    "href": "https://api.spotify.com/v1/artists/7ocwZINHqO9DZJgFtc1B20",
                    "id": "7ocwZINHqO9DZJgFtc1B20",
                    "name": "Lara Fabian",
                    "type": "artist",
                    "uri": "spotify:artist:7ocwZINHqO9DZJgFtc1B20"
                },
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/6cXMpsP9x0SH4kFfMyVezF"
                    },
                    "href": "https://api.spotify.com/v1/artists/6cXMpsP9x0SH4kFfMyVezF",
                    "id": "6cXMpsP9x0SH4kFfMyVezF",
                    "name": "Josh Groban",
                    "type": "artist",
                    "uri": "spotify:artist:6cXMpsP9x0SH4kFfMyVezF"
                }
            ],
            "disc_number": 1,
            "duration_ms": 282946,
            "explicit": false,
            "external_urls": {
                "spotify": "https://open.spotify.com/track/7LED1HxLNMauSMnAszcC2W"
            },
            "href": "https://api.spotify.com/v1/tracks/7LED1HxLNMauSMnAszcC2W",
            "id": "7LED1HxLNMauSMnAszcC2W",
            "name": "For Always",
            "preview_url": "https://p.scdn.co/mp3-preview/0ca5ce307a4cdb1fa30d41baf9f16093243b9de6?cid=a170636bea114cc6bd242130450d7e81",
            "track_number": 13,
            "type": "track",
            "uri": "spotify:track:7LED1HxLNMauSMnAszcC2W"
        }
    ]
}

// App
describe('<App/>', function () {
    it('should render without crashing', function () {
        shallow(<App />);
    });
});

// Navigation
describe('<Navigation/>', function () {
    it('should have a brand named SoundtrackDB', function () {
        const wrapper = shallow(<Navigation />);
        expect(wrapper.find('.navbar-brand').render().text()).to.equal('SoundtrackDB');
    });

    it('should have 4 items: Albums, Artists, TV/Movies, and About', function () {
        const wrapper = shallow(<Navigation />);
        const navItems = wrapper.find('Nav').children();
        expect(navItems).to.have.length(4);
        expect(navItems.at(0).find('.nav-link').render().text()).to.equal('Albums');
        expect(navItems.at(1).find('.nav-link').render().text()).to.equal('Artists');
        expect(navItems.at(2).find('.nav-link').render().text()).to.equal('TV/Movies');
        expect(navItems.at(3).find('.nav-link').render().text()).to.equal('About');
    });
});

let fakeTransition = { params: function () { return { offset: 0, limit: 12 } } };

describe('<AlbumHome/>', function () {
    it('should render without crashing', function () {
        shallow(<AlbumHome albums={ALBUMS_JSON} transition={fakeTransition}/>).render();
    })

    it('should contain 3 album instances', function () {
        const wrapper = shallow(<AlbumHome albums={ALBUMS_JSON} transition={fakeTransition}/>);
        const albumItems = wrapper.find('.row').children()
        expect(albumItems).to.have.length(3);
    })

    describe('<AlbumItem/>', function () {
        it('should render without crashing', function () {
            let album = ALBUMS_JSON.items[0]
            const wrapper = shallow(<AlbumItem album={album} transition={fakeTransition}/>).render()
        })

        it('should contain correct data', function () {
            let album = ALBUMS_JSON.items[0]
            const wrapper = shallow(<AlbumItem album={album} />)
            expect(wrapper.find('CardImg').prop('src')).to.be.equal(album.image)
            expect(wrapper.find('CardTitle').render().text()).to.be.equal(album.name)
            expect(wrapper.find('CardSubtitle').render().text()).to.be.equal(album.release_date.substring(0, 4))
            expect(wrapper.find('CardText').render().text()).to.be.equal('15 Tracks')
        })
    })
})

describe('<ArtistHome/>', function () {
    it('should render without crashing', function () {
        shallow(<ArtistHome artists={ARTISTS_JSON} transition={fakeTransition}/>).render();
    })

    it('should contain 3 artist instances', function () {
        const wrapper = shallow(<ArtistHome artists={ARTISTS_JSON} transition={fakeTransition}/>);
        const artistsItems = wrapper.find('.row').children()
        expect(artistsItems).to.have.length(3);
    })

    describe('<ArtistItem/>', function () {
        let artist = ARTISTS_JSON.items[0]
        it('should render without crashing', function () {
            const wrapper = shallow(<ArtistItem artist={artist} />).render()
        })

        it('should contain correct data', function () {
            const wrapper = shallow(<ArtistItem artist={artist} />)
            expect(wrapper.find('CardTitle').render().text()).to.be.equal(artist.name)
            expect(wrapper.find('CardText').render().text()).to.be.equal("Spotify Followers: " + artist.followers.toLocaleString())
        })
    })
})

describe('<MediaHome/>', function () {
    it('should render without crashing', function () {
        shallow(<MediaHome media={MEDIAS_JSON} transition={fakeTransition}/>).render();
    })

    it('should contain 3 artist instances', function () {
        const wrapper = shallow(<MediaHome media={MEDIAS_JSON} transition={fakeTransition}/>);
        const mediaItems = wrapper.find('.row').children()
        expect(mediaItems).to.have.length(3);
    })

    describe('<MediaItem/>', function () {
        let media = MEDIAS_JSON.items[0]
        it('should render without crashing', function () {
            const wrapper = shallow(<MediaItem media={media} />).render()
        })

        it('should contain correct data', function () {
            const wrapper = shallow(<MediaItem media={media} />)
            expect(wrapper.find('CardImg').prop('src')).to.be.equal(media.img)
            expect(wrapper.find('CardTitle').render().text()).to.be.equal(media.name ? media.name : media.title)
            expect(wrapper.find('CardSubtitle').render().text()).to.be.equal('TV Series • 2017 • 2 Seasons')
        })
    });
});

// Splash
describe('<Splash/>', function () {
    it('should render without crashing', function () {
        shallow(<Splash />);
    })

    it('should have 4 items: Albums, Artists, Movies and TV, and Making Connections', function () {
        const wrapper = shallow(<Splash />);
        const carouselItems = wrapper.find('CarouselCaption');
        expect(carouselItems).to.have.length(4);
        expect(carouselItems.at(0).render().text()).to.equal('Albums');
        expect(carouselItems.at(1).render().text()).to.equal('Artists');
        expect(carouselItems.at(2).render().text()).to.equal('TV and Movies');
        expect(carouselItems.at(3).render().text()).to.equal('Making Connections');
    })
});

describe('<MediaInstance/>', function () {
    let riverdale = RIVERDALE_JSON;
    let interstellar = INTERSTELLAR_JSON;

    it('should render without crashing', function () {
        const wrapper = shallow(<MediaInstance media={riverdale} />);
    });

    it('should have the correct data for name and about', function () {
        const wrapper = shallow(<MediaInstance media={riverdale} />);
        expect(wrapper.find({ id: 'name' }).render().text()).to.be.equal(riverdale.name);
        expect(wrapper.find({ id: 'about' }).render().text()).to.be.equal(riverdale.overview);
    });

    it('should have a subtitle with type, release year and genres if it is a movie', function () {
        const wrapper = shallow(<MediaInstance media={interstellar} />);
        const expected = 'Movie | 2014 | Adventure, Drama, Science Fiction';
        expect(wrapper.find({ id: 'subtitle' }).render().text()).to.be.equal(expected);
    });

    it('should have a subtitle with type, years, number of seasons and genres if it is a TV show', function () {
        const wrapper = shallow(<MediaInstance media={riverdale} />);
        const expected = 'TV Show | 2017 - Present | 2 seasons | Drama, Mystery';
        expect(wrapper.find({ id: 'subtitle' }).render().text()).to.be.equal(expected);
    });

    it('should have the correct cast listing', function () {
        const wrapper = shallow(<MediaInstance media={riverdale} />);
        const expected_cast = riverdale.cast;
        const result_cast = wrapper.find({ id: 'cast' }).children();
        let index = 0;
        for (let member of expected_cast) {
            expect(result_cast.at(index).render().text()).to.equal(member);
            index++;
        }
    });

    it('should have the correct poster image and video', function () {
        const wrapper = shallow(<MediaInstance media={riverdale} />);
        const expected_img = "http://image.tmdb.org/t/p/w500//1TsbOTztAJtzTRXAhoLsX9a83XX.jpg";
        const expected_video = "//www.youtube.com/embed/9XmFTADupMc";
        expect(wrapper.find({ alt: "Poster" }).prop('src')).to.be.equal(expected_img);
        expect(wrapper.find('iframe').prop('src')).to.be.equal(expected_video);
    });

    // it('should list associated albums and artists', function () {
    //     const wrapper = shallow(<MediaInstance media={riverdale} />);
    //     const expected_album = "Riverdale: Original Television Score (Season 1)";
    //     const expected_artist = "Blake Neely";
    //     expect(wrapper.find({ id: 'albums' }).find('a').render().text()).to.be.equal(expected_album);
    //     expect(wrapper.find({ id: 'albums' }).find('a').render().text()).to.be.equal(expected_album);
    // });
});

describe('<ArtistInstance/>', function () {
    it('should render without crashing', function () {
        shallow(<ArtistInstance artist={ARTIST_JSON} />);
    })

    it('should have correct data for name and bio', function () {
        const wrapper = shallow(<ArtistInstance artist={ARTIST_JSON} />);
        expect(wrapper.find({ id: 'name' }).render().text()).to.be.equal(ARTIST_JSON.name);
        // expect(wrapper.find({ id: 'bio' }).render().text()).to.be.equal(artist.lastfm_data.artist.bio.content);

    })

    it('should have the correct media', function () {
        const wrapper = shallow(<ArtistInstance artist={ARTIST_JSON} />);
        expect(wrapper.find({ alt: "Artist" }).prop('src')).to.be.equal(ARTIST_JSON.image);
        expect(wrapper.find('iframe').prop('src')).to.contain(ARTIST_JSON.spotify_uri)
    })

    // it('should have the correct related data', function () {
    //     const artist = HANS_ZIMMER_JSON;
    //     const wrapper = shallow(<ArtistInstance artist={artist} />);
    //     expect(wrapper.find({ id: 'albums' }).find('a').render().text()).to.be.equal(artist.albums[1]);
    //     expect(wrapper.find({ id: 'media' }).find('a').render().text()).to.be.equal(artist.media[1]);
    // })
});

// Album Instance
describe('<AlbumInstance/>', function () {
    it('should render without crashing', function () {
        shallow(<AlbumInstance album={ALBUM_JSON} />);
    })

    it('should have correct data for name, label, release year, and artists ', function () {
        const wrapper = shallow(<AlbumInstance album={ALBUM_JSON} />)
        expect(wrapper.find({ id: 'name' }).render().text()).to.be.equal(ALBUM_JSON.name);
        expect(wrapper.find({ id: 'label' }).render().text()).to.be.equal("Label: " + ALBUM_JSON.label);
        expect(wrapper.find({ id: 'year' }).render().text()).to.be.equal("Release year: " + ALBUM_JSON.release_date.substring(0, 4));
        // expect(wrapper.find({ id: 'artistlist' }).render().text()).to.be.equal("Artists: " + ALBUM_JSON.artists[1]);
    })

    it('should have the correct track', function () {
        const wrapper = shallow(<AlbumInstance album={ALBUM_JSON} />);
        const expected_track_list = ALBUM_JSON.tracks;
        const result_track_list = wrapper.find({ id: 'tracks' }).childAt(0);
        for (let i = 0; i < expected_track_list.length; i++) {
            expect(result_track_list.childAt(i).render().text()).to.equal(expected_track_list[i].name);
        }
    })

    // it('should list associated albums and artists', function () {
    //     const wrapper = shallow(<AlbumInstance album={ALBUM_JSON} />);
    //     const related_data = ALBUM_JSON.related_data.albums.riverdale;
    //     expect(wrapper.find({ id: 'media' }).find('a').render().text()).to.be.equal(ALBUM_JSON.media[0].name);
    //     expect(wrapper.find({ id: 'artists' }).find('a').render().text()).to.be.equal(ALBUM_JSON.artists[0].name);
    // })

});