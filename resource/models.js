module.exports = function(fs) {

	fs.readdirSync(DAO).forEach(function(target){

	    if( fs.statSync(DAO+'/'+target).isDirectory() ) {

            fs.readdirSync(DAO+'/'+target).forEach(function(subTarget){

                var pathName = subTarget.split('.')[0] || '';
                global[pathName] = require(DAO+'/'+target+'/'+pathName);

            });

        } else {

            var pathName = target.split('.')[0] || '';
            global[pathName] = require(DAO+'/'+pathName);

        }

    });

};



