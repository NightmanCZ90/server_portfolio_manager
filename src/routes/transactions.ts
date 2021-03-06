import { Router } from 'express';
import { body } from 'express-validator';

import transactionsController from '../controllers/transactions';
import isAuth from '../middlewares/is-auth';
import { isExecutionTypeValid, isTransactionTypeValid } from '../utils/helpers';

/**
 * Validations
 */

const transactionValidation = [
  body('stockName')
    .notEmpty()
    .withMessage('Stock name must not be empty.')
    .isLength({
      max: 20,
    })
    .withMessage('Max length of stock name is 20 chars.'),
  body('stockSector')
    .optional()
    .isLength({
      max: 20,
    })
    .withMessage('Max length of stock sector is 20 chars.'),
  body('transactionTime')
    .notEmpty()
    .isISO8601()
    .toDate()
    .withMessage('Transaction time is not a valid date format.'),
  body('transactionType')
    .custom(isTransactionTypeValid)
    .withMessage('Invalid transaction type.'),
  body('numShares')
    .isNumeric(),
  body('price')
    .isNumeric(),
  body('currency')
    .notEmpty()
    .withMessage('Stock currency must not be empty.')
    .isLength({
      max: 4,
    })
    .withMessage('Max length of currency is 4 chars.'),
  body('execution')
    .custom(isExecutionTypeValid)
    .withMessage('Invalid execution type.'),
  body('commissions')
    .optional()
    .isNumeric(),
  body('notes')
    .optional()
    .isString(),
  body('portfolioId')
    .notEmpty()
    .isInt()
];

/**
 * Routes
 */

const router = Router();

router.get(
  '/portfolios/:pId/transactions',
  isAuth,
  transactionsController.getPortfolioTransactions
);

router.post(
  '/transactions',
  isAuth,
  transactionValidation,
  transactionsController.createTransaction
);

router.get(
  '/transactions/:id',
  isAuth,
  transactionsController.getTransaction
);

router.get(
  '/transactions',
  isAuth,
  transactionsController.getTransactions
);

router.put(
  '/transactions/:id',
  isAuth,
  transactionValidation,
  transactionsController.updateTransaction
);

router.delete(
  '/transactions/:id',
  isAuth,
  transactionsController.deleteTransaction
);

export default router;
