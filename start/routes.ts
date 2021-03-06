/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })
  Route.group(() => {
    Route.post("/insertNewUser", "UsersController.insertUser");
    Route.post("/login", "AuthController.login");
    Route.post("/specialRoute", "UsersController.specialRoute");
    Route.post("/recover/:id", "UsersController.updatePassword");
    Route.post("/recoverPass", "UsersController.recoverPass");
    Route.post("/findByEmail", "UsersController.findUserByEmail");
    Route.get("/findById/:id", "UsersController.findUserById");


  }).prefix("/user")

  Route.group(() => {
    Route.resource("/announce", "AnnouncesController").apiOnly();
  }).middleware("auth");
  Route.get("/findAllAnnounces", "AnnouncesController.findAllAnnounces");
  Route.get("/allAnnouncesByUser/:id", "AnnouncesController.allAnnouncesByUser");


}).prefix("/api")

