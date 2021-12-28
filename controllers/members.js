const fs = require('fs')
const data = require('../data.json')
const { date } = require("../utils")

exports.index = function(re, res) {
    return res.render("members/index", { members: data.members})
}

exports.create = function(req, res) {
    return res.render("members/create")
}

// show
exports.show = function(req, res) {
    const  { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send("member is not founded!")


    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay,
    }

    return res.render("members/show", {member})
}

// post
exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if (req.body[key] == "") {
            return res.send('please, fill')
        }
    }

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]
    if (lastMember) {
        id = lastMember.id + 1
    }

    data.members.push({
        id,
        ...req.body,
        birth
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("write file")

        return res.redirect("/members")
    })

}

// edit
exports.edit = function(req, res) {
    const  { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send("member is not founded!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso,
    }


    return res.render("members/edit", {member})
}

// put
exports.put = function(req, res) {
    const  { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send("member is not founded!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/members/${id}`)
    })

}

// delete
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member) {
        return id != member.id
    })

    // Reorganized the order of member's id
    let cont = 1
    for(instru of filteredMembers) {
        instru.id = cont
        cont = cont + 1
    }

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("write error!")

        return res.redirect("/members")
    })
}