import firebase from 'firebase/app';
import 'firebase/auth';

module.exports = (to, from, next) => {
  const accessRestricted = to.matched.some(record => record.meta.accessRestricted);
  const isAuthenticated = firebase.auth().currentUser;

  if(accessRestricted && !isAuthenticated) {
    next('/login');
  } else if(to.name == 'login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
}