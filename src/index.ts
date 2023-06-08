import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import { CreateTableController, DeleteTableController, GetTableController, GetTablesController, UpdateTableController } from "./contollers.js";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors())

app.get('/get-table/:id', GetTableController)
app.get('/get-tables', GetTablesController)
app.post('/create-table/:name', CreateTableController)
app.put('/update-table/:id', UpdateTableController)
app.delete('/delete-table/:id', DeleteTableController)

app.listen(3000, () => {
  console.log("API up @ port 3000")
})