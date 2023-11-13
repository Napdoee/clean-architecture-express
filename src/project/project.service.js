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

const getAllProject = async () => {
  const projects = await findAllProject();

  return projects;
}

const createProject = async (newProjectData, image) => {
  const title = await findProjectByTitle(newProjectData.title);
  if (title) throw new AppError('title has to be unique');

  const newProject = await insertProject(newProjectData, image);

  return newProject;
}

const getProjectById = async (id) => {
  const project = await findProjectById(id);
  if (!project) throw new AppError('project not found');

  return project;
}

const updateProject = async (updateProjectData, id, image) => {
  const project = await getProjectById(id);

  let imageName;
  if (project.image) {
    if (image === null) {
      imageName = project.image;
    } else {
      const filePath = path.resolve("public/image", project.image);
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) throw Error("an error occurred while updating image");
        })
      }

      imageName = image;
    }
  } else {
    imageName = image;
  }

  const updatedProject = await editProject(updateProjectData, id, imageName);

  return updatedProject;
}

const deleteProject = async (id) => {
  const project = await getProjectById(id);

  const filePath = path.resolve("public/image", project.image);
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) throw Error("an error occurred while updating image");
    })
  }

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