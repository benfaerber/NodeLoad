# NodeLoad
 A way to upload files to a plex server remotely, built with NodeJS

I created NodeLoad to be able to upload files to my plex server remotley. My server is on my E: drive and I allow certain folders to be uploaded to.
You could easy modify the code to suite your needs!

To get started, create a .env file with the value UNAME and PWORD. Install all my node dependencies and then change the folder it uploads to in server.js (backend) and index.ejs (frontend)

I hope someone can use this!

Edit (Apr 7th, 2020):
I've been testing this some one and was able to upload a 6gb zip file. It failed to unzip saying it was too large. I think I may try to rewrite the app in another langauge because Node isn't that good with large files. I think I may try to learn Rust and write the app in that.
