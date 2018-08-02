# Todo API in Node with User authentication
### Auth via JWT. Database using MongoDB. Mongoose as ORM. Testing with Mocha, Expect and Supertest.

#### You can: `register` and `login` a User.

That user gets a unique `JWT` (JSON Web Token) which serves as the authentication for the manipulation of Todos. 

#### You can: `create`, `get`, `update`, `delete`, and `list` Todos

Todos are authenticated based on a header (`x-auth`), which has the `token` value of the signed in user. 
  
If the token is valid, then the Todo actions are executed. Else, it returns a `401 Unauthorized` status code.

## Core Dependencies
#### Hashing and salting passwords: [`bcryptjs`](https://www.npmjs.com/package/bcryptjs)
#### JWT Authentication: [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
#### Utility: [`lodash`](https://lodash.com/docs/4.17.10)
#### Database: [`mongodb`](https://docs.mongodb.com/)
#### ORM: [`mongoose`](http://mongoosejs.com/docs/guide.html)
#### Database utility tool: [`Robo3T`](https://robomongo.org/)
#### Validate email: [`validator`](https://www.npmjs.com/package/validator)

## Test dependencies
#### Assertions: [`expect`](https://jestjs.io/docs/en/expect.html)
#### Testing framework: [`mocha`](https://mochajs.org/)
#### HTTP assertions: [`supertest`](https://www.npmjs.com/package/supertest)
