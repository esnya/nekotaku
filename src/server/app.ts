import express from 'express';
import path from 'path';
import { connect, datastore as datastoreLogger } from './logger';
import Datastore from './Datastore';
import config from './config';

const app = express();
export default app;

app.use(connect);

const PublicPath = path.join(__dirname, '../../dist');
const FilePath = config.file.path;

const datastore = new Datastore({ ...config, logger: datastoreLogger });

app.use(express.static(PublicPath));
app.use('/files/:fileId', async (req: express.Request, res: express.Response) => {
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
app.get('*', (req: express.Request, res: express.Response) => res.sendFile(path.join(PublicPath, 'index.html')));
