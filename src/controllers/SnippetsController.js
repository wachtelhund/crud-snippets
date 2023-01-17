import hljs from 'highlight.js'
/**
 * Module for the SnippetsController.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
const viewData = [
  {
    user: 'Hampus Nilsson',
    title: 'Hello World',
    code: 'console.log("Hello World!")',
    language: 'javascript'
  },
  {
    user: 'Mala',
    title: 'Hello World in Java',
    code: 'public class HelloWorld {\npublic static void main(String[] args) {\n System.out.println("Hello World!");\n }\n}',
    language: 'java'
  },
  {
    user: 'Mala',
    title: 'Hello World in Java',
    code: 'public class HelloWorld {\npublic static void main(String[] args) {\n System.out.println("Hello World!");\n }\n}',
    language: 'java'
  }
]
export class SnippetsController {
  /**
   * Render snippets view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('snippets/index', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }

  async createForm (req, res, next) {
    try {
      res.render('snippets/create')
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      console.log(req.body);
      res.render('snippets/create')
    } catch (error) {
      next(error)
    }
  }
}
