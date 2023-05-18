const request = require('supertest');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('POST /travelUsage - returns 201', function () {
  it('responds with 201 created - basic POST body', function (done) {
    const travelUsageDocumentStub = {
      save: sinon.stub(),
    };
    const TravelUsageModelStub = sinon.stub().returns(travelUsageDocumentStub);
    const app = proxyquire('./app', {
      './models/travel_usage': TravelUsageModelStub,
    });
    const travelUsageData = {
      staffFirstName: 'a',
      staffLastName: 'b',
      kmTravelled: 'test',
    };

    request(app)
      .post('/travelUsage')
      .set('Content-Type', 'application/json')
      .send(travelUsageData)
      .then(function (response) {
        sinon.assert.match(response.status, 201);
        sinon.assert.match(response.body, travelUsageData);
        sinon.assert.calledWithExactly(TravelUsageModelStub, travelUsageData);
        sinon.assert.calledOnce(travelUsageDocumentStub.save);
        done();
      });
  });
});
