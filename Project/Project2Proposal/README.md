The idea for the prototype was to have a database working with Cloudant and a very basic website that could post JSON files to the database, get them back and display them.
I feel like this is the hardest part of the project. Especially if I'm trying to setup an efficient database like the one Cloudant provides.

Everything I tried worked in some sense but nothing was completed.
I worked in a very disorganized fashion, trying to find a method that would work fully and I thought I would clean everything up afterwards...

server.js can be run locally using Node.js and hosts a static website with express
With it I was able, as a proof of concept, to upload data to my Cloudant database.
I realized that I could not publish the website using gitHub.io because it doesn't support server side programming.
I then switched my focus on trying to host my own website using a laptop.
Using WampServer, I was able to create a connection to the internet but did not manage to link it with the custom Node.js server (server.js)
The next step was to try and use Heroku to host the server online for me using git. I was following a youtube tutorial by Codeboard Club
(https://www.youtube.com/watch?v=Nyn-CEgy-B8). This attempt includes code (commented as such) in the server.js file as well as everything in
the client_app folder. That too resulted in failure.

The next logical option is to give up on Cloudant and the Node.js hosting and build a client based website exclusively.
The data could than be saved and fetched by the client itself using Google's Firebase.
This was not realized in this failed prototype attempt.

I'm a bit disappointed in my performance with server hosting here... I did learn quite a lot and would like to discuss possible ways of making it work
if it fits your "domaine d'expertise"! (did I say domain? ^^)
