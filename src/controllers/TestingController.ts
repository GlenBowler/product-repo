const { Op } = require("sequelize");
// 

async function test(req: any, res: any) {
    try{
      res.send('testing perfectly')
    }
    catch(err: any){
        console.log(err)
        res.send(err)
    }
}

export  {
    test
}