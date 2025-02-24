// controllers/albums.js

const AlbumModel = require('../models/album.js');

class Albums {
  /**
   * @constructor
   * @param {Object} app - L'instance d'Express
   * @param {Object} connect - La connexion Mongoose (this.connect)
   * @param {Function} authenticateToken - Middleware JWT pour vérifier le token
   */
  constructor(app, connect, authenticateToken) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.authenticateToken = authenticateToken;

    // Lance la configuration des routes
    this.run();
  }

  /**
   * Créer un album
   * POST /album
   */
  create() {
    this.app.post('/album', this.authenticateToken, (req, res) => {
      try {
        // Exemple : vérifier si l'utilisateur est 'coach'
        // (selon votre logique, vous pouvez aussi autoriser tout le monde)
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        const newAlbum = new this.AlbumModel(req.body);

        newAlbum
          .save()
          .then((album) => {
            // Renvoyer l'album créé
            res.status(201).json(album);
          })
          .catch((err) => {
            console.error(`[ERROR] albums/create -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] albums/create -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Afficher tous les albums
   * GET /album
   */
  showAll() {
    this.app.get('/album', this.authenticateToken, (req, res) => {
      try {
        this.AlbumModel.find({})
          .then((albums) => {
            res.status(200).json(albums);
          })
          .catch((err) => {
            console.error(`[ERROR] albums/showAll -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] albums/showAll -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Afficher un album par ID
   * GET /album/:id
   */
  showById() {
    this.app.get('/album/:id', this.authenticateToken, (req, res) => {
      try {
        // Par exemple, on autorise UNIQUEMENT le rôle 'coach' à consulter un album
        if (req.user && req.user.role === 'coach') {
          this.AlbumModel.findById(req.params.id)
            .then((album) => {
              if (album) {
                res.status(200).json(album);
              } else {
                res.status(404).json({
                  code: 404,
                  message: 'Album not found'
                });
              }
            })
            .catch((err) => {
              console.error(`[ERROR] album/:id -> ${err}`);
              res.status(500).json({
                code: 500,
                message: 'Internal Server Error'
              });
            });
        } else {
          res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Mettre à jour un album par ID
   * PUT /album/:id
   */
  updateById() {
    this.app.put('/album/:id', this.authenticateToken, (req, res) => {
      try {
        // Ex. n'autoriser que le rôle 'coach' à modifier
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        this.AlbumModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true } // pour renvoyer l'album mis à jour
        )
          .then((updatedAlbum) => {
            if (updatedAlbum) {
              res.status(200).json(updatedAlbum);
            } else {
              res.status(404).json({
                code: 404,
                message: 'Album not found'
              });
            }
          })
          .catch((err) => {
            console.error(`[ERROR] albums/update -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] albums/update -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Supprimer un album par ID
   * DELETE /album/:id
   */
  deleteById() {
    this.app.delete('/album/:id', this.authenticateToken, (req, res) => {
      try {
        // Ex. n'autoriser que le rôle 'coach' à supprimer
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        this.AlbumModel.findByIdAndDelete(req.params.id)
          .then((album) => {
            if (album) {
              res.status(200).json({
                message: `Album '${album.title}' deleted.`,
                album
              });
            } else {
              res.status(404).json({
                code: 404,
                message: 'Album not found'
              });
            }
          })
          .catch((err) => {
            console.error(`[ERROR] album/:id -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Active toutes les routes de la classe
   */
  run() {
    this.create();
    this.showAll();
    this.showById();
    this.updateById();
    this.deleteById();
  }
}

module.exports = Albums;
