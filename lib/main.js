/**
 * [ description]
 * @param  {[type]} mongoose [description]
 * @return {[type]}                      [description]
 *
 * @example :
 *          var mongooseHelper = require('./mongooseHelper');
 *          var MyModelHelper = mongooseHelper(__modelName);
 *          
 *          var MyModel = MyModelHelper.model;
 *          
 *          // get all models
 *          ModelHelper.findAll(function(results){
 *              var error = null;
 *              if (results.length == 0) {
 *                  error = "No items of "+__modelName+" found";
 *              }
 *              if (results === false) {
 *                  error = "Error";
 *              }
 *
 *              // ActionHeroJS
 *              connection.response.results = results;
 *              connection.error = error;
 *              return next(connection, true);
 *
 *              // expressJS
 *              res.send(JSON.Stringigy({
 *                  'results': results,
 *                  'error': error
 *              }));
 *          });
 */
var mongoose = require('mongoose');
exports = module.exports = function (__modelName, __schema) {
    var Model          = {}
      , mongooseSchema = {}
    ;

    if (__schema) {
        mongooseSchema = new mongoose.Schema(__schema);
        Model = mongoose.model(__modelName, mongooseSchema);
    }
    else {
        Model = mongoose.model(__modelName);
    }
    
    return {
        "model": Model,
        "schema": __schema,
        _updateModel: function (__model, __datas) {
            Object.keys(__datas).forEach(function(key) {
                var val = __datas[key];

                __model[key] = val;
            });
            return __model;
        },
        add: function(__object, __callback) {
            var model;
            // TODO : check the API
            model = new Model(__object);
            console.log(__object);
            model.save(function(err) {
                if (err) {
                    console.log(err);
                    __callback(false);
                }
            });

            __callback(model);
        },
        update: function(__id, __object, __callback) {
            return Model.findOne({
                _id: __id
            }, function(err, result) {
                if( !err && result ){

                    // _updateModel
                    Object.keys(__object).forEach(function(key) {
                        var val = __object[key];
                        result[key] = val;
                    });

                    result.save(function(errSave) {
                        if( errSave ) {
                            console.log( errSave );
                            __callback(false);
                        }

                        __callback(result);
                    });
                }
                else {
                    if (err) {
                        __callback(false);
                    }
                    else {
                        __callback([]);
                    }
                }
            });
        },
        delete: function(__id, __callback) {
            Model.findOne( {_id: __id}).exec(function(err, result) {
                if( !result ) {
                    console.log('no item found with id:'+__id);
                    __callback(false);
                }

                result.remove(function(err) {
                    if (!err) {
                        __callback(true);
                    } else {
                        console.log(err);
                        __callback(false);
                    }
                });
            });
        },

        findAll: function(__callback) {
            Model.find({}).sort({addedAt: -1}).execFind(function(err, results) {
                var result = false;
                if (!err) {
                    if (results.length > 0) {
                        __callback(results);
                    }
                    else {
                        console.log('no results');
                        __callback([]);
                    }
                }
                else {
                    console.log(err);
                    __callback(false);
                }
            });
        },

        findById: function(__id, __callback) {

            return Model.findOne({
                _id: __id
            }, function(err, model) {
                if (!err) {
                    __callback(model);
                } else {
                    console.log(err);
                    __callback(false);
                }
            });
        }
    };
};