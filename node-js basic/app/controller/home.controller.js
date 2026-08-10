const {name} = require("ejs");


class HomeControler {

    async Home(req, res) {
        const user ={
            name: 'web',
            age: 20
        }
        res.render('home',{
            title: "home page",
            data: user
        })
}
async about(req, res) {
    res.render('about',{
        title: "about page",
        city: 'kolkata'
    })
}
}

module.exports = new HomeControler();