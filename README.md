### Summary

This app provides a journal that allows the user to record which of the [New Hampshire 48 4,000-footers](http://4000footers.com/nh.shtml) they have hiked, adding descriptions of their hike and uploading photos.  This repository contains the application API.

  Link to front-end repository: <https://github.com/wcons/mountain-client-react>

  Link to deployed application: <https://wcons.github.io/mountain-client-react>

  Link to Heroku deployment: <https://evening-taiga-11840.herokuapp.com/>

### Technologies Used
  * Express.js
  * Node.js
  * MongoDB

### Oustanding issues/unsolved problems:

In future iterations, I hope to include many more of my originally planned features including:
* Use seeded 4,000 footer name and location data to create a dropdown where users can select mountains and have lat/long automatically added
* Add photo uploads for photos of your hike
* Add a "date summited" field
* Make lists of mountains public, but only editable by the owner

### Planning, process, and problem solving

In planning this application, I wanted to make sure I had a working project idea, but also left room to challenge myself as time allowed.  I planned a project that would show basic CRUD operations, integrate a 3rd-party map API, use seed data to create a user-mountain relationship using a prepopulated list of the 48 mountains, and include image uploads.

I had to significantly scale back what I wanted to do in order to produce a working app for my MVP.  This necessitated going back and rescoping, removing anything that wasn't essential.  I stripped everything down to basic CRUD operations as a first iteration.

I originally planned to use MongoDB, then realized as I did my entity-relationship diagram that this project was particularly well suited to a relational database like Postgresql with a join table for users and mountains.  I took a crack at implementing this, but then realized that in the interest of time, I really needed to stick with what I already had and was more familiar with deploying instead.  Going forward, I think I learned something from this and am more equipped to think through my data relationships more clearly before choosing a tool.

### ERD

[Current ERD](https://i.imgur.com/QDsB9zG.jpg)

[ERD for planned future functionality](https://i.imgur.com/nIVRQOo.jpg)

### API Routes

* /sign-up
* /sign-in
* /change-password
* /sign-out
* /mountains
* /mountain/:id
* /mountains/:id/edit

### Installation & Setup instructions

There are no special set-up insctructions or additional components to install at this time.
