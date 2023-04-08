const path = require("path");
const process = require("process");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(process.cwd(), "todo.proto");

// function sayHello(call, callback) {
//   callback(null, { message: "Hello " + call.request.name });
// }

// function sayHelloAgain(call, callback) {
//   callback(null, { message: "Hello again, " + call.request.name });
// }

const todos = [];

function createTodo(call, callback) {
  console.dir(call.request);
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  // console.log(call);

  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodosStream(call, callback) {
  todos.forEach(todoItem => call.write(todoItem));
  call.end();
}

function main() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);

  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const todoPackage = grpcObject.todoPackage;

  var server = new grpc.Server();
  server.addService(todoPackage.Todo.service, {
    createTodo,
    readTodos,
    readTodosStream
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.err(err);
        return;
      }
      console.log(port);
      server.start();
    }
  );
}

if (require.main === module) {
  main();
}
