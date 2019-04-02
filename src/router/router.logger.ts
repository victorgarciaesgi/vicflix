import { MyRoute } from './routes.models';

export function routerLogger(to: MyRoute, from: MyRoute) {
  const toRoute = to.name || to.path;
  const fromRoute = from.name || from.path;

  console.groupCollapsed(
    `%c Router log %c To:%c[${toRoute}] %c, From:%c[${fromRoute}] %c`,
    'background: #42b983 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#fff;padding: 1px;color: #000',
    'background:#fff;padding: 1px;color: #198c1d',
    'background:#fff;padding: 1px;color: #000',
    'background:#fff;padding: 1px;border-radius: 0 3px 3px 0;color: #a06711',
    'background:transparent'
  );
  console.log('TO', to);
  console.log('FROM', from);
  console.groupEnd();
}
