const mongoose = require('mongoose');
require('dotenv').config({
    path: 'variables.env'
});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO_NATIVE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        })

        console.log('Db Connected correctly')
    } catch (error) {
        console.log(error, 'Unable to connect DB')
        process.exit(1) // detener la APP
    }
}

module.exports = conectarDB;
//&replicaSet=atlas-hfrxks-shard-0&authSource=admin&retryWrites=true&w=majority

