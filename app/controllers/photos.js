// controllers/photos.js

const PhotoModel = require('../models/photo.js');
const AlbumModel = require('../models/album.js');

class Photos {
  /**
   * @constructor
   * @param {Object} app - Instance d'Express
   * @param {Object} connect - Connection Mongoose (this.connect)
   * @param {Function} authenticateToken - Middleware de vérification JWT
   */
  constructor(app, connect, authenticateToken) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.authenticateToken = authenticateToken;

    this.run();
  }

  /**
   * CREATE - Ajouter une photo dans un album
   * POST /album/:albumId/photo
   */
  create() {
    this.app.post('/album/:albumId/photo', this.authenticateToken, async (req, res) => {
      try {
        // Exemple: seul un 'coach' peut créer une photo
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        const { albumId } = req.params;

        // Vérifier que l'album existe
        const album = await this.AlbumModel.findById(albumId);
        if (!album) {
          return res.status(404).json({
            code: 404,
            message: 'Album not found'
          });
        }

        // Créer la photo en liant l'album
        const newPhoto = new this.PhotoModel({
          ...req.body,
          album: album._id
        });

        const savedPhoto = await newPhoto.save();

        res.status(201).json(savedPhoto);
      } catch (err) {
        console.error(`[ERROR] photos/create -> ${err}`);
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  /**
   * READ ALL - Récupérer toutes les photos d'un album
   * GET /album/:albumId/photo
   */
  showAll() {
    this.app.get('/album/:albumId/photo', this.authenticateToken, async (req, res) => {
      try {
        // Exemple: on autorise tout utilisateur authentifié à voir les photos
        // Vous pouvez restreindre à un rôle précis si nécessaire

        const { albumId } = req.params;

        // Vérifier que l'album existe
        const album = await this.AlbumModel.findById(albumId);
        if (!album) {
          return res.status(404).json({
            code: 404,
            message: 'Album not found'
          });
        }

        // Récupérer toutes les photos associées à cet album
        const photos = await this.PhotoModel.find({ album: albumId });

        res.status(200).json(photos);
      } catch (err) {
        console.error(`[ERROR] photos/showAll -> ${err}`);
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  /**
   * READ ONE - Récupérer une photo précise
   * GET /album/:albumId/photo/:photoId
   */
  showById() {
    this.app.get('/album/:albumId/photo/:photoId', this.authenticateToken, async (req, res) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const { albumId, photoId } = req.params;

        // Vérifier que l'album existe
        const album = await this.AlbumModel.findById(albumId);
        if (!album) {
          return res.status(404).json({
            code: 404,
            message: 'Album not found'
          });
        }

        // Récupérer la photo
        const photo = await this.PhotoModel.findOne({
          _id: photoId,
          album: albumId
        });

        if (!photo) {
          return res.status(404).json({
            code: 404,
            message: 'Photo not found in this album'
          });
        }

        res.status(200).json(photo);
      } catch (err) {
        console.error(`[ERROR] photos/showById -> ${err}`);
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  /**
   * UPDATE - Mettre à jour une photo par son ID
   * PUT /album/:albumId/photo/:photoId
   */
  updateById() {
    this.app.put('/album/:albumId/photo/:photoId', this.authenticateToken, async (req, res) => {
      try {
        // Exemple: Seul un coach peut mettre à jour une photo
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        const { albumId, photoId } = req.params;

        // Vérifier que l'album existe
        const album = await this.AlbumModel.findById(albumId);
        if (!album) {
          return res.status(404).json({
            code: 404,
            message: 'Album not found'
          });
        }

        // Mettre à jour la photo
        // On s'assure que la photo est dans le bon album
        const updatedPhoto = await this.PhotoModel.findOneAndUpdate(
          { _id: photoId, album: albumId },
          req.body,
          { new: true }
        );

        if (!updatedPhoto) {
          return res.status(404).json({
            code: 404,
            message: 'Photo not found in this album'
          });
        }

        res.status(200).json(updatedPhoto);
      } catch (err) {
        console.error(`[ERROR] photos/updateById -> ${err}`);
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  /**
   * DELETE - Supprimer une photo d'un album
   * DELETE /album/:albumId/photo/:photoId
   */
  deleteById() {
    this.app.delete('/album/:albumId/photo/:photoId', this.authenticateToken, async (req, res) => {
      try {
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        const { albumId, photoId } = req.params;

        // Vérifier l'album
        const album = await this.AlbumModel.findById(albumId);
        if (!album) {
          return res.status(404).json({
            code: 404,
            message: 'Album not found'
          });
        }

        // Supprimer la photo liée
        const deletedPhoto = await this.PhotoModel.findOneAndDelete({
          _id: photoId,
          album: albumId
        });

        if (!deletedPhoto) {
          return res.status(404).json({
            code: 404,
            message: 'Photo not found in this album'
          });
        }

        res.status(200).json({
          message: `Photo '${deletedPhoto.title}' deleted.`,
          photo: deletedPhoto
        });
      } catch (err) {
        console.error(`[ERROR] photos/deleteById -> ${err}`);
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  /**
   * Installe toutes les routes
   */
  run() {
    this.create();
    this.showAll();
    this.showById();
    this.updateById();
    this.deleteById();
  }
}

module.exports = Photos;
