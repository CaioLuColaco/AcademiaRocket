const fs = require('fs')
// create
exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if (req.body[key] == "") {
            return res.send('please, fill')
        }
    }

    fs.writeFile("data.json", JSON.stringify(req.body), function(err) {
        if (err) return res.send("write file")

        return res.redirect("/instructors")
    })

    //return res.send(req.body)
}