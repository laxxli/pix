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

  context('#get hasAcquiredAnyComplementaryCertification', () => {

    it('should return true if clea is acquired', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
        certifiedBadgeImages: [],
      });

      // when
      const hasAcquiredAnyComplementaryCertification = certificationAttestation.hasAcquiredAnyComplementaryCertification;

      // expect
      expect(hasAcquiredAnyComplementaryCertification).to.be.true;
    });

    it('should return true if certification has some certified badges', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
        certifiedBadgeImages: ['/some/img/url'],
      });

      // when
      const hasAcquiredAnyComplementaryCertification = certificationAttestation.hasAcquiredAnyComplementaryCertification;

      // expect
      expect(hasAcquiredAnyComplementaryCertification).to.be.true;
    });

    it('should return true if certification has both acquired clea and some certified badges', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
        certifiedBadgeImages: ['/some/img/url'],
      });

      // when
      const hasAcquiredAnyComplementaryCertification = certificationAttestation.hasAcquiredAnyComplementaryCertification;

      // expect
      expect(hasAcquiredAnyComplementaryCertification).to.be.true;
    });

    it('should return false if certification has neither acquired clea nor some certified badges', () => {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
      const certificationAttestation = domainBuilder.buildCertificationAttestation({
        cleaCertificationResult,
        certifiedBadgeImages: [],
      });

      // when
      const hasAcquiredAnyComplementaryCertification = certificationAttestation.hasAcquiredAnyComplementaryCertification;

      // expect
      expect(hasAcquiredAnyComplementaryCertification).to.be.false;
    });
  });
});
