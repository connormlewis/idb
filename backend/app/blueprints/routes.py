"""Application routes"""
import os
import re
import sched
import threading
import time
from datetime import date

import requests
from flask import Blueprint, jsonify, request, abort
from sqlalchemy import or_, Text, cast, asc, desc, and_

from app.models import Artist, ArtistSchema, MediaSchema, Album, AlbumSchema, Media, \
    search, SearchSchema, Genre, GenreSchema
from app.shared.db import get_session

BP = Blueprint('category_routes', 'SoundtrackDB')

artist_schema = ArtistSchema()
album_schema = AlbumSchema()
media_schema = MediaSchema()
genre_schema = GenreSchema()
artists_schema = ArtistSchema(exclude=('albums', 'media'))
albums_schema = AlbumSchema(exclude=('artists', 'media', 'tracks'))
medias_schema = MediaSchema(
    exclude=('albums', 'artists', 'cast', 'other_images', 'videos'))
search_schema = SearchSchema(many=True)

commit_data = None
issue_data = None
lock = threading.Lock()
event = None
#Blessed


@BP.before_app_first_request
def setup_git_refresh():
    """Refresh every hour"""
    global event
    event = sched.scheduler(time.time, time.sleep)
    t = threading.Thread(target=get_git_data)
    t.start()


def get_git_data():
    """Get the actual data from github"""
    global event, commit_data, issue_data
    lock.acquire()
    commit_data = get_commits()
    issue_data = get_issues()
    lock.release()
    event.enter(3600, 1, get_git_data, ())


@BP.route('/about')
def get_about():
    """Get commits and data"""
    global commit_data, issue_data, lock

    lock.acquire()
    commits = commit_data
    issues = issue_data
    about_data = {}
    about_data['commits'] = commits[0]
    about_data['total_commits'] = commits[1]
    about_data['issues'] = issues[0]
    about_data['total_issues'] = issues[1]
    lock.release()
    return jsonify(about_data)


@BP.route('/artist')
def get_artists():
    """Get all of the artists"""
    return query_multiple(request.args, artist_search, \
                artist_filter, Artist, artists_schema)

@BP.route('/artist/<artist_id>')
def get_artist(artist_id):
    """Get a specific artist"""
    return query_single(artist_id, Artist, artist_schema)


@BP.route('/album')
def get_albums():
    """Get all of the albums"""
    return query_multiple(request.args, album_search, \
                album_filter, Album, albums_schema)


@BP.route('/album/<album_id>')
def get_album(album_id):
    """Get a specific album"""
    return query_single(album_id, Album, album_schema)


@BP.route('/media')
def get_media():
    """Get all media"""
    return query_multiple(request.args, media_search, \
                media_filter, Media, medias_schema)

@BP.route('/media/<media_id>')
def get_single_media(media_id):
    """Get a specific media instance"""
    return query_single(media_id, Media, media_schema)

@BP.route('/search/<term>')
def search_db(term):
    """
    Search database for a term
    """
    session = get_session()
    try:
        search_statement = or_(
            search.c.name.ilike('%' + term + '%'),
            search.c.about.ilike('%' + term + '%'),
            search.c.kind.ilike('%' + term + '%'),
            search.c.image.ilike('%' + term + '%'),
            cast(search.c.id, Text).ilike('%' + term + '%'),
            cast(search.c.release_date, Text).ilike('%' + term + '%'))
        query = session.query(search).filter(search_statement)
        query = search_filter(request.args, query)
        query = order_query(search, request.args, query)
        final_query = query

        query = set_limit_offset(request.args, query)

        data = query.all()
        count = final_query.count()
        return jsonify({
            'items': search_schema.dump(data, many=True).data,
            'count': count
        })
    finally:
        session.close()


@BP.route('/genres')
def get_genres():
    """
    Get genres
    """
    session = get_session()
    try:
        query = session.query(Genre)
        final_query = query
        query = set_limit_offset(request.args, query)
        genres = query.all()

        count = final_query.count()
        return jsonify({
            'items': genre_schema.dump(genres, many=True).data,
            'count': count
        })
    finally:
        session.close()

@BP.route('/labels')
def get_labels():
    """
    Get all possible values for label in album table
    """
    session = get_session()
    try:
        query = session.query(Album.label).distinct()
        final_query = query
        labels = query.all()
        label_list = []
        for label in labels:
            label_list.append(label[0])
        count = final_query.count()
        return jsonify({
            'items': label_list,
            'count': count
        })
    finally:
        session.close()

def query_single(model_id, Model, model_schema):
    """
    Make a query for a model instance
    """
    session = get_session()
    try:
        model_id = int(model_id)
        model = session.query(Model).get(model_id)

        if model is None:
            return abort(404)

        return jsonify(model_schema.dump(model).data)
    except ValueError:
        return abort(404)
    finally:
        session.close()

def query_multiple(query_params, search_func, filter_func, Model, models_schema):
    """
    Make a query for multiple model instances
    """
    session = get_session()
    table = Model.__table__
    try:
        query = session.query(Model)
        if query_params.get('search') is not None:
            query = search_func(query, query_params.get('search'))
        query = filter_func(query_params, query)
        query = order_query(table, query_params, query)
        final_query = query
        query = set_limit_offset(request.args, query)

        models = query.all()
        count = final_query.count()
        return jsonify({
            'items': models_schema.dump(models, many=True).data,
            'count': count
        })
    finally:
        session.close()

def set_limit_offset(query_params, query):
    """
    Set the offset and limit of the return query
    """
    if query_params.get('limit') is not None:
        query = query.limit(int(request.args.get('limit')))
    else:
        query = query.limit(12)

    if query_params.get('offset') is not None:
        query = query.offset(int(request.args.get('offset')))
    else:
        query = query.offset(0)
    return query

def order_query(table, query_params, query):
    """
    Order query
    """
    if query_params.get('order_by') is not None:
        val = query_params.get('order_by')
        if val in table.c:
            if 'asc' in request.args:
                query = query.order_by(asc(val))
            elif 'desc' in request.args:
                query = query.order_by(desc(val))
            else:
                query = query.order_by(val)
    else:
        query = query.order_by(asc('name'))
    return query


def get_commits():  # pragma: no cover
    """
    Get commits from github
    """
    global commit_data
    all_commits = 0
    team = {
        'stevex196x': 0,
        'TheSchaft': 0,
        'melxtru': 0,
        'aylish19': 0,
        'connormlewis': 0,
        'tsukkisuki': 0
    }
    while all_commits == 0:
        url = 'https://api.github.com/repos/connormlewis/idb/stats/contributors'
        data = requests.get(
            url, headers={'Authorization': 'token ' + os.environ['API_TOKEN']})
        json_list = data.json()
        for entry in json_list:
            total = entry['total']
            user_name = entry['author']['login']
            if user_name in team:
                team[user_name] = total
            all_commits += total
    return team, all_commits


def get_issues():  # pragma: no cover
    """
    Get issues from github
    """
    global issue_data
    team = {
        'stevex196x': 0,
        'TheSchaft': 0,
        'melxtru': 0,
        'aylish19': 0,
        'connormlewis': 0,
        'tsukkisuki': 0
    }
    all_issues = 0
    while all_issues == 0:
        url = ('https://api.github.com/repos/connormlewis/idb/'
               'issues?state=all&filter=all&per_page=100')
        data = requests.get(
            url, headers={'Authorization': 'token ' + os.environ['API_TOKEN']})
        link = data.headers.get('Link', None)
        for i in range(1, int(find_last_page(link)) + 1):
            url = (
                'https://api.github.com/repos/connormlewis/idb/'
                'issues?state=all&filter=all&per_page=100' + '&page=' + str(i))
            data = requests.get(
                url,
                headers={'Authorization': 'token ' + os.environ['API_TOKEN']})
            json_list = data.json()
            for entry in json_list:
                if 'pull_request' not in entry:
                    all_issues += 1
                    if entry['user']['login'] in team:
                        team[entry['user']['login']] += 1
    return team, all_issues


def find_last_page(link): # pragma: no cover
    """
    Parses the header of the GitHub API and returns the last page
    """
    if link is not None:
        parse_words = list(re.split('; |, | ', link))
        index = parse_words.index('rel="last"') - 1
        temp_string = parse_words[index][:-1]
        last_page = re.split('page=', temp_string)[-1]
    return last_page

def search_filter(query_params, query):
    """
    Filter search by type
    """
    if query_params.get('type') is not None:
        query = query.filter(search.c.kind == query_params.get('type'))
    return query


def artist_filter(query_params, query):
    """
    Filter artist table query
    """
    table = Artist.__table__
    col_name = table.c.followers
    if query_params.get('min_followers') is not None \
        and query_params.get('max_followers') is not None:
        filt_statement = and_(col_name >= query_params.get('min_followers'),
                              col_name <= query_params.get('max_followers'))
        query = query.filter(filt_statement)
    elif query_params.get('min_followers') is not None:
        query = query.filter(
            col_name >= int(query_params.get('min_followers')))
    elif query_params.get('max_followers') is not None:
        query = query.filter(
            col_name <= int(query_params.get('max_followers')))
    if query_params.get('num_albums') is not None:
        query = query.filter(
            table.c.num_albums == int(query_params.get('num_albums')))
    if query_params.get('num_media') is not None:
        query = query.filter(
            table.c.num_media == int(query_params.get('num_media')))
    return query


def album_filter(query_params, query):
    """
    Filter album table query
    """
    table = Album.__table__
    col_name = table.c.release_date
    if query_params.get('start_year') is not None \
        and query_params.get('end_year') is not None:
        filt_statement = and_(
            col_name >= date(int(query_params.get('start_year')), 1, 1),
            col_name <= date(int(query_params.get('end_year')), 12, 31))
        query = query.filter(filt_statement)
    elif query_params.get('start_year') is not None:
        query = query.filter(
            col_name >= date(int(query_params.get('start_year')), 1, 1))
    elif query_params.get('end_year') is not None:
        query = query.filter(
            col_name <= date(int(query_params.get('end_year')), 12, 31))
    if query_params.get('num_tracks') is not None:
        query = query.filter(
            table.c.num_tracks == int(query_params.get('num_tracks')))
    if query_params.get('label') is not None:
        query = query.filter(table.c.label == str(query_params.get('label')))
    return query


def media_filter(query_params, query):
    """
    Filter media table query
    """
    table = Media.__table__
    if query_params.get('type') is not None:
        if query_params.get('type').lower() == 'movie':
            query = query.filter(table.c.type == 1)
        elif query_params.get('type').lower() == 'tv_show':
            query = query.filter(table.c.type == 0)
    col_name = table.c.release_date
    if query_params.get('start_year') is not None \
        and query_params.get('end_year') is not None:
        filt_statement = and_(
            col_name >= date(int(query_params.get('start_year')), 1, 1),
            col_name <= date(int(query_params.get('end_year')), 12, 31))
        query = query.filter(filt_statement)
    elif query_params.get('start_year') is not None:
        query = query.filter(
            col_name >= date(int(query_params.get('start_year')), 1, 1))
    elif query_params.get('end_year') is not None:
        query = query.filter(
            col_name <= date(int(query_params.get('end_year')), 12, 31))
    if query_params.get('running') is not None:
        if query_params.get('running').lower() == 'true':
            query = query.filter(table.c.running)
        else:
            query = query.filter(not table.c.running)
    return extra_media_filter(query_params, query)


def extra_media_filter(query_params, query):
    """
    Some more filtering for media
    """
    table = Media.__table__
    if query_params.get('seasons') is not None:
        query = query.filter(
            table.c.seasons == int(query_params.get('seasons')))
    if query_params.get('average_rating') is not None:
        query = query.filter(table.c.average_rating >= float(
            query_params.get('average_rating')))
    if query_params.get('last_aired') is not None:
        query = query.filter(
            table.c.last_aired == str(query_params.get('last_aired')).zfill(4))
    if query_params.get('genre') is not None:
        query = query.join(
            Media.genres).filter(Genre.name == query_params.get('genre'))
    return query


def artist_search(query, term):
    """
    Search artist table for term
    """
    table = Artist.__table__
    search_statement = or_(
        cast(table.c.id, Text).ilike('%' + term + '%'),
        table.c.name.ilike('%' + term + '%'),
        table.c.bio.ilike('%' + term + '%'),
        table.c.image.ilike('%' + term + '%'),
        cast(table.c.followers, Text).ilike('%' + term + '%'),
        table.c.spotify_uri.ilike('%' + term + '%'))
    return query.filter(search_statement)


def media_search(query, term):
    """
    Search media table for term
    """
    table = Media.__table__
    search_statement = or_(
        cast(table.c.id, Text).ilike('%' + term + '%'),
        cast(table.c.type, Text).ilike('%' + term + '%'),
        table.c.name.ilike('%' + term + '%'),
        table.c.cast.ilike('%' + term + '%'),
        cast(table.c.seasons, Text).ilike('%' + term + '%'),
        cast(table.c.release_date, Text).ilike('%' + term + '%'),
        table.c.last_aired.ilike('%' + term + '%'),
        table.c.image.ilike('%' + term + '%'),
        cast(table.c.running, Text).ilike('%' + term + '%'),
        table.c.overview.ilike('%' + term + '%'),
        table.c.other_images.ilike('%' + term + '%'),
        table.c.videos.ilike('%' + term + '%'),
        cast(table.c.imdb_id, Text).ilike('%' + term + '%'),
        cast(table.c.tmdb_id, Text).ilike('%' + term + '%'),
        cast(table.c.runtime, Text).ilike('%' + term + '%'),
        table.c.tagline.ilike('%' + term + '%'),
        cast(table.c.popularity, Text).ilike('%' + term + '%'),
        cast(table.c.average_rating, Text).ilike('%' + term + '%'))
    return query.filter(search_statement)


def album_search(query, term):
    """
    Search album table for term
    """
    table = Album.__table__
    search_statement = or_(
        table.c.name.ilike('%' + term + '%'),
        cast(table.c.release_date, Text).ilike('%' + term + '%'),
        table.c.image.ilike('%' + term + '%'),
        table.c.label.ilike('%' + term + '%'),
        table.c.tracks.ilike('%' + term + '%'),
        table.c.spotify_uri.ilike('%' + term + '%'),
        cast(table.c.id, Text).ilike('%' + term + '%'))
    return query.filter(search_statement)
