# LastFMNowPlaying - a dumb/quick module to get current playing track

## Notes:

Dume loop fetch of [user.getRecentTracks](https://www.last.fm/api/show/user.getRecentTracks) you will need a API key from [Last.fm](https://www.last.fm/api/account/create)

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
