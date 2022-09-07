const express = require("express");

const usersRouter = require('./usersRoutes')
const coursRouter=require('./courseRoutes')
const categoryRouter=require('./categoryRoutes')
const systemRouter=require('./systemRoutes')
const routesInit = app => {
    app.use("/users", usersRouter)
    app.use("/courses",coursRouter)
    app.use("/categories",categoryRouter)
    app.use("/system",systemRouter)


    app.use("",(req,res)=>res.json({msg:"url not found",err:404}))
}

module.exports = routesInit;



