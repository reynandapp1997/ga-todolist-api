const express = require('express');
const router = express.Router();

const {
    getAllTodo,
    getTodoDetail,
    getMyTodo,
    addTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todo');
const auth = require('../middlewares/auth');

router.get('/', getAllTodo);
router.get('/:id', getTodoDetail);
router.get('/auth/mytodo', auth, getMyTodo);
router.post('/', auth, addTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;
