# LastFMNowPlaying - a dumb/quick module to get current playing track

## Notes:

Dume loop fetch of [user.getRecentTracks](https://www.last.fm/api/show/user.getRecentTracks) you will need a API key from [Last.fm](https://www.last.fm/api/account/create)

Uses [request](https://github.com/request/request/) to make the request.

## Example usage:

```js
var c = new LastFMNowPlaying.LastFMNowPlaying({
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

## Events

- `error` - percolates an error if request gets one, or an error with the response, passed the error
- `always` - emits the whole response of `user.getrecenttracks`
- `nochange` - the poll completed, but the song didn't change, nothing is passed
- `warning` - non 200 call from the API, either Last.fm tripped, or you are polling to quick and hit a rate limit. passes an object containting the HTTP Code as `code` and the `body` response
