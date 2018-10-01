'use strict';

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');

exports.LastFMNowPlaying = LastFMNowPlaying;

function LastFMNowPlaying(config) {
    EventEmitter.call(this);

    var { api_key, user, poll_time } = config;

    LastFMNowPlaying.api_key = api_key;
    LastFMNowPlaying.user = user;
    LastFMNowPlaying.poll_time = poll_time ? poll_time : 10000;

    var self = this;

    LastFMNowPlaying.tock = function() {
        request({
            url: 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
                + '&user=' + LastFMNowPlaying.user
                + '&api_key=' + LastFMNowPlaying.api_key
                + '&format=json'
                + '&limit=1',
            method: 'get',
            json: true,
            timeout: LastFMNowPlaying.poll_time
        }, (e,r,b) => {
            if (e) {
                self.emit('error', e);
            } else if (r.statusCode == 200) {
                self.emit('always', b);
                try {
                    var { recenttracks } = b;
                    var track = recenttracks.track[0];
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

