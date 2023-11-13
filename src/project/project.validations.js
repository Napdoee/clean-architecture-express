const { checkSchema } = require("express-validator");

const projectPostValidateSchema = checkSchema({
  title: {
    exists: {
      options: { checkFalsy: true },
      errorMessage: 'title is required'
    },
    isString: {
      errorMessage: 'title should be string'
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'title should be at least 3 characters'
    }
  },
  tech: {
    exists: {
      options: { checkFalsy: true },
      errorMessage: 'tech is required'
    },
    isArray: {
      options: {
        min: 1
      },
      errorMessage: 'tech must be array and should be at least 1 field'
    }
  },
  repository: {
    exists: {
      options: { checkFalsy: true },
      errorMessage: 'repository is required'
    },
    isURL: {
      options: {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true
      },
      errorMessage: "repository must be valid url protocol"
    }
  },
  site: {
    optional: {
      options: {
        nullable: true,
        checkFalsy: true
      }
    },
    isURL: {
      options: {
        require_host: true
      },
      errorMessage: "site must be valid url"
    }
  }
});

module.exports = { projectPostValidateSchema }