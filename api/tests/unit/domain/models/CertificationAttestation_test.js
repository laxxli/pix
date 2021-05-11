const { expect, domainBuilder } = require('../../../test-helper');

describe('Unit | Domain | Models | CertificationAttestation', () => {

  context('#setResultCompetenceTree', () => {

    it('should set the resultCompetenceTree on CertificationAttestation model', () => {
      // given
      const resultCompetenceTree = domainBuilder.buildResultCompetenceTree({ id: 'someId' });
      const certificationAttestation = domainBuilder.buildCertificationAttestation();

      // when
      certificationAttestation.setResultCompetenceTree(resultCompetenceTree);

      // expect
      expect(certificationAttestation.resultCompetenceTree).to.deep.equal(resultCompetenceTree);
    });
  });

  context('#get hasAcquiredCleaCertification', () => {

    it('should return true if clea is acquired', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
      });

      // when
      const hasAcquiredCleaCertification = certificationAttestation.hasAcquiredCleaCertification;

      // expect
      expect(hasAcquiredCleaCertification).to.be.true;
    });

    it('should return true if clea is not acquired', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
      });

      // when
      const hasAcquiredCleaCertification = certificationAttestation.hasAcquiredCleaCertification;

      // expect
      expect(hasAcquiredCleaCertification).to.be.false;
    });
  });
});
