# TAMUSA NSF transit project

**Clone repository**: (easy VSCode method  ***just one of many ways***)

1. ensure VSCode is signed in to your github account and your github has been linked to this project as a collaborator (invites sent via email)
2. clone repo to local machine
<img src="vscode1.png" alt="Clone Repo">

3. click Clone from GitHub (can also use URL)
4. type 'TAMUSA-nsf-project/transit' to search github (wont work if your account is not linked as collaborator or VSCode is not signed in)
5. choose where to save project
6. open project and go to the source control tab
7. click the <...> menu button and select 'Checkout to...'
<img src="vscode2.png" alt="Checkout Branch">

8. click '+Create new branch'
9. name your branch
10. publish branch

Now all commits will go to your branch!

### Run Project on Local Machine
<img src="start_local_server.gif" alt="npm install / npm start">

***Notes***:
- DB_KEY is specific to my MongoDB accout at this time (see line 39 of server.js).  (better solutions for defining and keeping our data will be implemented as we go)
- API_KEY is for google APIs like 'maps', 'directions', 'distance matrix', etc.  


## WebStorm Instructions
#### Installation 
1. Download WebStorm
2. Get educational license for WebStorm: https://www.jetbrains.com/community/education/#students
3. Clone or fork this repository in WebStorm
4. Download Node.js: https://nodejs.org/en/download/

#### Running the server
Open a terminal in WebStorm and execute the following commands.
1. npm install
2. npm start

The address of the server is printed to the terminal. Copy/paste
it to a browser.

#### Debugging
_You must have the Chrome web browser installed first._

Click 'Add Configuration...' at top of WebStorm window.

<img src="user-guide-images/Screen Shot 2022-05-16 at 11.01.11 AM.png" width="300" height="auto" alt="">

Click the "+" symbol at the top left. Scroll down and select "npm".

<img src="user-guide-images/Screen Shot 2022-05-16 at 11.03.14 AM.png" width="600" height="auto" alt="">

Select "start" in the dropdown next to "Command:". Click "Apply".

<img src="user-guide-images/Screen Shot 2022-05-16 at 11.04.14 AM.png" width="600" height="auto" alt="">

Add another configuration: click "+" again and select "JavaScript Debug". Configure the settings as shown. Click "OK".

<img src="user-guide-images/Screen Shot 2022-05-19 at 1.54.45 PM.png" width="600" height="auto" alt="">


Click in a file's gutter to add a breakpoint.

<img src="user-guide-images/Screen Shot 2022-05-16 at 11.41.01 AM.png" width="500" height="auto" alt="">

Select the "npm start" configuration from the dropdown. Click the green bug icon to run the server in debug mode. 

<img src="user-guide-images/Screen Shot 2022-05-16 at 11.04.47 AM.png" width="300" height="auto" alt="">

Then select the "js_debug" configuration from the same dropdown and click the green bug icon again.

<img src="user-guide-images/Screen Shot 2022-05-19 at 2.11.02 PM.png" width="300" height="auto" alt="">

Then interact with the website to hit breakpoints.