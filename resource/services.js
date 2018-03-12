module.exports = function(fs) {

	fs.readdirSync(SERVICE).forEach(function(target){

	    if( fs.statSync(SERVICE+'/'+target).isDirectory() ) {

            fs.readdirSync(SERVICE+'/'+target).forEach(function(subTarget){

                var pathName = subTarget.split('.')[0] || '';
                global[pathName] = require(SERVICE+'/'+target+'/'+pathName);

            });

        } else {

            var pathName = target.split('.')[0] || '';
            global[pathName] = require(SERVICE+'/'+pathName);

        }

    });

};



