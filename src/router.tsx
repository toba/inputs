import './router.scss';
import * as React from 'react';
//import { log } from '../workers';
import StateComponent from './stateful';
import { Action, ActionType } from 'modules/actions';
import { is } from 'lib/utility';
import { default as text, format } from 'lib/i18n/localize';

interface Props {
   routes: RouteList;
}

interface State {
   /**
    * Name of view that should be displayed in the router. Initial value is the
    * current `window.location.pathname`.
    */
   path: string;
}

/**
 * Route matches view component to a path name.
 */
export interface Route {
   /**
    * URL path token that will load the view. Server routing handles the first
    * token indicating which application to load. The router controls which
    * view to load within that application.
    *
    * `http://site.com/<app-token>/<path-token>/`
    *
    * For simplicity, the token's position in the path is not verified. It will
    * match if its the last token regardless of other path elements.
    */
   path: string;

   /** React component rendered for the route. */
   view: React.ComponentClass<any> | React.StatelessComponent<any>;

   /**
    * Whether to update the browser location URL when the view is activated.
    * Should be false if the view cannot be independently loaded.
    */
   updateURL: boolean;
}

/**
 * RouteList maintains the list of valid routes for an application along with
 * a `home` route that will be displayed if no routes match a request.
 */
export interface RouteList {
   /** React component rendered at the root (`/`) of the base path. */
   home: React.ComponentClass<any> | React.StatelessComponent<any>;
   views?: Route[];
}

/**
 * Render component matching path based on `RouteList`. The initial path is the
 * current URL. Thereafter it may be updated by component actions.
 */
export class Router extends StateComponent<Props, State> {
   /** Currently displayed view component. */
   view: React.ComponentClass<any> | React.StatelessComponent<any>;
   appPath: string;

   constructor(props: Props) {
      super(props, { path: viewPath() });

      const path = this.state.path;
      const routes = props.routes;

      if (is.empty(path)) {
         this.view = routes.home;
      } else {
         const r = routes.views.find(r => r.path == path);
         this.view = r === undefined ? routes.home : r.view;
      }
      this.appPath = appPath();
   }

   /**
    * Listen for `popstate` which usually is usually triggered by back-button
    * interaction.
    *
    * https://developer.mozilla.org/en-US/docs/Web/API/Window/history
    * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
    */
   componentDidMount() {
      super.componentDidMount();
      window.onpopstate = (e: PopStateEvent) => {
         if (e.state != null) {
            this.setState(e.state);
         } else {
            this.setState({ path: null });
         }
      };
   }

   handler(action: ActionType, path: any) {
      if (action == Action.ChangeView) {
         this.setState({ path });
      }
   }

   fullPath(path: string): string {
      return this.appPath + '/' + path + '/';
   }

   /**
    * Update with new view only if path and component are valid. If no path is
    * given then show the home view. If there are no navigable views then
    * return `false` so nothing changes.
    */
   shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
      const routes = nextProps.routes;
      if (!routes.views) {
         return false;
      }

      const path = nextState.path;
      if (is.empty(path)) {
         this.view = routes.home;
         return true;
      }
      const r = routes.views.find(r => r.path == path);
      if (r === undefined) {
         console.warn(format(text.BAD_ROUTE, this.fullPath(path)));
         return false;
      }
      this.view = r.view;

      if (r.updateURL) {
         history.pushState(nextState, null, this.fullPath(r.path));
      }
      return true;
   }

   render() {
      return <this.view />;
   }
}

/**
 * Last token of the current browser location. Replace everything except the
 * text after the last slash to isolate the view name.
 */
const viewPath = () =>
   window.location.pathname.replace(/^\/?[^\/]+(\/|$)/, '').replace(/\/?$/, '');

/**
 * Current base path, usually reported by the browser with a leading slash.
 * Ensure leading slash is included otherwise `history.pushState()` appends
 * the path.
 */
const appPath = () => {
   const parts = window.location.pathname.split('/');
   return '/' + (is.empty(parts[0]) ? parts[1] : parts[0]);
};
