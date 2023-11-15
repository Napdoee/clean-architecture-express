const prisma = require('../db');
const { project: Project } = prisma;

const findAllProject = async () => {
  const projects = await Project.findMany();

  return projects
}

const insertProject = async (newProjectData, image) => {
  const project = await Project.create({
    data: {
      title: newProjectData.title,
      description: newProjectData.description,
      tech: newProjectData.tech,
      repository: newProjectData.repository,
      site: newProjectData.site,
      image: image ? image : null,
    }
  });

  return project;
}

const findProjectById = async (id) => {
  const project = await Project.findUnique({
    where: {
      id
    }
  })

  return project;
}

const findProjectByTitle = async (title) => {
  const project = await Project.findFirst({
    where: {
      title
    }
  })

  return project;
}

const editProject = async (updatedProjectData, id, image) => {
  const project = await Project.update({
    where: {
      id
    },
    data: {
      title: updatedProjectData.title,
      description: updatedProjectData.description,
      tech: updatedProjectData.tech,
      repository: updatedProjectData.repository,
      site: updatedProjectData.site,
      image: image ? image : null
    }
  })

  return project;
}

const destroyProject = async (id) => {
  await Project.delete({
    where: {
      id
    }
  })
}

module.exports = {
  findAllProject,
  insertProject,
  findProjectById,
  findProjectByTitle,
  editProject,
  destroyProject
}