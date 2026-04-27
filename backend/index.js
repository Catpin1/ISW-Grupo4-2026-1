"use strict";
import cors from 'cors';
import morgan from 'morgan';
import cockieParser from 'cookie-parser';
import indexRoutes from './routes/index.routes.js';
import session from 'express-session';
import passport from 'passport';
import express,{json, urlencoded} from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {createServer} from 'http';
import { Server } from 'socket.io';
import {cokieKey,HOST,PORT,EMAIL_USER,EMAIL_PASS} from './config/configEnv.js';
import {connectDb} from './config/db.js';
import {createUser} from "./config/initialSetup.js";
//todavia no tenemos autorizaciones F
//import {passportJwtSetup} from './auth/passport.auth.js';
//todavia no tenemos servicios F
//import {saveMesageService} from './services/chat.service.js';