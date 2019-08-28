const Todo = require('../models/todo');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getAllTodo = (req, res, next) => {
    const {
        status
    } = req.query;
    let query;
    if (status) {
        query = {
            status
        };
    }
    Todo.find(query)
        .sort({
            dueDateTime: 1
        })
        .populate('userId', '-password')
        .exec()
        .then(result => res.status(200).json(successResponse('success', result.length, result)))
        .catch(error => res.status(500).json(errorResponse(error)));
};

exports.getTodoDetail = (req, res, next) => {
    const id = req.params.id;
    Todo.findById(id)
        .populate('userId', '-password')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json(errorResponse('Todo not found'));
            }
            return res.status(200).json(successResponse('success', null, result))
        })
        .catch(error => res.status(500).json(errorResponse(error)));
};

exports.getMyTodo = (req, res, next) => {
    const {
        status
    } = req.query;
    const userId = req.user.id;
    let query = {
        userId
    };
    if (status) {
        query = {
            userId,
            status
        }
    }
    Todo.find(query)
        .sort({
            dueDateTime: 1
        })
        .populate('userId', '-password')
        .exec()
        .then(result => res.status(200).json(successResponse('success', result.length, result)))
        .catch(error => res.status(500).json(errorResponse(error)));
};

exports.addTodo = (req, res, next) => {
    const userId = req.user.id;
    const {
        title,
        description,
        priority,
        dueDateTime
    } = req.body;
    const newTodo = new Todo({
        title,
        description,
        priority,
        dueDateTime,
        userId
    });
    newTodo.save()
        .then(result => res.status(201).json(successResponse('Todo added')))
        .catch(error => res.status(500).json(errorResponse(error)));
};

exports.updateTodo = async (req, res, next) => {
    const id = req.params.id;
    const checkTodo = await Todo.findById(id);
    if (!checkTodo) {
        return res.status(404).json(errorResponse('Todo not found'));
    }
    const userId= req.user.id;
    const {
        title,
        description,
        priority,
        dueDateTime,
        status
    } = req.body;
    const updateTodo = new Todo({
        _id: id,
        title,
        description,
        priority,
        dueDateTime,
        status,
        userId
    });
    Todo.findByIdAndUpdate({ _id: id }, updateTodo, { runValidators: true }, (error, result) => {
        if (error) {
            return res.status(500).json(errorResponse(error));
        } else if (result) {
            return res.status(201).json(successResponse('Todo updated'));
        }
    });
};

exports.deleteTodo = async (req, res, next) => {
    const id = req.params.id;
    const checkTodo = await Todo.findById(id);
    if (!checkTodo) {
        return res.status(404).json(errorResponse('Todo not found'));
    }
    const userId= req.user.id;
    Todo.findByIdAndDelete({ _id: id, userId }, (error ,result) => {
        if (error) {
            return res.status(500).json(errorResponse(error));
        } else if (result) {
            return res.status(200).json(successResponse('Todo deleted'));
        }
    });
};
