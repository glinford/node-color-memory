module.exports = function(app){
    var users = require('./controllers/users');
    app.get('/api/users', users.findAll);
    app.get('/api/highscores', users.findHighscores);
    app.post('/api/stats', users.getStats);
    app.post('/api/user/add', users.add);
    app.delete('/api/user/delete/:id', users.delete);
}
