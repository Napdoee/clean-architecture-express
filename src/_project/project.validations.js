const { body, checkSchema } = require("express-validator");

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
  description: {
    exists: {
      options: { checkFalsy: true },
      errorMessage: 'description is required'
    },
    isString: {
      errorMessage: 'description should be string'
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'description should be at least 3 characters'
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
        protocols: ["https"],
        require_protocol: true,
        require_valid_protocol: true
      },
      errorMessage: "repository must be valid url protocol"
    },
    custom: {
      if: url => {
        url = new URL(url);
        const checkValidRepository = !(url.hostname === 'github.com' && url.pathname.split("/")[1] === 'Napdoee');
        return checkValidRepository
      },
      errorMessage: "repository should be github.com/Napdoee"
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
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true
      },
      errorMessage: "site must be valid url"
    }
  },
  image: {
    exists: {
      if: (value, { req }) => !req.file,
      errorMessage: "Image is required"
    }
  }
});

const projectPatchValidateSchema = checkSchema({
  title: {
    optional: true,
    isString: {
      errorMessage: 'title should be string'
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'title should be at least 3 characters'
    }
  },
  description: {
    optional: true,
    isString: {
      errorMessage: 'description should be string'
    },
    isLength: {
      options: { min: 3 },
      errorMessage: 'description should be at least 3 characters'
    }
  },
  tech: {
    optional: true,
    isArray: {
      options: {
        min: 0
      },
      errorMessage: 'tech must be array and should be at least 1 field'
    }
  },
  repository: {
    optional: true,
    isURL: {
      options: {
        protocols: ["https"],
        require_protocol: true,
        require_valid_protocol: true
      },
      errorMessage: "repository must be valid url protocol"
    },
    custom: {
      if: url => {
        url = new URL(url);
        const checkValidRepository = !(url.hostname === 'github.com' && url.pathname.split("/")[1] === 'Napdoee');
        return checkValidRepository
      },
      errorMessage: "repository should be github.com/Napdoee"
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
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true
      },
      errorMessage: "site must be valid url"
    }
  }
});


module.exports = { projectPostValidateSchema, projectPatchValidateSchema }