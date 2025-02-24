const UserModel = require('../models/user.js')

const Users = class Users {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} connect
   */
  constructor (app, connect, authenticateToken) {
    this.app = app
    this.UserModel = connect.model('User', UserModel)
    this.authenticateToken = authenticateToken

    this.run()
  }

  /**
   * Delete by id
   */
    deleteById () {
      this.app.delete('/user/:id', this.authenticateToken, (req, res) => {
        try {
          this.UserModel.findByIdAndDelete(req.params.id).then((user) => {
            res.status(200).json(user || {})
          }).catch(() => {
            res.status(500).json({
              code: 500,
              message: 'Internal Server error'
            })
          })
        } catch (err) {
          console.error(`[ERROR] users/:id -> ${err}`)
  
          res.status(400).json({
            code: 400,
            message: 'Bad request'
          })
        }
      })
    }

  /**
   * Show by id
   */
  showById () {
    this.app.get('/user/:id', this.authenticateToken,  (req, res) => {
      try {
        if (req.user.role === 'coach') {
          this.UserModel.findById(req.params.id).then((user) => {
            res.status(200).json(user || {})
          }).catch(() => {
            res.status(500).json({
              code: 500,
              message: 'Internal Server error'
            })
          })
        } else {
          res.status(401).json({
            code: 401,
            message: 'Unauthorized you are not a coach'
          })
        }
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }
  updateById() {
    this.app.put('/user/:id', this.authenticateToken, (req, res) => {
      try {
        // Ex. n'autoriser que le rôle 'coach' à modifier
        if (!req.user || req.user.role !== 'coach') {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized - you are not a coach'
          });
        }

        this.UserModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true } // pour renvoyer le user mis à jour
        )
          .then((updatedUser) => {
            if (updatedUser) {
              res.status(200).json(updatedUser);
            } else {
              res.status(404).json({
                code: 404,
                message: 'User not found'
              });
            }
          })
          .catch((err) => {
            console.error(`[ERROR] users/update -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server Error'
            });
          });
      } catch (err) {
        console.error(`[ERROR] users/update -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Create
   */
  create () {
    this.app.post('/user/', (req, res) => {
      try {
        const userModel = new this.UserModel(req.body)

        userModel.save().then((user) => {
          res.status(200).json(user || {})
        }).catch(() => {
          res.status(200).json({})
        })
      } catch (err) {
        console.error(`[ERROR] users/create -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Run
   */
  run () {
    this.create()
    this.showById()
    this.deleteById()
    this.updateById();
  }
}

module.exports = Users
