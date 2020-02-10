import Service from '@ember/service';
import { inject as service } from '@ember/service';
import _ from 'lodash';

export default Service.extend({

  session: service(),
  store: service(),

  async load() {
    if (this.get('session.isAuthenticated')) {
      try {
        const user = await this.store.queryRecord('user', { me: true });
        const userMemberships = await user.get('memberships');
        const userMembership = await userMemberships.get('firstObject');
        const organization = await userMembership.organization;
        const isAdminInOrganization = userMembership.isAdmin;
        const canAccessStudentsPage = organization.isSco && organization.isManagingStudents;

        this.set('user', user);
        this.set('organization', organization);
        this.set('isAdminInOrganization', isAdminInOrganization);
        this.set('canAccessStudentsPage', canAccessStudentsPage);
      } catch (error) {
        if (_.get(error, 'errors[0].code') === 401) {
          return this.session.invalidate();
        }
      }
    }
  }
});
