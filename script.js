var MyToDo = {};
MyToDo.webdb = {};
MyToDo.webdb.db = null;

MyToDo.webdb.open = function(){
  var dbSize = 5 * 1024*1024;
  MyToDo.webdb.db = openDatabase("ToDo2", "1", "ToDo2 manager",dbSize);
}

MyToDo.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

MyToDo.webdb.onSuccess = function(tx, e){
  MyToDo.webdb.getAllTodoItems(loadTodoItems);
}

MyToDo.webdb.createTable = function() {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS " + "ToDo2(ID INTEGER PRIMARY KEY ASC, todo TEXT, user TEXT, added_on DATETIME)", []);
  });
}

MyToDo.webdb.addTodo = function(todoText, userText) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO ToDo2(todo, user, added_on) VALUES (?,?,?)",
    [todoText, userText, addedOn],
    MyToDo.webdb.onSuccess,
    MyToDo.webdb.onError);
  });
}

MyToDo.webdb.getAllTodoItems = function(renderFunc) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM ToDo2", [], renderFunc, MyToDo.webdb.onError);
  });
}

function loadTodoItems(tx, rs){
  var rowOutput = "";
  var todoItems = document.getElementById("todoItems");
  for(var i=0; i < rs.rows.length; i++){
    rowOutput += renderTodo(rs.rows.item(i));
  }

  todoItems.innerHTML = rowOutput;
}

function renderTodo(row) {
  return "<li>" + row.todo + " User: " + row.user + " [<a href='javascript:void(0);' onclick=\'MyToDo.webdb.deleteTodo(" + row.ID + ");\'>Delete</a>]</li>";
}

MyToDo.webdb.deleteTodo = function(id) {
  var db = MyToDo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM ToDo2 WHERE ID=?", [id], MyToDo.webdb.onSuccess,
    MyToDo.webdb.onError);
  });
}

function init(){
  MyToDo.webdb.open();
  MyToDo.webdb.createTable();

  MyToDo.webdb.getAllTodoItems(loadTodoItems);
}
function addTodo(){
  var todo = document.getElementById("todo");
  var user = document.getElementById("user");
  MyToDo.webdb.addTodo(todo.value, user.value);
  todo.value = "";
  user.value = "";
}