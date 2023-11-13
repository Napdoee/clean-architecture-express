const { Router } = require('express');
const { checkSchema } = require("express-validator");
const path = require('path');
const router = Router();

const prisma = require('../db');
const { project: Project } = prisma;

const {
  getAllProject,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getImageById
} = require('./project.service');

const { projectPostValidateSchema } = require('./project.validations');
const validate = require("../middleware/validate");

const { succesResponse, msgResponse } = require("../utils/sendResponse");
const tryCatch = require("../utils/tryCatch");
const uploadOption = require("../utils/uploadImage");

router.get('/', async (req, res) => {
  const projects = await getAllProject();

  return res.send(succesResponse({ projects }));
})

router.post('/', uploadOption.single('image'),
  validate(projectPostValidateSchema),
  tryCatch(async (req, res) => {
    const newProjectData = req.body;
    let imgName;

    const file = req.file;
    if (!file) {
      imgName = null;
    } else {
      imgName = file.filename;
    }

    // const pathFile = `${req.protocol}://${req.get('host')}/public/image/${imgName}`;
    await createProject(newProjectData, imgName);

    return res.status(201).send(msgResponse('Project success created'));
  })
)

router.get('/:id',
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);

    return res.send(succesResponse({ project }));
  })
)

router.patch('/:id', uploadOption.single('image'),
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const updateProjectData = req.body;

    const file = req.file;
    if (!file) {
      imgName = null;
    } else {
      imgName = file.filename;
    }

    const project = await updateProject(updateProjectData, projectId, imgName);

    return res.send(succesResponse({
      projectId: project.id
    }))
  })
)

router.delete('/:id',
  tryCatch(async (req, res) => {
    const projectId = req.params.id;

    await deleteProject(projectId)

    res.send(msgResponse('project success destroy'));
  })
)

router.get('/image/:id',
  tryCatch(async (req, res) => {
    const projectId = req.params.id;
    const projectImage = await getImageById(projectId);

    return res.sendFile(projectImage, { root: path.join(__dirname, '../../public/image') });
  })
)

module.exports = router;