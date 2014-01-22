Telephone directory
=============
A simple exercise to learn a bit more about Heroku, CI and test driven development with Jasmine.
The online version of this application can be found [here](http://pacific-refuge-9141.herokuapp.com/)

#Setup
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
```

to start the app.

#Tests









#License
##MIT licensed
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.