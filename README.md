mongoose-helper
===============

Before using mongoose-helper, you must initialize the mongoose connection
```js
mongoose.connect('mongodb://localhost/kitchensink');
```

After that, you can configure your mongoose models in an external file : 
```js
require('./shemas');
```

Content of ./shemas.js
```js
var 
	schemas = {}
	mongooseHelper = require('mongoose-helper')
;
schemas.StaticContent = mongooseHelper( "StaticContent", {
    title: String,
    content: String,
    updated_at: Date,
    created_at: Date
});

exports = module.exports = schemas;
```
