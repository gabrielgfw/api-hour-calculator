# Calculador de Horas <br>
Projeto criado com a intenção de facilitar o cálculo entre horas, possibilitando cálculos entre datas diferentes, obtendo informações resumidas para aplicação e gestão.<br><br>

# Cliente Web - Diferença entre Horas <br>
Com o objetivo de ser uma ferramenta simples e de fácil aprendizagem, o cliente web possibilita para o usuário as seguintes facilidades:<br><br>

• Resultados com informações objetivas para fácil utilização;
• Possibilidade de cálculo entre dois horários distintos, sendo possível selecionar datas diferentes, simulando o cálculo entre dias diferentes.


Foi utilizado para desenvolvimento do cliente web as seguintes tecnologias: <br><br>

• HTML; <br>
• CSS; <br>
• Javascript; <br>
• JQuery; <br>
• Moment; <br>

Abaixo exemplo de utilização do cliente: <br><br>

![examplo gif](https://github.com/gabrielgfw/api-hour-calculator/blob/master/examplo.gif?raw=true)
<br>

# API <br>

Desenvolvida em Node, a API utiliza alguns frameworks para seu funcionamento: <br><br>
• Express; <br>
• Moment; <br>
• MongoDB  (para futuras atualizações); <br>
• Mongoose (para futuras atualizações); <br>
• Nunjucks (para futuras atualizações); <br>
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

# Futuras implementações <br>

• Avaliar estabilidade da aplicação web;
• Disponibilizar a API de forma pública;
• Disponibilizar Cliente Web de forma pública;
• Sistema de Contas; <br>
• Cada conta possuir seu histórico de resultados;<br>
• Possibilitar a criação de grupo de resultados; <br>




<br><br>
