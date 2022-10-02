import express from "express";
import { api } from "./api";
import session from 'cookie-session';
import { auth } from "./auth";

const app = express();
app.use(session({
  secret: process.env['SESSION_SECRET'] || "my secret"
}))
app.use(auth);
app.use(api);

const frontendFiles = process.cwd() + '/dist';
app.use(express.static(frontendFiles));
app.get('/*', (_, res) => {
  res.send(frontendFiles + '/index.html');
});

app.listen(process.env["PORT"] || 3002, () => console.log("Started :)"));