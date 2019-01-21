import { module, test } from 'qunit';
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | organization memberships management', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    await authenticateSession({ userId: 1 });
  });

  test('visiting /organizations/:id', async function(assert) {
    // given
    const organization = this.server.create('organization');

    // when
    await visit(`/organizations/${organization.id}`);

    // then
    assert.equal(currentURL(), `/organizations/${organization.id}`);
  });

  module('listing members', function() {

    test('should display the correct number of users', async function(assert) {
      // given
      const organization = this.server.create('organization');

      const userAlice = this.server.create('user', { firstName: 'Alice', lastName: 'Cencieuse', email: 'alice@example.com' });
      const userBob = this.server.create('user', { firstName: 'Bob', lastName: 'Harr', email: 'bob@example.com' });
      const userCharlie = this.server.create('user', { firstName: 'Charlie', lastName: 'Bideau', email: 'charlie@example.com' });

      this.server.create('membership', { user: userAlice, organization });
      this.server.create('membership', { user: userBob, organization });
      this.server.create('membership', { user: userCharlie, organization });

      // when
      await visit(`/organizations/${organization.id}`);

      // then
      assert.equal(this.element.querySelectorAll('div.member-list table > tbody > tr').length, 3);
      assert.dom('div.member-list').includesText('Alice');
      assert.dom('div.member-list').includesText('Bob');
      assert.dom('div.member-list').includesText('Charlie');
    });

    test('should display the correct user data', async function(assert) {
      // given
      const organization = this.server.create('organization');

      const user = this.server.create('user', { firstName: 'Denise', lastName: 'Ter Hegg', email: 'denise@example.com' });

      this.server.create('membership', { user, organization});

      // when
      await visit(`/organizations/${organization.id}`);

      // then
      assert.equal(this.element.querySelectorAll('div.member-list table > thead > tr > th ').length, 4);

      assert.dom('div.member-list table > thead').includesText('Id');
      assert.dom('div.member-list table > thead').includesText('Prénom');
      assert.dom('div.member-list table > thead').includesText('Nom');
      assert.dom('div.member-list table > thead').includesText('Courriel');

      assert.dom('div.member-list table > tbody').includesText(user.id);
      assert.dom('div.member-list table > tbody').includesText('Denise');
      assert.dom('div.member-list table > tbody').includesText('Ter Hegg');
      assert.dom('div.member-list table > tbody').includesText('denise@example.com');

    });
  });

  module('adding a member', function() {

    test('should create a user membership and display it in the list', async function(assert) {
      // given
      const organization = this.server.create('organization');
      this.server.create('user', { firstName: 'John', lastName: 'Doe', email: 'user@example.com' });

      // when
      await visit(`/organizations/${organization.id}`);
      await fillIn('input.add-membership-form__user-email-input', 'user@example.com');
      await click('button.add-membership-form__validate-button');

      // then
      assert.dom('div.member-list').includesText('John');
      assert.dom('div.member-list').includesText('Doe');
      assert.dom('div.member-list').includesText('user@example.com');
      assert.dom('input.add-membership-form__user-email-input').hasNoValue();
    });
  });

  module('')
});
