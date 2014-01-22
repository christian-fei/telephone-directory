Telephone directory
=============
A simple exercise to learn a bit more about Heroku, CI and test driven development with Jasmine.
The online version of this application can be found [here](http://telephone-directory.herokuapp.com/)

#About
This application is a very basic phone book with which you can save informations about their name, surname and phone number[s].
I left out the whole auth system because it would go beyound the scope of this exercise.

##The app
I chose to build this application with [Express](http://expressjs.com/)  and MongoDB because in my opinion it perfectly fitted into the projects requirements:

- the ability to talk client <-> server and server <-> database in JavaScript
- simple and native JSON support on the client, server and database
- no relational data (we can use an Array to store multiple numbers for a single person)


#Deployment
##locally
This application uses Node and MongoDB, so both need to be installed on your system.

Install the npm dependencies by running

```
npm install
```

Next step is to create a Mongo database and get the URL for it.
This because internally the app makes use of the environment variable called `MONGO_URL`.

You can set the environment variable with

```
export MONGO_URL=mongodb://<user>:<password>@localhost:27017/telephonedirectory
```

and then run

```
node app.js
#or foreman start if you have heroku installed
```

to start the app.

##heroku

I've chosen [Heroku](https://heroku.com) as the PaaS of choice, so here are the steps needed to run your app in the cloud:

```
heroku apps:create [application name] --stack cedar
heroku config:set MONGO_URL=[your Mongo URL]
git push heroku master
heroku open
```

#Tests





#License
##MIT licensed
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.