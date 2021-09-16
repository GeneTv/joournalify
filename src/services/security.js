import store from "@/store";

const handleAuth = (to, from, next) => {
  const accessRestricted = to.matched.some(record => record.meta.accessRestricted);
  const { isAuthenticated } = store.getters;

  if(accessRestricted && !isAuthenticated) {
    next('/login');
  } else if(to.name == 'Login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
}


export default (to, from, next) => {

  if (store.state.isReady) {
    handleAuth(to, from, next);
  } else {
    console.debug('[router]   waiting for the app to be initialized...')
    store.watch(
      (state) => state.isReady,
      (value) => {
        if (value == true)
          handleAuth(to, from, next);
        console.debug('[router]   ok. app ready state changed', value)
      }
    )
  }

}