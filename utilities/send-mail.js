'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.notice = (comment) => {
    let emailSubject = '主人好～ 「' + process.env.SITE_NAME + '」上有新评论了';
    let emailContent = '<p>「' + process.env.SITE_NAME + '」上 '
        + comment.get('nick')
        +' 留下了新评论，内容如下：</p>'
        + comment.get('comment')
        + '<br><p> <a href="'
        + process.env.SITE_URL
        + comment.get('url')
        + '">点击前往查看</a>';

    let mailOptions = {
        from: '"' + process.env.SENDER_NAME + '" <' + process.env.SENDER_EMAIL + '>',
        to: process.env.SENDER_EMAIL,
        subject: emailSubject,
        html: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('通知邮件发送成功！');
    });
}

exports.send = (currentComment, parentComment)=> {
    let emailSubject = '主人好～「' + process.env.SITE_NAME + '」上有人@了你';
    let emailContent = '<span style="font-size:16px;color:#212121">Hi，'
        + parentComment.get('nick')
        + '</span>'
        + '<p>「' + process.env.SITE_NAME + '」上 '
        + currentComment.get('nick')
        +' @了你，回复内容如下：</p>'
        + currentComment.get('comment')
        + '<br><p>原评论内容为：'
        + parentComment.get('comment')
        + '</p><p> <a href="'
        + process.env.SITE_URL
        + currentComment.get('url')
        + '">点击前往查看</a> <br><p><a href="'
        + process.env.SITE_URL + '">'
        + process.env.SITE_NAME + ' </a>欢迎你的再度光临</p>';

    let mailOptions = {
        from: '"' + process.env.SENDER_NAME + '" <' + process.env.SENDER_EMAIL + '>', // sender address
        to: parentComment.get('mail'),
        subject: emailSubject,
        html: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件 %s 成功发送: %s', info.messageId, info.response);
        currentComment.set('isNotified', true);
        currentComment.save();
    });
};
