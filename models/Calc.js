const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const calc = new mongoose.Schema(
    {
        input:
        {
            start: 
            {
                type: Timestamp,
                required: true
            },
            final:
            {
                type: Timestamp,
                required: true
            }
        },
        result:
        {
            resultSimple:
            {
                type: String
            },
            resultNote:
            {
                type: String
            }
        }
    },
    {
        timestamps: true,
    }
);

mongoose.model('calc', Calc);
