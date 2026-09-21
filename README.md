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

- [ ] make delete and open buttons bigger
- [ ] display specific errors on frontend based on the backend error
- [ ] more track loading states
  - instantly add track to playlist ui greyed out
  - state when song is loading
    - might not work for playlists... try `--lazy-playlist` cli option
- [ ] more error handling
- [ ] more frontend design
- [ ] scaling
  - is a queue system needed to handle high loads?
- [ ] add more playlists features
  - titles
  - uuids
  - page to view all playlists you created (based on )
  - shuffle + repeat buttons
- [ ] review yt-dlp configs that are used are the best for this use case
- [ ] review logic for how streaming urls are stored and refreshed to make sure it's optimal
- [ ] load testing
- [ ] fix yt streaming
  - example broken url in prod: https://www.youtube.com/watch?v=Gr80_REfDZo
  - https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp
  - send cookie from frontend
    - https://github.com/yt-dlp/yt-dlp/wiki/Extractors#youtube
    - example code from chrome extension: https://github.com/kairi003/Get-cookies.txt-LOCALLY/blob/master/src/popup.mjs
  - only if it's a youtube url

</details>

<details>
<summary>Additional Enhancements</summary>

- [ ] test it out a lot to make sure accounts won't get banned
- [ ] investigate analytics
  - https://plausible.io/#pricing ?
  - fly.io comes with sentry access maybe?
- [ ] migrate to serverless maybe? b/c the ydl jobs server doesn't need to be running all the time
- [ ] can we handle spotify links?
- [ ] deploy with AWS CDK
- [ ] try out uv
  - https://docs.astral.sh/uv/
  - https://news.ycombinator.com/item?id=45751400

</details>