const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function getIndexOfRepository(id){
  return repositories.findIndex(repository => repository.id === id);
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {

  const {title,url,techs} = request.body;
  const id = uuid();
  const repository = {id,title,url,techs,likes:0};
  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const indexRepository = getIndexOfRepository(id);
  if(indexRepository === -1){
    response.status(400).json({Error:'Id not found'});
  }

  const {title,url} = request.body;
  const techs = request.body.techs;
  const likes = repositories[indexRepository].likes;
  const repository = {id,title,url,techs,likes};
  repositories[indexRepository] = repository;
  
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const indexRepository = getIndexOfRepository(id);

  if(indexRepository === -1){
    return response.status(400).json({Error:'Id not found'});
  }
  repositories.splice(indexRepository,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const {id} = request.params;
  const indexRepository = getIndexOfRepository(id);
  if(indexRepository === -1){
    return response.status(400).json({Error:'Id not found'});
  }
  const repository = repositories[indexRepository];
  repository.likes = repository.likes+1;
  repositories[indexRepository] = repository;

  return response.json(repository);
  
});

module.exports = app;
