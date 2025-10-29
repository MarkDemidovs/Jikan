# JIKAN
JIKAN is a (w.i.p) production-ready solution for keeping track of specific times and events for people all over the globe.
Right now, the local version is being built, but plans have been extended to create a full production-ready release.

## Installation
### backend
To install, you must cd to the root of the folder and type
> npm install
which will install all of the necesarry files for backend.
Now you may cd into the backend and type
> node server.js
.. to run the backend. You must have a valid local PostgreSQL Installation. You may run the jikanSetup.sql with your favourite PSQL tool, be it CLI, Powershell or the PSQL CLI

### frontnend
To install, you must cd into the fronend folder and type up this command into the console:
> npm install
which will install all of the necesarry files for React.js. 
Now you may cd into the frontend folder and type up
> npm run dev
.. to start running the frontend of the website.
* YOU MUST HAVE A VALID BACKEND AND A DB TO LOG IN OR SIGN UP!*


here are the todos:
    1. Event Expiry with next-day verification peer-to-peer.
    2. team exit
    3. db reset
    4. good styling!

what did i learn from this:
    1. that i seriously forgot about prop functions.. so now most of the code is in one file. I may add an issue to github for this.