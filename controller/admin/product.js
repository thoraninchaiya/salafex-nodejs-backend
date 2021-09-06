var conn = require('../../connect');


const getproduct = (req, res)=>{
    var sqlget = `SELECT * FROM product`;
    var sqlsearch = `SELECT * FORM product WHERE id = ?`;
    var params = [req.params.id];
}

const addproduct = (req, res)=>{

}

const editproduct = (req, res)=>{

}

const delproduct = (req, res)=>{

}

module.exports = {
    getproduct,
    addproduct,
    editproduct,
    delproduct
}