const http = require("http");
const fs = require("fs");
var requests = require("requests"); // It is the module in npm which helps in processing the api
const homeFile = fs.readFileSync("home.html","utf-8");
//console.log(homeFile);
const replaceVal = (tempVal,orgVal)=>{
  let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  return temperature;
}
const server = http.createServer((req,res)=>{
   if(req.url=="/"){
     requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=21e42f31b59169137af7631a5b38b657")
     .on("data",(chunk)=>{
         const objData = JSON.parse(chunk);
         const arrData = [objData];
        // console.log(arrData[0].main.temp);
        // console.log(arrData);
        var realTimeData = arrData.map((val)=> replaceVal(homeFile,val))
        .join("");
        res.write(realTimeData);
        console.log(realTimeData);
     })
     .on("end",(err)=>{
         if(err) return console.log("Connection is closed due to errors",err);
        //  console.log("end");
         res.end();
     });
   }
});
server.listen(8000,"127.0.0.1");