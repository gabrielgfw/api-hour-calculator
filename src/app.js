const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const moment = require('moment');
const path = require('path');

const app = express();

// Allowing express to work with JSON files.
app.use(express.json());

// Nunjucks config.
nunjucks.configure({
    express: app
});

// Connection with mongodb database.
mongoose.connect('mongodb://localhost/gabriel', {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    createLog("normal", "Sucesso - Conexão com banco de dados.");

}).catch((err) => {
    createLog("aditional", "Falha - Conexão com banco de dados.", err.toString());
});

// Calculating.
app.post("/api/calc/", (req, res) => {
    const startHour = req.body.startHour;
    const finalHour = req.body.finalHour;

    createLog("normal", ">>> Nova Requisição Iniciada <<<");
    createLog("aditional", "Data Inicial:", moment(startHour).format("YYYY-MM-DD HH:mm:ss"));
    createLog("aditional", "Data Final:", moment(finalHour).format("YYYY-MM-DD HH:mm:ss"))
    
    calculateAndCreateResponse(startHour, finalHour).then((result) => {
        createLog("normal", "Sucesso - Requisição finalizada.")
        res.json(result);

    }).catch((error) => {
        createLog("aditional", "Falha - Erro na Requsição.", error.name + ": " + error.message);
        res.json(error);
    });
});

function createLog(type, message, extra) {
    if(type === "normal") {
        return console.log(hourNow() + message);
    }
    if(type === "aditional") {
        return console.log(hourNow() + message + " - " + extra);
    }
}


function hourNow() {
    return moment().format("DD/MM/YYYY - HH:mm:ss") + "  -->  ";
}


function calculateAndCreateResponse(startHour, finalHour) {

    return new Promise((resolve, reject) => {
        const resultCalcInMs = moment(finalHour, "YYYY-MM-DD HH:mm:ss").diff(startHour, "YYYY-MM-DD HH:mm:ss");
        const resultCalcInHours = resultCalcInMs / 3600000
        const resultCalcInMinutes = resultCalcInHours * 60;
        const resultCalcInSeconds = resultCalcInHours * 3600;
        const resultHours = parseInt(resultCalcInHours);
        const resultMinutes = ((parseFloat(resultCalcInHours)) - resultHours) * 60;

        const resultObject = {
            startHour: startHour,
            finalHour: finalHour,
            resultCalcInMs: resultCalcInMs,
            resultCalcInHours: resultCalcInHours,
            resultCalcInMinutes: resultCalcInMinutes,
            resultCalcInSeconds: resultCalcInSeconds,
            resultHours: resultHours,
            resultMinutes: resultMinutes
        }

        if(!isValidDate(startHour, finalHour) || !isValidResult(resultCalcInMs)) {
            createLog("aditional", "Error - Falha na realização do Cálculo das horas", message);
            reject({
                error: true,
                message: "Error: Invalid inputs for calculating."
            });
        } else {
            createLog("normal", "Sucesso - Cálculo das horas.");
            resolve(
                createResponse(resultObject)
            );
        }
    });
}

function isValidDate(start, final) {
    const minDate = moment("1900-01-01", "YYYY-MM-DD");
    const maxDate = moment("3000-12-31", "YYYY-MM-DD");
    const startDate = moment(start, "YYYY-MM-DD HH:mm:ss");
    const finalDate = moment(final, "YYYY-MM-DD HH:mm:ss");

    if(!(moment(startDate).isValid())) {
        createLog("normal", "Falhou - Validação - Data Inicial.")
        return false;
    }
    if(!(moment(finalDate).isValid())) {
        createLog("normal", "Falhou - Validação - Data Final");
        return false;
    }
    if(startDate > maxDate || startDate < minDate) {
        createLog("normal", "Falhou - Validação - Data Inicial.");
        return false;
    }
    if(finalDate > maxDate || finalDate < minDate) {
        return false
    }
    return true;
}

function isValidResult(result) {
    if(isNaN(result) || result < 0) {
        return false;
    } else {
        return true;
    }
}

function createResponse(resultObj) {
    const diffMinutes = resultObj.resultMinutes.toFixed(0);
    const result = {
        input:
        {
            startHour: moment(resultObj.startHour).format("DD/MM/YYYY - HH:mm:ss"),
            finalHour: moment(resultObj.finalHour).format("DD/MM/YYYY - HH:mm:ss")
        },
        result:
        {
            diffHours: resultObj.resultHours.toString(),
            diffMinutes: diffMinutes.toString()
        },
        rawResult:
        {
            diffInHours: resultObj.resultCalcInHours.toString(),
            diffInMinutes: resultObj.resultCalcInMinutes.toString(),
            diffInSeconds: resultObj.resultCalcInSeconds.toString(),
            diffInMillisec: resultObj.resultCalcInMs.toString()
        }
    }
    createLog("normal", "Sucesso - Response criado.");
    return result;
}

app.get("/src/scripts", (req, res) => {
    res.sendFile(path.join(__dirname, "./scripts/hourcalculator.js"));
});

app.get("/src/style", (req, res) => {
    res.sendFile(path.join(__dirname, "./style/main.css"));
});

app.use((req,res) => {
    res.render(path.join(__dirname,'./index.html'));
});
// Server port.
app.listen(9999, () => {
    createLog("normal", "Servidor inicializado na porta 9999.");
});