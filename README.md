# LastFMNowPlaying

A dumb/quick module to get current playing track

## Notes:

Dume loop fetch of [user.getRecentTracks](https://www.last.fm/api/show/user.getRecentTracks) you will need a API key from [Last.fm](https://www.last.fm/api/account/create)

Uses [request](https://github.com/request/request/) to make the request.

## Example usage:

```js
var lfmnp = require('LastFMNowPlaying');

var c = new lfmnp.LastFMNowPlaying({
    api_key: some_apikey,
    user: some_lastFM_username
});

c.on('error', function(e) {
    console.error(e);
}).on('warning', function(e) {
    console.error('Got a', e.code, e.body);
}).on('song', function(s) {
    console.log('song', s.name, 'by', s.artist['#text']);
}).on('always', function(s) {
    console.log('always', s);
})
```

## Options

- `api_key` - string, required, you need a API Key in order to poll Last.fm
- `user` - string, required, the username to fetch songs for,
- `poll_time` - int, optional, default `10000` - time between polls in MS
- `nowplaying_only` - boolean, optional, default `false`, if `true` only return a `song` event if the current song is actually playing

## Events

- `error` - percolates an error if request gets one, or an error with the response, passed the error
- `always` - emits the whole response of `user.getrecenttracks`
- `song` - the song changed, returns the first track object
- `nochange` - the poll completed, but the song didn't change, nothing is passed
- `warning` - non 200 call from the API, either Last.fm tripped, or you are polling to quick and hit a rate limit. passes an object containting the HTTP Code as `code` and the `body` response
