const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const dummyTodos = [{
  _id: new ObjectID(),
  text: 'First test dummy todo'
}, {
  _id: new ObjectID(),
  text: 'Second test dummy todo',
  completed: true,
  completedAt: 333
}];

// clear the database before each test
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummyTodos); // return allows for chaining promises, as below
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text); // response should have the same text property as the variable
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    let text = '';

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // find() returns all documents. this test assumes the database only has the inserted document
        Todo.find().then((todos) => {
          expect(todos.length).toBe(dummyTodos.length);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should return list of todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123eqweqwe')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = dummyTodos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .delete('/todos/123eqweqwe')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const hexId = dummyTodos[0]._id.toHexString();
    const updatedText = 'Updated todo text from testing';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: updatedText,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedText);
        expect(res.body.todo.completed).toBeTruthy();
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const hexId = dummyTodos[0]._id.toHexString();
    const text = 'Second updated todo text from testing';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: text,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBeFalsy();
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});