const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_ENV)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'psanjhi@gmail.com',
        subject: 'Welcome to my app',
        text: `Welcome to the app ${name}.Let me know how you got along with the app`
        //can use html:''
    })
}

const sendGoodbyeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from: 'psanjhi@gmail.com',
        subject:'Account Cancellation',
        text:`hello ${name}. \n We will miss you. Tell us what went wrong ? how could we be better `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
} //object cause we are exporting multiple properties or functions on it 
