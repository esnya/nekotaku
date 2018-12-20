import express from 'express';
import path from 'path';
import config from './config';
import Datastore from './Datastore';
import { connect, datastore as datastoreLogger } from './logger';

const app = express();
export default app;

app.use(connect);

const PublicPath = path.join(__dirname, '../../dist');
const FilePath = config.file.path;

const datastore = new Datastore({ ...config, logger: datastoreLogger });

app.use(express.static(PublicPath));
app.use('/files/:fileId', async (req, res) => {
  const {
    fileId,
  } = req.params;

  const file = await datastore.findOne('files', { id: fileId });
  if (!file) {
    res.sendStatus(404);
  } else {
    res.type(file.type);
    res.sendFile(path.resolve(FilePath, fileId));
  }
});
app.get('*', (req, res) => res.sendFile(path.join(PublicPath, 'index.html')));
