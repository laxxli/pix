import Route from '@ember/routing/route';

export default class AuthenticatedSessionsDetailsAddStudentRoute extends Route {
  async model(params) {
    const session = await this.store.findRecord('session', params.session_id);
    const { id: certificationCenterId } = this.modelFor('authenticated');
    const students = await this.store.findAll('student',
      { adapterOptions : { certificationCenterId } },
    );
    return { session, students };
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    this.controllerFor('authenticated.sessions.add-student').set(
      'returnToSessionCandidates',
      (sessionId) => this.transitionTo('authenticated.sessions.details.certification-candidates', sessionId),
    );
  }
}
