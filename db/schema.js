const { gql } = require('apollo-server');

const typeDefs = gql`

    type Token{
        token: String
    }

    type Proyecto{
        nombre: String
        id: ID
    }

    type Tarea {
        nombre: String
        id: ID
        proyecto: String
        estado: Boolean
    }

    
    input ProyectoIDInput {
        proyecto: String!
    }


    type Query {

        obtenerProyectos: [Proyecto]

        obtenerTareas( input: ProyectoIDInput): [Tarea]
    }



    input ProyectoInput {
        nombre: String!
    }

    input UsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    input TareaInput {
        nombre: String!
        proyecto: String!
    }

    type Mutation{
        crearUsuario(input : UsuarioInput): String
        autenticarUsuario(input: AutenticarInput): Token
        crearProyecto( input: ProyectoInput ): Proyecto
        actulizarProyecto( id: ID!, input: ProyectoInput): Proyecto
        eliminarProyecto(id: ID) : String


        nuevaTarea( input: TareaInput) : Tarea
        actualizarTarea( id: ID, input : TareaInput, estado: Boolean ) : Tarea
        eliminarTarea( id: ID! ) : String
    }
`;

module.exports = typeDefs;