# Mod18MERN Book Search Engine

## Description

This application is using a Google Books API search engine built with a RESTful API, and refactoring it to be a GraphQL API built with Apollo Server.

### Criteria

GIVEN a book search engine
- WHEN I load the search engine
THEN I am presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button
- WHEN I click on the Search for Books menu option
THEN I am presented with an input field to search for books and a submit button
- WHEN I am not logged in and enter a search term in the input field and click the submit button
THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site
- WHEN I click on the Login/Signup menu option
THEN a modal appears on the screen with a toggle between the option to log in or sign up
- WHEN the toggle is set to Signup
THEN I am presented with three inputs for a username, an email address, and a password, and a signup button
- WHEN the toggle is set to Login
THEN I am presented with two inputs for an email address and a password and login button
- WHEN I enter a valid email address and create a password and click on the signup button
THEN my user account is created and I am logged in to the site
- WHEN I enter my account’s email address and password and click on the login button
THEN the modal closes and I am logged in to the site
- WHEN I am logged in to the site
THEN the menu options change to Search for Books, an option to see my saved books, and Logout
- WHEN I am logged in and enter a search term in the input field and click the submit button
THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site and a button to save a book to my account
- WHEN I click on the Save button on a book
THEN that book’s information is saved to my account
- WHEN I click on the option to see my saved books
THEN I am presented with all of the books I have saved to my account, each featuring the book’s title, author, description, image, and a link to that book on the Google Books site and a button to remove a book from my account
- WHEN I click on the Remove button on a book
THEN that book is deleted from my saved books list
- WHEN I click on the Logout button
THEN I am logged out of the site and presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button  


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributors](#contributors)
- [Tests](#tests)
- [Questions](#questions)

## Installation

```bash
npm install
```

Navigate to the client directory and build the client
```bash
cd client
npm run build
```
Navigate to the server directory and build the server
```bash
cd server
npm run build
```

Navigate back to the root directory
```bash
cd ..
npm run build
```



## Usage 

Navigate to Render for deployment and use

```bash
build command: npm run render-build
start command: npm run render-start
```
Add environment variables to Render

## License

None

## Contributors

Melina Nevarez

## Tests

No terminal tests available.  Use Insomnia or other API testing tool.

## Questions

If you have any questions about the project, you can reach me at:

- GitHub: [melinanev](https://github.com/melinanev)
- Email: [melina.l.nevarez@gmail.com](mailto:melina.l.nevarez@gmail.com)
- Repository: https://github.com/melinanev/Mod18MERN-BookSearch.git
- Render: https://mod18mern-booksearch.onrender.com
