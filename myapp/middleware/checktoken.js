require("dotenv").config();
const jwt = require('jsonwebtoken');

module.exports = {
    checkTokenForRoles: requiredRoles => {
        return function(req, res, next) {
            const header = req.headers['authorization'];
        
            if (typeof header !== 'undefined') {
                const bearer = header.split(' ');
                const token = bearer[1];
                

                try {
                    const user = jwt.verify(token, process.env.secretKey); 
                    let found = false;
                    requiredRoles.split(',').map(e => {
                        if (user.role === e ) {
                            found = true;
                        }
                    });
                    if (!found) {
                        console.log('user does not have one of required roles: ', requiredRoles);
                        return res.sendStatus(403); 
                    }
                    return next();
                    
                } catch (err) {
                    console.log(err);
                    res.sendStatus(403);
                }
            } else {
                console.log('Request is missing \'authorization\' header');
                res.sendStatus(403);
            }
        }
    }
}
