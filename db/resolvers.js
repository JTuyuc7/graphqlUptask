const Usuario = require('../models/Usuario');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const bcyptsj = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.evn'});

//Crear y firmar un token
const crearToken = (usuario, secreta, expiresIn) => {
    const { id, email, nombre } = usuario;

    return jwt.sign({ id, email, nombre}, secreta, { expiresIn } )
}

const resolvers = {
    Query: {
        obtenerProyectos: async (_, {}, ctx ) => {
            
            const proyectos = await Proyecto.find({ creador: ctx.usuario.id })

            return proyectos
        },

        obtenerTareas: async (_, {input}, ctx ) => {
            const tareas = await Tarea.find({ creador: ctx.usuario.id }).where('proyecto').equals(input.proyecto)

            return tareas
        }
    },

    Mutation: {
        crearUsuario: async (_, {input}, ctx) => {
            const { email, password } = input;

            const usuarioExiste = await Usuario.findOne({email})

            if(usuarioExiste){
                throw new Error('Usuario Ya registrado');
            }

            try {

                // Hashear el password
                const salt = await bcyptsj.genSalt(10);
                input.password = await bcyptsj.hash(password, salt )

                // Almacenar el usuario en DB
                const newUser = new Usuario(input);
                //console.log(newUser, 'Saved user')
                newUser.save()

                return 'Usuario Creado Correctamente';
            } catch (error) {
                console.log(error, 'User Already exist')
            }
        },
        autenticarUsuario: async (_, {input}, ctx) => {
            //console.log(input, 'Data para autenticar')
            const { email, password } = input;

            const findUser = await Usuario.findOne({email})
            if(!findUser){
                throw new Error('User was not Found');
            }

            const correctPassword = await bcyptsj.compare( password , findUser.password);

            if( !correctPassword ){
                throw new Error('Incorrect Password')
            }

            return {
                token: crearToken(findUser, process.env.SECRETA, '4hr' )
            }
        },
        crearProyecto: async (_, {input}, ctx) => {
            //console.log(input, 'Informacion Proyecto')
            //console.log(ctx, 'Context')
            const { nombre } = input;

            //validar que no este vacio
            if( nombre === '' ){
                throw new Error('Name is required for proyect');

            }

            try {
                const proyecto = new Proyecto(input);
                proyecto.creador = ctx.usuario.id;
                const resultado = await proyecto.save();

                return resultado;
                
            } catch (error) {
                console.log(error, 'Unable to save the Project')
            }
        },
        actulizarProyecto: async (_, { id ,input}, ctx) => {
            // revisar que el proyecto exista
            let proyectoFind = await Proyecto.findById(id);

            if(!proyectoFind){
                throw new Error('Proyect with the given ID was not foud')
            }

            // Revisar que pertenezca a la persona
            if( proyectoFind.creador.toString() !== ctx.usuario.id ){
                throw new Error('User has no permision to edit the project');
            }
            //console.log(proyectoFind, 'Proyecto Encontrodo')

            // Actualizar el proyecto
            proyectoFind = await Proyecto.findOneAndUpdate({ _id: id}, input, { new: true });
            return proyectoFind;
        },
        eliminarProyecto: async (_, {id}, ctx ) => {
            // Revisar que el proyecto exista
            const proyecto = await Proyecto.findById(id);

            if(!proyecto ){
                throw new Error('Project not found');
            }

            if( proyecto.creador.toString() !== ctx.usuario.id ){
                throw new Error('User is not allowed to delete the project')
            }

            // Eliminar el proyecto
            await Proyecto.findOneAndDelete({_id: id})

            return 'Project deleted succesfully';
        },


        // Tareas
        nuevaTarea: async (_, {input}, ctx) => {
            const { nombre, proyecto } = input;
            if( nombre === '' || proyecto === ''){
                throw new Error('Fields are required')
            }
            
            try {
                const tarea = new Tarea(input);
                tarea.creador = ctx.usuario.id;

                const resultado = await tarea.save()

                return resultado;
            } catch (error) {
                console.log(error, 'Unable to save the Task')
            }
        },

        // Actualizar la tarea
        actualizarTarea: async (_, {id, input, estado}, ctx) => {
            //console.log(id, input, 'informacion para actualizar')

            let tarea = await Tarea.findById(id);
            if(!tarea){
                throw new Error('Task with the giving ID was not found')
            }

            // Revisar que el usuario tenga permiso
            if( tarea.creador.toString() !== ctx.usuario.id ){
                throw new Error('User has not access to the task');
            }

            input.estado = estado;

            tarea = await Tarea.findOneAndUpdate( {_id: id}, input, { new: true });

            return tarea
        },

        // Eliminar Tarea
        eliminarTarea: async (_, {id}, ctx) => {
            const tarea = await Tarea.findById(id);

            if(!tarea){
                throw new Error('Task with the givin ID was not found');
            }

            if( tarea.creador.toString() !== ctx.usuario.id ){
                throw new Error('User has no access to this Task')
            }

            await Tarea.findOneAndDelete({ _id: id })

            return 'Task deleted succesfully';
        }
    }
};

module.exports = resolvers;