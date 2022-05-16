# chat_app_BE
Quick Install

Make sure that you have Node.js v8.15.1 and npm v5 or above installed. Clone this repo using git clone --depth=1 <GIT_URL> <YOUR_PROJECT_NAME>

Move to the appropriate directory: cd <YOUR_PROJECT_NAME>.

******** Setup git ********

git checkout -b develop
git fetch
git reset --hard origin/develop
Copy file example.env.dev to .env

Run npm run install & yarn install in order to install dependencies.

Run npm start & yarn start in order to install dependencies. At this point you can see the example app at http://localhost:5000.

******** Setup MongoDB ******** 
Create: mongodb://localhost:27017/chatApp

Now you're ready to rumble!
