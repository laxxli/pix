/* eslint-disable ember/no-classic-classes */

import Route from '@ember/routing/route';

export default Route.extend({

  beforeModel() {
    this.transitionTo('authenticated.sessions.list');
  },

});
