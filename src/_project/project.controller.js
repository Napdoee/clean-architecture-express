const { Router } = require('express');
const path = require('path');
const router = Router();

const {
  getAllProject,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getImageById
} = require('./project.service');
const {
  projectPostValidateSchema,
  projectPatchValidateSchema
} = require('./project.validations');

const verifyToken = require("../middleware/verifyToken");
const validate = require("../middleware/validate");

const { succesResponse, msgResponse } = require("../utils/sendResponse");
const uploadOption = require("../utils/uploadImage");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");

router.post('/', verifyToken,
  uploadOption.single('image'),
  validate(projectPostValidateSchema),
  tryCatch(async (req, res) => {
    const newProjectData = req.body;

    const imgFile = req.file;
    if (!imgFile) throw new AppError("Image must be valid file");

    const project = await createProject(newProjectData, imgFile);

    return res.status(201).send(succesResponse({
      projectId: project.id
    }))
  })
)

router.patch('/:id', verifyToken,
  uploadOption.single('image'),
  validate(projectPatchValidateSchema),
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const updateProjectData = req.body;

    const imgFile = req.file ? req.file : null;

    const project = await updateProject(updateProjectData, projectId, imgFile);

    return res.send(succesResponse({
      projectId: project.id
    }))
  })
)

router.delete('/:id', verifyToken,
  tryCatch(async (req, res) => {
    const projectId = req.params.id;

    await deleteProject(projectId)

    res.send(msgResponse('project success destroy'));
  })
)

router.get('/', async (req, res) => {
  const projects = await getAllProject();

  return res.send(succesResponse({ projects }));
})

router.get('/:id',
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    return res.send(succesResponse({ project }));
  })
)

router.get('/image/:id',
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const projectImage = await getImageById(projectId);

    return res.sendFile(projectImage, { root: path.join(__dirname, '../../storage/projects') });
  })
)

module.exports = router;