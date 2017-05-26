var express = require('express'),
    app = express(),
    Ajv = require('ajv'),
    metaSchema = require('ajv/lib/refs/json-schema-draft-04.json'),
    schema = require('./samples/datamodelSchema.json'),
    data = require('./samples/datamodel.json');

var ajv = new Ajv({
    meta: false,
    extendRefs: true,
    unknownFormats: 'ignore'
});
ajv.addMetaSchema(metaSchema);
ajv._opts.defaultMeta = metaSchema.id;

function validateSchema(schema, data, schemaKey){
    var valid = undefined,
        cachedSchema = ajv.getSchema(schemaKey);

    if(!cachedSchema){
        ajv.addSchema(schema, schemaKey);
        valid = ajv.validate(schemaKey, data);
    }
    else
        valid = cachedSchema(data);

    return valid ? {valid: true} : {valid:false, errors: ajv.errors};
}



app.get('/datamodel/check', function (req, res) {   
    var result = validateSchema(schema, data, 'SchemaGanister');
    res.status(200).send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Listening on: ', PORT);
    var result = validateSchema(schema, data, 'SchemaGanister');
    if(!result.valid)
        console.log("Error on validation: ", result.errors);
    else
        console.log("Everything is fine!");
});