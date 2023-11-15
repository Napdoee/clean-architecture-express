const path = require('path');
const fs = require('fs');

const {
  findAllProject,
  insertProject,
  findProjectById,
  findProjectByTitle,
  editProject,
  destroyProject
} = require('./project.repository');
const AppError = require('../utils/appError');

const storeImage = (imageFile) => {
  const extension = path.extname(imageFile.originalname);
  const image = 'project-' + Date.now() + extension;
  const buffer = imageFile.buffer
  const filePath = path.join(__dirname, '../../storage/projects/');

  fs.writeFileSync(filePath + image, buffer, (err) => {
    if (err) throw new Error("an error occurred while upload image");
  });

  return image;
}

const removeImage = async (oldImageName) => {
  const filePath = path.resolve("storage/projects", oldImageName);
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) throw new Error("an error occurred while remove image");
    })
  } else {
    throw new AppError("an error occrred, can not remove image.")
  }
}

const getAllProject = async () => {
  const projects = await findAllProject();

  return projects;
}

const createProject = async (newProjectData, imageFile) => {
  const title = await findProjectByTitle(newProjectData.title);
  if (title) throw new AppError('title has to be unique');

  const image = storeImage(imageFile);

  const newProject = await insertProject(newProjectData, image);

  return newProject;
}

const getProjectById = async (id) => {
  const project = await findProjectById(id);
  if (!project) throw new AppError('project not found');

  return project;
}

const updateProject = async (updateProjectData, id, imageFile) => {
  const project = await getProjectById(id);

  let image;
  if (!imageFile) {
    image = project.image;
  } else {
    removeImage(project.image)
    image = storeImage(imageFile);
  }

  const updatedProject = await editProject(updateProjectData, id, image);

  return updatedProject;
}

const deleteProject = async (id) => {
  const project = await getProjectById(id);

  removeImage(project.image);

  await destroyProject(id);
}

const getImageById = async (id) => {
  const { image } = await getProjectById(id)

  return image;
}

module.exports = {
  getAllProject,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getImageById
}