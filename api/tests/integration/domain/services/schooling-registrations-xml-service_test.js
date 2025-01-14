const { expect, catchErr } = require('../../../test-helper');
const { FileValidationError, SiecleXmlImportError } = require('../../../../lib/domain/errors');
const schoolingRegistrationsXmlService = require('../../../../lib/domain/services/schooling-registrations-xml-service');

describe('Integration | Services | schooling-registrations-xml-service', () => {

  describe('extractSchoolingRegistrationsInformationFromSIECLE', () => {

    it('should parse two schoolingRegistrations information', async function() {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-two-valid-students.xml`;
      const expectedSchoolingRegistrations = [{
        lastName: 'HANDMADE',
        preferredLastName: '',
        firstName: 'Luciole',
        middleName: 'Léa',
        thirdName: 'Lucy',
        birthdate: '1994-12-31',
        birthCityCode: '33318',
        birthCity: null,
        birthCountryCode: '100',
        birthProvinceCode: '033',
        MEFCode: '123456789',
        status: 'AP',
        nationalStudentId: '00000000123',
        division: '4A',
      }, {
        lastName: 'COVERT',
        preferredLastName: 'COJAUNE',
        firstName: 'Harry',
        middleName: 'Cocœ',
        thirdName: '',
        birthdate: '1994-07-01',
        birthCity: 'LONDRES',
        birthCityCode: null,
        birthCountryCode: '132',
        birthProvinceCode: null,
        MEFCode: '12341234',
        status: 'ST',
        nationalStudentId: '00000000124',
        division: '4A',
      }];

      // when
      const result = await schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE(path, organization);

      //then
      expect(result).to.deep.equal(expectedSchoolingRegistrations);
    });

    it('should parse the file when there is a BOM character in the file', async function() {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-bom.xml`;
      const expectedSchoolingRegistrations = [{
        lastName: 'COVERT',
        preferredLastName: 'COJAUNE',
        firstName: 'Harry',
        middleName: 'Coco',
        thirdName: '',
        birthdate: '1994-12-31',
        birthCityCode: '33318',
        birthCity: null,
        birthCountryCode: '100',
        birthProvinceCode: '033',
        MEFCode: null,
        status: 'AP',
        nationalStudentId: '00000000123',
        division: '4A',
      }];

      // when
      const result = await schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE(path, organization);

      //then
      expect(result).to.deep.equal(expectedSchoolingRegistrations);
    });

    it('when the encoding is not supported it throws an error', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-unknown-encoding.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('ENCODING_NOT_SUPPORTED');
    });

    it('should not parse schoolingRegistrations who are no longer in the school', async function() {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-registrations-no-longer-in-school.xml`;
      const expectedSchoolingRegistrations = [];

      // when
      const result = await schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE(path, organization);

      //then
      expect(result).to.deep.equal(expectedSchoolingRegistrations);
    });

    it('should abort parsing and reject with not valid UAI error', async function() {

      // given
      const wrongUAIFromSIECLE = '123ABC';
      const organization = { externalId: wrongUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-wrong-uai.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('UAI_MISMATCHED');
    });

    it('should abort parsing and reject with not valid UAI error if UAI is missing', async function() {

      // given
      const wrongUAIFromSIECLE = '123ABC';
      const organization = { externalId: wrongUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-no-uai.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('UAI_MISMATCHED');
    });

    it('should abort parsing and reject with XML error if file is malformed while scanning for UAI', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-broken.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(FileValidationError);
      expect(error.code).to.equal('INVALID_FILE');
    });

    it('should abort parsing and reject with XML error if file is malformed while scanning students', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-broken-after-uai.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(FileValidationError);
      expect(error.code).to.equal('INVALID_FILE');
    });

    it('should abort parsing and reject with duplicate national student id error', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-duplicate-national-student-id.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('INE_UNIQUE');
      expect(error.meta).to.deep.equal({ nationalStudentId: '00000000123' });
    });

    it('should abort parsing and reject with duplicate national student id error and tag not correctly closed', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-duplicate-national-student-id.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('INE_UNIQUE');
      expect(error.meta).to.deep.equal({ nationalStudentId: '00000000123' });
    });

    it('should abort parsing and reject with missing national student id error', async function() {

      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-no-national-student-id.xml`;
      // when
      const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect(error.code).to.equal('INE_REQUIRED');
    });

    context('when the file is zipped', () => {
      it('unzip the file', async function() {
        // given
        const organization = { externalId: '1237457A' };
        const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-zipped-file.xml.zip`;
        const expectedSchoolingRegistrations = [{
          lastName: 'Grubber',
          preferredLastName: null,
          firstName: 'Hans',
          middleName: '',
          thirdName: '',
          birthdate: '1950-01-01',
          birthCityCode: '24322',
          birthCity: '',
          birthCountryCode: '100',
          birthProvinceCode: '024',
          MEFCode: null,
          status: 'AP',
          nationalStudentId: '56789',
          division: '3EME NEW',
        }];

        // when
        const result = await schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE(path, organization);

        //then
        expect(result).to.deep.equal(expectedSchoolingRegistrations);
      });

      context('when the file is corrupted', () => {
        it('throws an error', async function() {
          // given
          const organization = { externalId: '1237457A' };
          const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/corrupt_entry.zip`;

          // when
          const error = await catchErr(schoolingRegistrationsXmlService.extractSchoolingRegistrationsInformationFromSIECLE)(path, organization);

          //then
          expect(error).to.be.instanceof(FileValidationError);
          expect(error.code).to.equal('INVALID_FILE');
        });
      });
    });
  });
});
