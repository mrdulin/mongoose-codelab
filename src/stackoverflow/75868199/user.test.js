const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("./user.model");
const server = require('./server');
chai.use(chaiHttp);
chai.should();

describe("should handle mongoose errors", function () {
  describe("faulty User.findOne method", function () {
    const _User_findOne_Backup = User.findOne;
    beforeEach(function () {
      User.findOne = function () {
        return Promise.reject("forced error");
      };
    });
    afterEach(function () {
      User.findOne = _User_findOne_Backup;
    });

    it("signup should respond with a server error", function () {
      return chai
        .request(server)
        .post("/api/getUser")
        .send({ name: "Alice" })
        .catch((err) => {
          const res = err.response;
          res.should.have.status(500);
        })
        ;
    });
  });
});