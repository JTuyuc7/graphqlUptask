const { ApolloServer, gql} = require('apollo-server');
// Importar los typeDefs 
const typeDefs = require('./db/schema');
// Importar los resolvers
const resolvers = require('./db/resolvers');
// Conectar DB
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

conectarDB()

const server = new ApolloServer({ typeDefs, 
    resolvers, 
    context: ({req}) => {
        //console.log(req.headers['authorization'], 'Desde backend')
        const token = req.headers['authorization'] || '';
        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA)
                //console.log(usuario, 'desde index backend')
                return{
                    usuario
                }
            } catch (error) {
                console.log(error, 'No token Found')
            }
        }
    } 
});

server.listen( { port: process.env.PORT || 4000 }).then( ({url}) => {
    console.log(`Server Runing on URL ${url}`)
})