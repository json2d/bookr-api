let nodemailer = require('nodemailer');
let aws = require('aws-sdk');

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

const send = options => {
  transporter.sendMail({...options, from:process.env.EMAIL_SENDER}, (err, info) => {
    if(err) console.error("there was a problem with sending an email, see logs for more info")
    else console.log(`an email was sent to ${options.to}`)
  })
}

module.exports = {send}
