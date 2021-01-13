const mongoose = require('mongoose');
const Artigo = new mongoose.Schema(
{
    titulo: 
    {
        type: String,
        required: true
    },

    conteudo: 
    {
        type: String,
        required: true
    }
},
{
    timestamps: true,
});

// Exporting the model.
mongoose.model('artigo', Artigo);
