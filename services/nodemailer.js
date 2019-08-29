const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.sendResetPassword = async (email, res) => {
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return res.status(404).json(errorResponse('Email not registered'));
    }
    const token = jwt.sign({
        id: userExist._id,
        email: userExist.email
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });
    transport.sendMail({
        from: 'group_one@ga.com',
        to: email,
        subject: 'Reset Password',
        html: `<p>Klik link dibawah ini untuk reset password</p>
        <a href="https://ga-todolist-api.herokuapp.com/api/user/reset/${token}" target="_blank">Reset Password</a>`
    })
        .then(() => res.status(200).json(successResponse(`Email sent to ${email}`)))
        .catch(() => res.status(500).json(errorResponse(`Failed sent to ${email}`)));
};
