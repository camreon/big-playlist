**Universal Playlist** is a music streaming web app that can create a playlist from multiple other streaming sources (youtube, bandcamp, soundcloud, etc.)

**Demo:** http://www.bigplaylist.club/

#### Local Setup

```
$ docker-compose build
$ docker-compose up
```

Frontend: [http://localhost:3000](http://localhost:3000)
Backend: [http://localhost:80](http://localhost:80)


#### Deployment

Uses https://fly.io/docs/
- Push to main branch
- OR run `fly deploy`


<details>

<summary>TODO</summary>

- [x] make delete and open buttons bigger
- [x] display specific errors on frontend based on the backend error
- [ ] more track loading states
  - instantly add track to playlist ui greyed out
  - state when song is loading
    - might not work for playlists... try `--lazy-playlist` cli option
- [ ] customizeable title for playlist
- [ ] page to view all playlists you created (based on ip or brower identification since we don't have user logins)
- [x] shuffle + repeat buttons
- [ ] audit yt-dlp configs that are used
- [ ] audit logic for how streaming urls are stored and refreshed to make sure it's optimal
- [ ] load testing
- [ ] fix yt streaming
  - example broken url in prod: https://www.youtube.com/watch?v=Gr80_REfDZo
  - https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp
  - send cookie from frontend
    - https://github.com/yt-dlp/yt-dlp/wiki/Extractors#youtube
    - example code from chrome extension: https://github.com/kairi003/Get-cookies.txt-LOCALLY/blob/master/src/popup.mjs
  - only if it's a youtube url
  - test it out a lot to make sure accounts won't get banned


</details>

<details>
<summary>Additional Enhancements</summary>

- [ ] improve error handling
- [ ] improve frontend design
- [ ] scaling
  - is a queue system needed to handle high loads?
- [ ] investigate analytics
  - https://plausible.io/#pricing ?
  - fly.io comes with sentry access maybe?
- [x] migrate to serverless maybe? b/c the ydl jobs server doesn't need to be running all the time
  - fly.io already handles this
- [ ] deploy with AWS CDK
- [x] try out uv
  - https://docs.astral.sh/uv/
  - https://news.ycombinator.com/item?id=45751400

</details>