/**
 * Module for the HomeController.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Render home view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('home/index')
    } catch (error) {
      next(error)
    }
  }
}
