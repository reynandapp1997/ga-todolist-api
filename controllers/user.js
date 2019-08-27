const bcrypjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getAllUser = (req, res, next) => {
    User.find()
        .select('-password')
        .then(result => {
            return res.status(200).json(successResponse('success', result.length, result));
        })
        .catch(error => {
            return res.status(500).json(errorResponse(error));
        });
};

exports.createUser = (req, res, next) => {
    const {
        name,
        email,
        password
    } = req.body;
    bcrypjs.hash(password, 10, async (err, hash) => {
        const newUser = new User({
            name,
            email,
            password: hash
        });
        newUser.save()
            .then(result => {
                return res.status(200).json(successResponse('User created'))
            })
            .catch(error => {
                return res.status(500).json(errorResponse(error));
            });
    });
};

exports.loginUser = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(errorResponse('User not registered'));
    }
    bcrypjs.compare(password, user.password, (error, success) => {
        if (error) {
            return res.status(500).json(errorResponse(error));
        } else if (success) {
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '24h'
            });
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).json(successResponse('Login Success'));
        }
        return res.status(401).json(errorResponse('Wrong password'));
    })
};
