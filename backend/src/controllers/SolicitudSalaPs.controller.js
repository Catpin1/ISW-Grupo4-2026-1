"use strict";

import { AppDataSource } from "../config/configDb.js";
import { solicitudsalapsCreateSchema, solicitudsalapsUpdateSchema} from "../validations/SolicitudSalaPs.val.js";
import { sendErrorClient, sendSuccess, sendErrorServer } from "../handlers/ResponseHandlers.js";

const solicitudSalaPsRepository = AppDataSource.getRepository("SolicitudSalaPs");
const personaRepository = AppDataSource.getRepository("Persona");
const salaRepository = AppDataSource.getRepository("Sala");

export const createSolicitudSalaPs = async (req, res) => {
    try {
        const {error} = solicitudsalapsCreateSchema.validate(req.body);
        if (error) {
            return sendErrorClient(res, error, 400)
        }
        const {id_persona} = req.body.id_persona;
        const persona = await personaRepository.findOneBy({id: id_persona});
        const {id_sala} = req.body.id_sala;
        const sala = await salaRepository.findOneBy({id: id_sala});

        if(!persona){
            return res.status(404).json({message:"Persona no encontrada para crear solicitud."});
        }
        if(!sala){
            return res.status(404).json({message: "Sala no encontrada para crear solicitud."})
        }
        if (sala.tipo !== "Psicotecnica"){
            return res.status(400).json({message: "Solo se pueden crear solicitudes para salas psicotecnicas"})
        }
        const nuevaSolicitudSalaPs = solicitudSalaPsRepository.create({
            descripcion:req.body.descripcion,
            asistentes:req.body.asistentes,
            estado_solicitud:req.body.estado_solicitud,
            persona: {id: id_persona},
            sala: {id: id_sala}
        })
        const resultado = await solicitudSalaPsRepository.save(nuevaSolicitudSalaPs);
        return sendSuccess(res, resultado, "Solicitud creada correctamente", 201)
    }catch(error){
        return sendErrorServer(res, error, 500)
    }
}
export const getSolicitudSalaPs = async (req, res) => {
    try {
        const Solicitudes = await solicitudSalaPsRepository.find()
        return res.json(Solicitudes);
    }catch(error){
        return sendErrorServer(res, error, 500);
    }
}

export const getSolicitudSalaPsId = async (req, res) => {
    try{
        const {id} = req.params;
        const solicitud = await solicitudSalaPsRepository.findOneBy({id: parseInt(id)});

        if (!solicitud){
            return res.status(404).son({message: "Solicitud no encontrada."})
        }
        return res.json(solicitud);
    }catch(error){
        return sendErrorServer(res, error, 500);
    }
}

export const updateEstadoSolicitud = async (req, res) => {
    try{
        const {error} = solicitudsalapsUpdateSchema.validate(req.body);
        if (error){
            return sendErrorClient(res, error, 400);
        }
        const {id}=req.params;
        const solicitud = await solicitudSalaPsRepository.findOneBy({id: parseInt(id)})
        const persona = await personaRepository.findOneBy({id: parseInt(id)})

        if(!solicitud){
            return res.status(404).json({message: "Solicitud no encontrada"});
        }

        solicitudSalaPsRepository.merge(solicitud, req.body);
        const resultado = await solicitudSalaPsRepository.save(solicitud);

        if (req.body.estado_solicitud==="Aprobado"){
            const sala = await salaRepository.findOneBy({id: solicitud.id_sala})
            if(persona.rol === "Alumno" && sala.estado_solicitud === "Pendiente"){
                sala.estado_solicitud = "Aprobado";
                await salaRepository.save(sala);
            }
        }
        return res.json(resultado);
    }catch(error){
        return sendErrorServer(res, error, 500)
    }
}
