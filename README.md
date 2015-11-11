# Local Storage with cordova

This project draws on the ideas of [this article by Frank Reding](https://www.neontribe.co.uk/cordova-file-plugin-examples/), published on neontribe.co.ul, to exercise two features of the local storage in a Cordova application: writing to a local file and downloading a potentially large file, like a zip with content to be handled by the application, for example video and audio files. This can be a crucial feature for many Cordova apps.

Many parameters are hard coded, but this is OK for testing purposes. For testing I have used two servers: one serving the Phonegap application via *Phonegap serve* and the other one on port 8080 of the same machine for serving the zip. The reason is that putting the zip file inside the www directory would have slowed down application startup.
