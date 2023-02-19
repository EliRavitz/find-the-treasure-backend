const nodemailer = require('nodemailer')
const pug = require('pug')
const { convert } = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `eli ravitz <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    // I haven't finished logging in to the MAILGUN website, so for now I'm not logged in

    // if (process.env.NODE_ENV === 'production') {
    //   return nodemailer.createTransport({
    //     host: process.env.MAILGUN_HOST,
    //     port: process.env.MAILGUN_PORT,
    //     auth: {
    //       user: process.env.MAILGUN_USERNAME,
    //       pass: process.env.MAILGUN_PASSWORD,
    //     },
    //   })
    // }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  // send the actuak email
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWolcome() {
    await this.send('emailWelcome', 'wolcome to Find the treasure game!')
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    )
  }
}
