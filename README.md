# Calculador de Horas <br>
Projeto criado com a intenção de facilitar o cálculo entre horas, possibilitando cálculos entre datas diferentes, obtendo informações resumidas para aplicação e gestão.<br><br>

# Projeto de gestão de horas <br>
Em paralelo a API, está sendo desenvolvido um cliente web para gestão de horas, com o intuíto mais voltado à aprendizagem utilizando: <br><br>
• HTML; <br>
• CSS; <br>
• Javascript; <br>
• JQuery; <br>
• Moment; <br>

#### Atual estado do cliente web:
![alt text](https://raw.githubusercontent.com/gabrielgfw/api-hour-calculator/master/exemplo.gif)
<br>
# API <br>

Desenvolvida em Node, a API utiliza alguns frameworks para seu funcionamento (incluindo futuras features): <br><br>
• Express; <br>
• Moment; <br>
• MongoDB (futuras features); <br>
• Mongoose (futuras features); <br>
• Nunjucks (futuras features); <br>
<br>

# Consumindo API <br>

Informações para a chamada da API:

```
Servidor: "http://localhost:8080"
End-Point: "/api/calc/"
Método: POST
```


<br>
Payload Exemplo:

```
{
  startHour: "YYYY-MM-DD HH:mm:ss",
  finalHour: "YYYY-MM-DD HH:mm:ss"
}
```


<br>
Retorno:

```
{
    input:
    {
      startHour: "DD/MM/YYYY - HH:mm:ss",
      finalHour: "DD/MM/YYYY - HH:mm:ss"
    },

    result:
    {
      diffHours: resultHours,
      diffMinutes: diffMinutes
    },

    rawResult:
    {
      diffInHours: resultCalcInHours,
      diffInMinutes: resultCalcInMinutes,
      diffInSeconds: resultCalcInSeconds,
      diffInMillisec: resultCalcInMs
    }
}
```
<br>

# Experimente <br>

Instalações prévias necessárias: <br><br>
• Node.js (compilador JS): <br>
<a href="https://nodejs.org/en/download/"># Node Website</a> <br><br>
• MongoDB Community (Banco de dados - Futuras Features): <br>
<a href="https://www.mongodb.com/"># MongoDB Website</a> <br><br>

<br>
Clone o projeto localmente: <br>

```
git clone https://github.com/gabrielgfw/api-hour-calculator
```

<br>
Instalando dependências: <br>

```
npm update
```
<br>
Inicializando a API: <br>

```
npm start
```
<br>
Acessando Web Client (em desenvolvimento): <br>
<a href="http://localhost:8080/"># Local Host</a> <br>
<br>

# Futuras implementações: <br>

• Finalizar implantação da visualização dos resultados; <br>
• Refatoração para deixar o código mais limpo; <br>
• Funções mais coesas; <br>
• Melhorias visuais; <br>
• Sistema de Contas: Login, Cadastro, Gestão de Conta; <br>
• Melhorar funcionalidades com os resultados de cálculo; <br>



<br><br>
