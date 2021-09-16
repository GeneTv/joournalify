import store from "@/store";

const handleAuth = (to, from, next) => {
  const accessRestricted = to.matched.some(record => record.meta.accessRestricted);
  const { isAuthenticated } = store.getters;

  if(accessRestricted && !isAuthenticated) {
    next('/login');
  } else if(to.name == 'login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
}


export default (to, from, next) => {

  if (!store.state.isReady) {
    console.debug('[router]   waiting for store to be initialized...')
    store.watch(
      (state) => state.isReady,
      (value) => {
        console.debug('[router]    ok store initialization state changed', value)
        if (value == true)
          handleAuth(to, from, next);
      }
    )
  } else {
    handleAuth(to, from, next);
  }

}