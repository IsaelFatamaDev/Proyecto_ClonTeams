import passport from 'passport';
import LocalStrategy from 'passport-local';
import * as controllersJs from './src/controllers/controllers.js';

// Configurar una estrategia de autenticación local
passport.use(new LocalStrategy(
     { usernameField: 'email' }, // Campo para el nombre de usuario
     async (email, password, done) => {
          try {
               const user = await controllersJs.findUserByEmail(email);
               if (!user || user.password !== password) {
                    return done(null, false, { message: 'Correo electrónico o contraseña incorrectos' });
               }
               return done(null, user);
          } catch (error) {
               return done(error);
          }
     }
));

// Serializar y deserializar usuarios para la sesión
passport.serializeUser((user, done) => {
     done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
     try {
          const user = await controllersJs.findUserById(id);
          done(null, user);
     } catch (error) {
          done(error);
     }
});

export default passport;
