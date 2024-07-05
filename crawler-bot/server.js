const express = require('express');
const transform = require('node-json-transform').transform;
const cors = require('cors');
const inputData = require('./output/data.json');

const app = express();
const port = 3003;

app.use(cors());

app.get('/api/data', (req, resp) => {

  const schema = {
    name: "repository.name",
    attributes: {
      url: "repository.url",
      profile: "repository.profile",
      stars: "stars",
      issues: "issues",
      pullRequests: "pullRequests",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      forks: "forks.count"
    },
    children: "forks.repositories"
  };

  const opertor = {
    run: (children) => recursiveTransform(children),
    on: "children"
  }

  const mapper = {
    item: schema,
    operate: [ opertor ]
  }

  const recursiveTransform = (arr, tx = []) => {
    if (!Array.isArray(arr)) return arr;
    const res = arr?.map(child =>  transform(child, mapper));
    const tRes = res?.map(child => recursiveTransform(child, tx));

    return tx.concat(tRes);
  }
  const response = transform(inputData, mapper);

  return resp.json(response);

});


app.listen(port, function(err) {
  if (err) console.log(err);
  console.log("Server listening on PORT: ", port);
})
