const { ApolloServer, gql} = require('apollo-server');


const typeDefs = gql`

    type Curso {
        titulo: String
    }

    type Query {
        obtenerCursos: [Curso]
    }
`;

const cursos = [
    {
        titulo: 'JavaScript Moderno Guia Definiva construye +10 proyectos',
        tecnologia: 'Javascript ES6'
    },
    {
        titulo: 'React - a guia completa Hooks context redux Mern +15 apps',
        tecnologia: 'React'
    },
    {
        titulo: 'Node.js - Bootcamp desarrolo web inc RVC y Rest API´s',
        tecnologia: 'Node.js'
    },
    {
        titulo: 'React Js Avanzado - Fullstack React GraphQL y apollo',
        tecnologia: 'React'
    }
]


const resolvers = {
    Query: {
        obtenerCursos: () => cursos,
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then( ({url}) => {
    console.log(`Server Runing on URL ${url}`)
})