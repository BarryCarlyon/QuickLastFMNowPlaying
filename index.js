'use strict';

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const got = require('got');

exports.LastFMNowPlaying = LastFMNowPlaying;

function LastFMNowPlaying(config) {
    EventEmitter.call(this);

    var { api_key, user, poll_time, nowplaying_only } = config;

    LastFMNowPlaying.api_key = api_key;
    LastFMNowPlaying.user = user;
    LastFMNowPlaying.poll_time = poll_time ? poll_time : 10000;
    LastFMNowPlaying.nowplaying_only = nowplaying_only ? nowplaying_only : false;

    var self = this;

    LastFMNowPlaying.tock = function() {
        got({
            url: 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
                + '&user=' + LastFMNowPlaying.user
                + '&api_key=' + LastFMNowPlaying.api_key
                + '&format=json'
                + '&limit=1',
            method: 'GET',
            responseType: 'json',
            timeout: LastFMNowPlaying.poll_time
        })
        .then(resp => {
            if (resp.statusCode == 200) {
                self.emit('always', b);

                try {
                    var { recenttracks } = b;
                    var track = recenttracks.track[0];

                    var is_playing = false;
                    if (track['@attr'] && track['@attr'].nowplaying) {
                        is_playing = true;
                    }

                    if (!is_playing && LastFMNowPlaying.nowplaying_only) {
                        // not playing
                        self.emit('nochange');
                        return;
                    }
                    var song = track.name;
                    if (LastFMNowPlaying.lasttrack != song) {
                        LastFMNowPlaying.lasttrack = song;
                        self.emit('song', track);
                    } else {
                        // no change
                        self.emit('nochange');
                    }
                } catch (e) {
                    self.emit('error', e);
                }
            } else {
                self.emit('warning', {
                    code: r.statusCode,
                    body: b
                });
            }
        })
        .catch(err => {
            self.emit('error', err);
        });
    }

    LastFMNowPlaying.start();
}
util.inherits(LastFMNowPlaying, EventEmitter);

LastFMNowPlaying.start = function() {
    LastFMNowPlaying.stop();

    LastFMNowPlaying.tick = setInterval(() => {
        LastFMNowPlaying.tock();
    }, LastFMNowPlaying.poll_time);

    LastFMNowPlaying.tock();
}
LastFMNowPlaying.stop = function() {
    clearInterval(LastFMNowPlaying.tick);
};
