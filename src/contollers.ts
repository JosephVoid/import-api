import mysql2 from "mysql2"
import dotenv from "dotenv"

dotenv.config();

export interface IData {
  id: string;
  item_no: string;
  item_desc: string;
  item_qty: string;
  item_price: string;
  item_rate: string;
  item_unit: string
}

var connection = mysql2.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

connection.connect(function(err) {
  if (err) {
    console.error('Error Connecting: ' + err.stack);
    return;
  }
});

export const CreateTableController = (req, res) => {
  let request_data:IData[] = req.body
  let table_name = req.params.name

  connection.execute('CREATE TABLE '+connection.escapeId(table_name)+' (id INT AUTO_INCREMENT, PRIMARY KEY (id), item_no VARCHAR(20), item_desc VARCHAR(2000), item_qty VARCHAR(20), item_price VARCHAR(20), item_rate VARCHAR(20), item_unit VARCHAR(20))', (error) => {
    if (error) console.log(error)
  })
  
  /* Turn the request into an insert statement */
  let insert_query = 'INSERT INTO '+connection.escapeId(table_name)+' (item_no, item_desc, item_qty, item_price, item_rate, item_unit) VALUES '
  request_data.forEach((data, index) => {
    insert_query += `('${data.item_no}', '${data.item_desc.split("'").join(" ")}', '${data.item_qty}', '${data.item_price}', '${data.item_rate}', '${data.item_unit}')`
    if (index+1 !== request_data.length) insert_query += ', '
  })

  connection.query(insert_query, (error) => {
    if (error) console.log(error)
    else res.status(200).json(request_data)
  })
}

export const DeleteTableController = (req, res) => {
  let table_id = req.params.id
  
  connection.execute('DROP TABLE '+connection.escapeId(table_id), (error) => {
    if (error) res.status(500).send(error)
  })

  return res.status(200).json(table_id)
}

export const GetTableController = (req, res) => {
  let table_id = req.params.id

  connection.query('SELECT * FROM '+connection.escapeId(table_id), (error, results) => {
    if (error) res.status(500).send(error)
    else res.status(200).json(formatter(results as any))
  })
}

export const GetTablesController = (req, res) => {
  connection.query('SHOW TABLES', (error, results) => {
    if (error) res.status(500).send(error)
    else res.status(200).json(results)
  })
}

export const UpdateTableController = (req, res) => {
  let request_data:IData[] = req.body
  let table_id = req.params.id

  connection.execute('DELETE FROM '+connection.escapeId(table_id)+' WHERE 1', (error) => {
    if (error) console.log(error)
  })

  /* Turn the request into an insert statement */
  let insert_query = 'INSERT INTO '+connection.escapeId(table_id)+' (item_no, item_desc, item_qty, item_price, item_rate, item_unit) VALUES '
  request_data.forEach((data, index) => {
    insert_query += `('${data.item_no}', '${data.item_desc.split("'").join(" ")}', '${data.item_qty}', '${data.item_price}', '${data.item_rate}', '${data.item_unit}')`
    if (index+1 !== request_data.length) insert_query += ', '
  })

  connection.query(insert_query, (error) => {
    if (error) console.log(error)
    else res.status(200).json(request_data)
  })
}

/* Copy id value into key */
function formatter (results:any[]):IData[] {
  var res_ = [...results]
  for (var i in res_) {
    res_[i].key = res_[i].id
  }
  return res_ as IData[]
}