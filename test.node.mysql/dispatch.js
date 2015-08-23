var
  child_process = require('child_process');

for(var i = 0;i < 4;i++){
  var
    child = child_process.fork('./client');
  child.send(i + 1);
}
