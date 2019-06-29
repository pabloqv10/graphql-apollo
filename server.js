const { ApolloServer } = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')
let courses = require('./courses')

const typeDefs = `
  type Course{
    id: ID!
    title: String!
    views: Int
  }

  input CourseInput{
    title: String!
    views: Int
  }

  type Alert{
    message: String
  }

  type Query{
    getCourses(page: Int, limit: Int = 1): [Course]
    getCourse(id: ID!): Course
  }

  type Mutation {
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
  }
`

const resolvers = {
  Query: {
    getCourses(obj, {page, limit}) {
      if (page != undefined) {
        return courses.slice((page - 1) * limit, page * limit)
      }
      return courses
    },
    getCourse(obj, { id }) {
      return courses.find(course => course.id == id)
    }
  },
  Mutation: {
    addCourse(obj, {input}) {
      const { title, views } = input
      const id = String(courses.length + 1)

      const course = {
        id,
        title,
        views
      }

      courses.push(course)

      return course
    },
    updateCourse(obj, {id, input}) {
      const { title, views } = input
      const courseIndex = courses.findIndex(course => course.id == id)
      const course = courses[courseIndex]
  
      const newCourse = Object.assign(course, {title, views})
  
      course[courseIndex] = newCourse
  
      return newCourse
    },
    deleteCourse(obj, {id}) {
      courses = courses.filter(course => course.id != id)
      return {
        message : `El curso con id ${id} fue eliminado`
      }
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const server = new ApolloServer({
  schema: schema
})

server.listen()
.then(({url}) => console.log(`Server running on ${url}`))