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
