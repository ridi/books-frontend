const nextRoutes = require('next-routes');
const clientRoutes = nextRoutes();

clientRoutes.add({ page: 'partials/gnb', pattern: '/partials/gnb' });
clientRoutes.add({ page: 'partials/footer', pattern: '/partials/footer' });
clientRoutes.add({ page: 'notification', pattern: '/notification' });
clientRoutes.add({ page: 'cart', pattern: '/cart' });
clientRoutes.add({ page: 'account/myridi', pattern: '/account/myridi' });
clientRoutes.add({ page: 'search', pattern: '/search' });
clientRoutes.add({ page: 'category/list', pattern: '/category/list' });
clientRoutes.add({ page: 'selection/:id', pattern: '/selection' });
clientRoutes.add({ page: 'special-room/:id', pattern: '/special-room' });
clientRoutes.add({
  page: '/',
  pattern: '/:genre(fantasy|fantasy-serial|romance|romance-serial|bl|bl-serial|comics)',
});
clientRoutes.add({ page: '/', pattern: '/' });

module.exports = {
  clientRoutes: clientRoutes,
  Link: clientRoutes.Link,
  Router: clientRoutes.Router,
  withRouter: clientRoutes.withRouter,
};
// Next 에서 제공하는 Link (next/link) 를 이용했을 때 404 에러 후 화면이 Flashing 되기 때문에 next-routes 를 이용
// https://github.com/zeit/next.js/issues/2833#issuecomment-414919347
